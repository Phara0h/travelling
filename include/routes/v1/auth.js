const config = require('../../utils/config');
const parse = require('../../utils/parse');
const qs = require('querystring');

const Database = require('../../database');
const CookieToken = require('../../utils/cookietoken');
const TokenHandler = require('../../token');

const { checkValidUser } = require('../../utils/user');
const gm = require('../../server/groupmanager');

var login = async (user, req, res) => {
  /**
      @TODO add check to ip to see if they are differnt then email the user of possible
      redflag activity on their account
    **/
  user.last_login = {
    date: Date.now(),
    ip: parse.getIp(req)
  };

  user.failed_login_attempts = 0;
  await user.save();
  const groupsData = await user.resolveGroup();

  req.createSession(user.id, { user, groupsData });
  await CookieToken.newTokenInCookie(user.domain, user.username, user.password, user.last_login.ip, res);

  config.log.logger.info(
    `User Logged in:  ${user.username || ''}(${user.email})[${user.domain}]` +
      ' (' +
      groupsData.names +
      ')' +
      ' | ' +
      user.last_login.ip
  );

  if (req.cookies['trav:backurl']) {
    var url = req.cookies['trav:backurl'].split('|');

    res.setCookie('trav:backurl', null, {
      expires: Date.now(),
      secure: config.https,
      httpOnly: true,
      domain: config.cookie.domain,
      path: '/'
    });
    res.redirect(url[0] === 'GET' ? 301 : 303, url[1]);
    return '';
  }

  res.code(200);
  return {
    msg: 'Access Granted'
  };
};

var loginRoute = async (req, res) => {
  // console.log(req)
  if (req.isAuthenticated) {
    res.code(200).send({
      type: 'login-session-error',
      msg: 'Logged in already.'
    });
  } else {
    if (!req.body) {
      res.code(400).send({
        type: 'body-login-error',
        msg: 'No body sent with request'
      });
      return;
    }

    var username;
    var email;
    var domain;

    if (req.body.username) {
      username = req.body.username = req.body.username.toLowerCase();
    }
    if (req.body.email) {
      email = req.body.email = req.body.email.toLowerCase();
    }
    if (req.params.domain) {
      domain = req.params.domain.toLowerCase();
    }

    if ((!req.body.email && !req.body.username) || !req.body.password) {
      res.code(400).send({
        type: 'body-login-error',
        msg: 'A valid username or email and password is required.'
      });
      return;
    }

    var isValid = await checkValidUser(req.body);

    if (isValid !== true) {
      res.code(400);
      return isValid;
    } else {
      try {
        var user = await Database.checkAuth(username, email, req.body.password, domain);

        return await login(user.user, req, res);
      } catch (e) {
        if (e.err && e.err.msg) {
          config.log.logger.debug(e.err, e.user ? e.user._ : null);
          config.log.logger.info(`Failed Auth (${e.err.msg}): `, username, email, domain);
        } else {
          config.log.logger.debug(e);
        }
        res.code(400);
        return e.err && e.err.type == 'locked'
          ? { type: e.err.type, msg: e.err.msg, email: e.email }
          : {
              type: 'login-error',
              msg: 'Invalid login'
            };
      }
    }
  }
};

var registerRoute = async (req, res) => {
  // if (req.isAuthenticated) {
  //     res.code(200).send({
  //         type: 'register-session-error',
  //         msg: 'Logged in already, logout first to register',
  //     });
  //     return;
  // }
  req.body.domain = req.params.domain || 'default';
  var isValid = await checkValidUser(req.body);

  if (isValid === true) {
    isValid = await Database.checkDupe(req.body);
  }

  if (!req.body.password || !req.body.email || (!req.body.username && config.user.username.enabled)) {
    res.code(400).send({
      type: 'register-error',
      msg: 'A valid username, password and email are required.'
    });
    return;
  }

  if (isValid !== true) {
    res.code(400).send(isValid);
    return;
  }

  var username = config.user.username.enabled ? req.body.username.toLowerCase() : '';
  var password = req.body.password;
  var email = req.body.email.toLowerCase();
  var domain = 'default';
  var groupRequest;

  if (req.body.group_request) {
    groupRequest = req.body.group_request.toLowerCase();
  }

  if (req.params.domain) {
    domain = req.params.domain.toLowerCase();
  }

  var dGroup = await gm.defaultGroup();
  var user = await Database.createAccount(username, password, email, [dGroup.id], groupRequest, req.hostname, domain);

  config.log.logger.info(`New User Created: ${user.username || ''}(${user.email})[${domain}] | ${parse.getIp(req)}`);
  res.code(200).send('Account Created');
};

var forgotPasswordRoute = async (req, res, sendemail = true) => {
  if (!req.body.email) {
    res.code(400);
    return {
      type: 'forgot-password-error',
      msg: 'A valid email is required.'
    };
  }

  var isValid = await checkValidUser(req.body, false);

  if (isValid !== true) {
    res.code(400);
    return isValid;
  }

  var tokenProm = Database.forgotPassword(req.body.email, parse.getIp(req), req.params.domain, sendemail);

  if (!sendemail) {
    return { token: (await tokenProm).token };
  }

  return '';
};

var resetPasswordRoute = async (req, res, autologin = false) => {
  if (!req.body.password) {
    res.code(400);
    return {
      type: 'reset-error',
      msg: 'A valid password is required.'
    };
  }

  var isValid = await checkValidUser({ password: req.body.password });

  if (isValid !== true) {
    res.code(400);
    return isValid;
  }

  var token = await TokenHandler.checkRecoveryToken(req.query.token);

  if (!token) {
    res.code(400);
    return {
      type: 'password-reset-token-error',
      msg: 'Token is invalid, please click on forgot password again.'
    };
  }

  var user = await Database.resetPassword(token, req.body.password);

  if (!user) {
    res.code(400);
    return {
      type: 'password-reset-token-error',
      msg: 'Token is invalid, please click on forgot password again.'
    };
  }

  res.code(200);
  if (autologin) {
    return await login(user, req, res);
  }
};

module.exports = function (app, opts, done) {
  // if(config.cors.enable) {
  //   app.use((req,res,next)=> {
  //     res.setHeader('access-control-allow-credentials', true)
  //     next();
  //   })
  // }

  app.addContentTypeParser(
    'application/x-www-form-urlencoded',
    { parseAs: 'buffer', bodyLimit: opts.bodyLimit },
    function (req, body, done) {
      done(null, qs.parse(body.toString()));
    }
  );

  app.put('/auth/login', loginRoute);
  app.put('/auth/login/domain/:domain', loginRoute);

  app.post('/auth/register', registerRoute);
  app.post('/auth/register/domain/:domain', registerRoute);

  app.put('/auth/password/forgot', forgotPasswordRoute);
  app.put('/auth/password/forgot/domain/:domain', forgotPasswordRoute);

  app.put('/auth/password/reset', resetPasswordRoute);

  app.put('/auth/password/reset/login', async (req, res) => {
    return await resetPasswordRoute(req, res, true);
  });

  // dangrous to allow for public use.
  app.put('/auth/token/password/forgot', async (req, res) => {
    return await forgotPasswordRoute(req, res, false);
  });
  app.put('/auth/token/password/forgot/domain/:domain', async (req, res) => {
    return await forgotPasswordRoute(req, res, false);
  });

  app.get('/auth/logout', (req, res) => {
    req.logout(req, res);

    if (req.query.redirect_uri) {
      res.sendFile(config.portal.filePath + '/src/redirect.html');
      return;
    }

    res.code(200).send('Logged Out');
  });

  app.get('/auth/activate', async (req, res) => {
    var token = await TokenHandler.checkActivationToken(req.query.token);

    if (!token) {
      res.code(400);
      return {
        type: 'activation-token-error',
        msg: 'Token is invalid, please login again for a new activation link sent to your email.'
      };
    }

    var isActivated = await Database.activateAccount(token);

    if (!isActivated) {
      return {
        type: 'activation-token-error',
        msg: 'Token is invalid, please login again for a new activation link sent to your email.'
      };
    }

    await TokenHandler.deleteTempToken(token[2], token[0], 'activation');

    res.redirect(config.portal.path + '?toast=Account activated, please login.');
    // return 'Account activated, please login.';
  });

  // Authorization Code Grant
  app.get('/auth/oauth/authorize', (req, res) => {
    var userID = req.session && req.session.data && req.session.data.user ? req.session.data.user.id : '';

    TokenHandler.isOAuthCodeExist(userID, req.query.client_id).then(async (token) => {
      TokenHandler.getRandomToken().then((token) => {
        res.setCookie('trav:codecheck', token, {
          expires: new Date(Date.now() + 12000),
          secure: config.https,
          domain: config.cookie.domain,
          httpOnly: true,
          path: '/' + config.serviceName + '/api/v1/auth/oauth/authorize'
        });

        res.sendFile(
          !config.token.code.authorizeFlow && userID != ''
            ? config.portal.filePath + '/src/submit.html'
            : config.portal.filePath + '/index.html'
        );
      });
    });
  });

  app.post('/auth/oauth/authorize', async (req, res) => {
    var token = null;

    var codechecked = null;

    if (req.cookies['trav:codecheck']) {
      codechecked = await TokenHandler.checkRandomToken(req.cookies['trav:codecheck']);
    }

    if (!codechecked) {
      res.code(401).send({
        error: 'invalid_request',
        error_description: 'Failed to have a valid CSRF token'
      });
      return;
    }

    try {
      token = await TokenHandler.getOAuthCode(req.session.data.user.id, req.query.client_id, req.query.redirect_uri);
      token = { client_id: token.id, client_secret: token.secret };
      var code = Buffer.from(`${token.client_id}:${token.client_secret}`, 'ascii').toString('base64');

      res.headers['Cache-Control'] = 'no-cache';
      res.redirect(encodeURI(req.query.redirect_uri + `?code=${code}&state=${req.query.state}&client_id=${req.query.client_id}`));
      return;
    } catch (e) {
      config.log.logger.debug(e);
      res.code(400).send({
        error: 'invalid_request'
      });
      return;
    }
  });

  // Authorization Client Credentials
  app.post('/auth/token', async (req, res) => {
    if (req.body.grant_type != 'client_credentials' && req.body.grant_type != 'authorization_code') {
      res.code(400);
      return {
        error: 'invalid_request',
        error_description: 'grant_type is not supported.'
      };
    }

    if (req.body.grant_type == 'client_credentials') {
      return await clientCredentialsToken(req, res);
    }

    return await authorizationCodeToken(req, res);
  });

  var clientCredentialsToken = async (req, res) => {
    var client_id = null;
    var client_secret = null;

    try {
      if (req.headers.authorization) {
        var details = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString('utf8').split(':');

        client_id = details[0];
        client_secret = details[1];
      } else if (req.body.client_id && req.body.client_secret) {
        client_id = req.body.client_id;
        client_secret = req.body.client_secret;
      }
    } catch (e) {
      config.log.logger.debug(e);
      res.code(401);
      return {
        type: 'invalid_client',
        msg: 'client_id and/or client_secret are invalid'
      };
    }

    if (!client_id || !client_secret) {
      res.code(401);
      return {
        type: 'invalid_client',
        msg: 'client_id and/or client_secret are invalid'
      };
    }
    var token = await TokenHandler.checkOAuthToken(client_id, client_secret);

    if (!token) {
      res.code(401);
      return {
        type: 'invalid_client',
        msg: 'client_id and/or client_secret are invalid'
      };
    }

    res.code(200);
    return await TokenHandler.getAccessToken(token);
  };

  var authorizationCodeToken = async (req, res) => {
    var code = null;
    var client_id = null;
    var client_secret = null;

    try {
      if (req.headers.authorization) {
        var details = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString('utf8').split(':');

        client_id = details[0];
        client_secret = details[1];
      } else if (req.body.client_id && req.body.client_secret) {
        client_id = req.body.client_id;
        client_secret = req.body.client_secret;
      }
      code = Buffer.from(req.body.code, 'base64').toString('utf8').split(':');
    } catch (e) {
      config.log.logger.debug(e);
      res.code(401);
      return {
        type: 'invalid_client',
        msg: 'client_id and/or client_secret are invalid'
      };
    }

    // console.log(client_id, client_secret, code[0], code[1]);

    if (!client_id || !client_secret) {
      res.code(401);
      return {
        type: 'invalid_client',
        msg: 'client_id and/or client_secret are invalid'
      };
    }

    var checkedCode = await TokenHandler.checkOAuthCode(code[0], code[1]);

    if (!checkedCode) {
      res.code(401);
      return {
        type: 'invalid_client',
        msg: 'client_id and/or client_secret are invalid'
      };
    }

    // console.log('checkdCode', checkedCode);

    var codeUserId = checkedCode.id.split('_'); // tokenid, userid

    var checkedToken = await TokenHandler.checkOAuthToken(client_id, client_secret);

    if (!checkedToken) {
      res.code(401);
      return {
        type: 'invalid_client',
        msg: 'client_id and/or client_secret are invalid'
      };
    }

    // console.log('checkedToken', checkedToken);
    // console.log('ID  CHECK: ', checkedToken.user_id, codeUserId[1], codeUserId[0], checkedToken.user_id != codeUserId[1], checkedToken.name != codeUserId[0] && checkedToken.id != codeUserId[0]);

    if (checkedToken.name != codeUserId[0] && checkedToken.id != codeUserId[0]) {
      res.code(401);
      return {
        type: 'invalid_client',
        msg: 'client_id and/or client_secret are invalid'
      };
    }

    checkedCode.user_id = checkedCode.id.split('_')[1];
    await TokenHandler.deleteOAuthCode(client_id, client_secret);

    res.code(200);
    return await TokenHandler.getAccessToken(checkedCode);
  };

  done();
};
