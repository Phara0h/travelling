const fs = require('fs')
const path = require('path')
const config = require('./include/utils/config');

const app = require('fastify')({
  http2: true,
  https: {
    allowHTTP1: true, // fallback support for HTTP1
    key: fs.readFileSync(path.join(__dirname, config.key)),
    cert: fs.readFileSync(path.join(__dirname, config.cert)),
    password: '1234'
  },
  logger: true
});
const fastifySession = require('fastify-session');
const fastifyCookie = require('fastify-cookie');
const MemoryStore = require('./include/utils/memorystore');

const PGConnecter = require('@abeai/node-utils').PGConnecter;

const pg = new PGConnecter({
  pg:{
    connectionString: process.env.DATABASE_URL,
  },
  crypto: require(config.pg.crypto.implementation)
});

const Group = require('./include/database/models/group');
const User = require('./include/database/models/user');

const nstats = require('nstats')();

app.get('/travelling/metrics', (req, res) => {res.code(200).send(nstats.toPrometheus())});
app.get('/travelling/_health', (req, res) => res.code(200).send('OK'));

//nstats
app.use((req,res,next)=>{
  if(req.url.indexOf('/travelling/metrics') == -1 && req.url.indexOf('/travelling/_health') == -1) {
    if(!nstats.httpServer)
    {
      nstats.httpServer = req.connection.server;
    }
    var sTime = process.hrtime.bigint();
    res.on("finish", () =>
    {
      nstats.addWeb(req, res, sTime)
    });
  }
  next();
});


app.register(fastifyCookie);
app.register(fastifySession,
{
  secret: config.cookie.secret,
  store: new MemoryStore(),
  cookie: {
        expires: new Date(Date.now() + (config.token.expiration * 86400000)),
         secure: true,
         httpOnly: true,
       },
  cookieName: 'trav:ssid'
}); // @TODO Make configurable latter

app.addHook('preHandler', (request, reply, next) => {
  //request.session.user = {name: 'max'};
  next();
})

app.register(require('./include/routes/v1/users'), { prefix: '/travelling/api/v1'});
app.register(require('./include/routes/v1/groups'), { prefix: '/travelling/api/v1'});
app.register(require('./include/routes/v1/auth'), { prefix: '/travelling/api/v1'});

async function initDBTables()
{
  await User.createTable();
  await Group.createTable();
  app.listen(config.port,'0.0.0.0')

  console.log(`Travelling on port ${config.port}`);
}
initDBTables();
