const config = require('./config');
const misc = require('./misc');
const regex = require('./regex');
const Fasquest = require('fasquest');
const User = require('../database/models/user');
const EmailUtils = require('./email');
const userSchema = new User()._defaultModel;
const { getByZip, validZip, validState } = require('zcs').zcs({});
const utilsUser = {
  checkValidUser: async function checkValidUser(user, validateEmail = true) {
    if (!user) {
      return {
        type: 'body-error',
        msg: 'No body sent with request'
      };
    }

    if (user.username && regex.username.exec(user.username.toLowerCase()) == null) {
      return {
        type: 'username-error',
        msg: `Minimum ${config.user.username.minchar} characters and only have these characters (A-Z, a-z, 0-9, _)`
      };
    }

    if (user.email) {
      const emailError = {
        type: 'email-error',
        msg: 'Must be a real email'
      };

      if (validateEmail) {
        user.email = user.email.toLowerCase();

        if (config.email.validation.external.enable) {
          try {
            await Fasquest.request({
              method: config.email.validation.external.method,
              uri:
                config.email.validation.external.endpoint +
                (config.email.validation.external.emailInEndpoint ? user.email : ''),
              body: config.email.validation.external.emailInBody ? user.email : null,
              resolveWithFullResponse: true
            });
          } catch (error) {
            return emailError;
          }
        } else if (regex.email.exec(user.email.toLowerCase()) == null) {
          return emailError;
        }

        if (user.email.includes('@gmail.com') && config.email.validation.internal.dedupeGmail) {
          user.email = EmailUtils.dedupeGmail(user.email);
        }
      }
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

    if (user.gender && (user.gender.length > 50 || regex.safeName.exec(user.gender) == null)) {
      return {
        type: 'gender-error',
        msg: 'Must be a valid gender (less than 50 char and safe chars)'
      };
    }

    if (user.firstname && (user.firstname.length > 100 || regex.safeName.exec(user.firstname) == null)) {
      return {
        type: 'firstname-error',
        msg: 'Must be a valid firstname'
      };
    }

    if (user.middlename && (user.middlename.length > 100 || regex.safeName.exec(user.middlename) == null)) {
      return {
        type: 'middlename-error',
        msg: 'Must be a valid middlename'
      };
    }

    if (user.lastname && (user.lastname.length > 100 || regex.safeName.exec(user.lastname) == null)) {
      return {
        type: 'lastname-error',
        msg: 'Must be a valid lastname'
      };
    }

    if (user.dob && isNaN(Date.parse(user.dob))) {
      return {
        type: 'dob-error',
        msg: 'Must be a valid date of birth'
      };
    }

    if (user.phone && (isNaN(Number(user.phone)) || user.phone.length != 10)) {
      return {
        type: 'phone-error',
        msg: 'Must be a valid phone'
      };
    }

    if (user.avatar && regex.base64Image.exec(user.avatar) == null) {
      return {
        type: 'avatar-error',
        msg: 'Must be a valid base64 image.'
      };
    }

    if (user.state && !validState(user.state)) {
      return {
        type: 'state-request-error',
        msg: 'Invalid state.'
      };
    }

    //// Might be to restrictive
    // if (user.city && !usa.cities[user.city.toUpperCase()]) {
    //   return {
    //     type: 'city-request-error',
    //     msg: 'Invalid city.'
    //   };
    // }

    // if (user.state && user.city && !usa.states[user.state.toUpperCase()][user.city.toUpperCase()]) {
    //   return {
    //     type: 'city-state-request-error',
    //     msg: 'This city is not inside of the specified state.'
    //   };
    // }

    // if (user.zip && user.state && usa.zips[user.zip].state != user.state.toUpperCase()) {
    //   return {
    //     type: 'zip-state-request-error',
    //     msg: 'This zipcode is not belong to the specified state.'
    //   };
    // }

    // if (user.zip && user.city && usa.zips[user.zip].city != user.city.toUpperCase()) {
    //   return {
    //     type: 'zip-city-request-error',
    //     msg: 'This zipcode is not belong to the specified city.'
    //   };
    // }

    if (user.zip && !validZip(user.zip)) {
      return {
        type: 'zip-request-error',
        msg: 'Invalid zipcode'
      };
    }

    if (user.street_name && (user.street_name.length > 100 || regex.safeName.exec(user.street_name) == null)) {
      return {
        type: 'street-name-error',
        msg: 'Must be a valid street name.'
      };
    }

    if (user.street_type && (user.street_type.length > 20 || regex.safeName.exec(user.street_type) == null)) {
      return {
        type: 'street-type-error',
        msg: 'Must be a valid street type and less than 20 chars.'
      };
    }

    if (user.street_affix && (user.street_affix.length > 50 || regex.safeName.exec(user.street_affix) == null)) {
      return {
        type: 'street-affix-error',
        msg: 'Must be a valid street affix'
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
      // Check if user data contains only approved values
      const keys = Object.keys(user.user_data);

      for (let i = 0; i < keys.length; i++) {
        if (regex.safeName.exec(keys[i]) == null || regex.userData.exec(user.user_data[keys[i]]) == null) {
          return {
            type: 'user-data-error',
            msg: 'User data contains invalid character(s).'
          };
        }
      }

      // Check if user data is valid JSON
      try {
        user.user_data = JSON.stringify(user.user_data);
      } catch (e) {
        return {
          type: 'user-data-error',
          msg: 'Must be a valid json.'
        };
      }
    }

    return true;
  },

  getPersonalInfo: function getPersonalInfo(user) {
    return utilsUser.setUser(
      {},
      {
        firstname: user.firstname,
        middlename: user.middlename,
        lastname: user.lastname,
        dob: user.dob,
        phone: user.phone,
        state: user.state,
        city: user.city,
        zip: user.zip,
        street_name: user.street_name,
        street_type: user.street_type,
        street_affix: user.street_affix,
        street_number: user.street_number,
        street_physical: user.street_physical,
        gender: user.gender
      }
    );
  },
  checkUserProps: function checkUserProps(prop) {
    return userSchema[prop] !== undefined;
  },
  setUser: function setUser(user, props) {
    if (props.username && config.user.username.enabled) {
      user.username = misc.toLower(props.username);
    }

    if (props.domain) {
      user.domain = misc.toLower(props.domain) || 'default';
    }

    if (props.password) {
      user.password = props.password;
    }

    if (props.email) {
      user.email = misc.toLower(props.email);
    }

    if (props.firstname !== undefined) {
      user.firstname = misc.toLower(props.firstname);
    }

    if (props.middlename !== undefined) {
      user.middlename = misc.toLower(props.middlename);
    }

    if (props.lastname !== undefined) {
      user.lastname = misc.toLower(props.lastname);
    }

    if (props.dob !== undefined) {
      if (!props.dob) {
        user.dob = null;
      } else {
        user.dob = new Date(Date.parse(props.dob)).toISOString();
      }
    }

    if (props.phone !== undefined) {
      user.phone = Number(props.phone);
    }

    if (props.state !== undefined) {
      user.state = misc.toLower(props.state);
    }

    if (props.city !== undefined) {
      user.city = misc.toLower(props.city);
    }

    if (props.zip !== undefined) {
      user.zip = props.zip;
      if (!user.city || !user.state) {
        const { state, city } = getByZip(user.zip);
        user.city = city;
        user.state = state;
      }
    }

    if (props.street_name !== undefined) {
      user.street_name = misc.toLower(props.street_name);
    }

    if (props.street_type !== undefined) {
      user.street_type = misc.toLower(props.street_type);
    }

    if (props.street_affix !== undefined) {
      user.street_affix = misc.toLower(props.street_affix);
    }

    if (props.street_number !== undefined) {
      user.street_number = Number(props.street_number);
    }

    if (props.street_physical !== undefined) {
      user.street_physical = misc.stringToBool(props.street_physical);
    }

    if (props.gender !== undefined) {
      user.gender = misc.toLower(props.gender);
    }

    if (props.locked_reason !== undefined) {
      user.locked_reason = props.locked_reason;
    }

    if (props.locked !== undefined) {
      user.locked = misc.stringToBool(props.locked) === true;
    }

    if (props.created_on !== undefined) {
      user.created_on = new Date(Date.parse(props.created_on)).toISOString();
    }

    if (props.group_ids) {
      user.group_ids = props.group_ids;
    }

    if (props.group_request !== undefined) {
      user.group_request = props.group_request ? misc.toLower(props.group_request) : null;
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
  },

  getId: function getId(req) {
    if (!req.params.id) {
      return null;
    }

    // if prob an email addresss
    if (req.params.id.indexOf('@') > -1) {
      return { email: req.params.id };
    }

    if (!regex.uuidCheck(req.params.id)) {
      if (regex.username.exec(req.params.id)) {
        return { username: req.params.id };
      } else {
        return null;
      }
    }

    return { id: req.params.id };
  }
};

module.exports = utilsUser;
