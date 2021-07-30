const qs = require('querystring');
const auth = require('./functions/auth');

module.exports = function (app, opts, done) {
  // if (config.cors.enable) {
  //   app.use((req,res,next) => {
  //     res.setHeader('access-control-allow-credentials', true)
  //     next();
  //   })
  // }

  app.addContentTypeParser(
    'application/x-www-form-urlencoded',
    {
      parseAs: 'buffer',
      bodyLimit: opts.bodyLimit
    },
    function (req, body, done) {
      done(null, qs.parse(body.toString()));
    }
  );

  app.put('/auth/login', auth.loginRoute);
  app.put('/auth/login/domain/:domain', auth.loginRoute);

  app.post('/auth/register', auth.registerRoute);
  app.post('/auth/register/domain/:domain', auth.registerRoute);

  app.put('/auth/password/forgot', auth.forgotPasswordRoute);
  app.put('/auth/password/forgot/domain/:domain', auth.forgotPasswordRoute);

  app.put('/auth/password/reset', auth.resetPasswordRoute);
  app.put('/auth/password/reset/login', async (req, res) => {
    return await auth.resetPasswordRoute(req, res, true);
  });

  // Dangerous to allow for public use.
  app.put('/auth/token/password/forgot', async (req, res) => {
    return await auth.forgotPasswordRoute(req, res, false);
  });
  app.put('/auth/token/password/forgot/domain/:domain', async (req, res) => {
    return await auth.forgotPasswordRoute(req, res, false);
  });

  app.get('/auth/logout', auth.logoutRoute);

  app.get('/auth/activate', auth.activateRoute);

  app.get('/auth/oauth/authorize', auth.getOAuthAuthorizeRoute);

  app.post('/auth/oauth/authorize', auth.postOAuthAuthorizeRoute);

  app.post('/auth/token', auth.authTokenRoute);

  done();
};
