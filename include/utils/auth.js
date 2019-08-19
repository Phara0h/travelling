const Token = require('./token');
const config = require('./config');

var checkLoggedIn = async (req, res)=> {

    if(req.session && req.session.user) {
      return {auth: true, redirect: false};
    }

    if(req.cookies['trav:tok']) {

        var user = await Token.checkToken(req, res)

        if(!user) {
          return {auth: false, redirect: false}
        }
        req.session.user = user;

        config.log.logger.info('User Token Session Refreshed: ' + user.username + ' (' + user._.group.name + ')' + ' | ' + req.ip);

        return {auth: true, redirect: true};
    }
    return {auth: false, redirect: false};
};

var logout = (req, res) => {
  req.session.user = null;
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
  delete req.session;
  res.code(200).send('Logged Out');
}

module.exports = {
  checkLoggedIn,
  logout
}
