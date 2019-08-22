'use strict';

const BaseModel = require('@abeai/node-utils').PGActiveModel;
const Base = require('@abeai/node-utils').Base;
const PGTypes = require('@abeai/node-utils').PGTypes;
const Group = require('./group');
const config = require('../../utils/config');

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
    group_id: null,
    email: PGTypes.AutoCrypt,
    created_on: null,
    last_login: null,
    client_id: null,
    client_secret: PGTypes.Hash,
    client_refresh: PGTypes.Hash,
    user_data: config.pg.crypto.encryptUserData ? PGTypes.AutoCrypt : null
}) {
    constructor(...args) {
        super(...args);
    }

    static async createTable() {
        const pg = new (require('@abeai/node-utils').PGConnecter)();

        await pg.queryBatch([
            {
                query: `CREATE TABLE IF NOT EXISTS users (
                id serial,
                username character varying(100),
                password character varying(258),
                email character varying(500),
                __email character varying(258),
                locked_reason text,
                locked boolean DEFAULT false,
                last_login json,
                group_id serial,
                failed_login_attempts int DEFAULT 0,
                change_username boolean DEFAULT false,
                change_password boolean DEFAULT false,
                reset_password_token varying(258),
                avatar text,
                created_on bigint,
                client_id character varying(258),
                client_secret character varying(258),
                client_refresh character varying(258),
                user_data text,
                __user_data character varying(258),
                PRIMARY KEY (id)
              );`,
                variables: null,
            },
        ]);
    }

    async resolveGroup() {
      var group = await Group.findById(this.group_id);
      this.addProperty('group', group);
      return this;
    }

}

module.exports = User;
