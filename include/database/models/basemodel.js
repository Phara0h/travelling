/*eslint new-cap: "warn"*/
const BaseModel = require('adost').PGActiveModel;
const regex = require('../../utils/regex');

BaseModel.findAllByFilter = async function ({
  query,
  filter,
  additionalFilter,
  sort,
  sortdir = 'DESC',
  limit,
  skip,
  count,
  ids,
  params
}) {
  var keys = [];
  var values = [];
  var ops = [];

  if (!query) {
    if (count) {
      query = `SELECT COUNT(id) FROM ${this.table} `;
    }
    else if(params) {
        if (params.indexOf(',') > -1) {
          params = params.split(',');
        } else {
          params = [params];
        }
        var query = `SELECT `
        for (var i = 0; i < params.length; i++) {
        
          if (this._defaultModel[params[i]] === null || typeof this._defaultModel[params[i]] === 'string') {
            query += `${params[i]}${params.length > i + 1 ? ',' : ''}`;
          }
        }
        query += ` FROM ${this.table} `;
      
    } else {
      query = `SELECT * FROM ${this.table} `;
    }
  }
  console.log(query)
  if ((limit && isNaN(limit)) || (skip && isNaN(skip))) {
    throw new Error('Invalid filter');
  }

  limit = Number.parseInt(limit);
  skip = Number.parseInt(skip);

  if (filter) {
    if (filter.indexOf(',') > -1) {
      filter = filter.split(',');
    } else {
      filter = [filter];
    }

    for (var i = 0; i < filter.length; i++) {
      var op = '=';
      var key;
      var value;

      if (filter[i].indexOf('>=') > -1) {
        var kv = filter[i].split('>=');

        op = '>=';
        key = kv[0];
        value = kv[1];
      } else if (filter[i].indexOf('<=') > -1) {
        var kv = filter[i].split('<=');

        op = '<=';
        key = kv[0];
        value = kv[1];
      } else if (filter[i].indexOf('>') > -1) {
        var kv = filter[i].split('>');

        op = '>';
        key = kv[0];
        value = kv[1];
      } else if (filter[i].indexOf('<') > -1) {
        var kv = filter[i].split('<');

        op = '<';
        key = kv[0];
        value = kv[1];
      } else if (filter[i].indexOf('=') > -1) {
        var kv = filter[i].split('=');

        key = kv[0];
        value = kv[1];
      }

      if (this._defaultModel[key] !== undefined) {
        if (op === '>' || op === '<' || op === '>=' || op === '<=') {
          // Whitelist range operator columns
          if (this.table === 'users' && key !== 'date' && key !== 'created_on' && key !== 'updated_on') {
            continue;
          }

          if (this.table === 'audits' && key !== 'created_on') {
            continue;
          }
        }

        if (this._encryptionFields[key] !== undefined) {
          value = (await this._queryFieldsHash({ [key]: value }))['__' + key];
          key = '__' + key;
        }

        ops.push(op);
        values.push(value);
        keys.push(key);
      }
    }
  }

  if (ids && keys.indexOf('id') < 0) {
    ops.push('=ANY');
    values.push(ids.split(','));
    keys.push('id');
  }

  if (keys.length) {
    for (var i = 0; i < keys.length; i++) {
      if (i === 0) {
        query += ' WHERE ';
      }

      query += `${this.table}.${keys[i]}${ops[i]}${ops[i] === '=ANY' ? `($${i + 1})` : `$${i + 1}`}`;

      if (keys.length > i + 1) {
        query += ' AND ';
      }
    }
  }

  if (additionalFilter) {
    query += `${keys.length > 0 ? ' AND ' : ' WHERE '} ${additionalFilter} `;
  }

  if (sort && regex.safeName.exec(sort) != null && this._defaultModel[sort] !== undefined) {
    query += ' ORDER BY ' + sort + ' ' + (sortdir == 'ASC' ? 'ASC' : 'DESC');
  }

  if (limit && !count) {
    query += ' LIMIT ' + limit;
  }

  if (skip && !count) {
    query += ' OFFSET ' + skip;
  }

  if (count) {
    const countRes = await this.query(query, values, false);
    var c = Number.parseInt(countRes.rows[0].count);

    if (skip) {
      c -= skip;
      if (c < 0) {
        c = 0;
      }
    }

    if (limit !== null) {
      if (c >= limit) {
        return { count: limit };
      }
    }

    return { count: c };
  }

  const newModels = await this.query(query, values, false);
  const rows = newModels.rows;

  for (var i = 0; i < rows.length; i++) {
    if (rows[i]) {
      rows[i] = await this.decrypt(rows[i], this.getEncryptedProfile(rows[i]), true);
      delete rows[i].password;
      delete rows[i].eprofile;

      const keys = Object.keys(rows[i]);

      // Delete rows that begin with '__'
      for (var j = 0; j < keys.length; j++) {
        if (keys[j] && keys[j][0] + keys[j][1] === '__') {
          delete rows[i][keys[j]];
        }
      }
    }
  }

  return rows;
};

module.exports = BaseModel;
