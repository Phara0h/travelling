const config = require('../../utils/config');
const regex = {
  email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  username: /^[A-Za-z0-9_.]{4,}$/,
  password: new RegExp('^' + (config.password.consecutive ? '' : '(?!.*(.)\\1{1})') +
        '(?=(.*[\\d]){' + config.password.number + ',})(?=(.*[a-z]){' +
        config.password.lowercase +
        ',})(?=(.*[A-Z]){' +
        config.password.uppercase +
        ',})(?=(.*[@#$%!]){' +
        config.password.special +
        ',})(?:[\\da-zA-Z@#$%!\\^\\&\\*\\(\\)]){' +
        config.password.minchar +
        ',' +
        config.password.maxchar +
        '}$'),
}

module.exports = function (app, opts, done) {

  app.post('/auth/login',(req, res) =>{

  })

  app.get('/auth/logout',(req, res) =>{

  })

  app.post('/auth/register',(req, res) =>{

    if(!req.body)
    {
      res.code(400).send({
        type: 'body-register-error',
        msg: 'No body sent with request)'
      })
    }

    var username = req.body.username.toLowerCase();
    var password = req.body.password;
    var email = req.body.email.toLowerCase();

    if (regex.username.exec(username) == null)
    {
     res.code(400).send(
      {
        type: 'username-register-error',
        msg: `Minimum ${config.password.minchar} characters and only have these characters (A-Z, a-z, 0-9, _)`
      });
    }
    else if (regex.password.exec(password) == null)
    {
      (config.password.consecutive ? '' : '(?!.*(.)\\1{1})') +
      '(?=(.*[\\d]){' + config.password.number + ',})(?=(.*[a-z]){' +
        config.password.lowercase +
        ',})(?=(.*[A-Z]){' +
        config.password.uppercase +
        ',})(?=(.*[@#$%!]){' +
        config.password.special +
        ',})(?:[\\da-zA-Z@#$%!]){' +
        config.password.minchar +
        ',' +
        config.password.maxchar;

      res.code(400).send(
      {
        type: 'password-register-error',
        msg: 'Minimum ' + config.password.minchar + ' characters ' + (config.password.consecutive ? '' : 'with no consecutive characters') + ', max of ' +
          config.password.maxchar + ' and at least ' + config.password.number +
          ' Number, ' + config.password.lowercase + ' lowercase, ' +
          config.password.uppercase + ' uppercase and ' + config.password.special + 'special character/s. '
      });
    }
    else if (regex.email.exec(email) == null)
    {
      res.code(400).send(
      {
        type: 'email-register-error',
        msg: 'Must be a real email. (Used only for password recovery)'
      });
    }
    else
    {

      res.code(200).send(
        {
          msg: 'swag'
        });


    }
  })

  done()
}
