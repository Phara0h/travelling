const config = require('../../include/utils/config');
const Travelling = require('../../sdk')('https://127.0.0.1:6969');
var userContainer = require('../include/UserContainer.js');

module.exports = () => {

      describe('Vaild', () => {
        var token1, token2;

        test("Add New OAuth2 Credentials Token as Test User With No Name", async () => {
          var res = await Travelling.User.Current.registerToken({}, null, {
              headers: {
                  cookie: userContainer.user1Cookie(),
              },
          });
          token1 = res.body;
          expect(res.body).toMatchObject({
              client_id: expect.any(String),
              client_secret: expect.any(String)
            })
        });

        test("Register New OAuth2 Credentials Token as Test User With Name", async () => {
          var res = await Travelling.User.Current.registerToken({name: 'MyServiceName'}, null, {
              headers: {
                  cookie: userContainer.user1Cookie(),
              },
          });
          token2 = res.body;
          expect(res.body).toMatchObject({
              client_id: 'MyServiceName',
              client_secret: expect.any(String)
            })
        });


        test("Get New OAuth2 Access Token as Test User With No Name", async () => {
          console.log(token1)
          var res = await Travelling.Auth.accessToken('client_credentials',token1.client_id, token1.client_secret);

          expect(res.body).toMatchObject({
              expires_in: config.token.access.expiration*60, // seconds
              access_token: expect.any(String),
              token_type:"bearer"
            })
        });

        test("GetNew OAuth2 Token as Test User With Name", async () => {
          var res = await Travelling.Auth.accessToken('client_credentials',token2.client_id, token2.client_secret);

          expect(res.body).toMatchObject({
              expires_in: config.token.access.expiration*60, // seconds
              access_token: expect.any(String),
              token_type:"bearer"
            })
        });

      });

      describe('Invaild', () => {

      })

};
