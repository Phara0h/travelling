const config = require('./config');
const regex = require('./regex');
const User = require('../database/models/user');

var checkVaildUser = async function(user, checkDupe = true) {
  
  if (!user) {
      return {
          type: 'body-error',
          msg: 'No body sent with request)',
      };
  }

  if (user.username && regex.username.exec(user.username.toLowerCase()) == null) {
      return {
          type: 'username-error',
          msg: `Minimum ${config.password.minchar} characters and only have these characters (A-Z, a-z, 0-9, _)`,
      };
  }

  if (user.email && regex.email.exec(user.email.toLowerCase()) == null) {
      return {
          type: 'email-error',
          msg: 'Must be a real email. (Used only for password recovery)',
      }
  }

  if (user.password && (regex.password.exec(user.password) == null || user.password.indexOf(user.username) > -1 || user.password.indexOf(user.email) > -1)) {
      return {
          type: 'password-error',
          msg: 'Minimum ' + config.password.minchar + ' characters '
              + (config.password.consecutive ? '' : 'with no consecutive characters')
              + ', max of ' + config.password.maxchar + ' and at least '
              + config.password.number + ' Number, '
              + config.password.lowercase + ' lowercase, '
              + config.password.uppercase + ' uppercase and '
              + config.password.special + 'special character/s. '
              + 'Must not contain username or email.'
      };
  }

  if (user.avatar && regex.base64Image.exec(user.avatar) == null) {
    return {
        type: 'avatar-error',
        msg: 'Must be a vaild base64 image.',
    }
  }

  if (user.user_data) {
    try {
      user.user_data = JSON.stringify(user.user_data);
    } catch (e) {
      return {
          type: 'user-data-error',
          msg: 'Must be a vaild json.',
      }
    }
  }

  if(checkDupe) {
      var found = await User.findLimtedBy({email:user.email, username: user.username}, 'OR', 1);
      if(found && found.length > 0) {
        return {
            type: 'exists-error',
            msg: 'Username or email already exists',
        }
      }
  }

  return true;
}

var setUser = function(user, props) {

  if(props.username) {
    user.username = props.username;
  }

  if(props.password) {
    user.password = props.password;
  }

  if(props.email) {
    user.email = props.email;
  }

  if(props.locked_reason) {
    user.locked_reason = props.locked_reason;
  }

  if(props.locked) {
    user.locked = props.locked === true;
    if(!user.locked) {
      user.failed_login_attempts = 0;
    }
  }

  if(props.group_id) {
    user.group_id = Number(props.group_id);
  }

  if(props.change_password) {
    user.change_password = props.change_password === true;
  }

  if(props.change_username) {
    user.change_username = props.change_username === true;
  }

  /**
    @TODO add image manipulation and checking
  */
  if(props.avatar) {
    user.avatar = Buffer.from(props.avatar);
  }

  if(props.user_data) {
    user.user_data = Buffer.from(props.user_data);
  }

  if(props.user_data === null) {
    user.user_data = null;
  }

  /**
  @TODO add eprofile
  */
  if(props.eprofile) {}

  return user;
}


module.exports = {
  checkVaildUser,
  setUser
}
