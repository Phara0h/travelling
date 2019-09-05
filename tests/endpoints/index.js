module.exports = () => {
  describe('Auth', () =>{
      describe('Register', require('./auth-register.js'))
      describe('Login', require('./auth-login.js'))
      describe('Session', require('./auth-session.js'))
  });
  describe('User', () =>{
      describe('Get', require('./user-get.js'))
  });
  describe('Groups', require('./groups.js'));
};
