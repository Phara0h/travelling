const config = require('../../include/utils/config');
const Audit = require('../../include/database/models/audit');
const User = require('../../include/database/models/user');
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

      test('Edit Test User 1 Property user_data ', async () => {
        var res = await Travelling.User.Current.editProperty(
          'noice notes broh',
          'user_data.notes',
          userContainer.user1Token
        );

        expect(res.body).toStrictEqual({ notes: 'noice notes broh' });
        expect(res.statusCode).toEqual(200);

        var remove = await Travelling.User.Current.editProperty(undefined, 'user_data.notes', userContainer.user1Token);
        expect(remove.statusCode).toEqual(200);
        expect(remove.body).toEqual({});
      });

      test('Edit Test User 1 Edit User Data Property ', async () => {
        var res = await Travelling.User.Current.editUserDataProperty('swagga', 'proppa', userContainer.user1Token);

        expect(res.body).toStrictEqual({ proppa: 'swagga' });
        expect(res.statusCode).toEqual(200);

        var remove = await Travelling.User.Current.editUserDataProperty(undefined, 'proppa', userContainer.user1Token);
        expect(remove.statusCode).toEqual(200);
        expect(remove.body).toEqual({});
      });

      test('Edit Test User 1 Email Property Value ', async () => {
        var res = await Travelling.User.Current.editPropertyValue('email', 'test@test.com', userContainer.user1Token);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual('test@test.com');
      });

      test('Edit Test User 1 User Data Property Value ', async () => {
        var res = await Travelling.User.Current.editUserDataPropertyValue('qwerty', 'ytrewq', userContainer.user1Token);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ qwerty: 'ytrewq' });

        var remove = await Travelling.User.Current.editUserDataProperty(undefined, 'qwerty', userContainer.user1Token);
        expect(remove.statusCode).toEqual(200);
        expect(remove.body).toEqual({});
      });

      test('Edit Test User 1 Email, domain and UserData', async () => {
        var res = await Travelling.User.Current.edit(
          { email: 'testasdf2@fd.foo', user_data: { test: 1, foo: 'bar' } },
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({
          email: 'testasdf2@fd.foo',
          user_data: { test: 1, foo: 'bar' }
        });
      });

      test('Edit Test User 1 - user_data - one property value', async () => {
        var res = await Travelling.User.Current.editPropertyValue(
          'user_data.coolprop',
          'testing',
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body).toStrictEqual({
          test: 1,
          foo: 'bar',
          coolprop: 'testing'
        });
      });

      test('Edit Test User 1 - user_data - delete one property value', async () => {
        // Setting user_data.prop = undefined deletes object
        var res = await Travelling.User.Current.editPropertyValue(
          'user_data.coolprop',
          undefined,
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body).toStrictEqual({
          test: 1,
          foo: 'bar'
        });
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
      test('Edit Test User 2 Email Property', async () => {
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

      test('Edit Test User Update Existing UserData', async () => {
        var res = await Travelling.User.edit(
          { user_data: { notes: 'notey totey' } },
          'test2',
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({ user_data: { notes: 'notey totey' } });
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

      test('Edit Property user_data - User Domain 2', async () => {
        var res = await Travelling.User.Domain.editProperty(
          'noice value',
          'test.com',
          'test_domain_2_changed@test.com',
          'user_data.domaintwo',
          userContainer.userDomain2Token
        );

        expect(res.body).toEqual({ domaintwo: 'noice value' });
        expect(res.statusCode).toEqual(200);

        var remove = await Travelling.User.Domain.editProperty(
          undefined,
          'test.com',
          'test_domain_2_changed@test.com',
          'user_data.domaintwo',
          userContainer.userDomain2Token
        );

        expect(remove.body).toEqual({});
        expect(remove.statusCode).toEqual(200);
      });

      test('Edit User Data Property - User Domain 2', async () => {
        var res = await Travelling.User.Domain.editUserDataProperty(
          'vcxz',
          'test.com',
          'test_domain_2_changed@test.com',
          'zxcv',
          userContainer.userDomain2Token
        );

        expect(res.body).toEqual({ zxcv: 'vcxz' });
        expect(res.statusCode).toEqual(200);

        var remove = await Travelling.User.Domain.editUserDataProperty(
          undefined,
          'test.com',
          'test_domain_2_changed@test.com',
          'zxcv',
          userContainer.userDomain2Token
        );

        expect(remove.body).toEqual({});
        expect(remove.statusCode).toEqual(200);
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

      test('Edit User Data Property Value - User Domain 2', async () => {
        var res = await Travelling.User.Domain.editUserDataPropertyValue(
          'test.com',
          'test_domain_2@test.com',
          'notes',
          'wubbalubbadubdub',
          userContainer.userDomain2Token
        );

        expect(res.body).toEqual({ notes: 'wubbalubbadubdub' });
        expect(res.statusCode).toEqual(200);

        // Do it again for good measure
        var res2 = await Travelling.User.Domain.editUserDataPropertyValue(
          'test.com',
          'test_domain_2@test.com',
          'notes',
          'rickytyrickytywreckd',
          userContainer.userDomain2Token
        );

        expect(res2.body).toEqual({ notes: 'rickytyrickytywreckd' });
        expect(res2.statusCode).toEqual(200);

        var remove = await Travelling.User.Domain.editUserDataPropertyValue(
          'test.com',
          'test_domain_2@test.com',
          'notes',
          undefined,
          userContainer.userDomain2Token
        );

        expect(remove.body).toEqual({});
        expect(remove.statusCode).toEqual(200);
      });

      test('Edit [State, City, UserData] User Domain 2', async () => {
        var res = await Travelling.User.Domain.edit(
          { state: 'WA', city: 'SEATTLE', user_data: { test: 1, foo: 'bar' } },
          'test.com',
          'test_domain_2@test.com',
          userContainer.userDomain2Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({ state: 'wa', city: 'seattle', user_data: { test: 1, foo: 'bar' } });
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
        expect(res.body.domain).toEqual('test.com');
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
        expect(res.body.domain).toEqual('test.com');
      });

      var userDomain3;

      test('Delete User Domain 3', async () => {
        userDomain3 = await User.findAllBy({ email: 'test_domain_3@test.com' });

        var res = await Travelling.User.Domain.delete(
          'test.com',
          'test_domain_3@test.com',
          userContainer.userDomain3Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body.domain).toEqual('test.com');
      });

      test('Checking Audit of (Delete Test User [test_domain_3@test.com])', async () => {
        if (config.audit.delete.enable === true) {
          const audit = await Audit.findAllBy({ of_user_id: userDomain3[0].id, action: 'DELETE', subaction: 'USER' });

          expect(audit[0]).toHaveProperty('id');
          expect(audit[0].created_on).not.toBeNull();
          expect(audit[0].old_val).not.toBeNull();
        }
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
      });

      test('Edit User Data Property - User Domain 2 - Multiple props', async () => {
        var res = await Travelling.User.Domain.editProperty(
          'test_domain_2_changed@test.com',
          'this-aint-no-real-domain.elite',
          'test_domain_2@test.com',
          'user_data.notes,user_data.hiii',
          userContainer.userDomain2Token
        );

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('type', 'user-prop-error');
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
      });

      test('Delete Already Deleted User Domain 3', async () => {
        var res = await Travelling.User.Domain.delete(
          'test.com',
          'test_domain_3@test.com',
          userContainer.userDomain2Token
        );

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('type', 'user-delete-error');
      });
    });
  });
};
