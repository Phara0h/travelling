const config = require('../../include/utils/config');

const { Travelling } = require('../../sdk/node')('http://127.0.0.1:6969/' + config.serviceName, {
  resolveWithFullResponse: true
});
var userContainer = require('../include/UserContainer.js');

module.exports = () => {
  var token1;
  var token2;
  var accessToken1;
  var accessToken2;

  describe('Valid', () => {
    test('Register OAuth2 Credentials Token as Test User With No Name', async () => {
      var res = await Travelling.User.Current.registerToken({ urls: ['http://localhost:6969'] }, null, {
        headers: {
          cookie: userContainer.user1Cookie()
        }
      });

      token1 = res.body;

      expect(res.body).toMatchObject({
        client_id: expect.any(String),
        client_secret: expect.any(String)
      });
    });

    test('Register New OAuth2 Credentials Token as Test 2 User With Name', async () => {
      var res = await Travelling.User.Current.registerToken({ name: 'MyServiceName', urls: ['http://localhost:6969'] }, null, {
        headers: {
          cookie: userContainer.user2Cookie()
        }
      });

      token2 = res.body;
      expect(res.body).toMatchObject({
        client_id: 'MyServiceName',
        client_secret: expect.any(String)
      });
    });

    test('Get New OAuth2 Access Token as Test User With No Name', async () => {
      var res = await Travelling.Auth.accessToken('client_credentials', token1.client_id, token1.client_secret, null);

      accessToken1 = res.body.access_token;
      userContainer.user1Token = res.body.access_token;

      expect(res.body).toMatchObject({
        expires_in: config.token.access.expiration * 60, // seconds
        access_token: expect.any(String),
        token_type: 'bearer'
      });
    });

    test('Get New OAuth2 Token as Test User With Name', async () => {
      var res = await Travelling.Auth.accessToken('client_credentials', token2.client_id, token2.client_secret, null);

      accessToken2 = res.body.access_token;
      userContainer.user2Token = res.body.access_token;
      expect(res.body).toMatchObject({
        expires_in: config.token.access.expiration * 60, // seconds
        access_token: expect.any(String),
        token_type: 'bearer'
      });
    });

    test('Get User With Token as Test User With No Name', async () => {
      var res = await Travelling.User.Current.get(accessToken1);

      expect(res.body.username).toEqual('test');
    });

    test('Get User With Token as Test User With Name', async () => {
      var res = await Travelling.User.Current.get(accessToken2);

      expect(res.body.username).toEqual('test2');
    });
  });

  describe('Invalid', () => {
    test('Register OAuth2 Credentials Token as Test User With Invalid Name', async () => {
      var res = await Travelling.User.Current.registerToken(
        { name: '(*&$#^%(@*#$&^%*Y)*&()*&)', urls: ['http://localhost:6969'] },
        null,
        {
          headers: {
            cookie: userContainer.user1Cookie()
          }
        }
      );

      token1 = res.body;
      expect(res.statusCode).toEqual(400);
    });

    test('Get User With Invalid Token as Test User With Name', async () => {
      var res = await Travelling.User.Current.get(accessToken2.slice(3) + 'aaa');

      expect(res.statusCode).toEqual(401);
    });

    test('Expired Access Token', async () => {
      var oldTokenExpiration = config.token.access.expiration;

      config.token.access.expiration = 0.05; // mins 3 seconds worth

      var res = await Travelling.Auth.accessToken('client_credentials', token2.client_id, token2.client_secret, null);
      var accessToken3 = res.body.access_token;

      expect(res.body).toMatchObject({
        expires_in: config.token.access.expiration * 60, // seconds
        access_token: expect.any(String),
        token_type: 'bearer'
      });

      jest.setTimeout(20000);

      var p = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 4900);
      });

      await p;

      var user = await Travelling.User.Current.get(accessToken3);

      expect(user.body.error).toEqual('invalid_client');

      config.token.access.expiration = oldTokenExpiration;
    });
  });
};
