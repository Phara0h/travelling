const config = require('../../include/utils/config');
const { Travelling } = require('../../sdk/node')('http://127.0.0.1:6969/' + config.serviceName, {
  resolveWithFullResponse: true
});
var userContainer = require('../include/UserContainer.js');

module.exports = () => {
  var superadminGroup;

  describe('Valid', () => {
    test('Get Users', async () => {
      var res = await Travelling.Users.get(null, null, null, null, null, null, userContainer.user1Token);

      userContainer.users = res.body;

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(10);

      // Make sure we dont have any hashes
      expect(res.body[0]).not.toHaveProperty('__email');
      expect(res.body[0]).not.toHaveProperty('__user_data');
    });

    test('Get Users with sort', async () => {
      var res = await Travelling.Users.get('created_on', null, null, null, null, null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(10);
    });

    test('Get Users with limit', async () => {
      var res = await Travelling.Users.get(null, 1, null, null, null, null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
    });

    test('Get Users with skip', async () => {
      var res = await Travelling.Users.get(null, null, 2, null, null, null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(8);
    });

    test('Get Users with sortdir', async () => {
      var res = await Travelling.Users.get(null, null, null, null, 'ASC', null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(10);
    });

    test('Get Users with ids', async () => {
      var ids = userContainer.users
        .slice(0, 2)
        .map((u) => u.id)
        .join(',');

      var res = await Travelling.Users.get(null, null, null, null, null, ids, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(2);
    });

    test('Get Users with ids and limit', async () => {
      var ids = userContainer.users
        .slice(0, 2)
        .map((u) => u.id)
        .join(',');

      var res = await Travelling.Users.get(null, 1, null, null, null, ids, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
    });

    test('Get Users with ids ignored when id filter present', async () => {
      var ids = userContainer.users
        .slice(0, 2)
        .map((u) => u.id)
        .join(',');
      var id = userContainer.users[3].id;

      var res = await Travelling.Users.get(null, null, null, `id=${id}`, null, ids, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].id).toEqual(id);
    });

    test('Get Users with filter locked [false]', async () => {
      var res = await Travelling.Users.get(null, null, null, 'locked=false', null, null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(8);
    });

    test('Get Users with filter created_on in date range', async () => {
      var yesterday = new Date();
      var tomorrow = new Date();

      yesterday.setDate(yesterday.getDate() - 1);
      tomorrow.setDate(tomorrow.getDate() + 1);

      var res = await Travelling.Users.get(
        null,
        null,
        null,
        `created_on >= ${yesterday.toISOString()}, created_on <= ${tomorrow.toISOString()}`,
        null,
        null,
        userContainer.user1Token
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(10);
    });

    test('Get Users with filter created_on out of date range', async () => {
      var oneWeekAgo = new Date();
      var twoWeeksAgo = new Date();

      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      var res = await Travelling.Users.get(
        null,
        null,
        null,
        `created_on>=${twoWeeksAgo.toISOString()},created_on<=${oneWeekAgo.toISOString()}`,
        null,
        null,
        userContainer.user1Token
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(0);
    });

    test('Get Users with filter created_on in date range with locked [false]', async () => {
      var yesterday = new Date();
      var tomorrow = new Date();

      yesterday.setDate(yesterday.getDate() - 1);
      tomorrow.setDate(tomorrow.getDate() + 1);

      var res = await Travelling.Users.get(
        null,
        null,
        null,
        `locked=false,created_on >= ${yesterday.toISOString()}, created_on <= ${tomorrow.toISOString()}`,
        null,
        null,
        userContainer.user1Token
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(8);
    });

    test('Get Users with sort and limit', async () => {
      var res = await Travelling.Users.get('created_on', 1, null, null, null, null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
    });

    test('Get Users with sort, limit, and sortdir', async () => {
      var res = await Travelling.Users.get('created_on', 1, null, null, 'ASC', null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
    });

    test('Get Users with sort, limit, filter and sortdir', async () => {
      var res = await Travelling.Users.get(
        'created_on',
        1,
        null,
        'locked=false',
        'ASC',
        null,
        userContainer.user1Token
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
    });

    test('Get Users with filter created_on in date range with locked [false] and sort, limit, and sortdir', async () => {
      var yesterday = new Date();
      var tomorrow = new Date();

      yesterday.setDate(yesterday.getDate() - 1);
      tomorrow.setDate(tomorrow.getDate() + 1);

      var res = await Travelling.Users.get(
        'created_on',
        1,
        null,
        `locked=false,created_on >= ${yesterday.toISOString()}, created_on <= ${tomorrow.toISOString()}`,
        'ASC',
        null,
        userContainer.user1Token
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
    });

    test('Get Users with filter created_on in date range and sort, limit, skip and sortdir', async () => {
      var yesterday = new Date();
      var tomorrow = new Date();

      yesterday.setDate(yesterday.getDate() - 1);
      tomorrow.setDate(tomorrow.getDate() + 1);

      var res = await Travelling.Users.get(
        'created_on',
        1,
        9,
        `created_on >= ${yesterday.toISOString()}, created_on <= ${tomorrow.toISOString()}`,
        'ASC',
        null,
        userContainer.user1Token
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
    });

    test('Get Users By GroupRequest', async () => {
      var res = await Travelling.Users.byGroupRequest('testgroup', userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body[0].username).toEqual('test');
    });

    test('Get Users By Default Domain', async () => {
      var res = await Travelling.Users.Domain.get(
        'default',
        null,
        null,
        null,
        null,
        null,
        null,
        userContainer.userDomainToken
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(4);

      // Make sure we dont have any hashes
      expect(res.body[0]).not.toHaveProperty('__email');
      expect(res.body[0]).not.toHaveProperty('__user_data');
    });

    test('Get Users By Domain', async () => {
      var res = await Travelling.Users.Domain.get(
        'test.com',
        null,
        null,
        null,
        null,
        null,
        null,
        userContainer.userDomainToken
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(3);
      expect(res.body[0].domain).toEqual('test.com');
    });

    test('Get Users By Domain with sort', async () => {
      var res = await Travelling.Users.Domain.get(
        'test.com',
        'created_on',
        null,
        null,
        null,
        null,
        null,
        userContainer.userDomainToken
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(3);
      expect(res.body[0].domain).toEqual('test.com');
    });

    test('Get Users By Domain with limit', async () => {
      var res = await Travelling.Users.Domain.get(
        'test.com',
        null,
        1,
        null,
        null,
        null,
        null,
        userContainer.userDomainToken
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].domain).toEqual('test.com');
    });

    test('Get Users By Domain with skip', async () => {
      var res = await Travelling.Users.Domain.get(
        'test.com',
        null,
        null,
        1,
        null,
        null,
        null,
        userContainer.userDomainToken
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(2);
    });

    test('Get Users By Domain with sortdir', async () => {
      var res = await Travelling.Users.Domain.get(
        'test.com',
        null,
        null,
        null,
        null,
        'ASC',
        null,
        userContainer.userDomainToken
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(3);
      expect(res.body[0].domain).toEqual('test.com');
    });

    test('Get Users By Domain with filter locked [false]', async () => {
      var res = await Travelling.Users.Domain.get(
        'test.com',
        null,
        null,
        null,
        'locked=false',
        null,
        null,
        userContainer.userDomainToken
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(3);
      expect(res.body[0].domain).toEqual('test.com');
    });

    test('Get Users By Domain with filter created_on in date range', async () => {
      var yesterday = new Date();
      var tomorrow = new Date();

      yesterday.setDate(yesterday.getDate() - 1);
      tomorrow.setDate(tomorrow.getDate() + 1);

      var res = await Travelling.Users.Domain.get(
        'test.com',
        null,
        null,
        null,
        `created_on >= ${yesterday.toISOString()}, created_on <= ${tomorrow.toISOString()}`,
        null,
        null,
        userContainer.userDomainToken
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(3);
      expect(res.body[0].domain).toEqual('test.com');
    });

    test('Get Users By Domain with filter created_on out of date range', async () => {
      var oneWeekAgo = new Date();
      var twoWeeksAgo = new Date();

      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      var res = await Travelling.Users.Domain.get(
        'test.com',
        null,
        null,
        null,
        `created_on>=${twoWeeksAgo.toISOString()},created_on<=${oneWeekAgo.toISOString()}`,
        null,
        null,
        userContainer.userDomainToken
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(0);
    });

    test('Get Users By Domain with filter created_on in date range with locked [false]', async () => {
      var yesterday = new Date();
      var tomorrow = new Date();

      yesterday.setDate(yesterday.getDate() - 1);
      tomorrow.setDate(tomorrow.getDate() + 1);

      var res = await Travelling.Users.Domain.get(
        'test.com',
        null,
        null,
        null,
        `locked=false,created_on >= ${yesterday.toISOString()}, created_on <= ${tomorrow.toISOString()}`,
        null,
        null,
        userContainer.userDomainToken
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(3);
      expect(res.body[0].domain).toEqual('test.com');
    });

    test('Get Users By Domain with sort and limit', async () => {
      var res = await Travelling.Users.Domain.get(
        'test.com',
        'created_on',
        1,
        null,
        null,
        null,
        null,
        userContainer.userDomainToken
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].domain).toEqual('test.com');
    });

    test('Get Users By Domain with sort, limit, and sortdir', async () => {
      var res = await Travelling.Users.Domain.get(
        'test.com',
        'created_on',
        1,
        null,
        null,
        'ASC',
        null,
        userContainer.userDomainToken
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].domain).toEqual('test.com');
    });

    test('Get Users By Domain with sort, limit, filter and sortdir', async () => {
      var res = await Travelling.Users.Domain.get(
        'test.com',
        'created_on',
        1,
        null,
        'locked=false',
        'ASC',
        null,
        userContainer.userDomainToken
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].domain).toEqual('test.com');
    });

    test('Get Users By Domain with filter created_on in date range with locked [false] and sort, limit, and sortdir', async () => {
      var yesterday = new Date();
      var tomorrow = new Date();

      yesterday.setDate(yesterday.getDate() - 1);
      tomorrow.setDate(tomorrow.getDate() + 1);

      var res = await Travelling.Users.Domain.get(
        'test.com',
        'created_on',
        1,
        null,
        `locked=false,created_on >= ${yesterday.toISOString()}, created_on <= ${tomorrow.toISOString()}`,
        'ASC',
        null,
        userContainer.userDomainToken
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].domain).toEqual('test.com');
    });

    test('Get Users By Domain with filter created_on in date range and sort, limit, skip and sortdir', async () => {
      var yesterday = new Date();
      var tomorrow = new Date();

      yesterday.setDate(yesterday.getDate() - 1);
      tomorrow.setDate(tomorrow.getDate() + 1);

      var res = await Travelling.Users.Domain.get(
        'test.com',
        'created_on',
        1,
        1,
        `locked=false,created_on >= ${yesterday.toISOString()}, created_on <= ${tomorrow.toISOString()}`,
        'ASC',
        null,
        userContainer.userDomainToken
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
    });

    test('Get Users Count', async () => {
      var res = await Travelling.Users.count(null, null, null, null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body.count).toEqual(10);
    });

    test('Get Users Count with limit', async () => {
      var res = await Travelling.Users.count(2, null, null, null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body.count).toEqual(2);
    });

    test('Get Users Count with skip', async () => {
      var res = await Travelling.Users.count(null, 3, null, null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body.count).toEqual(7);
    });

    test('Get Users Count with limit and skip', async () => {
      var res = await Travelling.Users.count(2, 7, null, null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body.count).toEqual(2);
    });

    test('Get Users Count with filter created_on in date range', async () => {
      var yesterday = new Date();
      var tomorrow = new Date();

      yesterday.setDate(yesterday.getDate() - 1);
      tomorrow.setDate(tomorrow.getDate() + 1);

      var res = await Travelling.Users.count(
        null,
        null,
        `created_on >= ${yesterday.toISOString()}, created_on <= ${tomorrow.toISOString()}`,
        null,
        userContainer.user1Token
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body.count).toEqual(10);
    });

    test('Get Users Count by Domain', async () => {
      var res = await Travelling.Users.Domain.count('test.com', null, null, null, null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body.count).toEqual(3);
    });

    test('Get Users Count by Domain with limit', async () => {
      var res = await Travelling.Users.Domain.count('test.com', 1, null, null, null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body.count).toEqual(1);
    });

    test('Get Users Count by Domain with skip', async () => {
      var res = await Travelling.Users.Domain.count('test.com', null, 1, null, null, userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body.count).toEqual(2);
    });

    test('Get Users Count by Domain filter created_on in date range', async () => {
      var yesterday = new Date();
      var tomorrow = new Date();

      yesterday.setDate(yesterday.getDate() - 1);
      tomorrow.setDate(tomorrow.getDate() + 1);

      var res = await Travelling.Users.Domain.count(
        'test.com',
        null,
        null,
        `created_on >= ${yesterday.toISOString()}, created_on <= ${tomorrow.toISOString()}`,
        null,
        userContainer.user1Token
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body.count).toEqual(3);
    });

    test('Users by group ID', async () => {
      var groupRes = await Travelling.Group.get('superadmin', userContainer.user1Token);

      superadminGroup = groupRes.body;

      var res = await Travelling.Group.Users.get(superadminGroup.id, '', '', '', '', '', userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(10);

      // Make sure we dont have any hashes
      expect(res.body[0]).not.toHaveProperty('__email');
      expect(res.body[0]).not.toHaveProperty('__user_data');
    });

    test('Users Count by group ID', async () => {
      var res = await Travelling.Group.Users.count(superadminGroup.id, '', '', '', userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body.count).toBe(10);
    });

    test('Users by group name', async () => {
      var res = await Travelling.Group.Users.get('superadmin', '', '', '', '', '', userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(10);
    });

    test('Users by group name - limit', async () => {
      var res = await Travelling.Group.Users.get('superadmin', '', 1, '', '', '', userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
    });

    test('Users by group name - skip', async () => {
      var res = await Travelling.Group.Users.get('superadmin', '', '', 100, '', '', userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(0);
    });

    test('Users by group name - date range filter', async () => {
      var yesterday = new Date();
      var tomorrow = new Date();

      yesterday.setDate(yesterday.getDate() - 1);
      tomorrow.setDate(tomorrow.getDate() + 1);

      var res = await Travelling.Group.Users.get(
        'superadmin',
        `created_on >= ${yesterday.toISOString()}, created_on <= ${tomorrow.toISOString()}`,
        '',
        '',
        '',
        '',
        userContainer.user1Token
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(10);
    });

    test('Users by group name - sort', async () => {
      var resDESC = await Travelling.Group.Users.get(
        'superadmin',
        '',
        '',
        '',
        'created_on',
        '',
        userContainer.user1Token
      );

      expect(resDESC.statusCode).toEqual(200);
      expect(resDESC.body).toHaveLength(10);

      let sortedDESC = true;

      let usersDESC = resDESC.body;

      for (let i = 1; i < usersDESC.length; i++) {
        const user = usersDESC[i];
        const userDate = new Date(user.created_on);

        const prevUser = usersDESC[i - 1];
        let prevUserDate = new Date(prevUser.created_on);

        if (prevUserDate.getTime() < userDate.getTime()) {
          sortedDESC = false;
        }
      }

      expect(sortedDESC).toBe(true);

      var resASC = await Travelling.Group.Users.get(
        'superadmin',
        '',
        '',
        '',
        'created_on',
        'ASC',
        userContainer.user1Token
      );

      expect(resASC.statusCode).toEqual(200);
      expect(resASC.body).toHaveLength(10);

      let sortedASC = true;

      let usersASC = resASC.body;

      for (let i = 1; i < usersASC.length; i++) {
        const user = usersASC[i];
        const userDate = new Date(user.created_on);

        const prevUser = usersASC[i - 1];
        let prevUserDate = new Date(prevUser.created_on);

        if (prevUserDate.getTime() > userDate.getTime()) {
          sortedASC = false;
        }
      }

      expect(sortedASC).toBe(true);
    });

    test('Users Count by group name', async () => {
      var res = await Travelling.Group.Users.count('superadmin', '', '', '', userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body.count).toBe(10);
    });

    test('Users by group type and ID', async () => {
      var res = await Travelling.Group.Type.Users.get(
        superadminGroup.id,
        superadminGroup.type,
        '',
        '',
        '',
        '',
        '',
        userContainer.user1Token
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(10);
    });

    test('Users count by group type and ID', async () => {
      var res = await Travelling.Group.Type.Users.count(
        superadminGroup.id,
        superadminGroup.type,
        '',
        '',
        '',
        userContainer.user1Token
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body.count).toBe(10);
    });

    test('Users by group type and Name', async () => {
      var res = await Travelling.Group.Type.Users.get(
        'superadmin',
        'group',
        '',
        '',
        '',
        '',
        '',
        userContainer.user1Token
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(10);
    });

    test('Users count by group type and Name', async () => {
      var res = await Travelling.Group.Type.Users.count('superadmin', 'group', '', '', '', userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body.count).toBe(10);
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
      var res = await Travelling.Users.get(
        null,
        null,
        null,
        'created_on < figment-of-ones-imagination',
        null,
        null,
        userContainer.user1Token
      );

      expect(res.statusCode).toEqual(400);
    });

    test('Get Users By Domain with filter created_on with invalid date', async () => {
      var res = await Travelling.Users.Domain.get(
        'test.com',
        null,
        null,
        null,
        'created_on < veryinvalid',
        null,
        null,
        userContainer.userDomainToken
      );

      expect(res.statusCode).toEqual(400);
    });

    test('Get Users By Domain with filter created_on with invalid domain', async () => {
      var yesterday = new Date();

      yesterday.setDate(yesterday.getDate() - 1);

      var res = await Travelling.Users.Domain.get(
        'swagger.69',
        null,
        null,
        null,
        `created_on >= ${yesterday.toISOString()}`,
        null,
        null,
        userContainer.userDomainToken
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(0);
    });
  });
};
