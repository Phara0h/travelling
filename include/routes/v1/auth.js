const config = require('../../utils/config');
const regex = {
    email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    username: new RegExp(`^[A-Za-z0-9_.]{${config.username.minchar},}`),
    password: new RegExp('^' + (config.password.consecutive ? '' : '(?!.*(.)\\1{1})')
        + '(?=(.*[\\d]){' + config.password.number + ',})(?=(.*[a-z]){'
        + config.password.lowercase
        + ',})(?=(.*[A-Z]){'
        + config.password.uppercase
        + ',})(?=(.*[@#$%!]){'
        + config.password.special
        + ',})(?:[\\da-zA-Z@#$%!\\^\\&\\*\\(\\)]){'
        + config.password.minchar
        + ','
        + config.password.maxchar
        + '}$'),
};
const Database = require('../../database');
const Token = require('../../utils/token');

var login = async function(user,req, res) {

    user.last_login = {
        date: Date.now(),
        ip: req.ip,
        sessionId: req.sessionID
      }

    user.failed_login_attempts = 0;
    await user.save();

    res = await Token.newTokenInCookie(user.username, user.password, req, res);
    req.session.user = user;

    config.log.info('User Logged in: ' + user.username + ' (' + user._.group.name + ')' + ' | ' + req.ip);

    if (req.session._backurl) {
      res.redirect(req.session._backurl);
    }
    else {
      res.code(200).send({
        msg: 'Access Granted'
      });
    }
 };

var checkLoggedIn = async function(req, res) {
    if(req.session.user) {
      return true;
    }

    if(req.cookies['trav:tok']) {
        var user = await Token.checkToken(req, res)
        if(!user) {
          return false
        }
        res.session.user = user;
        config.log.info('User Token Session Refreshed: ' + user.username + ' (' + user._.group.name + ')' + ' | ' + req.ip);
        return true;
    }
};

module.exports = function(app, opts, done) {

    app.post('/auth/login', (req, res) => {

      if(checkLoggedIn(req,res))
      {
        res.code(200).send(
        {
          msg: 'Already logged in.'
        });
      }
      else
      {
        if (!req.body) {
            res.code(400).send({
                type: 'body-login-error',
                msg: 'No body sent with request)',
            });
        }

        var username;
        var email;

        if(regex.password.exec(req.body.password) == null) {
          res.code(400).sned({
              type: 'login-error',
              msg: 'Invalid login',
          })
        }

        if(regex.username.exec(req.body.username.toLowerCase()) != null) {
          username = req.body.username.toLowerCase();
        }

        if(regex.email.exec(req.body.email.toLowerCase()) != null) {
          email = req.body.email.toLowerCase();
        }

        Database.checkAuth(username, email, req.body.password).then(user=>{
          login(user.user, req, res);
        }).catch(e=>{
          res.code(400).sned({
              type: 'login-error',
              msg: 'Invalid login',
          })
        })
      }

    });

    app.get('/auth/logout', (req, res) =>{
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

    });

    app.post('/auth/register', async (req, res) =>{

        if(await checkLoggedIn(req,res))
        {
          res.code(200).send(
          {
            msg: 'Logged in already, logout first to register'
          });
        }

        if (!req.body) {
            res.code(400).send({
                type: 'body-register-error',
                msg: 'No body sent with request)',
            });
        }

        var username = req.body.username.toLowerCase();
        var password = req.body.password;
        var email = req.body.email.toLowerCase();

        if (regex.username.exec(username) == null) {
            res.code(400).send(
                {
                    type: 'username-register-error',
                    msg: `Minimum ${config.password.minchar} characters and only have these characters (A-Z, a-z, 0-9, _)`,
                });
        } else if (regex.password.exec(password) == null) {
            res.code(400).send(
                {
                    type: 'password-register-error',
                    msg: 'Minimum ' + config.password.minchar + ' characters '
                    + (config.password.consecutive ? '' : 'with no consecutive characters')
                    + ', max of ' + config.password.maxchar + ' and at least '
                    + config.password.number + ' Number, '
                    + config.password.lowercase + ' lowercase, '
                    + config.password.uppercase + ' uppercase and '
                    + config.password.special + 'special character/s. ',
                });
        } else if (regex.email.exec(email) == null) {
            res.code(400).send(
                {
                    type: 'email-register-error',
                    msg: 'Must be a real email. (Used only for password recovery)',
                });
        } else {
            Database.checkAuth(username, email, password).then(user=>{
                login(user.user, req, res);
            }).catch(async e=>{

                var err = e.err;
                var user = e.user;

                if (user) {

                    if (email == user.email) {
                        res.code(400).send(
                            {
                                type: 'duplicate-email-register-error',
                                msg: 'That email is already linked to an account. If you forgot your account details link "Forgot Password?" link'
                            });
                    } else {
                        res.code(400).send(
                            {
                                type: 'duplicate-username-register-error',
                                msg: 'That username is already in use, try too think of another one. If you forgot your account details link "Forgot Password?" link'
                            });
                    }
                } else {
                    var user = await Database.createAccount(username, password, email);

                    config.log.info('New User Created: ' + user.username + ' | ' + req.connection);
                    login(user, req, res);
                }
            });
        }
    });

    done();
};
