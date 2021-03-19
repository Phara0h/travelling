const Group = require('./models/group');
const User = require('./models/user');

const config = require('../utils/config');
const crypto = require(config.pg.crypto.implementation);
const Email = require('../utils/email');
const TokenHandler = require('../token');
const gm = require('../server/groupmanager.js');

class Database {
  constructor() {}

  static async checkAuth(name, email, password, domain = 'default') {
    var user = null;
    var users = await this.findUser(email, name, domain);

    config.log.logger.trace('checkAuth: ', users);
    if (users == null || users.length == 0) {
      throw {
        user: null,
        err: {
          type: 'user',
          msg: 'invalid username or email'
        }
      };
    }

    user = users[0];

    // No user found

    // Regenerate new email with token for activation
    if (user.email_verify && user.locked) {
      var token = await TokenHandler.getActivationToken(user.id);

      await Email.sendActivation(user, user.email, token.token, domain);
    }

    // Locked check
    if (user.locked) {
      throw {
        user: user,
        err: {
          type: 'locked',
          msg: user.locked_reason
        }
      };
    }

    // Password check
    if (user.password == (await crypto.hash(password, null, user.getEncryptedProfile(user)))) {
      user.failed_login_attempts = 0;
      await user.save();

      return { user, err: null };
    }

    // Failed login
    user.failed_login_attempts += 1;
    if (config.login.maxLoginAttempts && user.failed_login_attempts >= config.login.maxLoginAttempts && !user.locked) {
      user.locked = true;
      user.locked_reason = config.user.locked.message;
      user.change_password = true;
      await user.save();
      throw {
        user: user,
        err: {
          type: 'locked',
          msg: user.locked_reason
        }
      };
    }

    await user.save();
    throw {
      user: user,
      err: {
        type: 'password',
        msg: 'invalid password'
      }
    };
  }

  static async createAccount(username, password, email, group_ids, group_request = null, hostname, domain = 'default') {
    var userProp = {
      username,
      password,
      email,
      group_request,
      group_ids,
      domain,
      change_username: false,
      change_password: false
    };

    if (config.registration.requireManualActivation) {
      userProp.locked = true;
      userProp.locked_reason = 'Activation Required, email your admin to get your account activated';
    }

    var user = await User.create(userProp);

    if (config.registration.requireEmailActivation) {
      user.locked = true;
      user.locked_reason = 'Activation Required, check your email for the activation link.';
      var token = await TokenHandler.getActivationToken(user.id);

      user.email_verify = true;
      await user.save();

      await Email.sendActivation(user, user.email, token.token, hostname);
    }

    // user.addProperty('group',group[0])
    return user;
  }

  static async forgotPassword(email, ip, hostname, domain = 'default') {
    var user = await User.findLimtedBy({ email: email }, 'AND', 1);

    if (user && user.length > 0) {
      user = user[0];

      var rt = await TokenHandler.getRecoveryToken(user.id);

      user.reset_password = true;
      await user.save();

      Email.sendPasswordRecovery(user, hostname, ip, user.email, rt.token);
    }
  }

  static async resetPassword(token, password) {
    var user = await User.findLimtedBy({ id: token[2] }, 'AND', 1);

    if (!user || user.length < 1) {
      return false;
    }

    user = user[0];
    user.password = password;
    user.reset_password = false;

    if (user.locked && user.locked_reason == config.user.locked.message) {
      user.locked = false;
      user.failed_login_attempts = 0;
      user.locked_reason = '';
    }

    await user.save();

    await TokenHandler.deleteAllTempTokens(token[2]);

    return true;
  }

  static async activateAccount(token) {
    var user = await User.findLimtedBy({ id: token[2] }, 'AND', 1);

    if (!user || user.length < 1) {
      return false;
    }

    user = user[0];

    user.email_verify = false;
    user.locked = false;
    user.locked_reason = null;
    await user.save();

    await TokenHandler.deleteAllTempTokens(token[2]);

    return true;
  }

  static async findUser(email, username, domain = 'default') {
    var qProps = [{ email }];
    var qOps = [config.user.username.enabled ? 'OR' : 'AND'];

    if (config.user.username.enabled && username) {
      qProps.push({ username });
      qOps.push('OR');
    }
    if (config.user.isolateByDomain && domain) {
      qProps.push({ domain });
      qOps.push('AND');
    }

    var found = await User.findLimtedBy(qProps.length == 1 ? qProps[0] : qProps, qOps.length == 1 ? qOps[0] : qOps, 1);

    return found;
  }

  static async checkDupe(user) {
    var found = await Database.findUser(user.email, user.username, user.domain);

    //console.log(user, qProps, qOps, found);
    if (found && found.length > 0) {
      return {
        type: 'exists-error',
        msg: 'Username or email already exists'
      };
    }
    return true;
  }

  static async initGroups(router) {
    var grps = await Group.findAll();

    if (grps.length == 0) {
      config.log.logger.info('Creating default groups...');
      // create default groups
      var anon = await Group.create({
        name: 'anonymous',
        type: 'group',
        allowed: [],
        is_default: false
      });

      anon.addRoute({
        route: config.portal.path + '*',
        host: config.portal.host
      });
      anon.addRoute({
        route: '/' + config.serviceName + '/api/v1/auth/*',
        host: null
      });
      anon.addRoute({
        route: '/' + config.serviceName + '/api/v1/user/me/route/allowed',
        host: null,
        method: 'GET'
      });
      anon.addRoute({
        route: '/' + config.serviceName + '/api/v1/user/me/permission/allowed/*',
        host: null,
        method: 'GET'
      });
      anon.addRoute({
        route: '/' + config.serviceName + '/assets/*',
        host: null,
        remove_from_path: '/' + config.serviceName + '/assets/',
        method: 'GET'
      });
      anon.addRoute({
        route: '/' + config.serviceName + '/api/v1/config/password',
        host: null,
        method: 'GET'
      });
      anon.addRoute({
        route: '/' + config.serviceName + '/api/v1/config/portal/webclient',
        host: null,
        method: 'GET'
      });
      anon.addRoute({
        route: '/favicon.ico',
        host: null,
        method: 'GET'
      });

      await anon.save();

      // gm.groups[anon.name] = this.groupInheritedMerge(anon, grps);

      var admin = await Group.create({
        name: 'superadmin',
        type: 'group',
        allowed: [],
        is_default: true,
        inherited: [anon.id]
      });

      admin.addRoute({
        host: null,
        route: '/' + config.serviceName + '/*'
      });
      await admin.save();
      // console.log(admin)
      // gm.groups[admin.name] = this.groupInheritedMerge(admin, grps);

      await gm.updateGroupList();
      return true;
    }
    await gm.updateGroupList();
    return false;
  }
}

module.exports = Database;
