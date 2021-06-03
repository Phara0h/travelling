const BaseModel = require('adost').PGActiveModel;
const Base = require('adost').Base;
const PGTypes = require('adost').PGTypes;
const Group = require('./group');
const config = require('../../utils/config');
const gm = require('../../server/groupmanager');
const userUtil = require('../../utils/user');
const regex = require('../../utils/regex');
const misc = require('../../utils/misc');

class User extends Base(BaseModel, 'users', {
  id: PGTypes.PK,
  domain: null,
  username: null,
  password: PGTypes.Hash,
  avatar: null,
  locked: null,
  locked_reason: null,
  group_request: null,
  firstname: null,
  lastname: null,
  middlename: null,
  gender: null,
  dob: null,
  phone: null,
  state: null,
  city: null,
  zip: null,
  street_physical: null,
  street_number: null,
  street_name: null,
  street_type: null,
  street_affix: null,
  has_webauthn: null,
  has_2fa: null,
  failed_login_attempts: null,
  change_username: null,
  change_password: null,
  reset_password: null,
  email_verify: null,
  group_ids: null,
  email: PGTypes.AutoCrypt,
  created_on: null,
  last_login: null,
  user_data: config.pg.crypto.encryptUserData ? PGTypes.AutoCrypt : null,
  eprofile: PGTypes.EncryptProfile
}) {
  constructor(...args) {
    super(...args);
  }

  static async createTable() {
    const pg = new (require('adost').PGConnecter)();

    await pg.query(`CREATE TABLE users (
                  id UUID DEFAULT uuid_generate_v4(),
                  domain character varying(258),
                  username character varying(100),
                  password character varying(258),
                  email character varying(500),
                  __email character varying(258),
                  group_request character varying(258),
                  firstname character varying(100),
                  lastname character varying(100),
                  middlename character varying(100),
                  gender character varying(50),
                  dob date,
                  phone bigint,
                  state character varying(2),
                  city character varying(100),
                  zip character varying(10),
                  street_physical boolean,
                  street_number int,
                  street_name character varying(100),
                  street_type character varying(20),
                  street_affix character varying(50),
                  locked_reason text,
                  locked boolean DEFAULT false,
                  last_login json,
                  has_webauthn boolean DEFAULT false,
                  has_2fa boolean DEFAULT false,
                  group_ids UUID[],
                  failed_login_attempts int DEFAULT 0,
                  change_username boolean DEFAULT false,
                  change_password boolean DEFAULT false,
                  reset_password boolean DEFAULT false,
                  email_verify boolean DEFAULT false,
                  avatar bytea,
                  created_on timestamp with time zone default current_timestamp ,
                  user_data text,
                  __user_data character varying(258),
                  eprofile character varying(350),
                  PRIMARY KEY (id)
                );`);
  }

  async resolveGroup() {
    var groups = [];
    var groupsNames = [];
    var groupsTypes = [];

    if (!this.groups) {
      this.addProperty('groups', groups);
    }

    // groups.name = '';
    // groups.type = '';

    for (var i = 0; i < this.group_ids.length; i++) {
      const group = (await gm.getGroup(this.group_ids[i])) || (await Group.findById(this.group_ids[i]));

      groups.push(group);
      groupsNames.push(group.name);
      groupsTypes.push(group.type);
      // groups.name += group.name;
      // if (this.group_ids.length < i + 1) {
      //     groups.name += '|';
      // }
      //
      // groups.type += group.type;
      // if (this.group_ids.length < i + 1) {
      //     groups.type += '|';
      // }
    }

    this.groups = groups;

    return { names: groupsNames, types: groupsTypes };
  }

  async addGroup(group) {
    if (this.group_ids && this.group_ids.indexOf(group.id) > -1) {
      return false;
    }

    if (!this.group_ids) {
      this.group_ids = [];
    }

    this.group_ids.push(group.id);
    this.group_ids = [...this.group_ids];

    return await this.save();
  }

  async removeGroup(group) {
    if (!this.group_ids) {
      return false;
    }

    var found = this.group_ids.indexOf(group.id);

    if (found == -1) {
      return false;
    }
    this.group_ids.splice(found, 1);
    this.group_ids = [...this.group_ids];

    return await this.save();
  }

  hasGroupId(id) {
    return this.group_ids.indexOf(id) > -1;
  }

  hasGroupName(name) {
    for (var i = 0; i < this.groups.length; i++) {
      if (this.groups[i].name === name) {
        return true;
      }
    }
    return false;
  }

  hasGroupType(type) {
    for (var i = 0; i < this.groups.length; i++) {
      if (this.groups[i].type === type) {
        return true;
      }
    }
    return false;
  }

  static async findAllByFilter(filter, sort, limit, sortdir = 'DESC') {
    var query = `SELECT * FROM ${this.table} `;

    var values;

    if (filter) {
      if (filter.indexOf(',') > -1) {
        filter = filter.split(',');
      } else {
        filter = [filter];
      }
      values = [];
      query += ' WHERE ';

      var user = {};
      var opts = [];

      //console.log(filter);
      for (var i = 0; i < filter.length; i++) {
        var opt = '=';
        var key;
        var value;

        if (filter[i].indexOf('>=') > -1) {
          var kv = filter[i].split('>=');

          opt = '>=';
          key = kv[0];
          value = kv[1];
        } else if (filter[i].indexOf('<=') > -1) {
          var kv = filter[i].split('<=');

          opt = '<=';
          key = kv[0];
          value = kv[1];
        } else if (filter[i].indexOf('>') > -1) {
          var kv = filter[i].split('>');

          opt = '>';
          key = kv[0];
          value = kv[1];
        } else if (filter[i].indexOf('<') > -1) {
          var kv = filter[i].split('<');

          opt = '<';
          key = kv[0];
          value = kv[1];
        } else if (filter[i].indexOf('=') > -1) {
          var kv = filter[i].split('=');

          key = kv[0];
          value = kv[1];
        }

        if (this._defaultModel[key] !== undefined) {
          if (this._encryptionFields[key] !== undefined) {
            value = (await this._queryFieldsHash({ [key]: value }))['__' + key];
            key = '__' + key;
          }
          opts.push(opt);
          user[key] = misc.stringToNativeType(value);
        }
      }
      var validUser = await userUtil.checkValidUser(user);

      if (validUser !== true) {
        throw validUser;
      }
      user = userUtil.setUser(user, user);
      var keys = Object.keys(user);

      for (var i = 0; i < keys.length; i++) {
        query += `"${keys[i]}"${opts[i]}$${i + 1} `;

        values.push(user[keys[i]]);
        if (keys.length > i + 1) {
          query += ' AND ';
        }
      }
    }

    if (sort && regex.safeName.exec(sort) != null) {
      query += ' ORDER BY ' + sort + ' ' + (sortdir == 'ASC' ? 'ASC' : 'DESC');
    }

    if (limit && !isNaN(Number(limit))) {
      query += ' LIMIT ' + Number(limit);
    }

    const newModels = await this.query(query, values);

    for (var i = 0; i < newModels.length; i++) {
      if (newModels[i]) {
        newModels[i] = await this.decrypt(newModels[i], this.getEncryptedProfile(newModels[i]), true);
        delete newModels[i].password;
        delete newModels[i].eprofile;
      }
    }
    return newModels;
  }

  static async getCountByFilter(filter) {
    // TODO: Create count query
    const query = `SELECT COUNT(*) FROM ${this.table} `;
    return await this.query(query, values);
  }

  toJSON() {
    var u = { ...this._ };

    if (u.avatar != null) {
      u.avatar = u.avatar.toString('utf8');
    }
    if (u.user_data != null) {
      u.user_data = JSON.parse(u.user_data.toString('utf8'));
    }

    delete u.password;
    return u;
  }
}

module.exports = User;
