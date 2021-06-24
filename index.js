const config = require('./include/utils/config');
const fs = require('fs');
const path = require('path');

const parse = require('./include/utils/parse');

var is_testing = false;

if (
  (process.env.npm_lifecycle_event && process.env.npm_lifecycle_event.indexOf('test') > -1) ||
  (process.env.NODE_ENV && process.env.NODE_ENV.indexOf('test') > -1) ||
  process.env.JEST_WORKER_ID
) {
  is_testing = true;
}

const ignored_routes = [`/${config.serviceName}/metrics`, `/${config.serviceName}/health`];

if (config.log.logger) {
  if (typeof config.log.logger === 'string') {
    if (config.log.logger == 'wog') {
      var appendFields = {};

      if (config.log.appendFields.app.enable) {
        appendFields.app = config.log.appendFields.app.label;
      }
      if (config.log.appendFields.version.enable) {
        appendFields.version = config.log.appendFields.version.label;
      }
      if (config.log.appendFields.environment.enable) {
        appendFields.environment = config.log.appendFields.environment.label;
      }
      if (config.log.appendFields.host.enable) {
        appendFields.host = config.log.appendFields.host.label;
      }
      if (config.log.appendFields.branch.enable) {
        appendFields.branch = config.log.appendFields.branch.label;
      }

      if (Object.keys(appendFields).length == 0) {
        appendFields = null;
      }

      config.log.logger = require('wog')({
        enable: config.log.enable,
        colors: config.log.colors,
        jsonoutput: config.log.jsonoutput,
        addTimestamp: true,
        appendFields,
        serializers: {
          req: function (req) {
            var traceId = '';

            if (ignored_routes.indexOf(req.url) > -1) {
              return null;
            }

            if (config.tracing.enable) {
              if (!req.span || req.span == '') {
                if (is_testing) {
                  req.span = trace.tracer.startSpan('root', trace.opentelemetry.context.active());
                } else {
                  req.span = trace.opentelemetry.getSpan(trace.opentelemetry.context.active());
                }
              }
              if (req.span) {
                traceId = req.span.context().traceId;
              }
            }
            var headers = {
              ...req.headers
            };

            delete headers.cookie;

            return {
              method: req.method,
              url: req.url,
              headers,
              remoteAddress: parse.getIp(req),
              remotePort: req.socket.remotePort,
              wog_type: 'request',
              traceId
            };
          },

          res: function (reply) {
            if (ignored_routes.indexOf(reply.request.url) > -1) {
              return null;
            }
            return {
              wog_type: 'reply',
              statusCode: reply.statusCode,
              traceId: config.tracing.enable && reply.request.span ? reply.request.span.context().traceId : ''
            };
          }
        }
      });
    } else {
      config.log.logger = require(config.log.logger);
    }
  }
}
var trace = null;

if (config.tracing.enable) {
  trace = require('./include/server/tracing')(config);
  trace.helpers = require('./include/server/tracing/helpers.js')();
}

var fastifyOptions = {
  http2: false,
  logger: config.log.logger,

  // logger: true
  disableRequestLogging: !config.log.fastify.requestLogging,
  requestIdHeader: config.log.fastify.requestIdHeader,
  requestIdLogLabel: config.log.fastify.requestIdLogLabel
};

if (config.https) {
  fastifyOptions.https = {
    allowHTTP1: true, // fallback support for HTTP1
    key: fs.readFileSync(path.join(__dirname, config.key)),
    cert: fs.readFileSync(path.join(__dirname, config.cert))
  };
}

const app = require('fastify')(fastifyOptions);

const fastifySession = require('fastify-good-sessions');
const fastifyCookie = require('fastify-cookie');

const PGConnecter = require('adost').PGConnecter;

var pgc = {};

if (config.pg.url) {
  pgc.connectionString = config.pg.url;
}
if (config.pg.user) {
  pgc.user = config.pg.user;
}
if (config.pg.password) {
  pgc.password = config.pg.password;
}
if (config.pg.database) {
  pgc.database = config.pg.database;
}
if (config.pg.host) {
  pgc.host = config.pg.host;
}
if (config.pg.port) {
  pgc.port = config.pg.port;
}

const pg = new PGConnecter({
  pg: pgc,
  crypto: require(config.pg.crypto.implementation)
});

const Database = require('./include/database');
const Group = require('./include/database/models/group');
const User = require('./include/database/models/user');
const Token = require('./include/database/models/token');
const Audit = require('./include/database/models/audit');

const redis = require('./include/redis');

const Router = require('./include/server/router');
const router = new Router(app.server);

const auth = require('./include/utils/auth');
const Email = require('./include/utils/email');

const nstats = require('nstats')();

if (config.tracing.enable) {
  app.setErrorHandler((error, request, reply) => {
    error.traceId = request.span.context().traceId;
    config.log.logger.error(error);

    request.span.recordException(error);

    reply.code(500).send(
      JSON.stringify({
        type: 'error',
        msg: 'Please report this issue to the site admin'
      })
    );
  });
  app.decorateRequest('span', '');
  app.decorateRequest('startSpan', trace.helpers.startSpan);
  // if (is_testing) {
  //   app.addHook('onRequest', (req, res, done) => {
  //     req.span = trace.tracer.startSpan('root', trace.opentelemetry.context.active());
  //     done();
  //   });
  // } else {
  //   app.addHook('onRequest', (req, res, done) => {
  //     req.span = trace.opentelemetry.getSpan(trace.opentelemetry.context.active());
  //     done();
  //   });
  // }
} else {
  app.setErrorHandler(function (error, request, reply) {
    config.log.logger.error(error);
    reply.code(500).send(
      JSON.stringify({
        type: 'error',
        msg: 'Please report this issue to the site admin'
      })
    );
  });
}

app.register(require('./include/server/cors.js'), { router });

app.get('/' + config.serviceName + '/metrics', (req, res) => {
  res.code(200).send(nstats.toPrometheus());
});
app.get('/' + config.serviceName + '/health', (req, res) => res.code(200).send('All Systems Nominal'));
app.register(nstats.fastify(), {
  ignored_routes
});

if (config.portal.enable) {
  app.get('/favicon.ico', (req, res) => {
    try {
      fs.readFile(config.portal.icon, (err, data) => {
        let stream;

        if (err && err.code === 'ENOENT') {
          stream = fs.createReadStream(__dirname + '/client/assets/favicon.ico');
        } else {
          stream = fs.createReadStream(config.portal.icon);
        }
        res.type('image/x-icon').send(stream);
      });
    } catch (e) {
      config.log.logger.error(e);
      res.code(500).send();
    }
  });
}

app.register(fastifyCookie);

// @TODO later rewrite this for a huge preformance increase.
// Add removing tokens if user needs updated (removed, locked, etc)
app.register(fastifySession, {
  secret: config.cookie.session.secret,
  store: redis.sessionStore,
  cookie: {
    secure: config.https,
    httpOnly: true,
    maxAge: config.cookie.session.expiration,
    domain: config.cookie.domain
  },
  cookieName: 'trav:ssid',
  saveUninitialized: false
});

app.decorateRequest('checkLoggedIn', async function (req, res, router, span) {
  return await auth.checkLoggedIn(req, res, router, span);
});
app.decorateRequest('logout', auth.logout);
app.decorateRequest('isAuthenticated', false);

app.addHook('preParsing', function (req, res, payload, next) {
  req.checkLoggedIn(req, res, router, req.span).then((auth) => {
    req.isAuthenticated = auth.auth;

    if (!auth.route) {
      res.code(401);
      if (auth.invalidToken) {
        res.send({
          error: 'invalid_client',
          error_description: 'Invalid Access Token'
        });
      } else {
        res.send();
        if (config.log.requests) {
          config.log.logger.warn(
            'Unauthorized',
            'Unregistered User' + ' (anonymous)' + ' | ' + parse.getIp(req) + ' | [' + req.raw.method + '] ' + req.raw.url
          );
        }
      }
    } else {
      router.routeUrl(req, res, req.span).then((route) => {
        if (!route) {
          next();
        }
      });
    }
  });
});

app.register(require('./include/routes/v1/auth'), { prefix: '/' + config.serviceName + '/api/v1', router });
app.register(require('./include/routes/v1/groups'), { prefix: '/' + config.serviceName + '/api/v1', router });
app.register(require('./include/routes/v1/users'), { prefix: '/' + config.serviceName + '/api/v1', router });
app.get('/' + config.serviceName + '/api/v1/config/:prop', (req, res) => {
  res.code(200).send(config[req.params.prop]);
});
app.get('/' + config.serviceName + '/api/v1/config/:prop/:prop2', (req, res) => {
  res.code(200).send(config[req.params.prop][req.params.prop2]);
});

if (config.portal.enable) {
  app.get('/' + config.serviceName + '/assets/logo', (req, res) => {
    res.sendFile(config.portal.logo);
    res.code(200);
    return;
  });

  app.get('/' + config.serviceName + '/assets/styles', (req, res) => {
    res.sendFile(config.portal.styles);
    res.code(200);
    return;
  });

  app.register(require('fastify-static'), {
    root: '/',
    send: {
      dotfiles: 'allow'
    },
    serve: false
  });

  app.register(require('fastify-static'), {
    root: config.portal.filePath,
    prefix: config.portal.path,
    decorateReply: false
  });
}

app.ready(() => {
  if (!config.log.jsonoutput) {
    config.log.logger.debug(app.printRoutes());
  }
});

async function init() {
  try {
    await pg.query('CREATE EXTENSION "uuid-ossp";');
  } catch (_) {}
  try {
    await User.createTable();
  } catch (_) {}
  try {
    await Group.createTable();
  } catch (_) {}
  try {
    await Token.createTable();
  } catch (_) {}
  try {
    await Audit.createTable();
  } catch (_) {}

  await Database.initGroups(router);
  await Email.init();
  app.listen(config.port, config.ip);

  config.log.logger.info(`Travelling on port ${config.port}`);
}

module.exports = init();
