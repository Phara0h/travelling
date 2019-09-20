'use strict';

const BaseModel = require('@abeai/node-utils').PGActiveModel;
const Base = require('@abeai/node-utils').Base;
const PGTypes = require('@abeai/node-utils').PGTypes;

class Token extends Base(BaseModel, 'tokens', {
    id: PGTypes.PK,
    user_id: null,
    name: null,
    type: null,
    secret: PGTypes.Hash,
}) {
    constructor(...args) {
        super(...args);
    }

    static async createTable() {
        const pg = new (require('@abeai/node-utils').PGConnecter)();

        await pg.query(`CREATE TABLE tokens (
                id UUID DEFAULT uuid_generate_v4(),
                user_id UUID,
                name CHARACTER varying(350),
                type CHARACTER varying(50),
                secret CHARACTER varying(350),
                PRIMARY KEY (id, user_id)
              );`);
    }
}

module.exports = Token;
