const config = require('../include/utils/config');
const Group = require('../include/database/models/group');
const User = require('../include/database/models/user');
const Token = require('../include/database/models/token');
const Audit = require('../include/database/models/audit');

const Redis = require('../include/redis');
//
// const Base = require('adost').Base;
// const PGConnecter = require('adost').PGConnecter;
// const PGBaseModel = require('adost').PGBaseModel;
// const pg = new PGConnecter({
//   pg: {
//     connectionString: config.pg.url
//   },
//   crypto: require(config.pg.crypto.implementation)
// });

var deletedUsers = [];
var deletedGroups = [];
var deletedTokens = [];
var deletedAudits = [];

beforeAll(async () => {
  try {
    deletedUsers = await User.deleteAll();
    deletedGroups = await Group.deleteAll();
    deletedTokens = await Token.deleteAll();
    deletedAudits = await Audit.deleteAll();

    console.log('Clear Database');
    console.log('Deleted Groups: ', deletedGroups);
    console.log('Deleted Users: ', deletedUsers);
    console.log('Deleted Tokens: ', deletedTokens);
    console.log('Deleted Audits: ', deletedAudits);
  } catch (e) {
    console.error(e);
  }

  if (config.redis.enabled) {
    console.log('Flushing Redis...');
    await Redis.flushAll();
  }

  require('./include/start-test-servers.js');
  const server = require('../index.js');

  await server;
  var p = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });

  await p;
  return;
});

afterAll(async () => {
  if (config.redis.enabled) {
    console.log('Flushing Redis...');
    await Redis.flushAll();
  }
  console.log('Deleting Users...');
  await User.deleteAll();
  console.log('Deleting Groups...');
  await Group.deleteAll();
  console.log('Deleting Tokens...');
  await Token.deleteAll();
  console.log('Deleting Audits...');
  await Audit.deleteAll();

  // var group = Base(PGBaseModel, Group.table, Group._defaultModel);
  // var user = Base(PGBaseModel, User.table, User._defaultModel);
  // var token = Base(PGBaseModel, Token.table, Token._defaultModel);
  //
  // for (var i = 0; i < deletedGroups.length; i++) {
  //     await group.create(deletedGroups[i]);
  // }
  // for (var j = 0; j < deletedUsers.length; j++) {
  //   await user.create(deletedUsers[j])
  // }
  // for (var k = 0; k < deletedTokens.length; k++) {
  //   await token.create(deletedTokens[k])
  // }
});
test('Waste Time', async () => {
  var p = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });

  await p;

  expect(1).not.toEqual(2);
});

describe('Endpoints', require('./endpoints'));
//describe('Email', require('./email'));
describe('Routes', require('./routes'));
describe('Flows', require('./flow-tests'));
