const config = require('../include/utils/config');
const { Travelling } = require('../sdk/node')('http://127.0.0.1:6969/' + config.serviceName);
var userContainer = require('./include/UserContainer.js');

module.exports = () => {
  describe('Test Multi User Group Permissions', () => {
    test('Add Permission [test-1-:grouptype] to Group 1', async () => {
      var res = await Travelling.Group.Type.addPermission('group1', 'testgroup', 'test-1-:grouptype', userContainer.user2Token);
      //console.log(res.body)

      expect(res.statusCode).toEqual(200);
    });

    test('User 2 Inherit from Group 3', async () => {
      var res = await Travelling.User.Current.addGroupInheritance('group1', 'testgroup', userContainer.user2Token);

      expect(res.statusCode).toEqual(200);
    });

    test('Check [test-1-testgroup] permission', async () => {
      var res = await Travelling.User.Current.permissionCheck('test-1-testgroup', userContainer.user2Token);

      expect(res.statusCode).toEqual(200);
    });

    test('User 2 Inherit from Group 3', async () => {
      var res = await Travelling.Group.Type.User.addGroupInheritance(
        'testgroup',
        'test2',
        'group3',
        'group',
        userContainer.user2Token
      );

      expect(res.statusCode).toEqual(200);
    });

    test('Check [test-1-testgroup] permission', async () => {
      var res = await Travelling.User.Current.permissionCheck('test-1-group', userContainer.user2Token);

      expect(res.statusCode).toEqual(200);
    });

    test('Add Permission [test-3-:grouptype] to Group 3', async () => {
      var res = await Travelling.Group.addPermission('group3', 'test-3-:grouptype', userContainer.user2Token);

      expect(res.statusCode).toEqual(200);
    });

    test('Change Group 3 to be Type [test2group]', async () => {
      var res = await Travelling.Group.edit({ type: 'test2group' }, 'group3', userContainer.user2Token);

      expect(res.statusCode).toEqual(200);
    });

    test('Check [test-3-test2group] permission', async () => {
      var res = await Travelling.User.Current.permissionCheck('test-3-test2group', userContainer.user2Token);

      expect(res.statusCode).toEqual(200);
    });

    test('Check [test-1-test2group] permission', async () => {
      var res = await Travelling.User.Current.permissionCheck('test-1-test2group', userContainer.user2Token);

      expect(res.statusCode).toEqual(200);
    });

    test('User 2 Remove From Group 1', async () => {
      var res = await Travelling.Group.User.removeGroupInheritance(
        'group3',
        'test2group',
        'test2',
        'group1',
        'testgroup',
        userContainer.user2Token
      );

      expect(res.statusCode).toEqual(200);
      //console.log(res.body)
    });

    test('Check [test-1-testgroup] permission', async () => {
      var res = await Travelling.User.Current.permissionCheck('test-1-testgroup', userContainer.user2Token);

      expect(res.statusCode).toEqual(401);
    });
  });

  test('Lock User Test1 While Test1 is Logged In', async () => {
    var res = await Travelling.User.editProperty('true', 'test', 'locked', null, {
      headers: {
        cookie: userContainer.user2Cookie()
      }
    });
    // console.log(res.req._headers,res.statusCode, res.headers, res.body)

    expect(res.body).toEqual(true);

    var res2 = await Travelling.User.editProperty('false', 'test', 'locked', null, {
      headers: {
        cookie: userContainer.user1Cookie()
      }
    });

    expect(res2.body).not.toEqual(false);

    await Travelling.User.editProperty('false', 'test', 'locked', null, {
      headers: {
        cookie: userContainer.user2Cookie()
      }
    });

    res2 = await Travelling.User.Current.get(null, {
      headers: {
        cookie: userContainer.user1Cookie()
      }
    });
    expect(res2.body).toMatchObject({ username: 'test' });
  });

  test('Delete User Test1 While Test1 is Logged In', async () => {
    var res = await Travelling.User.delete('test', null, {
      headers: {
        cookie: userContainer.user2Cookie()
      }
    });
    // console.log(res.req._headers,res.statusCode, res.headers, res.body)

    expect(res.statusCode).toEqual(200);

    var res2 = await Travelling.User.editProperty('false', 'test', 'locked', null, {
      headers: {
        cookie: userContainer.user1Cookie()
      }
    });

    expect(res2.body).not.toEqual(false);

    var res3 = await Travelling.User.Current.editProperty('false', 'locked', null, {
      headers: {
        cookie: userContainer.user1Cookie()
      }
    });

    expect(res3.body).not.toEqual(false);
  });
};
