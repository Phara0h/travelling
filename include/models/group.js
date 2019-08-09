'use strict';

const BaseModel = require('@abeai/node-utils').PGActiveModel;
const Base = require('@abeai/node-utils').Base;
const PGTypes = require('@abeai/node-utils').PGTypes;
const uuid = require('uuid');

class Group extends Base(BaseModel, 'groups', {
      id: PGTypes.PK,
      name: null,
      type: null,
      allowed: null,
      inherited: null,
      is_default: null
  }) {
    constructor(...args) {
      super(...args);
      // if(!this.id)
      // {
      //   this.id = uuid.v4();
      // }
    }

    static async createTable()
    {
      const pg = new (require('@abeai/node-utils').PGConnecter)();
      await pg.queryBatch([
          {
              query: `CREATE TABLE IF NOT EXISTS groups (
                id serial,
                name character varying(350),
                type character varying(350),
                allowed json[],
                inherited character varying(350)[],
                is_default boolean DEFAULT false,
                PRIMARY KEY (id)
              );`,
              variables: null,
          },
      ]);
    }
}

module.exports = Group;
