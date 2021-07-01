const BaseModel = require('adost').PGActiveModel;
const Base = require('adost').Base;
const PGTypes = require('adost').PGTypes;
const regex = require('../../utils/regex');
const misc = require('../../utils/misc');

class Audit extends Base(BaseModel, 'audits', {
  id: PGTypes.PK,
  created_on: null,
  action: null,
  subaction: null,
  by_user_id: null,
  of_user_id: null,
  prop: null,
  old_val: PGTypes.AutoCrypt,
  new_val: PGTypes.AutoCrypt,
  eprofile: PGTypes.EncryptProfile
}) {
  constructor(...args) {
    super(...args);
  }

  static async createTable() {
    const pg = new (require('adost').PGConnecter)();

    await pg.query(`CREATE TABLE audits (
                    id UUID DEFAULT uuid_generate_v4(),
                    created_on timestamp with time zone default current_timestamp,
                    action character varying(25),
                    subaction character varying(64),
                    by_user_id character varying(64),
                    of_user_id character varying(64),
                    prop character varying(200),
                    old_val text,
                    __old_val character varying(258),
                    new_val text,
                    __new_val character varying(258),
                    eprofile character varying(350),
                    PRIMARY KEY (id)
                    );`);
  }

  static async findAllByIdWithFilter(opts) {
    var query = `SELECT * FROM ${this.table} `;
    var keys = [];
    var values = [];

    if (opts.byUser === true) {
      query += `WHERE by_user_id = '${opts.id}' `
    }

    if (opts.ofUser === true) {
      query += `WHERE of_user_id = '${opts.id}' `
    }

    if (!opts.sortdir) {
      opts.sortdir = 'DESC';
    }

    if (opts.limit && isNaN(opts.limit)) {
      throw new Error('Invalid filter') 
    }
    opts.limit = Number.parseInt(opts.limit);

    if (opts.skip && isNaN(opts.skip)) {
      throw new Error('Invalid filter')
    }
    opts.skip = Number.parseInt(opts.skip);

    if (opts.filter) {
      if (opts.filter.indexOf(',') > -1) {
        opts.filter = opts.filter.split(',');
      } else {
        opts.filter = [opts.filter];
      }

      var audit = {};
      var ops = [];

      for (var i = 0; i < opts.filter.length; i++) {
        var op = '=';
        var key;
        var value;

        if (opts.filter[i].indexOf('>=') > -1) {
          var kv = opts.filter[i].split('>=');

          op = '>=';
          key = kv[0];
          value = kv[1];
        } else if (opts.filter[i].indexOf('<=') > -1) {
          var kv = opts.filter[i].split('<=');

          op = '<=';
          key = kv[0];
          value = kv[1];
        } else if (opts.filter[i].indexOf('>') > -1) {
          var kv = opts.filter[i].split('>');

          op = '>';
          key = kv[0];
          value = kv[1];
        } else if (opts.filter[i].indexOf('<') > -1) {
          var kv = opts.filter[i].split('<');

          op = '<';
          key = kv[0];
          value = kv[1];
        } else if (opts.filter[i].indexOf('=') > -1) {
          var kv = opts.filter[i].split('=');

          key = kv[0];
          value = kv[1];
        }

        if (this._defaultModel[key] !== undefined) {
          if (this._encryptionFields[key] !== undefined) {
            value = (await this._queryFieldsHash({ [key]: value }))['__' + key];
            key = '__' + key;
          }

          ops.push(op);
          values.push(value)
          keys.push(key)
          audit[key] = misc.stringToNativeType(value);
        }
      }

      for (var i = 0; i < keys.length; i++) {
        if (i === 0) {
          query += ' AND ';
        }
        query += `"${keys[i]}"${ops[i]}$${i + 1} `;

        if (keys.length > i + 1) {
          query += ' AND ';
        }
      }
    }

    if (opts.sort && regex.safeName.exec(opts.sort) != null) {
      query += ' ORDER BY ' + opts.sort + ' ' + (opts.sortdir == 'ASC' ? 'ASC' : 'DESC');
    }

    if (opts.limit && !opts.count) {
      query += ' LIMIT ' +  opts.limit;
    }

    if (opts.skip && !opts.count) {
      query += ' OFFSET ' +  opts.skip;
    }
 
    const audits = await this.query(query, values);

    for (var i = 0; i < audits.length; i++) {
      if (audits[i]) {
        audits[i] = await this.decrypt(audits[i], this.getEncryptedProfile(audits[i]), true);
        delete audits[i].eprofile;
      }
    }
    return audits;
  }
}

module.exports = Audit;
