'use strict';

const BaseModel = require('@abeai/node-utils').PGActiveModel;
const Base = require('@abeai/node-utils').Base;
const PGTypes = require('@abeai/node-utils').PGTypes;
const pg = new (require('@abeai/node-utils').PGConnecter)();
class Group extends Base(BaseModel, 'groups', {
    id: PGTypes.PK,
    name: null,
    type: null,
    /**
    allowed is an array of objects with this struct:
    {
        name: String, //needs to be unqiue
        method: String,
        removeFromPath: String,
        route: String,
        host: String
    }
    **/
    allowed: null,
    inherited: null,
    is_default: null,
}) {
    constructor(...args) {
        super(...args);
    }

    static async createTable() {
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

    static async getDefaultGroup() {
        return await this.findLimtedBy({is_default: true}, 'AND', 1);
    }

    async addRoute(route) {
        if (!route.method) {
            route.method = '*';
        }
        route.method = route.method.toUpperCase();

        if (!route.name) {
            route.name = (route.method == '*' ? 'all' : route.method) + route.route.replace(/\//g, '-');
        }
        route.name = route.name.toLowerCase();

        if(!this.allowed || this.allowed.length <= 0) {
          this.allowed = [];
        }
        this.allowed.push(route);
          this.allowed = [...this.allowed]
    }

}

module.exports = Group;
