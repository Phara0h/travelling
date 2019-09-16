const fs = require('fs');
const path = require('path');
const config = require('./include/utils/config');
const misc = require('./include/utils/misc')
config.log.logger = require(config.log.logger);

if (typeof config.log.fastify.logger == 'string' && misc.stringToBool(config.log.fastify.logger) === null) {
    config.log.fastify.logger = require(config.log.fastify.logger);
}
else {
  config.log.fastify.logger = misc.stringToBool(config.log.fastify.logger)
}

var fastifyOptions = {
    http2: false,
    logger: config.log.fastify.logger,
    // logger: true
    disableRequestLogging: config.log.fastify.disableRequestLogging,
    requestIdHeader: config.log.fastify.requestIdHeader,
    requestIdLogLabel: config.log.fastify.requestIdLogLabel
};

if (config.https) {
    fastifyOptions.https = {
        allowHTTP1: true, // fallback support for HTTP1
        key: fs.readFileSync(path.join(__dirname, config.key)),
        cert: fs.readFileSync(path.join(__dirname, config.cert)),
    };
}

const app = require('fastify')(fastifyOptions);

const fastifySession = require('fastify-good-sessions');
const fastifyCookie = require('fastify-cookie');
const MemoryStore = require('./include/utils/memorystore');

const PGConnecter = require('@abeai/node-utils').PGConnecter;

const pg = new PGConnecter({
    pg: {
        connectionString: process.env.DATABASE_URL,
    },
    crypto: require(config.pg.crypto.implementation),
});

const Database = require('./include/database');
const Group = require('./include/database/models/group');
const User = require('./include/database/models/user');
const Token = require('./include/database/models/token');

const Router = require('./include/server/router');
const router = new Router(app.server);

const auth = require('./include/utils/auth');
const Email = require('./include/utils/email');

const nstats = require('nstats')();

app.setErrorHandler(function(error, request, reply) {
    console.log(error);
    reply.code(500).send({
        type: 'error',
        msg: 'Please report this issue to the site admin',
    });
});

if (config.cors.enable) {
    app.use((req, res, next) => {
        if (req.headers['origin']) {
            res.setHeader('access-control-allow-origin', config.cors.origin || req.headers['origin'] || '*');
        }

        if (req.headers['access-control-request-method']) {
            res.setHeader('access-control-allow-methods', config.cors.methods || req.headers['access-control-request-method'] || '*');
        }

        if (req.headers['access-control-request-headers']) {
            res.setHeader('access-control-allow-headers', config.cors.headers || req.headers['access-control-request-headers'] || '*');
        }

        if (req.url.indexOf('/travelling/api/v1/auth') > -1) {
            res.setHeader('access-control-allow-credentials', true);
        }
        next();
    });
    app.options('/travelling/api/v1/*', (req, res) => {

        res.header('access-control-max-age', config.cors.age);
        res.code(204).send();
    });
}

app.get('/travelling/metrics', (req, res) => {res.code(200).send(nstats.toPrometheus());});
app.get('/travelling/_health', (req, res) => res.code(200).send('OK'));

// nstats
app.use((req, res, next)=>{
    if (req.url.indexOf('/travelling/metrics') == -1 && req.url.indexOf('/travelling/_health') == -1) {

        if (!nstats.httpServer) {
            nstats.httpServer = req.connection.server;
        }

        var sTime = process.hrtime.bigint();

        res.on('finish', () => {
            nstats.addWeb(req, res, sTime);
        });
    }
    next();
});

app.register(fastifyCookie);

// @TODO later rewrite this for a huge preformance increase.
// Add removing tokens if user needs updated (removed, locked, etc)
app.register(fastifySession, {
    secret: config.cookie.session.secret,
    store: new MemoryStore(),
    cookie: {
        secure: config.https,
        httpOnly: true,
        maxAge: config.cookie.session.expiration * 1000,
    },
    cookieName: 'trav:ssid',
    saveUninitialized: false,
});

app.decorateRequest('checkLoggedIn', async function(req, res) {return await auth.checkLoggedIn(req, res, router);});
app.decorateRequest('logout', auth.logout);
app.decorateRequest('isAuthenticated', false);
app.addHook('preHandler', function(req, res, next) {

    req.checkLoggedIn(req, res).then(auth=>{
        req.isAuthenticated = auth.auth;

        if (!auth.route) {
            res.code(401).send();
            if (config.log.requests) {
                config.log.logger.warn('Unauthorized', 'Unregistered User' + ' (anonymous)' + ' | ' + req.ip + ' | [' + req.raw.method + '] ' + req.req.url);
            }

        } else {
            router.routeUrl(req, res).then(route=>{
                if (!route) {
                    next();
                }
            });
        }
    });
});

app.register(require('./include/routes/v1/auth'), {prefix: '/travelling/api/v1', router});
app.register(require('./include/routes/v1/groups'), {prefix: '/travelling/api/v1', router});
app.register(require('./include/routes/v1/users').routes, {prefix: '/travelling/api/v1', router});

if (config.portal.enable) {
    app.register(require('fastify-static'), {
        root: config.portal.filePath,
        prefix: config.portal.path,
    });
}

app.ready(()=>{
    config.log.logger.debug(app.printRoutes());
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

    await Database.initGroups(router);
    await Email.init();
    app.listen(config.port, config.ip);

    config.log.logger.info(`Travelling on port ${config.port}`);
}

module.exports = init();
