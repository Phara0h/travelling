const Token = require('./token');
const config = require('./config');

var checkLoggedIn = async function(req, res) {

    if(req.session.user) {
      return true;
    }

    if(req.cookies['trav:tok']) {

        var user = await Token.checkToken(req, res)

        if(!user) {
          return false
        }
        req.session.user = user;

        config.log.logger.info('User Token Session Refreshed: ' + user.username + ' (' + user._.group.name + ')' + ' | ' + req.ip);

        //redirect so it gets it session cookie set to bypass proxy
        res.redirect(req.raw.url)
        return true;
    }
    return false;
};

var logout = function(req, res) {
  req.destroySession(d=>{
    res = Token.removeAuthCookie(res)
    res.setCookie('trav:ssid', null, {
      expires: Date.now(),
      secure: true,
      httpOnly: true,
      path: '/'
    })
    res.code(200).send();
  });
}

module.exports = {
  checkLoggedIn,
  logout
}
