const config = require('../utils/config');

module.exports = function (app, opts, done) {
  if (config.cors.enable) {
    var configOrigin = null;

    if (config.cors.origin) {
      configOrigin = config.cors.origin.split('.');
    }

    app.use((req, res, next) => {
      if (req.headers['origin'] && configOrigin) {
        var reqOrigin = req.headers['origin'].split('.');

        if (reqOrigin.length == configOrigin.length) {
          var isAllowed = true;

          for (var i = 0; i < reqOrigin.length; i++) {
            if (reqOrigin[i] != configOrigin[i] && configOrigin[i] != '*') {
              isAllowed = false;
              break;
            }
          }

          if (isAllowed) {
            res.setHeader('access-control-allow-origin', req.headers['origin']);
          }
        }
      } else if (req.headers['origin']) {
        res.setHeader('access-control-allow-origin', req.headers['origin']);
      }

      if (req.headers['access-control-request-method']) {
        res.setHeader('access-control-allow-methods', config.cors.methods || req.headers['access-control-request-method'] || '*');
      }

      if (req.headers['access-control-request-headers']) {
        res.setHeader(
          'access-control-allow-headers',
          config.cors.headers || req.headers['access-control-request-headers'] || '*'
        );
      }

      if (req.url.indexOf('/' + config.serviceName + '/api/v1/auth') > -1) {
        res.setHeader('access-control-allow-credentials', true);
      }

      next();
    });
    app.options('/' + config.serviceName + '/api/v1/*', (req, res) => {
      res.header('access-control-max-age', config.cors.age);
      res.code(204).send();
    });
  }

  done();
};
