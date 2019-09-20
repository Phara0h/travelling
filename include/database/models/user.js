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
    group_request: null,
    failed_login_attempts: null,
    change_username: null,
    change_password: null,
    reset_password: null,
    email_verify: null,
    group_id: null,
    email: PGTypes.AutoCrypt,
    created_on: null,
    last_login: null,
    user_data: config.pg.crypto.encryptUserData ? PGTypes.AutoCrypt : null,
    eprofile: PGTypes.EncryptProfile,
}) {
    constructor(...args) {
        super(...args);
    }

    static async createTable() {
        const pg = new (require('@abeai/node-utils').PGConnecter)();

        await pg.query(`CREATE TABLE users (
                  id UUID DEFAULT uuid_generate_v4(),
                  username character varying(100),
                  password character varying(258),
                  email character varying(500),
                  __email character varying(258),
                  group_request character varying(258),
                  locked_reason text,
                  locked boolean DEFAULT false,
                  last_login json,
                  group_id UUID,
                  failed_login_attempts int DEFAULT 0,
                  change_username boolean DEFAULT false,
                  change_password boolean DEFAULT false,
                  reset_password boolean DEFAULT false,
                  email_verify boolean DEFAULT false,
                  avatar bytea,
                  created_on bigint,
                  user_data bytea,
                  __user_data character varying(258),
                  eprofile character varying(350),
                  PRIMARY KEY (id, group_id)
                );`);

    }

    async resolveGroup(router) {
        var group = router ? await router.getGroup(this.group_id) : await Group.findById(this.group_id);

        if (!this.group) {
            this.addProperty('group', group);
        } else {
            this.group = group;
        }

        return this;
    }

    toJSON() {
        var u = {...this._};

        if (u.avatar != null) {
            u.avatar = u.avatar.toString('utf8');
        }
        if (u.user_data != null) {
            u.user_data = JSON.parse(u.user_data.toString('utf8'));
        }
        return u;
    }

}

module.exports = User;
