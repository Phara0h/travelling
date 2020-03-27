'use strict';

const BaseModel = require('adost').PGActiveModel;
const Base = require('adost').Base;
const PGTypes = require('adost').PGTypes;

class Token extends Base(BaseModel, 'tokens', {
    id: PGTypes.PK,
    user_id: null,
    name: null,
    type: null,
    urls: null,
    secret: PGTypes.Hash,
}) {
    constructor(...args) {
        super(...args);
    }

    static async createTable() {
        const pg = new (require('adost').PGConnecter)();

        await pg.query(`CREATE TABLE tokens (
                id UUID DEFAULT uuid_generate_v4(),
                user_id UUID,
                name CHARACTER varying(350),
                type CHARACTER varying(50),
                urls CHARACTER varying(2000)[],
                secret CHARACTER varying(350),
                PRIMARY KEY (id, user_id)
              );`);
    }
}

module.exports = Token;
