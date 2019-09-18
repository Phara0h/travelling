const config = require('../../include/utils/config');
const Travelling = require('../../sdk')('https://127.0.0.1:6969');
var userContainer = require('../include/UserContainer.js');
module.exports = () => {

    describe('Vaild', () => {

        test('Create Test User [test]', async () => {
            var res = await Travelling.Auth.register({
                username: 'test',
                password: 'Pas5w0r!d',
                email: 'test@test.com',
            });
            expect(res.statusCode).toEqual(200);
        });

        test('Create Test User [test2]', async () => {
            var res = await Travelling.Auth.register({
                username: 'test2',
                password: 'Pas5w0r!d2',
                email: 'test2@test.com',
            });
            expect(res.statusCode).toEqual(200);
        });

        test('Create Test User [test3] Manual Activaation', async () => {
            config.registration.requireManualActivation = true;
            var res = await Travelling.Auth.register({
                username: 'test3',
                password: 'Pas5w0r!d3',
                email: 'test3@test.com',
            });
            config.registration.requireManualActivation = false;
            expect(res.statusCode).toEqual(200);

        });

        test('Create Test User [test4] Email Activaation', async () => {
            config.registration.requireEmailActivation = true;
            var res = await Travelling.Auth.register({
                username: 'test4',
                password: 'Pas5w0r!d4',
                email: 'test4@test.com',
            });
            config.registration.requireEmailActivation = false;

            expect(res.statusCode).toEqual(200);
        });

    });

    describe('Invaild', () => {

        test('No Body', async () => {
            var res = await Travelling.Auth.register({
            });

            expect(res.statusCode).toEqual(400);
        });

        test('Username Short', async () => {
            var res = await Travelling.Auth.register({
                username: '1',
                password: 'Pas5w0r!d',
                email: 'test1@test.com',
            });

            expect(res.statusCode).toEqual(400);
        });

        test('Username Invaild Characters', async () => {
            var res = await Travelling.Auth.register({
                username: '$w@g',
                password: 'Pas5w0r!d',
                email: 'test1@test.com',
            });

            expect(res.statusCode).toEqual(400);
        });

        test('Duplicate Username', async () => {
            var res = await Travelling.Auth.register({
                username: 'test',
                password: 'Pas5w0r!d',
                email: 'test1@test.com',
            });

            expect(res.statusCode).toEqual(400);
        });

        test('No Username', async () => {
            var res = await Travelling.Auth.register({
                password: 'Pas5w0r!d',
                email: 'test1@test.com',
            });

            expect(res.statusCode).toEqual(400);
        });

        test('Email Invaild Characters', async () => {
            var res = await Travelling.Auth.register({
                username: 'test1',
                password: 'Pas5w0r!d',
                email: 'test.test.com',
            });

            expect(res.statusCode).toEqual(400);
        });

        test('Duplicate Email', async () => {
            var res = await Travelling.Auth.register({
                username: 'test1',
                password: 'Pas5w0r!d',
                email: 'test@test.com',
            });

            expect(res.statusCode).toEqual(400);
        });

        test('No Email', async () => {
            var res = await Travelling.Auth.register({
                username: 'test1',
                password: 'Pas5w0r!d',
            });

            expect(res.statusCode).toEqual(400);
        });

        test('Password Consecutive Characters', async () => {
            var res = await Travelling.Auth.register({
                username: 'test1',
                password: 'Password1!',
                email: 'test1@test.com',
            });

            expect(res.statusCode).toEqual(400);
        });

        test('Password Short', async () => {
            var res = await Travelling.Auth.register({
                username: 'test1',
                password: 'P@5z',
                email: 'test1@test.com',
            });

            expect(res.statusCode).toEqual(400);
        });

        test('No Special Characters', async () => {
            var res = await Travelling.Auth.register({
                username: 'test1',
                password: 'Pas5word1',
                email: 'test1@test.com',
            });

            expect(res.statusCode).toEqual(400);
        });

        test('No Number Characters', async () => {
            var res = await Travelling.Auth.register({
                username: 'test1',
                password: 'Pascworda!',
                email: 'test1@test.com',
            });

            expect(res.statusCode).toEqual(400);
        });

        test('No Lowercase Characters', async () => {
            var res = await Travelling.Auth.register({
                username: 'test1',
                password: 'IMAMADBOI420!',
                email: 'test1@test.com',
            });

            expect(res.statusCode).toEqual(400);
        });

        test('No Uppercase Characters', async () => {
            var res = await Travelling.Auth.register({
                username: 'test1',
                password: 'pas5w0r!d',
                email: 'test1@test.com',
            });

            expect(res.statusCode).toEqual(400);
        });

        test('Passowrd Containing Username', async () => {
            var res = await Travelling.Auth.register({
                username: 'test1',
                password: 'imsneekytest1Pas5w0r!dlol',
                email: 'test1@test.com',
            });

            expect(res.statusCode).toEqual(400);
        });

        test('Passowrd Containing Email', async () => {
            var res = await Travelling.Auth.register({
                username: 'test1',
                password: 'test1@test.com4Ca!',
                email: 'test1@test.com',
            });

            expect(res.statusCode).toEqual(400);
        });

        test('No Password', async () => {
            var res = await Travelling.Auth.register({
                username: 'test1',
                email: 'test1@test.com',
            });

            expect(res.statusCode).toEqual(400);
        });

    });
};
