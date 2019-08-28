const config = require('../include/utils/config');
const Group = require('../include/database/models/group');
const User = require('../include/database/models/user');
const PGConnecter = require('@abeai/node-utils').PGConnecter;
const pg = new PGConnecter({
    pg: {
        connectionString: process.env.DATABASE_URL,
    },
    crypto: require('../include/utils/cryptointerface'),
});

var deletedUsers;
var deletedGroups;

beforeAll(async () => {

    deletedUsers = await User.deleteAll();
    deletedGroups = await Group.deleteAll();

    console.log('Clear Database');
    console.log('Deleted: ', deletedGroups, deletedUsers);

    const server = require('../index.js');

    await server;
    return;
});

afterAll(async () => {
    await User.deleteAll();
    await Group.deleteAll();
    for (var i = 0; i < deletedGroups.length; i++) {
        await Group.create(deletedGroups[i]);
    }
    for (var i = 0; i < deletedUsers.length; i++) {
        await User.create(deletedUsers[i]);
    }
});

describe('Endpoints', () => {
  describe('Auth', () =>{
      describe('Register', require('./endpoints/auth-register.js'))
      describe('Login', require('./endpoints/auth-login.js'))
  });
});
