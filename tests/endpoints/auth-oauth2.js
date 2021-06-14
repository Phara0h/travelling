const config = require('../../include/utils/config');

const { Travelling } = require('../../sdk/node')('http://127.0.0.1:6969/' + config.serviceName, {
  resolveWithFullResponse: true
});
var userContainer = require('../include/UserContainer.js');

module.exports = () => {
  var token1;
  var token2;
  var tokenDomain;
  var tokenDomain2;
  var tokenDomain3;
  var tokenDomain4;
  var accessToken1;
  var accessToken2;
  var accessTokenDomain;
  var accessTokenDomain2;
  var accessTokenDomain3;
  var accessTokenDomain4;

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

    test('Register New OAuth2 Credentials Token as Test Domain User With No Name', async () => {
      var res = await Travelling.User.Current.registerToken({ urls: ['http://localhost:6969'] }, null, {
        headers: {
          cookie: userContainer.userDomainCookie()
        }
      });

      tokenDomain = res.body;

      expect(res.body).toMatchObject({
        client_id:  expect.any(String),
        client_secret: expect.any(String)
      });
    });

    test('Register New OAuth2 Credentials Token as Test Domain User 2 With No Name', async () => {
      var res = await Travelling.User.Current.registerToken({ urls: ['http://localhost:6969'] }, null, {
        headers: {
          cookie: userContainer.userDomain2Cookie()
        }
      });

      tokenDomain2 = res.body;

      expect(res.body).toMatchObject({
        client_id:  expect.any(String),
        client_secret: expect.any(String)
      });
    });

    test('Register New OAuth2 Credentials Token as Test Domain User 3 With No Name', async () => {
      var res = await Travelling.User.Current.registerToken({ urls: ['http://localhost:6969'] }, null, {
        headers: {
          cookie: userContainer.userDomain3Cookie()
        }
      });

      tokenDomain3 = res.body;

      expect(res.body).toMatchObject({
        client_id:  expect.any(String),
        client_secret: expect.any(String)
      });
    });

    test('Register New OAuth2 Credentials Token as Test Domain User 4 With No Name', async () => {
      var res = await Travelling.User.Current.registerToken({ urls: ['http://localhost:6969'] }, null, {
        headers: {
          cookie: userContainer.userDomain4Cookie()
        }
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toEqual("Access Denied");
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

    test('Get New OAuth2 Access Token as Test Domain User With No Name', async () => {
      var res = await Travelling.Auth.accessToken('client_credentials', tokenDomain.client_id, tokenDomain.client_secret, null);

      accessTokenDomain = res.body.access_token;
      userContainer.userDomainToken = res.body.access_token;

      expect(res.body).toMatchObject({
        expires_in: config.token.access.expiration * 60, // seconds
        access_token: expect.any(String),
        token_type: 'bearer'
      });
    });

    test('Get New OAuth2 Access Token as Test Domain User 2 With No Name', async () => {
      var res = await Travelling.Auth.accessToken('client_credentials', tokenDomain2.client_id, tokenDomain2.client_secret, null);

      accessTokenDomain2 = res.body.access_token;
      userContainer.userDomain2Token = res.body.access_token;

      expect(res.body).toMatchObject({
        expires_in: config.token.access.expiration * 60, // seconds
        access_token: expect.any(String),
        token_type: 'bearer'
      });
    });

    test('Get New OAuth2 Access Token as Test Domain User 3 With No Name', async () => {
      var res = await Travelling.Auth.accessToken('client_credentials', tokenDomain3.client_id, tokenDomain3.client_secret, null);

      accessTokenDomain3 = res.body.access_token;
      userContainer.userDomain3Token = res.body.access_token;

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

    test('Get User With Token as Test Domain User With No Name', async () => {
      var res = await Travelling.User.Current.get(accessTokenDomain);

      expect(res.body.email).toEqual('test_domain_1@test.com');
    });

    test('Get User With Token as Test Domain User 2 With No Name', async () => {
      var res = await Travelling.User.Current.get(accessTokenDomain2);

      expect(res.body.email).toEqual('test_domain_2@test.com');
    });

    test('Get User With Token as Test Domain User 3 With No Name', async () => {
      var res = await Travelling.User.Current.get(accessTokenDomain3);

      expect(res.body.email).toEqual('test_domain_3@test.com');
    });

    test('Get User With Token as Test Domain User 4 With No Name', async () => {
      var res = await Travelling.User.Current.get(accessTokenDomain4);

      expect(res.statusCode).toEqual(401);
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
