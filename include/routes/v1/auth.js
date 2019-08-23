const config = require('../../utils/config');
const regex = require('../../utils/regex');

const Database = require('../../database');
const Token = require('../../utils/token');
const Email = require('../../utils/email');
var login = async function(user, req, res) {
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
    req.session.user = user;

    config.log.logger.info('User Logged in: ' + user.username + ' (' + user.group.name + ')' + ' | ' + req.ip);

    if (req.session._backurl) {
        res.redirect(req.session._backurl);
    } else {
        res.code(200).send({
            msg: 'Access Granted',
        });
    }
};

module.exports = function(app, opts, done) {

    app.post('/auth/login', (req, res) => {

        if (req.isAuthenticated) {
            res.code(200).send({
                msg: 'Already logged in.',
            });
        } else {
            if (!req.body) {
                res.code(400).send({
                    type: 'body-login-error',
                    msg: 'No body sent with request',
                });
            }

            var username;
            var email;

            if (regex.password.exec(req.body.password) == null) {
                res.code(400).sned({
                    type: 'login-error',
                    msg: 'Invalid login',
                });
            }

            if (regex.username.exec(req.body.username.toLowerCase()) != null) {
                username = req.body.username.toLowerCase();
            }

            if (regex.email.exec(req.body.email.toLowerCase()) != null) {
                email = req.body.email.toLowerCase();
            }

            Database.checkAuth(username, email, req.body.password).then(user=>{
                login(user.user, req, res);
            }).catch(e=>{
                res.code(400).send({
                    type: 'login-error',
                    msg: 'Invalid login',
                });
            });
        }

    });

    app.get('/auth/logout', (req, res) =>{
        req.logout(req, res);
    });

    app.post('/auth/register', async (req, res) =>{

        if (req.isAuthenticated) {
            res.code(200).send({
                msg: 'Logged in already, logout first to register',
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
            res.code(400).send({
                type: 'username-register-error',
                msg: `Minimum ${config.password.minchar} characters and only have these characters (A-Z, a-z, 0-9, _)`,
            });
        } else if (regex.password.exec(password) == null) {
            res.code(400).send({
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
            res.code(400).send({
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
                        res.code(400).send({
                            type: 'duplicate-email-register-error',
                            msg: 'That email is already linked to an account. If you forgot your account details click the "Forgot Password?" link',
                        });
                    } else {
                        res.code(400).send({
                            type: 'duplicate-username-register-error',
                            msg: 'That username is already in use, try too think of another one. If you forgot your account details click the "Forgot Password?" link',
                        });
                    }
                } else {
                    var user = await Database.createAccount(username, password, email);

                    config.log.logger.info('New User Created: ' + user.username + ' | ' + req.connection);
                    login(user, req, res);
                }
            });
        }
    });

    app.put('/auth/password/forgot', async (req, res) =>{
        if (regex.email.exec(req.body.email) == null) {
            res.code(400).send({
                type: 'email-error',
                msg: 'Must be a real email. (Used only for password recovery)',
            });
        } else {
            res.code(200).send();
            Database.forgotPassword(req.body.email);
        }
    });

    app.put('/auth/password/reset', async (req, res) =>{
        if (regex.password.exec(req.body.password) == null) {
            res.code(400).send({
                type: 'password-reset-error',
                msg: 'Minimum ' + config.password.minchar + ' characters '
                  + (config.password.consecutive ? '' : 'with no consecutive characters')
                  + ', max of ' + config.password.maxchar + ' and at least '
                  + config.password.number + ' Number, '
                  + config.password.lowercase + ' lowercase, '
                  + config.password.uppercase + ' uppercase and '
                  + config.password.special + 'special character/s. ',
            });
        } else {
          console.log(req.query.token)
            var token = await Email.checkRecoveryToken(req.query.token);

            if (!token) {
                res.code(400).send({
                    type: 'password-reset-token-error',
                    msg: 'Token is invaild, please click on forgot password again.',
                });
            } else
            {
              var cPassword = await Database.resetPassword(token, req.body.password);
              console.log(cPassword)
              if (cPassword) {
                res.code(200).send();
            } else {
                res.code(400).send({
                    type: 'password-reset-token-error',
                    msg: 'Token is invaild, please click on forgot password again.',
                });
            }
          }

        }
    });

    done();
};
