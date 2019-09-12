const CookieToken = require('./cookietoken');
const TokenHandler = require('../token');
const config = require('./config');



var logout = (req, res) => {
    req.session.data.user = null;
    req.sessionStore.destroy(req.session.sessionId, ()=>{

    });
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
        config.log.logger.debug(req.headers)
        var splitAuth = req.headers.authorization.split(' ');
        if(splitAuth.length < 2) {
          return false;
        }
        splitAuth[0] = splitAuth[0].toLowerCase();

        if(splitAuth[0] != 'basic' || splitAuth != 'bearer') {
          return false;
        }

        var user = await TokenHandler.checkAccessToken(splitAuth[1]);

        if (!user) {
            return {auth: false, route: req.headers.authorization.indexOf('Basic ') > -1 ? true : false};
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
          config.log.logger.debug('no user',req.url, req.raw.url)

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
