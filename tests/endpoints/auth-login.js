const config = require('../../include/utils/config');

const { Travelling } = require('../../sdk')('http://127.0.0.1:6969/' + config.serviceName, {
  resolveWithFullResponse: true
});
var userContainer = require('../include/UserContainer.js');
var testContainer = require('../include/TestContainer.js');
const fasq = require('fasquest');

module.exports = () => {
  describe('Valid', () => {
    test('Login with Test User', async () => {
      var res = await Travelling.Auth.login({
        username: 'test',
        password: 'Pas5w0r!d'
      });

      userContainer.parseUser1Cookie(res.headers['set-cookie']);

      expect(res.statusCode).toEqual(200);
    });

    test('Login with Test2 User', async () => {
      var res = await Travelling.Auth.login({
        password: 'Pas5w0r!d2',
        email: 'test2@test.com'
      });

      userContainer.parseUser2Cookie(res.headers['set-cookie']);
      expect(res.statusCode).toEqual(200);
    });

    test('Login with Test2 User Again', async () => {
      var res = await Travelling.Auth.login(
        {
          password: 'Pas5w0r!d2',
          email: 'test2@test.com'
        },
        {
          headers: {
            cookie: userContainer.user2Cookie()
          }
        }
      );

      expect(res.body.type).toEqual('login-session-error');
    });

    test('Login with Test3 User [Locked]', async () => {
      var res = await Travelling.Auth.login({
        password: 'Pas5w0r!d3',
        email: 'test3@test.com'
      });

      expect(res.body.type).toEqual('locked');
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
