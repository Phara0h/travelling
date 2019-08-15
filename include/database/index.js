'use strict';

const Group = require('./models/group');
const User = require('./models/user');

const crypto = require('../utils/cryptointerface');
const config = require('../utils/config');

class Database {
    constructor() {
    }

    static async checkAuth(name, email, password) {

        name = name.toLowerCase();

        var user = await User.findLimtedBy({username: name, email: email}, 'OR', 1);

        //No user found
        if (user == null || user.length == 0) {
          throw {
              user: null,
              err: {
                  type: 'user',
                  msg: 'invalid username or email'
              }
          };
        }

        //Locked check
        user = user[0];
        if (user.locked) {
            throw {
                user: user,
                err: {
                    type: 'locked',
                    msg: user.locked_reason
                }
            };
        }

        //Password check
        if (user.password == await crypto.hash(password)) {
            user.failed_login_attempts = 0;
            await user.save();
            user._.group = await Group.findById(user.group_id);

            return {user, err: null};
        }

        //Failed login
        user.failed_login_attempts += 1;
        if (config.login.maxLoginAttempts && user.failed_login_attempts >= config.login.maxLoginAttempts && !user.locked) {
            user.locked = true;
            user.locked_reason = 'Failed login attempts exceeded the limit. Contact your admin to get your account unlocked.';
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

    static async createAccount(username, password, email) {
        var group = await Database.getDefaultGroup();

        var user = await User.create({
            change_username: false,
            change_password: 0,
            username: username.toLowerCase(),
            password: password,
            email: email,
            created_on: Date.now(),
            group_id: group[0].id
        });

        user.group = group[0];
        return user;
    }

    static async getDefaultGroup() {
        return await Group.getDefaultGroup();
    }
}

module.exports = Database;
