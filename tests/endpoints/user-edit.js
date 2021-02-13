const config = require('../../include/utils/config');
const { Travelling } = require('../../sdk')('http://127.0.0.1:6969/' + config.serviceName, {
  resolveWithFullResponse: true
});

var userContainer = require('../include/UserContainer.js');

module.exports = () => {
  describe('Current User', () => {
    describe('Valid', () => {
      test('Edit Test User 1 Email Property ', async () => {
        var res = await Travelling.User.Current.editProperty('asdf@asdf.memes', 'email', userContainer.user1Token);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual('asdf@asdf.memes');
      });

      test('Edit Test User 1 Email Property Value ', async () => {
        var res = await Travelling.User.Current.editPropertyValue('email', 'test@test.com', userContainer.user1Token);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual('test@test.com');
      });

      test('Edit Test User 1 Email and UserData', async () => {
        var res = await Travelling.User.Current.edit(
          { email: 'testasdf2@fd.foo', user_data: { test: 1, foo: 'bar' } },
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({ email: 'testasdf2@fd.foo', user_data: { test: 1, foo: 'bar' } });
      });

      test('Delete Test User 1 Token "test123token" ', async () => {
        var res = await Travelling.User.Current.registerToken(
          { name: 'test123token', urls: ['http://127.0.0.1'] },
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);

        res = await Travelling.User.Current.deleteToken('test123token', userContainer.user1Token);

        expect(res.statusCode).toEqual(200);
      });
    });
  });

  describe('Non-Current User', () => {
    describe('Valid', () => {
      test('Edit Test User 2 Email Property ', async () => {
        var res = await Travelling.User.editProperty('asdf@asdf.memes', 'test2', 'email', userContainer.user1Token);

        expect(res.body).toEqual('asdf@asdf.memes');
        expect(res.statusCode).toEqual(200);
      });

      test('Edit Test User 2 Email Property Value ', async () => {
        var res = await Travelling.User.editPropertyValue('test2', 'email', 'test2@test.com', userContainer.user1Token);

        expect(res.body).toEqual('test2@test.com');
        expect(res.statusCode).toEqual(200);
      });

      test('Edit Test User 2 Email and UserData', async () => {
        var res = await Travelling.User.edit(
          { email: 'asdfa@fd.foo', user_data: { test: 1, foo: 'bar' } },
          'test2',
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({ email: 'asdfa@fd.foo', user_data: { test: 1, foo: 'bar' } });
      });

      test('Edit Test User 1 Email Property By GroupRequest', async () => {
        var res = await Travelling.Group.Request.User.editProperty(
          'asdfs@asdf.memes',
          'testgroup',
          'test',
          'email',
          userContainer.user2Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual('asdfs@asdf.memes');
      });

      test('Edit Test User 1 Email and UserData By GroupRequest', async () => {
        var res = await Travelling.Group.Request.User.edit(
          { email: 'gr@fd.foo', user_data: { test: 1, foo: 'bar' } },
          'testgroup',
          'test',
          userContainer.user2Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({ email: 'gr@fd.foo', user_data: { test: 1, foo: 'bar' } });
      });
    });

    describe('Invalid', () => {});
  });
};
