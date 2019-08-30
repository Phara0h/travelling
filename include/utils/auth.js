const Token = require('./token');
const config = require('./config');

var checkLoggedIn = async (req, res, router)=> {

    if(req.session && req.session.data && req.session.data.user) {
      if(req.session.data.user.locked) {
        return {auth: false, redirect: false}
      }
      return {auth: true, redirect: false};
    }

    if(req.cookies['trav:tok']) {

        var user = await Token.checkToken(req, res, router)

        if(!user || user.locked) {
          return {auth: false, redirect: false}
        }

        user.resolveGroup(router);
        req.createSession(user.id, {user});

        config.log.logger.info('User Token Session Refreshed: ' + user.username + ' (' + user._.group.name + ')' + ' | ' + req.ip);

        return {auth: true, redirect: true};
    }
    return {auth: false, redirect: false};
};

var logout = (req, res) => {
  req.session.data.user = null;
  req.sessionStore.destroy(req.session.sessionId,()=>{

  });
  Token.removeAuthCookie(res)
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
