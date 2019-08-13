'use strict';

const BaseModel = require('@abeai/node-utils').PGActiveModel;
const Base = require('@abeai/node-utils').Base;
const PGTypes = require('@abeai/node-utils').PGTypes;

class User extends Base(BaseModel, 'users', {
      id: PGTypes.PK,
      username: null,
      password: PGTypes.Hash,
      avatar: null,
      locked: null,
      locked_reason: null,
      failed_login_attempts: null,
      change_username: null,
      change_password: null,
      group: null,
      email: PGTypes.AutoCrypt,
      created_on: null,
      last_login: null,
      client_id: null,
      client_secret: PGTypes.Hash
  }) {
    constructor(...args) {
      super(...args);
    }

    static async createTable()
    {
      const pg = new (require('@abeai/node-utils').PGConnecter)();
      await pg.queryBatch([
          {
              query: `CREATE TABLE IF NOT EXISTS users (
                id serial,
                username character varying(100),
                password character varying(258),
                locked_reason text,
                locked boolean DEFAULT false,
                last_login json,
                groupId serial,
                failed_login_attempts numeric DEFAULT 0,
                change_username boolean DEFAULT false,
                change_password numeric DEFAULT 0,
                avatar text,
                creation_on bigint,
                client_id character varying(258),
                client_secret character varying(258),
                PRIMARY KEY (id)
              );`,
              variables: null,
          },
      ]);
    }

}

module.exports = User;
