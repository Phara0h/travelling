'use strict';

const fs = require('fs');
const path = require('path');
const config = require('./include/utils/config');
const misc = require('./include/utils/misc');

config.log.logger = require(config.log.logger);

if (typeof config.log.fastify.logger == 'string' && misc.stringToBool(config.log.fastify.logger) === null) {
    config.log.fastify.logger = require(config.log.fastify.logger);
} else {
    config.log.fastify.logger = misc.stringToBool(config.log.fastify.logger);
}

var fastifyOptions = {
    http2: false,
    logger: config.log.fastify.logger,
    // logger: true
    disableRequestLogging: !config.log.fastify.requestLogging,
    requestIdHeader: config.log.fastify.requestIdHeader,
    requestIdLogLabel: config.log.fastify.requestIdLogLabel,
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

const PGConnecter = require('@abeai/node-utils').PGConnecter;

const pg = new PGConnecter({
    pg: {
        connectionString: config.pg.url,
    },
    crypto: require(config.pg.crypto.implementation),
});

const Database = require('./include/database');
const Group = require('./include/database/models/group');
const User = require('./include/database/models/user');
const Token = require('./include/database/models/token');

const redis = require('./include/redis');

const Router = require('./include/server/router');
const router = new Router(app.server);

const auth = require('./include/utils/auth');
const Email = require('./include/utils/email');

const nstats = require('nstats')();

app.setErrorHandler(function(error, request, reply) {
    config.log.logger.error(error);
    reply.code(500).send(JSON.stringify({
        type: 'error',
        msg: 'Please report this issue to the site admin',
    }));
});

app.register(require('./include/server/cors.js'), {router});

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

app.get('/favicon.ico', (req, res)=> {
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

app.register(fastifyCookie);

// @TODO later rewrite this for a huge preformance increase.
// Add removing tokens if user needs updated (removed, locked, etc)
app.register(fastifySession, {
    secret: config.cookie.session.secret,
    store: redis.sessionStore,
    cookie: {
        secure: config.https,
        httpOnly: true,
        maxAge: config.cookie.session.expiration * 1000,
        domain: config.cookie.domain,
    },
    cookieName: 'trav:ssid',
    saveUninitialized: false,
});

app.decorateRequest('checkLoggedIn', async function(req, res) {return await auth.checkLoggedIn(req, res, router);});
app.decorateRequest('logout', auth.logout);
app.decorateRequest('isAuthenticated', false);
app.addHook('preHandler', function(req, res, next) {

    req.checkLoggedIn(req, res, router).then(auth=>{
        req.isAuthenticated = auth.auth;

        if (!auth.route) {
            res.code(401);
            if (auth.invaildToken) {
                res.send({
                    error: 'invaild_client',
                    error_description: 'Invaild Access Token',
                });
            } else {
                res.send();
                if (config.log.requests) {
                    config.log.logger.warn('Unauthorized', 'Unregistered User' + ' (anonymous)' + ' | ' + req.ip + ' | [' + req.raw.method + '] ' + req.req.url);
                }
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
app.get('/travelling/api/v1/config/:prop', (req, res) => {

    res.code(200).send(config[req.params.prop]);

});

if (config.portal.enable) {

    app.get('/travelling/assets/logo', (req, res) => {

        res.sendFile(config.portal.logo);
        res.code(200);
        return;
    });

    app.get('/travelling/assets/styles', (req, res) => {
        res.sendFile(config.portal.styles);
        res.code(200);
        return;
    });

    app.register(require('fastify-static'), {
        root: '/',
        send: {
            dotfiles: 'allow',
        },
        serve: false,
    });

    app.register(require('fastify-static'), {
        root: config.portal.filePath,
        prefix: config.portal.path,
        decorateReply: false,
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
