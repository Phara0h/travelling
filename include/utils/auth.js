const CookieToken = require('./cookietoken');
const TokenHandler = require('../token');
const config = require('./config');

var checkLoggedIn = async (req, res, router)=> {

    if(req.headers.authorization) {
      var user = await TokenHandler.checkAccessToken(req.headers.authorization.split('Bearer ')[1]);
      if(!user) {
        return {auth: false, route: req.headers.authorization.indexOf('Basic ') > -1 ? true : false}
      }

      await user.resolveGroup(router);
      req.session = {data:{user}};

      return {auth: true, route: true};
    }

    if(req.session && req.session.data && req.session.data.user) {
      if(req.session.data.user.locked) {
        return {auth: false, route: true}
      }
      return {auth: true, route: true};
    }

    if(req.cookies['trav:tok']) {

        var user = await CookieToken.checkToken(req, res, router)

        if(!user || user.locked) {
          return {auth: false, route: true}
        }

        user.resolveGroup(router);
        req.createSession(user.id, {user});

        config.log.logger.info('User Token Session Refreshed: ' + user.username + ' (' + user._.group.name + ')' + ' | ' + req.ip);

        return {auth: true, route: true};
    }
    return {auth: false, route: true};
};

var logout = (req, res) => {
  req.session.data.user = null;
  req.sessionStore.destroy(req.session.sessionId,()=>{

  });
  CookieToken.removeAuthCookie(res)
  res.setCookie('trav:ssid', null, {
    expires: Date.now(),
    secure: true,
    httpOnly: true,
    path: '/'
  })
  req.isAuthenticated = false;

}

module.exports = {
  checkLoggedIn,
  logout
}
