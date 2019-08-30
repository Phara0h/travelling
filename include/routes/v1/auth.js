const config = require('../../utils/config');
const regex = require('../../utils/regex');

const Database = require('../../database');
const Token = require('../../utils/token');
const Email = require('../../utils/email');

const {checkVaildUser} = require('../../utils/user');

var login = async (user, req, res) => {
    /** *
      @TODO add check to ip to see if they are differnt then email the user of possible
      redflag activity on their account
    **/
    user.last_login = {
        date: Date.now(),
        ip: req.ip,
    };

    user.failed_login_attempts = 0;
    await user.save();

    res = await Token.newTokenInCookie(user.username, user.password, req, res);
    req.createSession(user.id, {user});

    config.log.logger.info('User Logged in: ' + user.username + ' (' + user.group.name + ')' + ' | ' + req.ip);

    if (req.cookies['trav:backurl']) {
        var url = req.cookies['trav:backurl'];
        res.setCookie('trav:backurl', null, {
          expires: Date.now(),
          secure: true,
          httpOnly: true,
          path: '/'
        })
        res.redirect(url);
        return;
    } else {
        res.code(200).send({
            msg: 'Access Granted',
        });
    }
};

module.exports = function(app, opts, done) {
    const router = opts.router;

    app.put('/auth/login', async (req, res) => {

        if (req.isAuthenticated) {
          res.code(200).send({
              type: 'login-session-error',
              msg: 'Logged in already.',
          });
        } else {
            if (!req.body) {
                res.code(400).send({
                    type: 'body-login-error',
                    msg: 'No body sent with request',
                });
                return;
            }

            var username;
            var email;

            if (req.body.username) {
                username = req.body.username = req.body.username.toLowerCase();
            }
            if (req.body.email) {
                email = req.body.email = req.body.email.toLowerCase();
            }

            if ((!req.body.email && !req.body.username) || !req.body.password) {
              res.code(400).send({
                  type: 'body-login-error',
                  msg: 'A vaild username or email and password is required.',
              });
              return;
            }

            var isVaild = await checkVaildUser(req.body, false);

            if (isVaild !== true) {
                res.code(400).send(isVaild);
            } else {
              try {
                var user = await Database.checkAuth(username, email, req.body.password)
                await login(user.user, req, res);
              } catch (e) {
                res.code(400).send(e.err.type=='locked' ? {...e.err, email:e.email} : {
                    type: 'login-error',
                    msg: 'Invalid login',
                });

              }
            }
        }
    });

    app.get('/auth/logout', (req, res) =>{
        req.logout(req, res);
        res.code(200).send('Logged Out');
    });

    app.post('/auth/register', async (req, res) =>{

        if (req.isAuthenticated) {
            res.code(200).send({
                type: 'register-session-error',
                msg: 'Logged in already, logout first to register',
            });
        }

        var isVaild = await checkVaildUser(req.body);

        if(!req.body.username || !req.body.password || !req.body.email) {
          res.code(400).send({
              type: 'register-error',
              msg: 'A vaild username, password and email are required.',
          });
        }
        else if (isVaild !== true) {
            res.code(400).send(isVaild);
        } else {

            var username = req.body.username.toLowerCase();
            var password = req.body.password;
            var email = req.body.email.toLowerCase();
            var dGroup = await router.defaultGroup();
            var user = await Database.createAccount(username, password, email, dGroup.id);

            config.log.logger.info('New User Created: ' + user.username + ' | ' + req.connection);
            res.code(200).send('Account Created');
        }
    });

    app.put('/auth/password/forgot', async (req, res) => {
        if(!req.body.email) {
          res.code(400).send({
              type: 'forgot-password-error',
              msg: 'A vaild email is required.',
          });
          return;
        }

        var isVaild = checkVaildUser(req.body, false);
        if (isVaild !== true) {
            res.code(400).send(isVaild);
            return;
        }

        res.code(200).send();
        Database.forgotPassword(req.body.email, req.ip);

    });

    app.put('/auth/password/reset', async (req, res) => {
        if(!req.body.password) {
          res.code(400).send({
              type: 'reset-error',
              msg: 'A vaild password is required.',
          });
          return;
        }

        var isVaild = checkVaildUser(req.body, false);
        if (isVaild !== true) {
            res.code(400).send(isVaild);
            return;
        }
        var token = await Email.checkRecoveryToken(req.query.token);

        if (!token) {
            res.code(400).send({
                type: 'password-reset-token-error',
                msg: 'Token is invaild, please click on forgot password again.',
            });
            return;
        }

        var cPassword = await Database.resetPassword(token, req.body.password);

        if (!cPassword) {
            res.code(400).send({
                type: 'password-reset-token-error',
                msg: 'Token is invaild, please click on forgot password again.',
            });
            return;
        }

        res.code(200).send();
    });

    app.get('/auth/activate', async (req, res) => {
        var token = await Email.checkActivationToken(req.query.token);

        if(!token) {
          res.code(400);
          return {
              type: 'activation-token-error',
              msg: 'Token is invaild, please login again for a new activation link sent to your email.',
          }
        }

        var isActivated = await Database.activateAccount(token);

        if(!isActivated) {
          return {
              type: 'activation-token-error',
              msg: 'Token is invaild, please login again for a new activation link sent to your email.',
          }
        }

        return 'Account activated, please login.';
    });

    done();
};
