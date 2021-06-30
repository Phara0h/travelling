const config = require('../../include/utils/config');
const Audit = require('../../include/database/models/audit');
const User = require('../../include/database/models/user');
const { Travelling } = require('../../sdk/node')('http://127.0.0.1:6969/' + config.serviceName, {
  resolveWithFullResponse: true
});

module.exports = () => {
  describe('Valid', () => {
    test('Create Test User [test]', async () => {
      await Travelling.healthCheck();

      var res = await Travelling.Auth.register({
        username: 'test',
        password: 'Pas5w0r!d',
        email: 'test@test.com',
        group_request: 'testgroup'
      });

      expect(res.statusCode).toEqual(200);
    });

    test('Create Test User [test2] and verify audit', async () => {
      var res = await Travelling.Auth.register({
        username: 'test2',
        password: 'Pas5w0r!d2',
        email: 'test2@test.com'
      });

      expect(res.statusCode).toEqual(200);

      const u = await User.findAllBy({ email: 'test2@test.com' });
      const audit = await Audit.findAllBy({ of_user_id: u[0].id, action: "CREATE", subaction: "USER" });

      expect(audit[0]).toHaveProperty('id');
      expect(audit[0].created_on).not.toBeNull();
      expect(audit[0].action).toEqual('CREATE');
      expect(audit[0].subaction).toEqual('USER');
    });

    test('Create Test User [test3] Manual Activation Request Group Type Test', async () => {
      config.registration.requireManualActivation = true;
      var res = await Travelling.Auth.register({
        username: 'test3',
        password: 'Pas5w0r!d3',
        email: 'test3@test.com'
      });

      config.registration.requireManualActivation = false;
      expect(res.statusCode).toEqual(200);
    });

    test('Create Test User [test4] Email Activation', async () => {
      config.registration.requireEmailActivation = true;
      var res = await Travelling.Auth.register({
        username: 'test4',
        password: 'Pas5w0r!d4',
        email: 'test4@test.com'
      });

      config.registration.requireEmailActivation = false;

      expect(res.statusCode).toEqual(200);
    });

    test('Create Test User [test_domain_1]', async () => {
      var res = await Travelling.Auth.Domain.register({
        username: 'test_domain_1',
        password: 'Pas5w0r!d',
        email: 'test_domain_1@test.com'
      }, 'test.com');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual('Account Created')
    });

    test('Create Test User [test_domain_2]', async () => {
      var res = await Travelling.Auth.Domain.register({
        username: 'test_domain_2',
        password: 'Pas5w0r!d',
        email: 'test_domain_2@test.com'
      }, 'test.com');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual('Account Created')
    });

    test('Create Test User [test_domain_3] Gets deleted in user-edit', async () => {
      var res = await Travelling.Auth.Domain.register({
        username: 'test_domain_3',
        password: 'Pas5w0r!d',
        email: 'test_domain_3@test.com'
      }, 'test.com');

      expect(res.statusCode).toEqual(200);
    });

    test('Create Test User [test_domain_4] login remember [false]', async () => {
      var res = await Travelling.Auth.Domain.register({
        username: 'test_domain_4',
        password: 'Pas5w0r!d',
        email: 'test_domain_4@test.com'
      }, 'test.com');

      expect(res.statusCode).toEqual(200);
    });

  });

  describe('Invalid', () => {
    test('No Body', async () => {
      var res = await Travelling.Auth.register({});

      expect(res.statusCode).toEqual(400);
    });

    test('Username Short', async () => {
      var res = await Travelling.Auth.register({
        username: '1',
        password: 'Pas5w0r!d',
        email: 'test1@test.com'
      });

      expect(res.statusCode).toEqual(400);
    });

    test('Username Invalid Characters', async () => {
      var res = await Travelling.Auth.register({
        username: '$w@g',
        password: 'Pas5w0r!d',
        email: 'test1@test.com'
      });

      expect(res.statusCode).toEqual(400);
    });

    test('Duplicate Username', async () => {
      var res = await Travelling.Auth.register({
        username: 'test',
        password: 'Pas5w0r!d',
        email: 'test1@test.com'
      });

      expect(res.statusCode).toEqual(400);
    });

    test('No Username', async () => {
      var res = await Travelling.Auth.register({
        password: 'Pas5w0r!d',
        email: 'test1@test.com'
      });

      expect(res.statusCode).toEqual(400);
    });

    test('Email Invalid Characters', async () => {
      var res = await Travelling.Auth.register({
        username: 'test1',
        password: 'Pas5w0r!d',
        email: 'test.test.com'
      });

      expect(res.statusCode).toEqual(400);
    });

    test('Duplicate Email', async () => {
      var res = await Travelling.Auth.register({
        username: 'test1',
        password: 'Pas5w0r!d',
        email: 'test@test.com'
      });

      expect(res.statusCode).toEqual(400);
    });

    test('No Email', async () => {
      var res = await Travelling.Auth.register({
        username: 'test1',
        password: 'Pas5w0r!d'
      });

      expect(res.statusCode).toEqual(400);
    });

    test('Password Consecutive Characters', async () => {
      var res = await Travelling.Auth.register({
        username: 'test1',
        password: 'Password1!',
        email: 'test1@test.com'
      });

      expect(res.statusCode).toEqual(400);
    });

    test('Password Short', async () => {
      var res = await Travelling.Auth.register({
        username: 'test1',
        password: 'P@5z',
        email: 'test1@test.com'
      });

      expect(res.statusCode).toEqual(400);
    });

    test('No Special Characters', async () => {
      var res = await Travelling.Auth.register({
        username: 'test1',
        password: 'Pas5word1',
        email: 'test1@test.com'
      });

      expect(res.statusCode).toEqual(400);
    });

    test('No Number Characters', async () => {
      var res = await Travelling.Auth.register({
        username: 'test1',
        password: 'Pascworda!',
        email: 'test1@test.com'
      });

      expect(res.statusCode).toEqual(400);
    });

    test('No Lowercase Characters', async () => {
      var res = await Travelling.Auth.register({
        username: 'test1',
        password: 'IMAMADBOI420!',
        email: 'test1@test.com'
      });

      expect(res.statusCode).toEqual(400);
    });

    test('No Uppercase Characters', async () => {
      var res = await Travelling.Auth.register({
        username: 'test1',
        password: 'pas5w0r!d',
        email: 'test1@test.com'
      });

      expect(res.statusCode).toEqual(400);
    });

    test('Passowrd Containing Username', async () => {
      var res = await Travelling.Auth.register({
        username: 'test1',
        password: 'imsneekytest1Pas5w0r!dlol',
        email: 'test1@test.com'
      });

      expect(res.statusCode).toEqual(400);
    });

    test('Passowrd Containing Email', async () => {
      var res = await Travelling.Auth.register({
        username: 'test1',
        password: 'test1@test.com4Ca!',
        email: 'test1@test.com'
      });

      expect(res.statusCode).toEqual(400);
    });

    test('No Password', async () => {
      var res = await Travelling.Auth.register({
        username: 'test1',
        email: 'test1@test.com'
      });

      expect(res.statusCode).toEqual(400);
    });
  });
};
