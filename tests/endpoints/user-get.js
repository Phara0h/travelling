const config = require('../../include/utils/config');

const { Travelling } = require('../../sdk/node')('http://127.0.0.1:6969/' + config.serviceName, {
  resolveWithFullResponse: true
});
var userContainer = require('../include/UserContainer.js');

module.exports = () => {
  describe('Current User', () => {
    describe('Valid', () => {
      test('Get User Test', async () => {
        var res = await Travelling.User.Current.get(null, {
          headers: {
            cookie: userContainer.user1Cookie()
          }
        });

        userContainer.user1 = Object.assign(res.body, userContainer.user1);
        expect(res.body).toMatchObject({ username: 'test' });
      });

      test('Get User Test2', async () => {
        var res = await Travelling.User.Current.get(null, {
          headers: {
            cookie: userContainer.user2Cookie()
          }
        });

        userContainer.user2 = Object.assign(res.body, userContainer.user2);

        expect(res.body).toMatchObject({ username: 'test2' });
      });

      test("Get Test's Email", async () => {
        var res = await Travelling.User.Current.getProperty('email', null, {
          headers: {
            cookie: userContainer.user1Cookie()
          }
        });

        expect(res.body).toEqual(userContainer.user1.email);
      });

      // test("Get Test's Password", async () => {
      //   var res = await Travelling.User.Current.getProperty('password', null, {
      //       headers: {
      //           cookie: userContainer.user1Cookie(),
      //       },
      //   });
      //
      //   expect(res.body).toEqual(userContainer.user1.password);
      // });

      test("Check Test's Permission", async () => {
        var res = await Travelling.User.Current.permissionCheck('get-' + config.serviceName, null, {
          headers: {
            cookie: userContainer.user1Cookie()
          }
        });

        expect(res.statusCode).toEqual(200);
      });

      test("Check Test's Route", async () => {
        var res = await Travelling.User.Current.routeCheck(
          'get',
          '/' + config.serviceName + '/api/v1/user/me',
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
      });

      test('Check Test Domain Route - Using User Domain', async () => {
        // User 1 has domain 'dragohmventures.com'
        // Route /test/domain requires domain 'dragohmventures.com'

        // Check by passing in header
        var withHeaderDomain = await Travelling.User.Current.routeCheck(
          'get',
          '/' + config.serviceName + '/api/v1/test/domain',
          userContainer.user1Token
        );

        expect(withHeaderDomain.statusCode).toEqual(200);
        expect(withHeaderDomain.body).toEqual(true);
      });

      test('Check Test Domain Route - Using Request Header Domain', async () => {
        // Check without passing in header
        var noHeaderDomain = await Travelling.User.Current.routeCheck(
          'get',
          '/' + config.serviceName + '/api/v1/test/domain/two',
          userContainer.user1Token
        );

        expect(noHeaderDomain.statusCode).toEqual(401);
        expect(noHeaderDomain.body).toEqual(true);

        // Check by passing in header
        var withHeaderDomain = await Travelling.User.Current.routeCheck(
          'get',
          '/' + config.serviceName + '/api/v1/test/domain/two',
          userContainer.user1Token,
          {
            headers: { 'my-domain': 'dragohmventures-two.com' }
          }
        );

        expect(withHeaderDomain.statusCode).toEqual(200);
        expect(withHeaderDomain.body).toEqual(true);
      });

      test('Check Test Domain Route - Route With Wildcard * Domain', async () => {
        // Check by passing in header
        var withHeaderDomain = await Travelling.User.Current.routeCheck(
          'get',
          '/' + config.serviceName + '/api/v1/test/domain/wildcard',
          userContainer.user1Token
        );

        expect(withHeaderDomain.statusCode).toEqual(200);
        expect(withHeaderDomain.body).toEqual(true);
      });

      test('Check Test Domain Route - No Match - Using Cloudflare Header Domain', async () => {
        // Check by passing in non-existent header
        var res = await Travelling.User.Current.routeCheck(
          'get',
          '/' + config.serviceName + '/api/v1/test/domain',
          userContainer.user1Token,
          {
            headers: { ['CF-Worker']: 'notamatchduuude.com' }
          }
        );

        expect(res.statusCode).toEqual(401);
        expect(res.body).toEqual(false);
      });

      test("Check Anonymous's Permission", async () => {
        var res = await Travelling.User.Current.permissionCheck('delete-travelling-api-v1-user-me');

        expect(res.statusCode).toEqual(401);
      });

      test("Check Anonymous's Route", async () => {
        var res = await Travelling.User.Current.routeCheck('delete', '/' + config.serviceName + '/api/v1/user/me');

        expect(res.statusCode).toEqual(401);
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
  });

  describe('Non-Current User', () => {
    describe('Valid', () => {
      test('Get By Id', async () => {
        var res = await Travelling.User.get(userContainer.user1.id, null, {
          headers: {
            cookie: userContainer.user1Cookie()
          }
        });

        expect(res.body).toMatchObject({ username: 'test' });
      });

      test('Get By Username', async () => {
        var res = await Travelling.User.get(userContainer.user1.username, null, {
          headers: {
            cookie: userContainer.user1Cookie()
          }
        });

        expect(res.body).toMatchObject({ username: 'test' });
      });

      test("Get Test2's Email By Id ", async () => {
        var res = await Travelling.User.getProperty(userContainer.user2.id, 'email', null, {
          headers: {
            cookie: userContainer.user2Cookie()
          }
        });

        expect(res.body).toEqual(userContainer.user2.email);
      });

      test("Get Test2's Email By Username ", async () => {
        var res = await Travelling.User.getProperty(userContainer.user2.username, 'email', null, {
          headers: {
            cookie: userContainer.user2Cookie()
          }
        });

        expect(res.body).toEqual(userContainer.user2.email);
      });

      test("Get Test2's Email By Username By Grouptype ", async () => {
        var res = await Travelling.Group.Type.User.getProperty('group', userContainer.user2.username, 'email', null, {
          headers: {
            cookie: userContainer.user2Cookie()
          }
        });

        expect(res.body).toEqual(userContainer.user2.email);
      });
    });

    describe('Invalid', () => {
      test('Get By Invalid Id', async () => {
        var res = await Travelling.User.get(0, null, {
          headers: {
            cookie: userContainer.user1Cookie()
          }
        });

        expect(res.statusCode).toEqual(400);
      });

      test('Get By No Id', async () => {
        var res = await Travelling.User.get('', null, {
          headers: {
            cookie: userContainer.user1Cookie()
          }
        });

        expect(res.statusCode).toEqual(400);
      });

      test('Get By Invalid Username', async () => {
        var res = await Travelling.User.get('coolusername', null, {
          headers: {
            cookie: userContainer.user1Cookie()
          }
        });

        expect(res.statusCode).toEqual(400);
      });

      test('Get By No Username', async () => {
        var res = await Travelling.User.get('', null, {
          headers: {
            cookie: userContainer.user1Cookie()
          }
        });

        expect(res.statusCode).toEqual(400);
      });

      test("Get Test2's Email By Username By Invaild Grouptype ", async () => {
        var res = await Travelling.Group.Type.User.getProperty(
          'testgroup',
          userContainer.user2.username,
          'email',
          null,
          {
            headers: {
              cookie: userContainer.user2Cookie()
            }
          }
        );

        expect(res.statusCode).toEqual(400);
        expect(res.body).not.toEqual(userContainer.user2.email);
      });
    });
  });

  describe('Non-Current User With Domain', () => {
    describe('Valid', () => {
      test('Get User Domain 2', async () => {
        var res = await Travelling.User.Domain.get(
          'test.com',
          'test_domain_2@test.com',
          userContainer.userDomain2Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body.domain).toEqual('test.com');
        expect(res.body.email).toEqual('test_domain_2@test.com');
      });

      test('Get Property User Domain 2', async () => {
        var res = await Travelling.User.Domain.getProperty(
          'test.com',
          'test_domain_2@test.com',
          'domain',
          userContainer.userDomain2Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual('test.com');
      });
    });

    describe('Invalid', () => {
      test('Get User Domain 2 non-existent domain', async () => {
        var res = await Travelling.User.Domain.get(
          'this-aint-no-real-domain.elite',
          'test_domain_2@test.com',
          userContainer.userDomain2Token
        );

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('type', 'user-find-by-error');
      });

      test('Get User Domain 2 invalid id', async () => {
        var res = await Travelling.User.Domain.get(
          'test.com',
          'real-incorrect-id@45.wrong',
          userContainer.userDomain2Token
        );

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('type', 'user-find-by-error');
      });

      test('Get User Domain 2 invalid property', async () => {
        var res = await Travelling.User.Domain.getProperty(
          'test.com',
          'test_domain_2@test.com',
          'asdfasdfasdf',
          userContainer.userDomain2Token
        );

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('type', 'user-prop-error');
      });
    });
  });
};
