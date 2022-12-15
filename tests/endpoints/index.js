module.exports = () => {
  describe('Auth', () => {
    describe('Register', require('./auth-register.js'));
    describe('Login', require('./auth-login.js'));
    describe('Session', require('./auth-session.js'));
    describe('OAuth2', require('./auth-oauth2.js'));
  });

  describe('Groups', require('./groups.js'));

  describe('User', () => {
    describe('Get', require('./user-get.js'));
    describe('Edit', require('./user-edit.js'));
  });

  describe('Users', () => {
    describe('Get', require('./users-get.js'));
  });

  describe('Audit', require('./audit.js'));

  describe('Misc', () => {
    describe('Server', require('./misc.js'));
  });
};
