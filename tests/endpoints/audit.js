const config = require('../../include/utils/config');
const User = require('../../include/database/models/user');
const { Travelling } = require('../../sdk/node')('http://127.0.0.1:6969/' + config.serviceName, {
    resolveWithFullResponse: true
});
var userContainer = require('../include/UserContainer.js');

module.exports = () => {
    describe('Valid ByUser', () => {
        var testUser1;

        test('Get Audit by Test User (No Query Params)', async () => {
            testUser1 = await User.findAllBy({ username: 'test' });

            const res = await Travelling.Audit.User.byuserId(
                testUser1[0].id,
                null,
                null,
                null,
                null,
                null,
                userContainer.user1Token
            );

            expect(res.statusCode).toEqual(200);
            expect(res.body[0].id).not.toBeNull();
            expect(res.body[0].created_on).not.toBeNull();
            expect(res.body[0].action).not.toBeNull();
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
                userContainer.user1Token
            );

            expect(res.statusCode).toEqual(200);
            expect(res.body[0].id).not.toBeNull();
            expect(res.body[0].created_on).not.toBeNull();
            expect(res.body[0].action).not.toBeNull();
            expect(res.body[0].subaction).not.toBeNull();
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
                userContainer.user1Token
            );

            expect(res.statusCode).toEqual(200);
            expect(res.body[0].id).not.toBeNull();
            expect(res.body[0].created_on).not.toBeNull();
            expect(res.body[0].action.localeCompare(res.body[1].action)).toBeLessThanOrEqual(0);
            expect(res.body[0].subaction).not.toBeNull();
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
                userContainer.user1Token
            );

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(1);
            expect(res.body[0].id).not.toBeNull();
            expect(res.body[0].created_on).not.toBeNull();
            expect(res.body[0].action).not.toBeNull();
            expect(res.body[0].subaction).not.toBeNull();
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
                userContainer.user1Token
            );

            expect(res.statusCode).toEqual(200);
            expect(res.body[0].id).not.toBeNull();
            expect(res.body[0].created_on).not.toBeNull();
            expect(res.body[0].action).toEqual('EDIT');
            expect(res.body[0].subaction).not.toBeNull();
            expect(res.body[0].by_user_id).toEqual(testUser1[0].id);
        });

        test('Get Audit by Test User with filter (within date range)', async () => {
            var yesterday = new Date()
            var tomorrow = new Date()
            yesterday.setDate(yesterday.getDate() - 1);
            tomorrow.setDate(tomorrow.getDate() + 1);
   
            const res = await Travelling.Audit.User.byuserId(
                testUser1[0].id,
                `created_on >= ${yesterday.toISOString()}, created_on <= ${tomorrow.toISOString()}`,
                null,
                null,
                null,
                null,
                userContainer.user1Token
            );

            expect(res.statusCode).toEqual(200);
            expect(res.body[0].id).not.toBeNull();
            expect(res.body[0].created_on).not.toBeNull();
            expect(res.body[0].action).not.toBeNull();
            expect(res.body[0].subaction).not.toBeNull();
            expect(res.body[0].by_user_id).toEqual(testUser1[0].id);
        });

        test('Get Audit by Test User with filter (outside date range)', async () => {
            var yesterday = new Date()
            var tomorrow = new Date()
            yesterday.setDate(yesterday.getDate() - 1);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const res = await Travelling.Audit.User.byuserId(
                testUser1[0].id,
                `created_on > ${tomorrow.toISOString()}, created_on < ${yesterday.toISOString()}`,
                null,
                null,
                null,
                null,
                userContainer.user1Token
            );

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(0);
        });
    });


    describe('Valid OfUser', async () => {
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
                userContainer.user1Token
            );

            expect(res.statusCode).toEqual(200);
            expect(res.body[0].id).not.toBeNull();
            expect(res.body[0].created_on).not.toBeNull();
            expect(res.body[0].action).not.toBeNull();
            expect(res.body[0].subaction).not.toBeNull();
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
                userContainer.user1Token
            );

            expect(res.statusCode).toEqual(200);
            expect(res.body[0].id).not.toBeNull();
            expect(res.body[0].created_on).not.toBeNull();
            expect(res.body[0].action).not.toBeNull();
            expect(res.body[0].subaction).not.toBeNull();
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
                userContainer.user1Token
            );

            expect(res.statusCode).toEqual(200);
            expect(res.body[0].id).not.toBeNull();
            expect(res.body[0].created_on).not.toBeNull();
            expect(res.body[0].action.localeCompare(res.body[1].action)).toBeLessThanOrEqual(0);
            expect(res.body[0].subaction).not.toBeNull();
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
                userContainer.user1Token
            );

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(1);
            expect(res.body[0].id).not.toBeNull();
            expect(res.body[0].created_on).not.toBeNull();
            expect(res.body[0].action).not.toBeNull();
            expect(res.body[0].subaction).not.toBeNull();
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
                userContainer.user1Token
            );

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(0);
        });

        test('Get Audit of Test User with filter (action=EDIT)', async () => {
            const res = await Travelling.Audit.User.ofuserId(
                testUser1[0].id,
                'action=EDIT',
                null,
                null,
                null,
                null,
                userContainer.user1Token
            );

            expect(res.statusCode).toEqual(200);
            expect(res.body[0].id).not.toBeNull();
            expect(res.body[0].created_on).not.toBeNull();
            expect(res.body[0].action).toEqual('EDIT');
            expect(res.body[0].subaction).not.toBeNull();
            expect(res.body[0].of_user_id).toEqual(testUser1[0].id);
        });

        test('Get Audit of Test User with filter (within date range)', async () => {
            var yesterday = new Date()
            var tomorrow = new Date()
            yesterday.setDate(yesterday.getDate() - 1);
            tomorrow.setDate(tomorrow.getDate() + 1);
  
            const res = await Travelling.Audit.User.ofuserId(
                testUser1[0].id,
                `created_on >= ${yesterday.toISOString()}, created_on <= ${tomorrow.toISOString()}`,
                null,
                null,
                null,
                null,
                userContainer.user1Token
            );

            expect(res.statusCode).toEqual(200);
            expect(res.body[0].id).not.toBeNull();
            expect(res.body[0].created_on).not.toBeNull();
            expect(res.body[0].action).not.toBeNull();
            expect(res.body[0].subaction).not.toBeNull();
            expect(res.body[0].of_user_id).toEqual(testUser1[0].id);
        });

        test('Get Audit of Test User with filter (outside date range)', async () => {
            var yesterday = new Date()
            var tomorrow = new Date()
            yesterday.setDate(yesterday.getDate() - 1);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const res = await Travelling.Audit.User.ofuserId(
                testUser1[0].id,
                `created_on > ${tomorrow.toISOString()}, created_on < ${yesterday.toISOString()}`,
                null,
                null,
                null,
                null,
                userContainer.user1Token
            );

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(0);
        });
    });


    describe('Invalid', async () => {
        test('Get Audit ByUser with non-existent user id', async () => {
            const res = await Travelling.Audit.User.byuserId(
                'fakeAF',
                null,
                null,
                null,
                null,
                null,
                userContainer.user1Token
            );

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(0);
        });

        test('Get Audit OfUser with non-existent user id', async () => {
            const res = await Travelling.Audit.User.ofuserId(
                'UnrealAF',
                null,
                null,
                null,
                null,
                null,
                userContainer.user1Token
            );

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(0);
        });

        test('Get Audit ByUser with missing user id', async () => {
            const res = await Travelling.Audit.User.byuserId(
                '',
                null,
                null,
                null,
                null,
                null,
                userContainer.user1Token
            );

            expect(res.statusCode).toEqual(400);
            expect(res.body.type).toEqual('missing-param-error');
        });

        test('Get Audit OfUser with missing user id', async () => {
            const res = await Travelling.Audit.User.ofuserId(
                '',
                null,
                null,
                null,
                null,
                null,
                userContainer.user1Token
            );

            expect(res.statusCode).toEqual(400);
            expect(res.body.type).toEqual('missing-param-error');
        });

        test('Get Audit ByUser with invalid skip param', async () => {
            const res = await Travelling.Audit.User.byuserId(
                null,
                null,
                null,
                'NaN008',
                null,
                null,
                userContainer.user1Token
            );

            expect(res.statusCode).toEqual(400);
            expect(res.body.type).toEqual('audit-filter-error');
        });
    });
};
