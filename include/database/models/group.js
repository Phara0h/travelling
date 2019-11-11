'use strict';

const BaseModel = require('@abeai/node-utils').PGActiveModel;
const Base = require('@abeai/node-utils').Base;
const PGTypes = require('@abeai/node-utils').PGTypes;
const {URL} = require('url');

class Group extends Base(BaseModel, 'groups', {
    id: PGTypes.PK,
    name: null,
    type: null,

    /**
    allowed is an array of objects with this struct:
    {
        name: String, //needs to be unqiue
        method: String,
        remove_from_path: String,
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

        await pg.query(`CREATE TABLE groups (
                  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                  name character varying(350),
                  type character varying(350),
                  allowed json[],
                  inherited UUID[],
                  is_default boolean DEFAULT false,
                  eprofile character varying(350)
                );`);

    }

    static async getDefaultGroup() {
        return await this.findLimtedBy({is_default: true}, 'AND', 1);
    }

    addRoute(route) {
        if (route.method) {
            route.method = route.method.toUpperCase();
        }

        if (!route.name) {
            const url = new URL('http://localhost' + route.route);

            route.name = (route.method || '*') + url.pathname.replace(/\//g, '-');
            // try {
            //     route.name = route.name + '-' + [...url.searchParams.keys()].join('-');
            // } catch (_) {}
        }

        route.name = route.name.toLowerCase();

        if (!this.allowed || this.allowed.length <= 0) {
            this.allowed = [];
        }

        for (var i = 0; i < this.allowed.length; i++) {
            if (this.allowed[i].name == route.name || route.route && this.allowed[i].route == route.route && route.method && route.method == this.allowed[i].method) {

                console.log(route.name, route.route, this.allowed[i]);
                return false;
            }
        }

        this.allowed.push(route);
        this.allowed = [...this.allowed];
        return true;
    }

    removeRoute(route) {
        if (!route.name) {
            return false;
        }

        route.name = route.name.toLowerCase();

        if (!this.allowed || this.allowed.length <= 0) {
            this.allowed = [];
        }

        let found = false;

        for (var i = 0; i < this.allowed.length; i++) {
            if (this.allowed[i].name == route.name || this.allowed[i].route == route.name) {
                found = i;
                break;
            }
        }

        if (found === false) {
            return false;
        }

        this.allowed.splice(found, 1);
        this.allowed = [...this.allowed];

        return true;
    }

}

module.exports = Group;
