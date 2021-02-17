const config = require('../../include/utils/config');
const { Travelling } = require('../../sdk/node')('http://127.0.0.1:6969/' + config.serviceName, {
  resolveWithFullResponse: true
});
var userContainer = require('../include/UserContainer.js');

module.exports = () => {
  describe('Valid', () => {
    test('Get Users', async () => {
      var res = await Travelling.Users.get(userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(4);
    });

    test('Get Users By GroupRequest', async () => {
      var res = await Travelling.Users.byGroupRequest('testgroup', userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body[0].username).toEqual('test');
    });
  });

  describe('Invalid', () => {
    test('Check Permission With No Permission', async () => {
      var res = await Travelling.User.Current.permissionCheck('', null, {
        headers: {
          cookie: userContainer.user1Cookie()
        }
      });

      expect(res.statusCode).toEqual(401);
    });

    test('Check Route With No Route & No Method', async () => {
      var res = await Travelling.User.Current.routeCheck('', '', null, {
        headers: {
          cookie: userContainer.user1Cookie()
        }
      });

      expect(res.statusCode).toEqual(401);
    });
  });
};
