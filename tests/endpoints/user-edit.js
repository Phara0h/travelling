const config = require('../../include/utils/config');
const Audit = require('../../include/database/models/audit');
const User = require('../../include/database/models/user');
const { Travelling } = require('../../sdk/node')('http://127.0.0.1:6969/' + config.serviceName, {
  resolveWithFullResponse: true
});

var userContainer = require('../include/UserContainer.js');

const XSS_AND_SQL_INJECTION = [
  `>"><script>alert("XSS")</script>&`,
  `<IMG SRC="javascript:alert('XSS');">`,
  `<IMG SRC=JaVaScRiPt:alert(&quot;XSS<WBR>&quot;)>`,
  `"><STYLE>@import"javascript:alert('XSS')";</STYLE>`,
  `>"'>`,
  `<img%20src%3D%26%23x6a;%26%23x61;%26%23x76;%26%23x61;%26%23x73;%26%23x63;%26%23x72;%26%23x69;%26%23x70;%26%23x74;%26%23x3a;`,
  `alert(%26quot;%26%23x20;XSS%26%23x20;Test%26%23x20;Successful%26quot;)>`,
  `">`,
  `>"`,
  `'';!--"<XSS>=&{()}`,
  `&<WBR>#x27&#x58&#x53&#x53&#x27&#x29>`,
  `OR 1=1`,
  `' OR 1=1--`,
  `' OR '1'='1`,
  `; OR '1'='1'`,
  `'||(elt(-3+5,bin(15),ord(10),hex(char(45))))`,
  `||6`,
  `'||'6`,
  `(||6)`,
  `) UNION SELECT%20*%20FROM%20INFORMATION_SCHEMA.TABLES;`,
  `' having 1=1--`,
  `UNI/**/ON SEL/**/ECT`,
  `+or+isnull%281%2F0%29+%2F*`,
  `OR/**/1=1`,
  `$$/**/1=1`,
  `$$ 1=1`
];

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

      test('Edit Test User 1 Email - Newlines and tabs', async () => {
        const paragraph = `\tasdf asd f sadf.\n\tasdf asdf.\n   asdf!`;
        var res = await Travelling.User.Current.edit({ user_data: { paragraph } }, userContainer.user1Token);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({
          user_data: { paragraph }
        });
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

      test('Edit Test User 1 - user_data - Newlines and tabs', async () => {
        const properWriting = `     A very well formatted paragraph, with all the English you could ever need!\n\n\tNow that we are a line under we can write a sentence ending with a period.`;

        var res = await Travelling.User.Current.editProperty(
          properWriting,
          'user_data.proper-writing',
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body).toStrictEqual({
          test: 1,
          foo: 'bar',
          'proper-writing': properWriting
        });

        // Delete the properness
        var del = await Travelling.User.Current.editProperty('', 'user_data.proper-writing', userContainer.user1Token);

        expect(del.statusCode).toEqual(200);
        expect(del.body).toStrictEqual({
          test: 1,
          foo: 'bar'
        });
      });

      test('Edit Test User 1 - user_data - allowed special characters', async () => {
        var res = await Travelling.User.Current.editProperty(
          ' .,!?$:~#%&-_@',
          'user_data.speshial',
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body).toStrictEqual({
          test: 1,
          foo: 'bar',
          speshial: ' .,!?$:~#%&-_@'
        });
      });

      test('Edit Test Domain User 6 Password and verify audit log', async () => {
        const newPassword = 'Pas5w0r!d';

        const travtok = userContainer.userDomain6;

        var res = await Travelling.User.Current.editProperty(newPassword, 'password', null, {
          headers: {
            cookie: 'trav:tok=' + travtok.tok
          }
        });

        expect(res.body).not.toBe(newPassword); // Make sure only the hash is returned
        expect(res.statusCode).toEqual(200);

        // Should get a new token when changing password
        userContainer.parseUserDomain6Cookie(res.headers['set-cookie']);

        // Wait before accessing resource to ensure an invalid token wont work
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Make sure token authenticates
        var currentUser = await Travelling.User.Current.get(null, {
          headers: {
            cookie: userContainer.userDomain6Cookie()
          }
        });

        expect(currentUser.statusCode).toEqual(200);

        if (config.audit.edit.enable === true) {
          // Check audit log to make sure password is hashed
          const audit = await Audit.findAllBy({
            by_user_id: currentUser.body.id,
            action: 'EDIT',
            subaction: 'USER_PROPERTY',
            prop: 'password'
          });

          expect(audit.length).toBe(1);
          expect(audit[0]).toHaveProperty('id');
          expect(audit[0]).toHaveProperty('created_on');
          expect(audit[0]).toHaveProperty('action', 'EDIT');
          expect(audit[0]).toHaveProperty('subaction', 'USER_PROPERTY');
          expect(audit[0]).toHaveProperty('by_user_id', currentUser.body.id);
          expect(audit[0]).toHaveProperty('of_user_id', currentUser.body.id);
          expect(audit[0]).toHaveProperty('prop', 'password');
          expect(audit[0]).toHaveProperty('old_val');
          expect(audit[0].old_val).not.toBeNull();
          expect(audit[0].new_val).not.toBe('Pas5w0r!d6'); // This is the old password from the register test suite
          expect(audit[0]).toHaveProperty('new_val');
          expect(audit[0].new_val).not.toBeNull();
          expect(audit[0].new_val).not.toBe(newPassword); // Make sure its hashed
        }
      });

      test('Delete Test User 1 Token "test123token" ', async () => {
        var res = await Travelling.User.Current.registerToken(
          { name: 'test123token', urls: ['http://127.0.0.1'] },
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('client_id', 'test123token');
        expect(res.body).toHaveProperty('client_secret');

        if (config.audit.create.enable === true) {
          const clientSecret = res.body.client_secret;

          var currentUser = await Travelling.User.Current.get(userContainer.user1Token);

          expect(currentUser.statusCode).toEqual(200);

          // Make sure audit log doesnt leak token
          const audit = await Audit.findAllBy({
            by_user_id: currentUser.body.id,
            action: 'CREATE',
            subaction: 'USER_OAUTH2_TOKEN'
          });

          expect(audit.length).toBeGreaterThanOrEqual(1);
          expect(audit[0]).toHaveProperty('id');
          expect(audit[0]).toHaveProperty('created_on');
          expect(audit[0]).toHaveProperty('action', 'CREATE');
          expect(audit[0]).toHaveProperty('subaction', 'USER_OAUTH2_TOKEN');
          expect(audit[0]).toHaveProperty('by_user_id', currentUser.body.id);
          expect(audit[0]).toHaveProperty('of_user_id', currentUser.body.id);
          expect(audit[0]).toHaveProperty('prop', null);
          expect(audit[0]).toHaveProperty('old_val', null);
          expect(audit[0]).toHaveProperty('new_val');
          expect(audit[0].new_val).not.toBeNull();
          expect(audit[0].new_val).not.toBe(clientSecret); // make sure its hashed
        }

        res = await Travelling.User.Current.deleteToken('test123token', userContainer.user1Token);

        expect(res.statusCode).toEqual(200);
      });
    });

    describe('Invalid', () => {
      test('Edit Current User (user 1) - Edit user_data security', async () => {
        for (let i = 0; i < XSS_AND_SQL_INJECTION.length; i++) {
          // Edit
          var editRes = await Travelling.User.Current.edit(
            { user_data: { asdf: XSS_AND_SQL_INJECTION[i] } },
            userContainer.user1Token
          );

          expect(editRes.body.msg).toEqual('User data contains invalid character(s).');
          expect(editRes.statusCode).toEqual(400);

          // Edit property
          var editPropertyRes = await Travelling.User.Current.editProperty(
            XSS_AND_SQL_INJECTION[i],
            `user_data.badprop`,
            userContainer.user1Token
          );

          expect(editPropertyRes.body.msg).toEqual('User data contains invalid character(s).');
          expect(editPropertyRes.statusCode).toEqual(400);

          // Edit user_data property
          var editUserDataPropertyRes = await Travelling.User.Current.editUserDataProperty(
            XSS_AND_SQL_INJECTION[i],
            'badprop',
            userContainer.user1Token
          );

          expect(editUserDataPropertyRes.body.msg).toEqual('User data contains invalid character(s).');
          expect(editUserDataPropertyRes.statusCode).toEqual(400);
        }
      });

      test('Edit Current User (user 1) - Edit user_data property value security', async () => {
        // Edit property value
        var editPropertyValueRes = await Travelling.User.Current.editPropertyValue(
          `user_data.bad$%^`,
          '$>',
          userContainer.user1Token
        );
        expect([400, 404]).toContain(editPropertyValueRes.statusCode);

        // Edit user_data property value
        var editUserDataPropertyValueRes = await Travelling.User.Current.editUserDataPropertyValue(
          `user_data.bad(.)`,
          '*!',
          userContainer.user1Token
        );
        expect([400, 404]).toContain(editUserDataPropertyValueRes.statusCode);
      });

      if (config.email.validation.internal.dedupeGmail) {
        test('Edit Current User (user 1) - Edit user data with dupe gmail', async () => {
          // First edit user to have gmail email
          const editRes = await Travelling.User.Current.editPropertyValue(
            'email',
            'testing.guy@gmail.com',
            userContainer.user1Token
          );

          expect(editRes).toHaveProperty('statusCode', 200);

          // Attempt to edit user data with dupe email properties (+, .)
          const invalidRes = await Travelling.User.Current.editPropertyValue(
            'email',
            't.e.stinggu.y+123213@gmail.com',
            userContainer.user1Token
          );

          expect(invalidRes).toHaveProperty('statusCode', 400);
        });
      }
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

      test('Edit User Data Property - Newlines and tabs', async () => {
        const properWriting = `     A very well formatted paragraph, with all the English you could ever need!\n\n\tNow that we are a line under we can write a sentence ending with a period.`;

        var res = await Travelling.User.Domain.editUserDataProperty(
          properWriting,
          'test.com',
          'test_domain_2_changed@test.com',
          'proper-writing',
          userContainer.userDomain2Token
        );

        expect(res.body).toEqual({ 'proper-writing': properWriting });
        expect(res.statusCode).toEqual(200);

        var remove = await Travelling.User.Domain.editUserDataProperty(
          undefined,
          'test.com',
          'test_domain_2_changed@test.com',
          'proper-writing',
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

      test('Edit Test User Domain 2 - user_data - allowed special characters', async () => {
        var res = await Travelling.User.Domain.editProperty(
          ' .,!?$:~#%&-_@',
          'test.com',
          'test_domain_2@test.com',
          'user_data.speshial',
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body).toStrictEqual({
          speshial: ' .,!?$:~#%&-_@'
        });
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

      test('Edit Current User (userDomain2Token) - Edit user_data security', async () => {
        for (let i = 0; i < XSS_AND_SQL_INJECTION.length; i++) {
          // Edit
          var editRes = await Travelling.User.Domain.edit(
            { user_data: { asdf: XSS_AND_SQL_INJECTION[i] } },
            'test.com',
            'test_domain_2@test.com',
            userContainer.user1Token
          );

          expect(editRes.body.msg).toEqual('User data contains invalid character(s).');
          expect(editRes.statusCode).toEqual(400);

          // Edit property
          var editPropertyRes = await Travelling.User.Domain.editProperty(
            XSS_AND_SQL_INJECTION[i],
            'test.com',
            'test_domain_2@test.com',
            `user_data.badprop`,
            userContainer.user1Token
          );

          expect(editPropertyRes.body.msg).toEqual('User data contains invalid character(s).');
          expect(editPropertyRes.statusCode).toEqual(400);

          // Edit user_data property
          var editUserDataPropertyRes = await Travelling.User.Domain.editUserDataProperty(
            XSS_AND_SQL_INJECTION[i],
            'test.com',
            'test_domain_2@test.com',
            'badprop',
            userContainer.user1Token
          );

          expect(editUserDataPropertyRes.body.msg).toEqual('User data contains invalid character(s).');
          expect(editUserDataPropertyRes.statusCode).toEqual(400);
        }
      });

      test('Edit Current User (user 1) - Edit user_data property value security', async () => {
        // Edit property value
        var editPropertyValueRes = await Travelling.User.Domain.editPropertyValue(
          'test.com',
          'test_domain_2@test.com',
          `user_data.bad$%^`,
          '$>',
          userContainer.user1Token
        );
        expect([400, 404]).toContain(editPropertyValueRes.statusCode);

        // Edit user_data property value
        var editUserDataPropertyValueRes = await Travelling.User.Domain.editUserDataPropertyValue(
          'test.com',
          'test_domain_2@test.com',
          `user_data.bad(.)`,
          '*!',
          userContainer.user1Token
        );
        expect([400, 404]).toContain(editUserDataPropertyValueRes.statusCode);
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
