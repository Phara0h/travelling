const fs = require('fs');
const path = require('path');
const config = require('./include/utils/config');

const app = require('fastify')({
    http2: true,
    https: {
        allowHTTP1: true, // fallback support for HTTP1
        key: fs.readFileSync(path.join(__dirname, config.key)),
        cert: fs.readFileSync(path.join(__dirname, config.cert))
    },
    logger: true,
    disableRequestLogging: true,
});
const fp = require('fastify-plugin')

const fastifySession = require('fastify-session');
const fastifyCookie = require('fastify-cookie');
const MemoryStore = require('./include/utils/memorystore');

const PGConnecter = require('@abeai/node-utils').PGConnecter;

const pg = new PGConnecter({
    pg: {
        connectionString: process.env.DATABASE_URL,
    },
    crypto: require(config.pg.crypto.implementation)
});

const Database = require('./include/database');
const Group = require('./include/database/models/group');
const User = require('./include/database/models/user');

const Router = require('./include/server/router');
const router = new Router(app.server);

const auth = require('./include/utils/auth');

const nstats = require('nstats')();

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

// @TODO Make configurable latter rewrite this for a huge preformance increase.
app.register(fastifySession,{
        secret: config.cookie.secret,
        store: new MemoryStore(),
        cookie: {
            secure: true,
            httpOnly: true,
        },
        cookieName: 'trav:ssid'
});

app.decorateRequest('checkLoggedIn', auth.checkLoggedIn);
app.decorateRequest('logout', auth.logout);
app.decorateRequest('isAuthenticated', false);
app.addHook('preHandler',function(req, res, next) {
  req.checkLoggedIn(req, res).then(auth=>{
    req.isAuthenticated = auth.auth;
    if (auth.redirect) {
        res.redirect(302,req.raw.url);
    } else {
      router.routeUrl(req,res).then(route=>{
        if(!route){
          next();
        }
      });
    }
  })
})


app.register(require('./include/routes/v1/users'), {prefix: '/travelling/api/v1', router});
app.register(require('./include/routes/v1/groups'), {prefix: '/travelling/api/v1', router});
app.register(require('./include/routes/v1/auth'), {prefix: '/travelling/api/v1', router});

app.register(require('fastify-static'), {
  root: config.portal.filePath,
  prefix: config.portal.path, // optional: default '/'
})

app.ready(()=>{
  console.log(app.printRoutes())
})
async function init() {
    await User.createTable();
    await Group.createTable();
    await Database.initGroups(router);
    app.listen(config.port, '0.0.0.0');

    console.log(`Travelling on port ${config.port}`);
}
init();
