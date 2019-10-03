const config = require('../include/utils/config');
const Travelling = require('../sdk')('https://127.0.0.1:6969');
var userContainer = require('./include/UserContainer.js');
const fasq = require('fasquest');

module.exports = () => {
    describe('Vaild', () => {
        var token;
        var accessToken;



        // test('Login with Test3 User [Locked]', async () => {
        //     var res = await Travelling.Auth.login({
        //         password: 'Pas5w0r!d3',
        //         email: 'test3@test.com',
        //     });
        //
        //     expect(res.body.type).toEqual('locked');
        // });





        test('Test Get With Username and Group 1 in Path Params', async () => {
          await Travelling.Auth.register({
              username: 'routes',
              password: 'Pas5w0r!d3',
              email: 'routes@test.com',
          });

          var user = userContainer.parseCookie((await Travelling.Auth.login({
              username: 'routes',
              password: 'Pas5w0r!d3',
          })).headers['set-cookie'], {});

          console.log((await Travelling.Group.get('group5', userContainer.user1Token)).body);

          token = (await Travelling.User.Current.registerToken({ urls: ['http://127.0.0.1:6969']}, null, {
              headers: {
                  cookie: userContainer.getCookie(user),
              },
          })).body;
        console.log((await Travelling.Groups.get(accessToken)).body)
          accessToken = (await Travelling.Auth.accessToken('client_credentials', null, token.client_id, token.client_secret)).body.access_token;

          var sdf = await Travelling.Group.addRoute({
                          route: "/test/get",
                          host: "https://127.0.0.1:4268/:username/:group",
                          removeFromPath: '/test/get',
                          method: "get"
                        }, 'group2',accessToken);
          console.log(sdf.statusCode, sdf.body, userContainer.getCookie(user), token, accessToken)
          var res = await fasq.request({
           method: 'GET',
           resolveWithFullResponse: true,
           simple: false,
           uri: 'https://127.0.0.1:6969/test/get',
           authorization: {
               bearer: accessToken
           }
          });

          //console.log(res.body)
          //var res = await Travelling.Group.edit({inherited:[group4.id]}, 'group1', userContainer.user1Token);

          expect(res.statusCode).toEqual(200);
        });

    });

};
