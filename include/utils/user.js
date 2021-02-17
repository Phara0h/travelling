const config = require('./config');
const misc = require('./misc');
const regex = require('./regex');
const User = require('../database/models/user');

module.exports = {
  checkValidUser: async function checkValidUser(user, checkDupe = true) {
    if (!user) {
      return {
        type: 'body-error',
        msg: 'No body sent with request)'
      };
    }

    if (user.username && regex.username.exec(user.username.toLowerCase()) == null) {
      return {
        type: 'username-error',
        msg: `Minimum ${config.user.username.minchar} characters and only have these characters (A-Z, a-z, 0-9, _)`
      };
    }

    if (user.email && regex.email.exec(user.email.toLowerCase()) == null) {
      return {
        type: 'email-error',
        msg: 'Must be a real email. (Used only for password recovery)'
      };
    }

    if (
      user.password &&
      (regex.password.exec(user.password) == null ||
        user.password.indexOf(user.username) > -1 ||
        user.password.indexOf(user.email) > -1)
    ) {
      return {
        type: 'password-error',
        msg:
          'Minimum ' +
          config.password.minchar +
          ' characters ' +
          (config.password.consecutive ? '' : 'with no consecutive characters') +
          ', max of ' +
          config.password.maxchar +
          ' and at least ' +
          config.password.number +
          ' Number, ' +
          config.password.lowercase +
          ' lowercase, ' +
          config.password.uppercase +
          ' uppercase and ' +
          config.password.special +
          'special character/s. ' +
          'Must not contain username or email.'
      };
    }

    if (user.avatar && regex.base64Image.exec(user.avatar) == null) {
      return {
        type: 'avatar-error',
        msg: 'Must be a valid base64 image.'
      };
    }

    if (user.group_request && regex.safeName.exec(user.group_request) == null) {
      return {
        type: 'group-request-error',
        msg: 'Invalid group name.'
      };
    }

    if (user.group_ids) {
      for (var i = 0; i < user.group_ids.length; i++) {
        if (regex.uuidv4.exec(user.group_ids[i]) == null) {
          return {
            type: 'group-id-error',
            msg: 'Group id contain invalid characters.'
          };
        }
      }
    }

    if (user.user_data) {
      try {
        user.user_data = JSON.stringify(user.user_data);
      } catch (e) {
        return {
          type: 'user-data-error',
          msg: 'Must be a valid json.'
        };
      }
    }

    if (checkDupe) {
      var qProps = [{ email: user.email }];
      var qOps = [config.user.username.enabled ? 'OR' : 'AND'];

      if (config.user.username.enabled && user.username) {
        qProps.push({ username: user.username });
        qOps.push('OR');
      }
      if (config.user.isolateByDomain && user.domain) {
        qProps.push({ domain: user.domain });
        qOps.push('AND');
      }

      var found = await User.findLimtedBy(qProps.length == 1 ? qProps[0] : qProps, qOps.length == 1 ? qOps[0] : qOps, 1);

      //console.log(user, qProps, qOps, found);
      if (found && found.length > 0) {
        return {
          type: 'exists-error',
          msg: 'Username or email already exists'
        };
      }
    }

    return true;
  },

  setUser: function setUser(user, props) {
    if (props.username && config.user.username.enabled) {
      user.username = props.username.toLowerCase();
    }
    if (props.domain) {
      user.domain = props.domain.toLowerCase() || 'default';
    }

    if (props.password) {
      user.password = props.password;
    }

    if (props.email) {
      user.email = props.email.toLowerCase();
    }

    if (props.locked_reason !== undefined) {
      user.locked_reason = props.locked_reason;
    }

    if (props.locked !== undefined) {
      user.locked = misc.stringToBool(props.locked) === true;
      if (!user.locked) {
        user.failed_login_attempts = 0;
      }
    }

    if (props.group_ids) {
      user.group_ids = props.group_ids;
    }

    if (props.group_request !== undefined) {
      user.group_request = props.group_request ? props.group_request.toLowerCase() : null;
    }

    if (props.change_password !== undefined) {
      user.change_password = misc.stringToBool(props.change_password) === true;
    }

    if (props.change_username !== undefined) {
      user.change_username = misc.stringToBool(props.change_username) === true;
    }

    /**
        @TODO add image manipulation and checking
      */
    if (props.avatar !== undefined) {
      user.avatar = props.avatar ? Buffer.from(props.avatar) : null;
    }

    if (props.user_data !== undefined) {
      user.user_data = props.user_data ? Buffer.from(props.user_data) : null;
    }

    if (props.user_data === null) {
      user.user_data = null;
    }

    /**
      @TODO add eprofile
      */
    if (props.eprofile) {
    }

    return user;
  }
};
