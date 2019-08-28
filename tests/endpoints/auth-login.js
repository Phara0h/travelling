const config = require('../../include/utils/config');
const Travelling = require('../include/Travelling')('https://127.0.0.1:6969');
var userContainer = require('../include/UserContainer.js');

module.exports = () => {
  describe('Vaild', () => {

      test('Login With Test User', async () => {
          var res = await Travelling.Auth.login({
              username: 'test',
              password: 'Pas5w0r!d',
          });
          expect(res.statusCode).toEqual(200);
      });

      test('Login with Test2 User', async () => {
          var res = await Travelling.Auth.login({
              password: 'Pas5w0r!d2',
              email: 'test2@test.com',
          });
          expect(res.statusCode).toEqual(200);
      });
  });

  describe('Invaild', () => {

  });

};
