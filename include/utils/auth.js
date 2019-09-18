const CookieToken = require('./cookietoken');
const TokenHandler = require('../token');
const config = require('./config');



var logout = (req, res) => {
    req.sessionStore.destroy(req.session.sessionId)
    CookieToken.removeAuthCookie(res);
    res.setCookie('trav:ssid', null, {
        expires: Date.now(),
        secure: true,
        httpOnly: true,
        path: '/',
    });
    req.isAuthenticated = false;

};

var checkAuthHeader = async (req, res, router) => {
    if (req.headers.authorization) {

        var splitAuth = req.headers.authorization.split(' ');
        if(splitAuth.length < 2) {
          return false;
        }
        splitAuth[0] = splitAuth[0].toLowerCase();

        if(splitAuth[0] == 'basic') {
          return {auth: false, route: true};
        }

        if(splitAuth[0] != 'bearer') {
          return false;
        }

        var user = await TokenHandler.checkAccessToken(splitAuth[1]);

        if (!user) {
            return {auth: false, route: false, invaildToken: true};
        }

        await user.resolveGroup(router);
        req.session = {data: {user}};

        return {auth: true, route: true};
    }
    return false;
};

var checkSession = (req, res, router) => {

    if (req.session && req.session.data && req.session.data.user) {
        if (req.session.data.user.locked) {
            return {auth: false, route: true};
        }
        return {auth: true, route: true};
    }
    return false;
};

var checkCookie = async (req, res, router) => {
    if (req.cookies['trav:tok']) {
      try {
        var user = await CookieToken.checkToken(req, res, router);

        if (!user || user.locked) {
            return {auth: false, route: true};
        }

        user.resolveGroup(router);
        req.createSession(user.id, {user});

        config.log.logger.info('User Token Session Refreshed: ' + user.username + ' (' + user._.group.name + ')' + ' | ' + req.ip);

        return {auth: true, route: true};
      } catch (e) {
        config.log.logger.debug.log(e);
        return {auth: false, route: true};
      }
    }
    return false;
};

var checkLoggedIn = async (req, res, router)=> {
    var authHeader = await checkAuthHeader(req, res, router);
    if(authHeader) {
      return authHeader;
    }

    var session = checkSession(req, res, router);
    if(session) {
      return session;
    }

    var cookie = await checkCookie(req,res,router);
    if(cookie) {
      return cookie;
    }
    return {auth: false, route: true};
};

module.exports = {
    checkLoggedIn,
    logout,
};
