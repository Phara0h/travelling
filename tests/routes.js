const config = require('../include/utils/config');
const { Travelling } = require('../sdk/node')('http://127.0.0.1:6969/' + config.serviceName, {
  resolveWithFullResponse: true
});
var userContainer = require('./include/UserContainer.js');
const fasq = require('fasquest');

module.exports = () => {
  describe('Valid', () => {
    var accessToken;
    var user;

    beforeAll(async () => {
      await Travelling.Auth.register({
        username: 'routes',
        password: 'Pas5w0r!d3',
        email: 'routes@test.com'
      });

      let userRes = userContainer.parseCookie(
        (
          await Travelling.Auth.login({
            username: 'routes',
            password: 'Pas5w0r!d3'
          })
        ).headers['set-cookie'],
        {}
      );

      var token = (
        await Travelling.User.Current.registerToken({ urls: ['http://127.0.0.1:6969'] }, null, {
          headers: {
            cookie: userContainer.getCookie(userRes)
          }
        })
      ).body;

      accessToken = (await Travelling.Auth.accessToken('client_credentials', token.client_id, token.client_secret)).body
        .access_token;
      user = (await Travelling.User.Current.get(accessToken)).body;
    });

    test('[GET] with Username and Group 1 in Path Params HTTPS', async () => {
      await Travelling.Group.addRoute(
        {
          route: '/test/get',
          host: 'https://127.0.0.1:4268/:username/:group',
          remove_from_path: '/test/get',
          method: 'get'
        },
        'group2',
        accessToken
      );

      var res = await fasq.request({
        method: 'GET',
        resolveWithFullResponse: true,
        simple: false,
        uri: 'http://127.0.0.1:6969/test/get',
        authorization: {
          bearer: accessToken
        }
      });

      //console.log(res.body)
      //var res = await Travelling.Group.edit({inherited:[group4.id]}, 'group1', userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body.params).toEqual({ param1: 'routes', param2: 'group5' });
    });

    test('[GET] redirect route - to health check with unauthenticated user', async () => {
      const originalVal = config.misc.deniedRedirect;

      // Set deniedRedirect to false for this test
      config.misc.deniedRedirect = false;

      await Travelling.Group.addRoute(
        {
          method: '*',
          route: '/test-domain-redirect',
          name: 'test-domain-redirect',
          domain: '*',
          redirect: 'http://example.com'
        },
        'group6',
        accessToken
      );

      var res = await fasq.request({
        method: 'GET',
        resolveWithFullResponse: true,
        simple: false,
        uri: 'http://127.0.0.1:6969/test-domain-redirect',
        authorization: {
          bearer: ''
        }
      });

      config.misc.deniedRedirect = originalVal;

      expect(res.body).not.toBe('Access Denied');
      expect(res.body.includes('html')).toBe(true);
      expect(res.statusCode).toEqual(200);
    });

    test('[GET] access denied on route with no redirect', async () => {
      await Travelling.Group.addRoute(
        {
          method: '*',
          route: '/test-domain-nada',
          name: 'test-domain-nada',
          domain: '*'
        },
        'group6',
        accessToken
      );

      var res = await fasq.request({
        method: 'GET',
        resolveWithFullResponse: true,
        simple: false,
        uri: 'http://127.0.0.1:6969/test-domain-nada',
        authorization: {
          bearer: userContainer.user1Token // User1 shouldnt have group 6
        }
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toBe('Access Denied');
    });

    test('[POST] with ID and Permission in Query Params HTTP', async () => {
      await Travelling.Group.addRoute(
        {
          route: '/test/post',
          host: 'http://127.0.0.1:4267/?id=:id&permission=:permission',
          remove_from_path: '/test/post',
          method: 'post'
        },
        'group2',
        accessToken
      );

      var res = await fasq.request({
        method: 'POST',
        resolveWithFullResponse: true,
        simple: false,
        uri: 'http://127.0.0.1:6969/test/post',
        json: true,
        body: { test: 'swag' },
        authorization: {
          bearer: accessToken
        }
      });

      //var res = await Travelling.Group.edit({inherited:[group4.id]}, 'group1', userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body.query).toEqual({ id: user.id, permission: 'post-test-post' });
    });

    test('[DELETE] with Grouptype in Route Dynamic Permissions HTTPS', async () => {
      await Travelling.Group.addRoute(
        {
          route: '/test/delete/:grouptype',
          host: 'https://127.0.0.1:4268',
          remove_from_path: '/test/delete',
          method: 'delete'
        },
        'group5',
        accessToken
      );

      var res = await fasq.request({
        method: 'DELETE',
        resolveWithFullResponse: true,
        simple: false,
        uri: 'http://127.0.0.1:6969/test/delete/' + user.groups[0].type,
        authorization: {
          bearer: accessToken
        }
      });

      //var res = await Travelling.Group.edit({inherited:[group4.id]}, 'group1', userContainer.user1Token);

      expect(res.statusCode).toEqual(200);
      expect(res.body.params).toEqual({ param1: user.groups[0].type });
    });
  });
};
