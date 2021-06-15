const config = require('../../include/utils/config');

const { Travelling } = require('../../sdk/node')('http://127.0.0.1:6969/' + config.serviceName, {
  resolveWithFullResponse: true
});
var userContainer = require('../include/UserContainer.js');

module.exports = () => {
  describe('Valid', () => {
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

    test('Login with Test2 User Again After Session Expires 4 Seconds', async () => {
      jest.setTimeout(20000);

      var p = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 4900);
      });

      await p;

      var ssid = userContainer.user2.ssid;
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

      userContainer.parseUser2Cookie(res.headers['set-cookie']);

      expect(res.statusCode).toBe(200);
      expect(ssid).not.toEqual(userContainer.user2.ssid);
    });

    test('Login remember [false] with Test Domain 4 User After Session Expires 4 Seconds', async () => {
      jest.setTimeout(20000);

      // Login
      var res = await Travelling.Auth.login(
        {
          password: 'Pas5w0r!d',
          email: 'test_domain_4@test.com',
          remember: false
        },
        {
          headers: {
            cookie: userContainer.userDomain4Cookie()
          }
        }
      );

      userContainer.parseUserDomain4Cookie(res.headers['set-cookie']);
      expect(res.statusCode).toBe(200);      

      // Current User
      var userRes1 = await Travelling.User.Current.get(null,  {
        headers: {
          cookie: userContainer.userDomain4Cookie()
        }
      });
      expect(userRes1.statusCode).toEqual(200);


      // Wait for session to expire
      var p = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 4900);
      });

      await p;

      expect(userContainer.userDomain4.tok).toBeUndefined();
      expect(userContainer.userDomain4.ssid).toBeDefined();

      // Current User again
      var userRes2 = await Travelling.User.Current.get(null,  {
        headers: {
          cookie: userContainer.userDomain4Cookie()
        }
      });
      expect(userRes2.statusCode).toEqual(401);
    });

    test('Token and No Session', async () => {
      var ssid = userContainer.user2.ssid;

      userContainer.user2.ssid = null;

      var res = await Travelling.User.Current.get(null, {
        headers: {
          cookie: userContainer.user2Cookie()
        }
      });

      userContainer.parseUser2Cookie(res.headers['set-cookie']);

      expect(res.statusCode).toBe(200);
      expect(ssid).not.toEqual(userContainer.user2.ssid);
    });
  });

  describe('Invalid', () => {
    test('Token and No Session', async () => {
      var ssid = userContainer.user2.ssid;

      userContainer.user2.ssid = null;

      var tok = userContainer.user2.tok;

      userContainer.user2.tok = userContainer.user2.tok.slice(18);

      var res = await Travelling.User.Current.get(null, {
        headers: {
          cookie: userContainer.user2Cookie()
        }
      });

      userContainer.user2.tok = tok;
      userContainer.user2.ssid = ssid;
      expect(res.req.path).toEqual('/' + config.serviceName + '/api/v1/user/me');

      expect(res.headers['set-cookie']).toContainEqual(expect.stringContaining('trav:tok=null'));
    });

    test('Session with Token', async () => {
      var ssid = userContainer.user2.ssid;

      userContainer.user2.ssid = userContainer.user2.ssid.slice(18);

      var res = await Travelling.User.Current.get(null, {
        headers: {
          cookie: userContainer.user2Cookie()
        }
      });

      userContainer.parseUser2Cookie(res.headers['set-cookie']);

      expect(res.statusCode).toBe(200);
      expect(ssid).not.toEqual(userContainer.user2.ssid);
    });
  });
};
