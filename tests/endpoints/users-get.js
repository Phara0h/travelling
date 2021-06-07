const config = require('../../include/utils/config');
const { Travelling } = require('../../sdk/node')('http://127.0.0.1:6969/' + config.serviceName, {
  resolveWithFullResponse: true
});
var userContainer = require('../include/UserContainer.js');

module.exports = () => {
  describe('Valid', () => {
    test('Get Users', async () => {
      var res = await Travelling.Users.get(null, null, null, null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(5);
    });

    test('Get Users with sort', async () => {
      var res = await Travelling.Users.get('created_on', null, null, null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(5);
    });

    test('Get Users with limit', async () => {
      var res = await Travelling.Users.get(null, 1, null, null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
    });

    test('Get Users with sortdir', async () => {
      var res = await Travelling.Users.get(null, null, null, 'ASC', userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(5);
    });

    test('Get Users with filter locked [false]', async () => {
      var res = await Travelling.Users.get(null, null, 'locked=false', null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(3);
    });

    test('Get Users with filter created_on in date range', async () => {
      var yesterday = new Date()
      var tomorrow = new Date()
      yesterday.setDate(yesterday.getDate() - 1);
      tomorrow.setDate(tomorrow.getDate() + 1);

      var res = await Travelling.Users.get(null, null, `created_on >= ${yesterday.toISOString()}, created_on <= ${tomorrow.toISOString()}`, null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(5);
    });

    test('Get Users with filter created_on out of date range', async () => {
      var oneWeekAgo = new Date()
      var twoWeeksAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      var res = await Travelling.Users.get(null, null, `created_on>=${twoWeeksAgo.toISOString()},created_on<=${oneWeekAgo.toISOString()}`, null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(0);
    });

    test('Get Users with filter created_on in date range with locked [false]', async () => {
      var yesterday = new Date()
      var tomorrow = new Date()
      yesterday.setDate(yesterday.getDate() - 1);
      tomorrow.setDate(tomorrow.getDate() + 1);

      var res = await Travelling.Users.get(null, null, `locked=false,created_on >= ${yesterday.toISOString()}, created_on <= ${tomorrow.toISOString()}`, null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(3);
    });

    test('Get Users with sort and limit', async () => {
      var res = await Travelling.Users.get('created_on', 1, null, null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
    });

    test('Get Users with sort, limit, and sortdir', async () => {
      var res = await Travelling.Users.get('created_on', 1, null, 'ASC', userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
    });

    test('Get Users with sort, limit, filter and sortdir', async () => {
      var res = await Travelling.Users.get('created_on', 1, 'locked=false', 'ASC', userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
    });

    test('Get Users with filter created_on in date range with locked [false] and sort, limit, and sortdir', async () => {
      var yesterday = new Date()
      var tomorrow = new Date()
      yesterday.setDate(yesterday.getDate() - 1);
      tomorrow.setDate(tomorrow.getDate() + 1);

      var res = await Travelling.Users.get('created_on', 1, `locked=false,created_on >= ${yesterday.toISOString()}, created_on <= ${tomorrow.toISOString()}`, 'ASC', userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
    });

    test('Get Users By GroupRequest', async () => {
      var res = await Travelling.Users.byGroupRequest('testgroup', userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body[0].username).toEqual('test');
    });

    test('Get Users By Default Domain', async () => {
      var res = await Travelling.Users.Domain.get('default', null, null, null, null, userContainer.userDomainToken);

      expect(res.statusCode).toEqual(200);
      expect(Number(res.body.length)).toBeGreaterThanOrEqual(1);
    });

    test('Get Users By Domain', async () => {
      var res = await Travelling.Users.Domain.get('test.com', null, null, null, null, userContainer.userDomainToken);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].domain).toEqual('test.com');
    });

    test('Get Users By Domain with sort', async () => {
      var res = await Travelling.Users.Domain.get('test.com', 'created_on', null, null, null, userContainer.userDomainToken);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].domain).toEqual('test.com');
    });

    test('Get Users By Domain with limit', async () => {
      var res = await Travelling.Users.Domain.get('test.com', null, 1, null, null, userContainer.userDomainToken);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].domain).toEqual('test.com');
    });

    test('Get Users By Domain with sortdir', async () => {
      var res = await Travelling.Users.Domain.get('test.com', null, null, null, 'ASC', userContainer.userDomainToken);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].domain).toEqual('test.com');
    });

    test('Get Users By Domain with filter locked [false]', async () => {
      var res = await Travelling.Users.Domain.get('test.com', null, null, 'locked=false', null, userContainer.userDomainToken);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].domain).toEqual('test.com');
    });

    test('Get Users By Domain with filter created_on in date range', async () => {
      var yesterday = new Date()
      var tomorrow = new Date()
      yesterday.setDate(yesterday.getDate() - 1);
      tomorrow.setDate(tomorrow.getDate() + 1);

      var res = await Travelling.Users.Domain.get('test.com', null, null, `created_on >= ${yesterday.toISOString()}, created_on <= ${tomorrow.toISOString()}`, null, userContainer.userDomainToken);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].domain).toEqual('test.com');
    });

    test('Get Users By Domain with filter created_on out of date range', async () => {
      var oneWeekAgo = new Date()
      var twoWeeksAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      var res = await Travelling.Users.Domain.get('test.com', null, null, `created_on>=${twoWeeksAgo.toISOString()},created_on<=${oneWeekAgo.toISOString()}`, null, userContainer.userDomainToken);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(0);
    });

    test('Get Users By Domain with filter created_on in date range with locked [false]', async () => {
      var yesterday = new Date()
      var tomorrow = new Date()
      yesterday.setDate(yesterday.getDate() - 1);
      tomorrow.setDate(tomorrow.getDate() + 1);

      var res = await Travelling.Users.Domain.get('test.com', null, null, `locked=false,created_on >= ${yesterday.toISOString()}, created_on <= ${tomorrow.toISOString()}`, null, userContainer.userDomainToken);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].domain).toEqual('test.com');
    });

    test('Get Users By Domain with sort and limit', async () => {
      var res = await Travelling.Users.Domain.get('test.com', 'created_on', 1, null, null, userContainer.userDomainToken);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].domain).toEqual('test.com');
    });

    test('Get Users By Domain with sort, limit, and sortdir', async () => {
      var res = await Travelling.Users.Domain.get('test.com', 'created_on', 1, null, 'ASC', userContainer.userDomainToken);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].domain).toEqual('test.com');
    });

    test('Get Users By Domain with sort, limit, filter and sortdir', async () => {
      var res = await Travelling.Users.Domain.get('test.com', 'created_on', 1, 'locked=false', 'ASC', userContainer.userDomainToken);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].domain).toEqual('test.com');
    });

    test('Get Users By Domain with filter created_on in date range with locked [false] and sort, limit, and sortdir', async () => {
      var yesterday = new Date()
      var tomorrow = new Date()
      yesterday.setDate(yesterday.getDate() - 1);
      tomorrow.setDate(tomorrow.getDate() + 1);

      var res = await Travelling.Users.Domain.get('test.com', 'created_on', 1, `locked=false,created_on >= ${yesterday.toISOString()}, created_on <= ${tomorrow.toISOString()}`, 'ASC', userContainer.userDomainToken);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].domain).toEqual('test.com');
    });

    test('Get Users Count', async () => {
      var res = await Travelling.Users.count(null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body.count).toEqual(5);
    });

    test('Get Users Count with filter created_on in date range', async () => {
      var yesterday = new Date()
      var tomorrow = new Date()
      yesterday.setDate(yesterday.getDate() - 1);
      tomorrow.setDate(tomorrow.getDate() + 1);

      var res = await Travelling.Users.count(`created_on >= ${yesterday.toISOString()}, created_on <= ${tomorrow.toISOString()}`, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body.count).toEqual(5);
    });

    test('Get Users Count by Domain', async () => {
      var res = await Travelling.Users.Domain.count('test.com', null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body.count).toEqual(1);
    });

    test('Get Users Count by Domain filter created_on in date range', async () => {
      var yesterday = new Date()
      var tomorrow = new Date()
      yesterday.setDate(yesterday.getDate() - 1);
      tomorrow.setDate(tomorrow.getDate() + 1);

      var res = await Travelling.Users.Domain.count('test.com', `created_on >= ${yesterday.toISOString()}, created_on <= ${tomorrow.toISOString()}`, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body.count).toEqual(1);
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

    test('Get Users with filter created_on with invalid date', async () => {
      var res = await Travelling.Users.get(null, null, 'created_on < figment-of-ones-imagination', null, userContainer.user1Token);

      expect(res.statusCode).toEqual(400);
    });

    test('Get Users By Domain with filter created_on with invalid date', async () => {
      var res = await Travelling.Users.Domain.get('test.com', null, null, 'created_on < veryinvalid', null, userContainer.userDomainToken);

      expect(res.statusCode).toEqual(400);
    });

    test('Get Users By Domain with filter created_on with invalid domain', async () => {
      var yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1);

      var res = await Travelling.Users.Domain.get('swagger.69', null, null, `created_on >= ${yesterday.toISOString()}`, null, userContainer.userDomainToken);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(0);
    });

  });
};
