const config = require('../../include/utils/config');
const User = require('../../include/database/models/user');
const Audit = require('../../include/database/models/audit');
const { Travelling } = require('../../sdk/node')('http://127.0.0.1:6969/' + config.serviceName, {
  resolveWithFullResponse: true
});
var userContainer = require('../include/UserContainer.js');

module.exports = () => {
  if (
    config.audit.view.enable === true &&
    config.audit.create.enable === true &&
    config.audit.edit.enable === true &&
    config.audit.delete.enable === true
  ) {
    var testUser1;

    describe('Valid ByUser', () => {
      test('Get Audit by Test User (No Query Params)', async () => {
        testUser1 = await User.findAllBy({ username: 'test' });

        const res = await Travelling.Audit.User.byuserId(
          testUser1[0].id,
          null,
          null,
          null,
          null,
          null,
          true,
          null,
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body[0].id).not.toBeNull();
        expect(res.body[0].created_on).not.toBeNull();
        expect(res.body[0].action).not.toBeNull();
        expect(res.body[0].subaction).not.toBeNull();
        expect(res.body[0]).toHaveProperty('by_user_firstname');
        expect(res.body[0]).toHaveProperty('by_user_lastname');
        expect(res.body[0]).toHaveProperty('of_user_firstname');
        expect(res.body[0]).toHaveProperty('of_user_lastname');
        expect(res.body[0].subaction).not.toBeNull();
        expect(res.body[0].by_user_id).toEqual(testUser1[0].id);
      });

      test('Get Audit by Test User with Sort', async () => {
        const res = await Travelling.Audit.User.byuserId(
          testUser1[0].id,
          null,
          null,
          null,
          'action',
          null,
          true,
          null,
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body[0].id).not.toBeNull();
        expect(res.body[0].created_on).not.toBeNull();
        expect(res.body[0].action).not.toBeNull();
        expect(res.body[0].subaction).not.toBeNull();
        expect(res.body[0]).toHaveProperty('by_user_firstname');
        expect(res.body[0]).toHaveProperty('by_user_lastname');
        expect(res.body[0]).toHaveProperty('of_user_firstname');
        expect(res.body[0]).toHaveProperty('of_user_lastname');
        expect(res.body[0].by_user_id).toEqual(testUser1[0].id);
      });

      test('Get Audit by Test User with Sortdir', async () => {
        const res = await Travelling.Audit.User.byuserId(
          testUser1[0].id,
          null,
          null,
          null,
          'action',
          'ASC',
          true,
          null,
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body[0].id).not.toBeNull();
        expect(res.body[0].created_on).not.toBeNull();
        expect(res.body[0].action.localeCompare(res.body[1].action)).toBeLessThanOrEqual(0);
        expect(res.body[0].subaction).not.toBeNull();
        expect(res.body[0]).toHaveProperty('by_user_firstname');
        expect(res.body[0]).toHaveProperty('by_user_lastname');
        expect(res.body[0]).toHaveProperty('of_user_firstname');
        expect(res.body[0]).toHaveProperty('of_user_lastname');
        expect(res.body[0].by_user_id).toEqual(testUser1[0].id);
      });

      test('Get Audit by Test User with limit', async () => {
        const res = await Travelling.Audit.User.byuserId(
          testUser1[0].id,
          null,
          1,
          null,
          null,
          null,
          true,
          null,
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(1);
        expect(res.body[0].id).not.toBeNull();
        expect(res.body[0].created_on).not.toBeNull();
        expect(res.body[0].action).not.toBeNull();
        expect(res.body[0].subaction).not.toBeNull();
        expect(res.body[0]).toHaveProperty('by_user_firstname');
        expect(res.body[0]).toHaveProperty('by_user_lastname');
        expect(res.body[0]).toHaveProperty('of_user_firstname');
        expect(res.body[0]).toHaveProperty('of_user_lastname');
        expect(res.body[0].by_user_id).toEqual(testUser1[0].id);
      });

      test('Get Audit by Test User with skip', async () => {
        const res = await Travelling.Audit.User.byuserId(
          testUser1[0].id,
          null,
          null,
          1000,
          null,
          null,
          true,
          null,
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(0);
      });

      test('Get Audit by Test User with filter (action=EDIT)', async () => {
        const res = await Travelling.Audit.User.byuserId(
          testUser1[0].id,
          'action=EDIT',
          null,
          null,
          null,
          null,
          true,
          null,
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body[0].id).not.toBeNull();
        expect(res.body[0].created_on).not.toBeNull();
        expect(res.body[0].action).toEqual('EDIT');
        expect(res.body[0].subaction).not.toBeNull();
        expect(res.body[0]).toHaveProperty('by_user_firstname');
        expect(res.body[0]).toHaveProperty('by_user_lastname');
        expect(res.body[0]).toHaveProperty('of_user_firstname');
        expect(res.body[0]).toHaveProperty('of_user_lastname');
        expect(res.body[0].by_user_id).toEqual(testUser1[0].id);
      });

      test('Get Audit by Test User - Verify No (self) View Audits Were Created', async () => {
        // View Self
        const me = await Travelling.User.Current.get(null, {
          headers: {
            cookie: userContainer.user1Cookie()
          }
        });

        expect(me.body.id).not.toBeNull();

        // Check for audits
        const res = await Travelling.Audit.User.byuserId(
          me.body.id,
          `action=VIEW,of_user_id=${me.body.id}`,
          null,
          null,
          null,
          null,
          true,
          null,
          userContainer.user1Token
        );

        expect(res.body.length).toEqual(0);
        expect(res.statusCode).toEqual(200);
      });

      test('Get Audit by Test User with filter (within date range)', async () => {
        var yesterday = new Date();
        var tomorrow = new Date();

        yesterday.setDate(yesterday.getDate() - 1);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const res = await Travelling.Audit.User.byuserId(
          testUser1[0].id,
          `created_on >= ${yesterday.toISOString()}, created_on <= ${tomorrow.toISOString()}`,
          null,
          null,
          null,
          null,
          true,
          null,
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body[0].id).not.toBeNull();
        expect(res.body[0].created_on).not.toBeNull();
        expect(res.body[0].action).not.toBeNull();
        expect(res.body[0].subaction).not.toBeNull();
        expect(res.body[0]).toHaveProperty('by_user_firstname');
        expect(res.body[0]).toHaveProperty('by_user_lastname');
        expect(res.body[0]).toHaveProperty('of_user_firstname');
        expect(res.body[0]).toHaveProperty('of_user_lastname');
        expect(res.body[0].by_user_id).toEqual(testUser1[0].id);
      });

      test('Get Audit by Test User with filter (outside date range)', async () => {
        var yesterday = new Date();
        var tomorrow = new Date();

        yesterday.setDate(yesterday.getDate() - 1);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const res = await Travelling.Audit.User.byuserId(
          testUser1[0].id,
          `created_on > ${tomorrow.toISOString()}, created_on < ${yesterday.toISOString()}`,
          null,
          null,
          null,
          null,
          true,
          null,
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(0);
      });
    });

    describe('Valid OfUser', () => {
      var testUser1;

      test('Get Audit of Test User (No Query Params)', async () => {
        testUser1 = await User.findAllBy({ username: 'test' });

        const res = await Travelling.Audit.User.ofuserId(
          testUser1[0].id,
          null,
          null,
          null,
          null,
          null,
          true,
          null,
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body[0].id).not.toBeNull();
        expect(res.body[0].created_on).not.toBeNull();
        expect(res.body[0].action).not.toBeNull();
        expect(res.body[0].subaction).not.toBeNull();
        expect(res.body[0]).toHaveProperty('by_user_firstname');
        expect(res.body[0]).toHaveProperty('by_user_lastname');
        expect(res.body[0]).toHaveProperty('of_user_firstname');
        expect(res.body[0]).toHaveProperty('of_user_lastname');
        expect(res.body[0].of_user_id).toEqual(testUser1[0].id);
      });

      test('Get Audit of Test User with Sort', async () => {
        const res = await Travelling.Audit.User.ofuserId(
          testUser1[0].id,
          null,
          null,
          null,
          'action',
          null,
          true,
          null,
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body[0].id).not.toBeNull();
        expect(res.body[0].created_on).not.toBeNull();
        expect(res.body[0].action).not.toBeNull();
        expect(res.body[0].subaction).not.toBeNull();
        expect(res.body[0]).toHaveProperty('by_user_firstname');
        expect(res.body[0]).toHaveProperty('by_user_lastname');
        expect(res.body[0]).toHaveProperty('of_user_firstname');
        expect(res.body[0]).toHaveProperty('of_user_lastname');
        expect(res.body[0].of_user_id).toEqual(testUser1[0].id);
      });

      test('Get Audit of Test User with Sortdir', async () => {
        const res = await Travelling.Audit.User.ofuserId(
          testUser1[0].id,
          null,
          null,
          null,
          'action',
          'ASC',
          true,
          null,
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body[0].id).not.toBeNull();
        expect(res.body[0].created_on).not.toBeNull();
        expect(res.body[0].action.localeCompare(res.body[1].action)).toBeLessThanOrEqual(0);
        expect(res.body[0].subaction).not.toBeNull();
        expect(res.body[0]).toHaveProperty('by_user_firstname');
        expect(res.body[0]).toHaveProperty('by_user_lastname');
        expect(res.body[0]).toHaveProperty('of_user_firstname');
        expect(res.body[0]).toHaveProperty('of_user_lastname');
        expect(res.body[0].of_user_id).toEqual(testUser1[0].id);
      });

      test('Get Audit of Test User with limit', async () => {
        const res = await Travelling.Audit.User.ofuserId(
          testUser1[0].id,
          null,
          1,
          null,
          null,
          null,
          true,
          null,
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(1);
        expect(res.body[0].id).not.toBeNull();
        expect(res.body[0].created_on).not.toBeNull();
        expect(res.body[0].action).not.toBeNull();
        expect(res.body[0].subaction).not.toBeNull();
        expect(res.body[0]).toHaveProperty('by_user_firstname');
        expect(res.body[0]).toHaveProperty('by_user_lastname');
        expect(res.body[0]).toHaveProperty('of_user_firstname');
        expect(res.body[0]).toHaveProperty('of_user_lastname');
        expect(res.body[0].of_user_id).toEqual(testUser1[0].id);
      });

      test('Get Audit of Test User with skip', async () => {
        const res = await Travelling.Audit.User.ofuserId(
          testUser1[0].id,
          null,
          null,
          1000,
          null,
          null,
          true,
          null,
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(0);
      });

      test('Get Audit of Test User with filter (action=EDIT) - With Self Exclusion', async () => {
        // Do an edit to self
        var edit = await Travelling.User.Current.editProperty('testofferson', 'middlename', userContainer.user1Token);

        expect(edit.statusCode).toEqual(200);
        expect(edit.body).toEqual('testofferson');

        // Get all audits by edit
        const res = await Travelling.Audit.User.ofuserId(
          testUser1[0].id,
          'action=EDIT',
          null,
          null,
          null,
          null,
          true,
          null,
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThanOrEqual(8);
        expect(res.body[0].id).not.toBeNull();
        expect(res.body[0].created_on).not.toBeNull();
        expect(res.body[0].action).toEqual('EDIT');
        expect(res.body[0].subaction).not.toBeNull();
        expect(res.body[0]).toHaveProperty('by_user_firstname');
        expect(res.body[0]).toHaveProperty('by_user_lastname');
        expect(res.body[0]).toHaveProperty('of_user_firstname');
        expect(res.body[0]).toHaveProperty('of_user_lastname');
        expect(res.body[0].of_user_id).toEqual(testUser1[0].id);

        // Test with exculding self ID
        const exclusionRes = await Travelling.Audit.User.ofuserId(
          testUser1[0].id,
          'action=EDIT',
          null,
          null,
          null,
          null,
          true,
          true, // exclude self-same id
          userContainer.user1Token
        );

        expect(exclusionRes.statusCode).toEqual(200);
        expect(exclusionRes.body.length).toBeLessThanOrEqual(7);
        expect(exclusionRes.body[0].id).not.toBeNull();
        expect(exclusionRes.body[0].created_on).not.toBeNull();
        expect(exclusionRes.body[0].action).toEqual('EDIT');
        expect(exclusionRes.body[0].subaction).not.toBeNull();
        expect(exclusionRes.body[0]).toHaveProperty('by_user_firstname');
        expect(exclusionRes.body[0]).toHaveProperty('by_user_lastname');
        expect(exclusionRes.body[0]).toHaveProperty('of_user_firstname');
        expect(exclusionRes.body[0]).toHaveProperty('of_user_lastname');
        expect(exclusionRes.body[0].of_user_id).toEqual(testUser1[0].id);
      });

      test('Get Audit of Test User with filter (action=VIEW)', async () => {
        const res = await Travelling.Audit.User.ofuserId(
          testUser1[0].id,
          'action=VIEW',
          null,
          null,
          null,
          null,
          true,
          null,
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body[0].id).not.toBeNull();
        expect(res.body[0].created_on).not.toBeNull();
        expect(res.body[0].action).toEqual('VIEW');
        expect(res.body[0].subaction).not.toBeNull();
        expect(res.body[0]).toHaveProperty('by_user_firstname');
        expect(res.body[0]).toHaveProperty('by_user_lastname');
        expect(res.body[0]).toHaveProperty('of_user_firstname');
        expect(res.body[0]).toHaveProperty('of_user_lastname');
        expect(res.body[0].of_user_id).toEqual(testUser1[0].id);
      });

      test('Get Audit of Test User with filter (within date range)', async () => {
        var yesterday = new Date();
        var tomorrow = new Date();

        yesterday.setDate(yesterday.getDate() - 1);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const res = await Travelling.Audit.User.ofuserId(
          testUser1[0].id,
          `created_on >= ${yesterday.toISOString()}, created_on <= ${tomorrow.toISOString()}`,
          null,
          null,
          null,
          null,
          true,
          null,
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body[0].id).not.toBeNull();
        expect(res.body[0].created_on).not.toBeNull();
        expect(res.body[0].action).not.toBeNull();
        expect(res.body[0].subaction).not.toBeNull();
        expect(res.body[0]).toHaveProperty('by_user_firstname');
        expect(res.body[0]).toHaveProperty('by_user_lastname');
        expect(res.body[0]).toHaveProperty('of_user_firstname');
        expect(res.body[0]).toHaveProperty('of_user_lastname');
        expect(res.body[0].of_user_id).toEqual(testUser1[0].id);
      });

      test('Get Audit of Test User with filter (outside date range)', async () => {
        var yesterday = new Date();
        var tomorrow = new Date();

        yesterday.setDate(yesterday.getDate() - 1);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const res = await Travelling.Audit.User.ofuserId(
          testUser1[0].id,
          `created_on > ${tomorrow.toISOString()}, created_on < ${yesterday.toISOString()}`,
          null,
          null,
          null,
          null,
          true,
          null,
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(0);
      });

      test('Checking Audit of (Edit Test User Email Property [test2])', async () => {
        const u = await User.findAllBy({ username: 'test2' });
        const res = await Travelling.Audit.User.ofuserId(
          u[0].id,
          `action=EDIT,subaction=USER_PROPERTY`,
          null,
          null,
          'created_on',
          'ASC',
          true,
          null,
          userContainer.user1Token
        );

        const audit = res.body;

        expect(audit[0]).toHaveProperty('id');
        expect(audit[0].created_on).not.toBeNull();
        expect(audit[0].prop).toEqual('email');
        expect(audit[0].old_val).toMatch('test2@test.com');
        expect(audit[0].new_val).toMatch('asdf@asdf.memes');

        expect(audit[1]).toHaveProperty('id');
        expect(audit[1].created_on).not.toBeNull();
        expect(audit[1].prop).toEqual('email');
        expect(audit[1].old_val).toMatch('asdf@asdf.memes');
        expect(audit[1].new_val).toMatch('test2@test.com');

        expect(audit[2]).toHaveProperty('id');
        expect(audit[2].created_on).not.toBeNull();
        expect(audit[2].prop).toEqual('email');
        expect(audit[2].old_val).toMatch('test2@test.com');
        expect(audit[2].new_val).toMatch('asdfa@fd.foo');

        expect(audit[3]).toHaveProperty('id');
        expect(audit[3].created_on).not.toBeNull();
        expect(audit[3].prop).toEqual('user_data');
        expect(audit[3].old_val).toBeNull();
        expect(audit[3].new_val).toMatch('{"test":1,"foo":"bar"}');

        expect(audit[4]).toHaveProperty('id');
        expect(audit[4].created_on).not.toBeNull();
        expect(audit[4].prop).toEqual('user_data');
        expect(audit[4].old_val).toMatch('{"test":1,"foo":"bar"}');
        expect(audit[4].new_val).toMatch('{"notes":"notey totey"}');
      });
    });

    describe('Invalid', () => {
      test('Get Audit ByUser - Non-existent User ID', async () => {
        const res = await Travelling.Audit.User.byuserId(
          '69696969-a145-41b6-b892-a52bd3ad3e11', // fake
          null,
          null,
          null,
          null,
          null,
          true,
          null,
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(0);
      });

      test('Get Audit ByUser - Invalid User UUID', async () => {
        const res = await Travelling.Audit.User.byuserId(
          'fakeAF',
          null,
          null,
          null,
          null,
          null,
          true,
          null,
          userContainer.user1Token
        );

        expect(res.body).toHaveProperty('msg', 'Please provide a valid uuid.');
        expect(res.body).toHaveProperty('type', 'validation-error');
        expect(res.statusCode).toEqual(400);
      });

      test('Get Audit OfUser - Non-Existent User', async () => {
        const res = await Travelling.Audit.User.ofuserId(
          '69696969-a145-41b6-b892-a52bd3ad3e11', // fake
          null,
          null,
          null,
          null,
          null,
          true,
          null,
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(0);
      });

      test('Get Audit OfUser - Invalid User UUID', async () => {
        const res = await Travelling.Audit.User.ofuserId(
          'UnrealAF',
          null,
          null,
          null,
          null,
          null,
          true,
          null,
          userContainer.user1Token
        );

        expect(res.body).toHaveProperty('msg', 'Please provide a valid uuid.');
        expect(res.body).toHaveProperty('type', 'validation-error');
        expect(res.statusCode).toEqual(400);
      });

      test('Get Audit ByUser - Missing User ID', async () => {
        const res = await Travelling.Audit.User.byuserId('', null, null, null, null, null, true, null, userContainer.user1Token);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('msg', 'Please provide a valid uuid.');
        expect(res.body).toHaveProperty('type', 'validation-error');
      });

      test('Get Audit OfUser - Missing User Id', async () => {
        const res = await Travelling.Audit.User.ofuserId('', null, null, null, null, null, true, null, userContainer.user1Token);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('msg', 'Please provide a valid uuid.');
        expect(res.body).toHaveProperty('type', 'validation-error');
      });

      test('Get Audit ByUser - Invalid Skip Param', async () => {
        const res = await Travelling.Audit.User.byuserId(
          testUser1[0].id,
          null,
          null,
          'NaN008',
          null,
          null,
          true,
          null,
          userContainer.user1Token
        );

        expect(res.statusCode).toEqual(400);
        expect(res.body.type).toEqual('audit-filter-error');
      });
    });
  }
};
