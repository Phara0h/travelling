const cookie = require('cookie');
const config = require('../../include/utils/config');

const { Travelling } = require('../../sdk/node')('http://127.0.0.1:6969/' + config.serviceName, {
  resolveWithFullResponse: true
});
var userContainer = require('../include/UserContainer.js');
var testContainer = require('../include/TestContainer.js');
const fasq = require('fasquest');
const { hexToBase64 } = require('@opentelemetry/core');

module.exports = () => {
  describe('Valid', () => {
    test('Login with Test User', async () => {
      const start = new Date();

      var res = await Travelling.Auth.login({
        username: 'test',
        password: 'Pas5w0r!d'
      });

      userContainer.parseUser1Cookie(res.headers['set-cookie']);

      expect(res.statusCode).toEqual(200);

      // Make sure trav.ls token is correct
      if (config.cookie.token.checkable) {
        var ls = {};
        var tok = {};

        for (var i = 0; i < res.headers['set-cookie'].length; i++) {
          var pc = cookie.parse(res.headers['set-cookie'][i]);

          if (pc['trav:ls']) {
            ls = pc;
          } else if (pc['trav:tok']) {
            tok = pc;
          }
        }

        expect(ls['trav:ls']).toBe('1');
        expect(ls.Path).toBe('/');
        expect(ls.Expires).toEqual(tok.Expires);

        const cookieExpires = new Date(ls.Expires);
        expect(cookieExpires.getTime()).toBeGreaterThan(start.getTime());
      }
    });

    test('Login with Test2 User', async () => {
      var res = await Travelling.Auth.login({
        password: 'Pas5w0r!d2',
        email: 'test2@test.com'
      });

      userContainer.parseUser2Cookie(res.headers['set-cookie']);
      expect(res.statusCode).toEqual(200);

      expect(userContainer.user2).toHaveProperty('tok');
      expect(userContainer.user2).toHaveProperty('ssid');

      if (config.cookie.token.checkable) {
        expect(userContainer.user2).toHaveProperty('ls', '1');
      }
    });

    test('Login with Test2 User Again', async () => {
      var res = await Travelling.Auth.login(
        {
          password: 'Pas5w0r!d2',
          email: 'test2@test.com'
        },
        null,
        {
          headers: {
            cookie: userContainer.user2Cookie()
          }
        }
      );

      console.log(res);
      expect(res.body.msg).toEqual('Access Granted');
    });

    test('Login with Test3 User [Locked]', async () => {
      var res = await Travelling.Auth.login({
        password: 'Pas5w0r!d3',
        email: 'test3@test.com'
      });

      expect(res.body.type).toEqual('locked');
    });

    test('Login with Test Domain User', async () => {
      const start = new Date();

      var res = await Travelling.Auth.Domain.login(
        {
          password: 'Pas5w0r!d',
          email: 'test_domain_1@test.com'
        },
        'traziventures.com'
      );

      userContainer.parseUserDomainCookie(res.headers['set-cookie']);

      expect(res.statusCode).toEqual(200);

      // Make sure trav.ls token is correct
      if (config.cookie.token.checkable) {
        var ls = {};
        var tok = {};

        for (var i = 0; i < res.headers['set-cookie'].length; i++) {
          var pc = cookie.parse(res.headers['set-cookie'][i]);

          if (pc['trav:ls']) {
            ls = pc;
          } else if (pc['trav:tok']) {
            tok = pc;
          }
        }

        expect(ls['trav:ls']).toBe('1');
        expect(ls.Path).toBe('/');
        expect(ls.Expires).toEqual(tok.Expires);

        const cookieExpires = new Date(ls.Expires);
        expect(cookieExpires.getTime()).toBeGreaterThan(start.getTime());
      }
    });

    test('Login with Test Domain User 2', async () => {
      var res = await Travelling.Auth.Domain.login(
        {
          password: 'Pas5w0r!d',
          email: 'test_domain_2@test.com'
        },
        'traziventures.com'
      );

      userContainer.parseUserDomain2Cookie(res.headers['set-cookie']);

      expect(res.statusCode).toEqual(200);
    });

    test('Login with Test Domain User 3 [Gets deleted in user-edit]', async () => {
      var res = await Travelling.Auth.Domain.login(
        {
          password: 'Pas5w0r!d',
          email: 'test_domain_3@test.com'
        },
        'traziventures.com'
      );

      userContainer.parseUserDomain3Cookie(res.headers['set-cookie']);

      expect(res.statusCode).toEqual(200);
    });

    if (config.email.test.enable) {
      test('Login with Test4 User Email Activation Enable [Locked]', async () => {
        var res = await Travelling.Auth.login({
          password: 'Pas5w0r!d4',
          email: 'test4@test.com'
        });

        expect(res.body.type).toEqual('locked');

        var aeRes = await fasq.request({
          method: 'GET',
          resolveWithFullResponse: true,
          simple: false,
          uri: testContainer.activationEmail.url
        });

        var activationUrl = aeRes.body.match(/\bhttps?:\/\/\S+/gi);

        var activationRes = await fasq.request({
          method: 'GET',
          resolveWithFullResponse: true,
          simple: false,
          uri: activationUrl[1].replace(']', '').replace(/&#x3D;/g, '=')
        });

        expect(activationRes.statusCode).toEqual(200);

        var res2 = await Travelling.Auth.login({
          password: 'Pas5w0r!d4',
          email: 'test4@test.com'
        });

        expect(res2.statusCode).toEqual(200);
      });
    } else {
      test('Login with Test4 User Email Activation Disabled [Locked]', async () => {
        var res = await Travelling.Auth.login({
          password: 'Pas5w0r!d4',
          email: 'test4@test.com'
        });

        expect(res.body.type).toEqual('locked');
      });
    }

    test('Login with Domain User 5', async () => {
      var res = await Travelling.Auth.Domain.login(
        {
          password: 'Pas5w0r!d5',
          email: 'test_domain_5@test.com'
        },
        'traziventures.com'
      );

      userContainer.parseUser5Cookie(res.headers['set-cookie']);
      expect(res.statusCode).toEqual(200);
    });

    test('Login with Domain User 6', async () => {
      var res = await Travelling.Auth.Domain.login(
        {
          password: 'Pas5w0r!d6',
          email: 'test_domain_6@test.com'
        },
        'traziventures.com'
      );

      userContainer.parseUserDomain6Cookie(res.headers['set-cookie']);
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('Invalid', () => {
    test('No Body', async () => {
      var res = await Travelling.Auth.login({});

      expect(res.statusCode).toEqual(400);
    });

    test('Username', async () => {
      var res = await Travelling.Auth.login({
        username: 'test42',
        password: 'Pas5w0r!d'
      });

      expect(res.statusCode).toEqual(400);
    });

    test('Password', async () => {
      var res = await Travelling.Auth.login({
        username: 'test',
        password: 'Pas5w0r!dz'
      });

      expect(res.statusCode).toEqual(400);
    });

    test('Email', async () => {
      var res = await Travelling.Auth.login({
        email: 'testsdf@test.com',
        password: 'Pas5w0r!d'
      });

      expect(res.statusCode).toEqual(400);
    });
  });
};
