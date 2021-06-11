const config = require('../../include/utils/config');
const { Travelling } = require('../../sdk/node')('http://127.0.0.1:6969/' + config.serviceName, {
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
  });

  describe('Non-Current User By Domain', () => {
    describe('Valid', () => {
      test('Edit Property [email] User Domain 2', async () => {
        var res = await Travelling.User.Domain.editProperty(
          'test_domain_2_changed@test.com',
          'test.com',
          'test_domain_2@test.com',
          'email',
          userContainer.userDomain2Token
        );

        expect(res.body).toEqual('test_domain_2_changed@test.com');
        expect(res.statusCode).toEqual(200);
      });

      test('Edit Property Value [email] User Domain 2', async () => {
        var res = await Travelling.User.Domain.editPropertyValue(
          'test.com',
          'test_domain_2_changed@test.com',
          'email',
          'test_domain_2@test.com',
          userContainer.userDomain2Token
        );

        expect(res.body).toEqual('test_domain_2@test.com');
        expect(res.statusCode).toEqual(200);
      });

      test('Edit [UserData] User Domain 2', async () => {
        var res = await Travelling.User.Domain.edit(
          { user_data: { test: 1, foo: 'bar' } },
          'test.com',
          'test_domain_2@test.com',
          userContainer.userDomain2Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({ user_data: { test: 1, foo: 'bar' } });
      });

      test('Add Group Inheritance [group1][testgroup] User Domain 2', async () => {
        var res = await Travelling.User.Domain.addGroupInheritance(
          'test.com',
          'test_domain_2@test.com',
          'group1',
          'testgroup',
          userContainer.userDomain2Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body.domain).toEqual('test.com')
      });

      test('Remove Group Inheritance [group1][testgroup] User Domain 3', async () => {
        // Add group inheritence
        var res = await Travelling.User.Domain.addGroupInheritance(
          'test.com',
          'test_domain_3@test.com',
          'group1',
          'testgroup',
          userContainer.userDomain3Token
        );
        
        // Remove group inheritence
        var res = await Travelling.User.Domain.removeGroupInheritance(
          'test.com',
          'test_domain_3@test.com',
          'group1',
          'testgroup',
          userContainer.userDomain3Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body.domain).toEqual('test.com')
      });

      test('Delete User Domain 3', async () => {
        var res = await Travelling.User.Domain.delete(
          'test.com',
          'test_domain_3@test.com',
          userContainer.userDomain3Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body.domain).toEqual('test.com');
      });

    });


    describe('Invalid', () => {
      test('Edit Property [email] User Domain 2 Invalid Domain', async () => {
        var res = await Travelling.User.Domain.editProperty(
          'test_domain_2_changed@test.com',
          'this-aint-no-real-domain.elite',
          'test_domain_2@test.com',
          'email',
          userContainer.userDomain2Token
        );

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('type', 'user-edit-error');
        expect(res.body).toHaveProperty('msg', 'No user by that username or id was found.');
      });

      test('Edit Property Value User Domain 2 Invalid Property', async () => {
        var res = await Travelling.User.Domain.editPropertyValue(
          'test.com',
          'test_domain_2_changed@test.com',
          'fakeaffff',
          'test_domain_2@test.com',
          userContainer.userDomain2Token
        );

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('type', 'user-prop-error');
        expect(res.body).toHaveProperty('msg', 'Not a property of user');
      });

      test('Edit User Domain 2 Invalid Data', async () => {
        var res = await Travelling.User.Domain.edit(
          { garbo: { from: 3.14159, space: 'bar' } },
          'test.com',
          'test_domain_2@test.com',
          userContainer.userDomain2Token
        );

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('type', 'user-prop-error');
        expect(res.body).toHaveProperty('msg', 'Not a property of user');
      });

      test('Add [Pre-Existing] Group Inheritance User Domain 2', async () => {
        var res = await Travelling.User.Domain.addGroupInheritance(
          'test.com',
          'test_domain_2@test.com',
          'group1',
          'testgroup',
          userContainer.userDomain2Token
        );

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('type', 'user-add-group-error');
        expect(res.body).toHaveProperty('msg', 'User could not add group.');
      });

      test('Add Group Inheritance User Domain 2 Non-existent group type', async () => {
        var res = await Travelling.User.Domain.addGroupInheritance(
          'test.com',
          'test_domain_2@test.com',
          'group1',
          'it-really-doesnt-exist',
          userContainer.userDomain2Token
        );

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('type', 'user-edit-group-error');
        expect(res.body).toHaveProperty('msg', 'No group with that type by that name or id was found.');
      });

      test('Delete Already Deleted User Domain 3', async () => {
        var res = await Travelling.User.Domain.delete(
          'test.com',
          'test_domain_3@test.com',
          userContainer.userDomain2Token
        );

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('type', 'user-delete-error');
        expect(res.body).toHaveProperty('msg', 'No user by that username or id was found.');
      });

    }); 
  });
};
