const regex = require('./regex');
const misc = require('./misc');
const userUtil = require('./user');

async function findAllByFilterQuery(self, opts) {
  var query = '';
  var keys = [];
  var values = [];

  if (opts.count) {
    query = `SELECT COUNT(id) FROM ${self.table} `;
  } else {
    query = `SELECT * FROM ${self.table} `;
  }

  if (!opts.sortdir) {
    opts.sortdir = 'DESC';
  }

  if (opts.limit && isNaN(opts.limit)) {
    throw new Error('Invalid filter');
  }
  opts.limit = Number.parseInt(opts.limit);

  if (opts.skip && isNaN(opts.skip)) {
    throw new Error('Invalid filter');
  }
  opts.skip = Number.parseInt(opts.skip);

  if (opts.filter) {
    if (opts.filter.indexOf(',') > -1) {
      opts.filter = opts.filter.split(',');
    } else {
      opts.filter = [opts.filter];
    }

    var obj = {};
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

      if (self._defaultModel[key] !== undefined) {
        if (self._encryptionFields[key] !== undefined) {
          value = (await self._queryFieldsHash({ [key]: value }))['__' + key];
          key = '__' + key;
        }

        ops.push(op);
        values.push(value);
        keys.push(key);
        obj[key] = misc.stringToNativeType(value);
      }
    }

    if (self.table === 'users') {
      var validUser = await userUtil.checkValidUser(obj);

      if (validUser !== true) {
        throw validUser;
      }
      obj = userUtil.setUser(obj, obj);
    }

    for (var i = 0; i < keys.length; i++) {
      if (i === 0) {
        query += ' WHERE ';
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
    query += ' LIMIT ' + opts.limit;
  }

  if (opts.skip && !opts.count) {
    query += ' OFFSET ' + opts.skip;
  }

  if (opts.count) {
    const countRes = await self.query(query, values, false);
    var count = Number.parseInt(countRes.rows[0].count);

    if (opts.skip) {
      count -= opts.skip;
      if (count < 0) {
        count = 0;
      }
    }
    if (opts.limit !== null) {
      if (count >= opts.limit) {
        return { count: opts.limit };
      }
    }

    return { count };
  }

  const newModels = await self.query(query, values);
  console.log(query);
  console.log(values);
  for (var i = 0; i < newModels.length; i++) {
    if (newModels[i]) {
      newModels[i] = await self.decrypt(newModels[i], self.getEncryptedProfile(newModels[i]), true);
      delete newModels[i].password;
      delete newModels[i].eprofile;
    }
  }
  return newModels;
}

module.exports = {
  findAllByFilterQuery
};
