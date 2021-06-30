const config = require('../../include/utils/config');
const Audit = require('../../include/database/models/audit');
const Group = require('../../include/database/models/group');
const { Travelling } = require('../../sdk/node')('http://127.0.0.1:6969/' + config.serviceName, {
  resolveWithFullResponse: true
});
var userContainer = require('../include/UserContainer.js');

module.exports = () => {
  var group1;
  var group2;
  var group3;
  var group4;
  var exported;

  describe('Valid', () => {
    describe('Create', () => {
      /**
                group5
            _______|______
            |            |
        superadmin     group4
                         |____
                              |
                            group3
                               |___________
                                  |       |
                                group1  group2
                                          |
                                        group1
          */

      test('Create a Group With Name group1 and verify audit', async () => {
        var res = await Travelling.Group.create({ name: 'group1', type: 'testgroup' }, userContainer.user1Token);

        group1 = res.body;
        expect(res.body).toMatchObject({ name: 'group1', id: expect.any(String), is_default: false });
      
        const audit = await Audit.findAllBy({ action: "CREATE", subaction: "GROUP" });

        expect(audit[0]).toHaveProperty('id');
        expect(audit[0].created_on).not.toBeNull();
        expect(audit[0].by_user_id).not.toBeNull();
        expect(audit[0].new_val).not.toBeNull();
        expect(audit[0].prop).toEqual('groupID');
      });

      test('Create a Group With Name group2 and Inherited From group1', async () => {
        var res = await Travelling.Group.create({ name: 'group2', inherited: [group1.id] }, userContainer.user1Token);

        group2 = res.body;
        expect(res.body).toMatchObject({
          name: 'group2',
          id: expect.any(String),
          is_default: false,
          inherited: [group1.id]
        });
      });

      test('Create a Default Group With Name group3 and Inherited From group2 & group 1', async () => {
        var res = await Travelling.Group.create(
          { name: 'group3', inherited: [group1.id, group2.id], is_default: true },
          userContainer.user1Token
        );

        group3 = res.body;
        expect(res.body).toMatchObject({
          name: 'group3',
          id: expect.any(String),
          is_default: true,
          inherited: [group1.id, group2.id]
        });
      });

      test('Create a Default Group With Name group4 and Inherited From group3', async () => {
        var res = await Travelling.Group.create(
          { name: 'group4', inherited: [group3.id], is_default: true },
          userContainer.user1Token
        );

        group4 = res.body;
        expect(res.body).toMatchObject({
          name: 'group4',
          id: expect.any(String),
          is_default: true,
          inherited: [group3.id]
        });
      });

      test('Create a Default Group With Name group5 and Inherited From group4 and superadmin', async () => {
        var superadmin = (await Travelling.Group.get('superadmin', userContainer.user1Token)).body.id;
        var res = await Travelling.Group.create(
          { name: 'group5', inherited: [group4.id, superadmin], is_default: true },
          userContainer.user1Token
        );

        expect(res.body).toMatchObject({
          name: 'group5',
          id: expect.any(String),
          is_default: true,
          inherited: [group4.id, superadmin]
        });
      });
    });

    describe('Import/Export', () => {
      test('Export Groups', async () => {
        var res = await Travelling.Groups.export(userContainer.user1Token);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({
          group: {
            group2: expect.anything(),
            group3: expect.anything(),
            group4: expect.anything(),
            group5: expect.anything(),
            anonymous: expect.anything(),
            superadmin: expect.anything()
          },
          testgroup: {
            group1: expect.anything()
          }
        }),
          (exported = res.body);
      });
    });

    describe('Edit', () => {
      test('Add permission to superadmin and test permission', async () => {
        var addPerm = await Travelling.Group.addPermission('superadmin', 'test-one-*-three', userContainer.user1Token);

        expect(addPerm.statusCode).toEqual(200);

        var permCheck = await Travelling.User.Current.permissionCheck('test-one-fish-three', userContainer.user1Token);

        expect(permCheck.statusCode).toEqual(200);

        var failPermCheck = await Travelling.User.Current.permissionCheck('test-one-fish-blue', userContainer.user1Token);

        expect(failPermCheck.statusCode).toEqual(401);
      });

      test('Group 4 to Inherit Superadmin', async () => {
        var superadmin = (await Travelling.Group.get('superadmin', userContainer.user1Token)).body.id;
        var res = await Travelling.Group.edit(
          {
            inherited: [group3.id, superadmin]
          },
          'group4',
          userContainer.user1Token
        );

        group4 = res.body;

        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({
          name: 'group4',
          id: expect.any(String),
          is_default: false,
          inherited: [group3.id, superadmin]
        });

              
        const audit = await Audit.findAllBy({ action: "EDIT", subaction: "GROUP_ADD_INHERITANCE" });

        expect(audit[0]).toHaveProperty('id');
        expect(audit[0].created_on).not.toBeNull();
        expect(audit[0].by_user_id).not.toBeNull();
        expect(audit[0].new_val).not.toBeNull();
        expect(audit[0].prop).toEqual('inheritedGroup');
      });

      test('Group 1 to Inherit Superadmin', async () => {
        var superadmin = (await Travelling.Group.get('superadmin', userContainer.user1Token)).body.id;
        var res = await Travelling.Group.Type.inheritFrom('group1', 'testgroup', 'superadmin', 'group', userContainer.user1Token);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({
          name: 'group1',
          id: expect.any(String),
          is_default: false,
          inherited: [superadmin]
        });
      });

      test('Group 1 to Remove Inheritance by Group Type of Superadmin ', async () => {
        var res = await Travelling.Group.Type.removeInheritance(
          'group1',
          'testgroup',
          'superadmin',
          'group',
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({ name: 'group1', id: expect.any(String), is_default: false, inherited: [] });
      });

      test('Group 1 to Remove Inheritance of Superadmin ', async () => {
        var res = await Travelling.Group.inheritFrom('group2', 'superadmin', 'group', userContainer.user1Token);

        expect(res.statusCode).toEqual(200);

        res = await Travelling.Group.removeInheritance('group2', 'superadmin', 'group', userContainer.user1Token);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({
          name: 'group2',
          id: expect.any(String),
          is_default: false,
          inherited: [group1.id]
        });
      });

      test('Delete permission to superadmin and test permission', async () => {
        var addPerm = await Travelling.Group.deletePermission('superadmin', 'test-one-*-three', userContainer.user1Token);

        expect(addPerm.statusCode).toEqual(200);

        var failPermCheck = await Travelling.User.Current.permissionCheck('test-one-fish-three', userContainer.user1Token);

        expect(failPermCheck.statusCode).toEqual(401);
      });

      test('Set Group 2 as Default and Create Test User 10', async () => {
        var res = await Travelling.Group.setDefault('group2', userContainer.user1Token);

        console.log(res.body);
        expect(res.statusCode).toEqual(200);

        res = await Travelling.Auth.register({
          username: 'test10',
          password: 'Pas5w0r!d10',
          email: 'test10@test.com'
        });
        console.log(res.body);
        expect(res.statusCode).toEqual(200);

        res = await Travelling.User.getProperty('test10', 'group_ids', userContainer.user1Token);
        console.log(res.body);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([group2.id]);

        res = await Travelling.User.delete('test10', userContainer.user1Token);
        console.log(res.body);
        expect(res.statusCode).toEqual(200);

        res = await Travelling.Group.setDefault('group5', userContainer.user1Token);
        console.log(res.body);
        expect(res.statusCode).toEqual(200);
      });
    });

    describe('Get', () => {
      test('All Groups', async () => {
        var res = await Travelling.Groups.get(userContainer.user1Token);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(7);
      });

      test('All Groups of "testgroup" Type', async () => {
        var res = await Travelling.Groups.Type.all('testgroup', userContainer.user1Token);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
      });

      test('All Types of Groups', async () => {
        var res = await Travelling.Groups.Type.getTypesList(userContainer.user1Token);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
      });

      test('Group2 by Name', async () => {
        var res = await Travelling.Group.get('group2', userContainer.user1Token);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({
          allowed: group2.allowed,
          id: group2.id,
          inherited: group2.inherited,
          is_default: group2.is_default,
          name: group2.name,
          type: group2.type
        });
      });

      test('Group2 by id', async () => {
        var res = await Travelling.Group.get(group2.id, userContainer.user1Token);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({
          allowed: group2.allowed,
          id: group2.id,
          inherited: group2.inherited,
          is_default: group2.is_default,
          name: group2.name,
          type: group2.type
        });
      });

      test('Group1 by id and Type', async () => {
        var res = await Travelling.Group.Type.get(group1.id, group1.type, userContainer.user1Token);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({
          allowed: group1.allowed,
          id: group1.id,
          inherited: [],
          is_default: group1.is_default,
          name: group1.name,
          type: group1.type
        });
      });

      test('Group1 by Name and Type', async () => {
        var res = await Travelling.Group.Type.get('group1', group1.type, userContainer.user1Token);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({
          allowed: group1.allowed,
          id: group1.id,
          inherited: [],
          is_default: group1.is_default,
          name: group1.name,
          type: group1.type
        });
      });
    });
  });

  describe('Invalid', () => {
    describe('Edit', () => {
      test('Circular Group Inheritance', async () => {
        var res = await Travelling.Group.edit({ inherited: [group4.id] }, 'group1', userContainer.user1Token);

        expect(res.statusCode).toEqual(400);
      });

      test('Circular Group Inheritance Inverse', async () => {
        var res = await Travelling.Group.edit({ inherited: [] }, 'group4', userContainer.user1Token);

        expect(res.statusCode).toEqual(200);

        res = await Travelling.Group.edit({ inherited: [group4.id] }, group1.id, userContainer.user1Token); // id instead of name since its not 'group' type
        expect(res.statusCode).toEqual(200);

        res = await Travelling.Group.edit({ inherited: [group2.id] }, 'group4', userContainer.user1Token);
        expect(res.statusCode).toEqual(400);
      });

      test('Circular Group Inheritance Self', async () => {
        var res = await Travelling.Group.edit({ inherited: [group1.id] }, 'group1', userContainer.user1Token);

        expect(res.statusCode).toEqual(400);
      });

      test('Invaild Name Group1', async () => {
        var res = await Travelling.Group.edit(
          { name: "SELECT * FROM members WHERE username = 'admin'--' AND password = 'password'" },
          'group1',
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(400);
      });
    });
  });

  afterAll(async () => {
    // reset groups
    console.log('Reset Groups');
    await Travelling.Groups.import(exported, userContainer.user1Token);
  });
};
