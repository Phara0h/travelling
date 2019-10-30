const config = require('../include/utils/config');
const Group = require('../include/database/models/group');
const User = require('../include/database/models/user');
const Token = require('../include/database/models/token');

const Redis = require('../include/redis');

const Base = require('@abeai/node-utils').Base;
const PGConnecter = require('@abeai/node-utils').PGConnecter;
const PGBaseModel = require('@abeai/node-utils').PGBaseModel;
const pg = new PGConnecter({
    pg: {
        connectionString: config.pg.url,
    },
    crypto: require(config.pg.crypto.implementation),
});

var deletedUsers = [];
var deletedGroups = [];
var deletedTokens = [];

beforeAll(async () => {
    try {
      deletedUsers = await User.deleteAll();
      deletedGroups = await Group.deleteAll();
      deletedTokens = await Token.deleteAll();

      console.log('Clear Database');
      console.log('Deleted Groups: ', deletedGroups);
      console.log('Deleted Users: ',deletedUsers);
      console.log('Deleted Tokens: ',deletedTokens);

    } catch (e) {
      console.error(e)
    }

    console.log('Flushing Redis...');
    await Redis.flushAll();

    require('./include/start-test-servers.js');
    const server = require('../index.js');

    await server;

    return;
});

afterAll(async () => {

    console.log('Flushing Redis...');
    await Redis.flushAll();

    await User.deleteAll();
    await Group.deleteAll();
    await Token.deleteAll();

    var user = Base(PGBaseModel, User.table, User._defaultModel);
    var token = Base(PGBaseModel, Token.table, Token._defaultModel);

    for (var i = 0; i < deletedGroups.length; i++) {
        await Group.create(deletedGroups[i]);
    }
    for (var j = 0; j < deletedUsers.length; j++) {
      await user.create(deletedUsers[j])
    }
    for (var k = 0; k < deletedTokens.length; k++) {
      await token.create(deletedTokens[k])
    }
});


describe('Endpoints', require('./endpoints'));
//describe('Email', require('./email'));
describe('Routes', require('./routes'));
describe('Flows', require('./flow-tests'));

test('Waste Time', async ()=>{
  var p = new Promise((resolve, reject)=>{
      setTimeout(()=>{
          resolve();
      }, 500);
  });

  await p;

  expect(1).not.toEqual(2);
})
