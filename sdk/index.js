'use strict';
const qs = require('querystring');
const url = require('url');
const client = {
    https: require('https'),
    http: require('http'),
};

const agent = {
    http: new client.http.Agent({
        keepAlive: true
    }),
    https: new client.https.Agent({
        keepAlive: true
    })
};

const REDIRECT_CODES = [301, 302, 303, 307];

class SimpleError extends Error {
    constructor() {
        super(
            'Error happened due to simple constraint not being 2xx status code.')
        this.name = 'FR_Simple';
    }
}

class RequestError extends Error {
    constructor(e) {
        super('Error happened reguarding a request: ' + e.message)
        this.name = 'FR_Simple';
    }
}

class Fasquest {
    constructor() {}

    request(options, cb = null) {
        if (!cb) {
            return this.requestPromise(options);
        } else {
            this._request(options, (err, req, res) => {
                const connection = res.info || res.connection;
                reject({
                    req,
                    res,
                    err
                });
            })
        }
    }

    requestPromise(options) {
        return new Promise((resolve, reject) => {
            this._request(options, (req, res, err) => {
                if (err) {
                    reject({
                        req,
                        res,
                        err
                    })
                } else {
                    resolve(options.resolveWithFullResponse ? res : res.body);
                }
            });
        });
    }

    _request(ops, cb, count = 0) {
        var options = this._setOptions({
            ...ops
        });
        if (options.body && !options.headers['Content-Length']) {
            options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(options.body));
        }
        var req = client[options.proto].request(options.uri, options, (res) => {
            res.body = '';
            res.on('data', (chunk) => {
                res.body += chunk;
            });
            res.on('end', () => {
                // remove as causes circular references
                delete options.agent;

                if (REDIRECT_CODES.indexOf(res.statusCode) !== -1 && count < options.redirect_max) {
                    options.uri = url.resolve(options.uri, res.headers.location);
                    options.proto = options.uri.split(':')[0];
                    return this._request(this._setOptions(options), cb, ++count);
                } else {
                    if (res.headers['content-type'] && res.headers['content-type'].indexOf('json') > -1) {
                        res.body = JSON.parse(res.body);
                    }
                    if (options.simple) {
                        if (res.statusCode > 299 || res.statusCode < 200) {
                            return cb(req, res, new SimpleError());
                        }
                    }

                    return cb(req, res, null);
                }

            });
        });

        req.on('error', (e) => {
            // remove as causes circular references
            delete options.agent;

            return cb(req, null, new RequestError(e))
        });

        if (options.body) {
            req.write(options.json ? JSON.stringify(options.body) : options.body);
        }

        req.end();
    }

    _setOptions(options) {
        options.proto = options.proto || options.uri.split(':')[0];

        options.simple = options.simple !== false;

        if (options.qs) {
            var escQS = qs.stringify(options.qs);

            if (escQS.length > 0) {
                options.uri += (options.uri.indexOf('?') > -1 ? '&' : '?') + escQS;
            }
        }

        options.agent = options.agent || agent[options.proto];

        if (!options.headers) {
            options.headers = {};
        }

        if (options.json) {
            options.headers['Content-Type'] = 'application/json';
        } else if (options.form) {
            options.body = qs.stringify(options.form);
            options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            options.headers['Content-Length'] = Buffer.byteLength(options.body);
        }
        if (options.authorization) {
            if (options.authorization.basic) {
                options.headers['Authorization'] = 'Basic ' + Buffer.from(options.authorization.basic.client + ':' + options.authorization.basic.secret, 'ascii').toString('base64');
            } else if (options.authorization.bearer) {
                options.headers['Authorization'] = 'Bearer ' + options.authorization.bearer;
            }

            delete options.authorization;
        }


        if (!options.redirect_max) {
            options.redirect_max = 5;
        }

        return options;
    }
}
module.exports = new Fasquest();

const fasq = new Fasquest();
var hostUrl = '';

/**
 * 
 */
class Travelling {
    constructor() {}


    /**
     * healthCheck - server's health check
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async healthCheck(authorization_bearer, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/_health`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * metrics - servers metrics
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async metrics(authorization_bearer, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/metrics`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static get Config() {
        return Config;
    }

    static get Users() {
        return Users;
    }

    static get User() {
        return User;
    }

    static get Groups() {
        return Groups;
    }

    static get Group() {
        return Group;
    }

    static get Auth() {
        return Auth;
    }
}
/**
 * 
 */
class Config {
    constructor() {}


    /**
     * getProperty - Gets a property from travellings config.
     * @param {any} property  (example: password)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async getProperty(property, authorization_bearer, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/config/${property}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }
}
/**
 * 
 */
class Users {
    constructor() {}


    /**
      * byGroupRequest - Gets all the users that have the specified group request

    ##### Optional Query Params

    | Param | Description |
    | --- | --- |
    | id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
    | username | *optional* (example:  user7) |
    | locked | *optional* (example:  true) |
    | locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
    | group_request | *optional* (example:  superadmin) |
    | failed_login_attempts | *optional* (example:  0) |
    | change_username | *optional* (example:  false) |
    | change_password | *optional* (example:  false) |
    | reset_password | *optional* (example:  false) |
    | email_verify | *optional* (example:  false) |
    | group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
    | email | *optional* (example:  test@test.ai) |
    | created_on | *optional* (example:  1568419646794) |
    | last_login | *optional* (example:  null) |
      * @param {any} group_request name of the group  (example: superadmin)
      * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
      */
    static async byGroupRequest(group_request, authorization_bearer, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/users/group/request/${group_request}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
      * get - Gets all the users

    ##### Optional Query Params

    | Param | Description |
    | --- | --- |
    | id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
    | username | *optional* (example:  user7) |
    | locked | *optional* (example:  true) |
    | locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
    | group_request | *optional* (example:  superadmin) |
    | failed_login_attempts | *optional* (example:  0) |
    | change_username | *optional* (example:  false) |
    | change_password | *optional* (example:  false) |
    | reset_password | *optional* (example:  false) |
    | email_verify | *optional* (example:  false) |
    | group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
    | email | *optional* (example:  test@test.ai) |
    | created_on | *optional* (example:  1568419646794) |
    | last_login | *optional* (example:  null) |
      * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
      */
    static async get(authorization_bearer, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/users`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }
}
/**
 * 
 */
class User {
    constructor() {}


    /**
     * editPropertyValue - Edit a current user's property data as a path param.
     * @param {any} id Id or Username  
     * @param {any} property  (example: group_id)
     * @param {any} value  (example: 595d3f9a-5383-4da9-a465-b975d8a5e28e)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async editPropertyValue(id, property, value, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/id/${id}/${property}/${value}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * delete - Delete a user by it's Id.
     * @param {any} id Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async delete(id, authorization_bearer, opts) {
        var options = {
            method: 'DELETE',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/id/${id}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * editProperty - Edit a user's property by id.
     * @param {Object} body
     * @param {any} id Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
     * @param {any} prop  (example: username)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     * @example
     * body
     * ```js
     * user6
     * ```
     */
    static async editProperty(body, id, prop, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/id/${id}/${prop}`,
            body,
            json: true,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * edit - Edit a user's by id.
     * @param {Object} body
     * @param {any} id Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     * @example
     * body
     * ```js
     * {
     *     "username": "user6",
     *     "password": "Awickednewawesomepasword4242!@"
     * }
     * ```
     */
    static async edit(body, id, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/id/${id}`,
            body,
            json: true,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * getProperty - Get a user's property by it's id.
     * @param {any} id Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
     * @param {any} prop  (example: username)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async getProperty(id, prop, authorization_bearer, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/id/${id}/${prop}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * get - Get a user by it's id.
     * @param {any} id  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async get(id, authorization_bearer, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/id/${id}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static get Current() {
        return UserCurrent;
    }
}
/**
 * 
 */
class UserCurrent {
    constructor() {}


    /**
     * editPropertyValue - Edit a current user's property data as a path param.
     * @param {any} property  (example: group_id)
     * @param {any} value  (example: 595d3f9a-5383-4da9-a465-b975d8a5e28e)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async editPropertyValue(property, value, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me/${property}/${value}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * editProperty - Edit a current user's property data.
     * @param {Object} body
     * @param {any} property  (example: user_data)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     * @example
     * body
     * ```js
     * {
     *     "test": 123
     * }
     * ```
     */
    static async editProperty(body, property, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me/${property}`,
            body,
            json: true,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * deleteToken - Deletes a client_credentials based access token auth.
     * @param {Object} body
     * @param {any} id id or name of the token 
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     * @example
     * body
     * ```js
     * {
     *     "name": "test"
     * }
     * ```
     */
    static async deleteToken(body, id, authorization_bearer, opts) {
        var options = {
            method: 'DELETE',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me/token/${id}`,
            body,
            json: true,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * registerToken - Registers a new credentials service for client_credentials based access token auth.
     * @param {Object} body
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     * @example
     * body
     * ```js
     * {
     *     "name": "conversate"
     * }
     * ```
     */
    static async registerToken(body, authorization_bearer, opts) {
        var options = {
            method: 'POST',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me/token`,
            body,
            json: true,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * edit - Updates the current logged in user.
     * @param {Object} body
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     * @example
     * body
     * ```js
     * {
     *     "username": "user6",
     *     "password": "Awickednewawesomepasword4242!@"
     * }
     * ```
     */
    static async edit(body, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me`,
            body,
            json: true,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * getProperty - Gets the currently logged in user's single property 
     * @param {any} property  (example: username)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async getProperty(property, authorization_bearer, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me/${property}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * routeCheck - Checks if current logged in user can access the route with method.
     * @param {any} method  (example: get)
     * @param {any} route  (example: /travelling/api/v1/users/me)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async routeCheck(method, route, authorization_bearer, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me/route/allowed`,
            qs: {
                method,
                route
            },
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * permissionCheck - Checks to see if the current user can access content based on permission.
     * @param {any} permission name of the route/permission (example: get-travelling)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async permissionCheck(permission, authorization_bearer, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me/permission/allowed/${permission}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * get - Gets the currently logged in user
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async get(authorization_bearer, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me`,
            json: true,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }
}
/**
 * 
 */
class Groups {
    constructor() {}


    /**
     * export - Exports all groups in the proper format to be imported.
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async export (authorization_bearer, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/groups/export`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * import - Imports all groups from the exported format.
     * @param {Object} body
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     * @example
     * body
     * ```js
     * {
     *     "testgroup": {
     *         "group1": {
     *             "inherited": [
     *                 "group|group4"
     *             ]
     *         },
     *         "superadmin": {}
     *     },
     *     "group": {
     *         "anonymous": {
     *             "allowed": [{
     *                     "route": "/travelling/portal/*",
     *                     "host": null,
     *                     "name": "*-travelling-portal-*"
     *                 },
     *                 {
     *                     "route": "/travelling/api/v1/auth/*",
     *                     "host": null,
     *                     "name": "*-travelling-api-v1-auth-*"
     *                 },
     *                 {
     *                     "route": "/travelling/api/v1/user/me/route/allowed",
     *                     "host": null,
     *                     "method": "GET",
     *                     "name": "get-travelling-api-v1-user-me-route-allowed"
     *                 },
     *                 {
     *                     "route": "/travelling/api/v1/user/me/permission/allowed/*",
     *                     "host": null,
     *                     "method": "GET",
     *                     "name": "get-travelling-api-v1-user-me-permission-allowed-*"
     *                 },
     *                 {
     *                     "route": "/travelling/assets/*",
     *                     "host": null,
     *                     "remove_from_path": "/travelling/assets/",
     *                     "method": "GET",
     *                     "name": "get-travelling-assets-*"
     *                 },
     *                 {
     *                     "route": "/travelling/api/v1/config/password",
     *                     "host": null,
     *                     "method": "GET",
     *                     "name": "get-travelling-api-v1-config-password"
     *                 },
     *                 {
     *                     "route": "/favicon.ico",
     *                     "host": null,
     *                     "method": "GET",
     *                     "name": "get-favicon.ico"
     *                 }
     *             ]
     *         },
     *         "group4": {},
     *         "group1": {},
     *         "group3": {
     *             "inherited": [
     *                 "testgroup|group1",
     *                 "group|group2"
     *             ]
     *         },
     *         "superadmin": {
     *             "allowed": [{
     *                     "host": null,
     *                     "route": "/travelling/*",
     *                     "name": "*-travelling-*"
     *                 },
     *                 {
     *                     "name": "test-one-*-three"
     *                 }
     *             ],
     *             "inherited": [
     *                 "group|anonymous"
     *             ]
     *         },
     *         "group2": {
     *             "allowed": [{
     *                     "route": "/test/get",
     *                     "host": "https://127.0.0.1:4268/:username/:group",
     *                     "remove_from_path": "/test/get",
     *                     "method": "GET",
     *                     "name": "get-test-get"
     *                 },
     *                 {
     *                     "route": "/test/post",
     *                     "host": "http://127.0.0.1:4267/?id=:id&permission=:permission",
     *                     "remove_from_path": "/test/post",
     *                     "method": "POST",
     *                     "name": "post-test-post"
     *                 }
     *             ],
     *             "inherited": [
     *                 "testgroup|group1"
     *             ]
     *         },
     *         "group5": {
     *             "allowed": [{
     *                 "route": "/test/delete/:grouptype",
     *                 "host": "https://127.0.0.1:4268",
     *                 "remove_from_path": "/test/delete",
     *                 "method": "DELETE",
     *                 "name": "delete-test-delete-:grouptype"
     *             }],
     *             "inherited": [
     *                 "group|group4",
     *                 "group|superadmin"
     *             ],
     *             "is_default": true
     *         }
     *     }
     * }
     * ```
     */
    static async import(body, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/groups/import`,
            body,
            json: true,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * get - Get all the groups
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async get(authorization_bearer, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/groups`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static get Type() {
        return GroupsType;
    }
}
/**
 * 
 */
class GroupsType {
    constructor() {}


    /**
     * all - Gets all groups of a particular type
     * @param {any} type The type of the group 
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async all(type, authorization_bearer, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/groups/type/${type}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * getTypesList - Gets all the types of groups currently made.
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async getTypesList(authorization_bearer, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/groups/types`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }
}
/**
 * 
 */
class Group {
    constructor() {}


    /**
     * addPermission - Adds a permission to a group.
     * @param {any} name Name of the group (example: anonymous)
     * @param {any} permission Permission (example: test-one-two-*)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async addPermission(name, permission, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/name/${name}/insert/permission/${permission}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * deletePermission - Removes a permission/route from a group.
     * @param {any} name Name of the group (example: anonymous)
     * @param {any} permission Name or Route (example: test-one-two-*)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async deletePermission(name, permission, authorization_bearer, opts) {
        var options = {
            method: 'DELETE',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/name/${name}/permission/${permission}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
      * addRoute - Adds a route to a group.

    ```javascript
    {
        "route": "test/permissions/*", // optional
        "host": null, // optional, defaults to travelling host
        "method": "*", // optional, defaults to '*'
        "remove_from_path": 'test/', // optional 
        "name": "test-permissions-*"  // Required and needs to be unqiue, defaults to method + route seperated by '-' instead of `/`
    }
    ```
      * @param {Object} body
      * @param {any} name  
      * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
      * @example
      * body
      * ```js
      * {
     *     "route": "test/permissions/*",
     *     "host": null,
     *     "method": "*",
     *     "name": "test-permissions-*"
     * }
      * ```
      */
    static async addRoute(body, name, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/name/${name}/insert/route`,
            body,
            json: true,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * removeInheritance - Removes an inheritance from a group.
     * @param {any} name Name of the group (example: test1234)
     * @param {any} inherited Name of the group to inherit from (example: group4)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async removeInheritance(name, inherited, authorization_bearer, opts) {
        var options = {
            method: 'DELETE',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/name/${name}/remove/inheritance/${inherited}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * inheritFrom - Adds an inheritance to a group.
     * @param {any} name Name of the group (example: test1234)
     * @param {any} inherited Name of the group to inherit from (example: group4)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async inheritFrom(name, inherited, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/name/${name}/inherit/from/${inherited}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * setDefault - Sets the group to be the default group for new users.
     * @param {any} name id or name (example: group6)
     */
    static async setDefault(name, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/name/${name}/set/default`,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * delete - delete group by its id or name
     * @param {any} name id or name  
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async delete(name, authorization_bearer, opts) {
        var options = {
            method: 'DELETE',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/name/${name}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * edit - Edits a group
     * @param {Object} body
     * @param {any} name  (example: ab31efc8-40a5-4d38-a347-adb4e38d0075)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     * @example
     * body
     * ```js
     * {
     *     "allowed": [{
     *             "route": "/travelling/portal/*",
     *             "host": null,
     *             "remove_from_path": "/travelling/portal",
     *             "method": "*",
     *             "name": "*-travelling-portal-*"
     *         },
     *         {
     *             "route": "/travelling/api/v1/auth/*",
     *             "host": null,
     *             "method": "*",
     *             "name": "*-travelling-api-v1-auth-*"
     *         },
     *         {
     *             "route": "/travelling/api/v1/user/me/route/allowed",
     *             "host": null,
     *             "method": "GET",
     *             "name": "get-travelling-api-v1-user-me-route-allowed"
     *         },
     *         {
     *             "route": "/travelling/api/v1/user/me/permission/allowed/*",
     *             "host": null,
     *             "method": "GET",
     *             "name": "get-travelling-api-v1-user-me-permission-allowed-*"
     *         },
     *         {
     *             "route": "/travelling/assets/*",
     *             "host": null,
     *             "remove_from_path": "/travelling/assets/",
     *             "method": "*",
     *             "name": "*-travelling-assets-*"
     *         },
     *         {
     *             "route": "travelling/api/v1/config/password",
     *             "host": null,
     *             "method": "get"
     *         }
     *     ]
     * }
     * ```
     */
    static async edit(body, name, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/name/${name}`,
            body,
            json: true,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * get - Get a group by it's id or name.
     * @param {any} id id or name  (example: group1)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async get(id, authorization_bearer, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/name/${id}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * createByName - Add a new blank group with the set name.
     * @param {any} name Name of the new group (example: test123)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async createByName(name, authorization_bearer, opts) {
        var options = {
            method: 'POST',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/name/${name}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * create - Add a new group
     * @param {Object} body
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     * @example
     * body
     * ```js
     * {
     *     "name": "group1",
     *     "type": "accounts",
     *     "allowed": [{
     *         "route": "/test",
     *         "host": "http://127.0.0.1:1237/",
     *         "remove_from_path": "test",
     *         "method": "*",
     *         "name": "all-test"
     *     }],
     *     "is_default": false
     * }
     * ```
     */
    static async create(body, authorization_bearer, opts) {
        var options = {
            method: 'POST',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group`,
            body,
            json: true,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static get Users() {
        return GroupUsers;
    }

    static get Type() {
        return GroupType;
    }

    static get Request() {
        return GroupRequest;
    }
}
/**
 * 
 */
class GroupUsers {
    constructor() {}


    /**
      * inherited - Gets all the users that belong to the group and all of its inherited groups.

    ##### Optional Query Params

    | Param | Description |
    | --- | --- |
    | id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
    | username | *optional* (example:  user7) |
    | locked | *optional* (example:  true) |
    | locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
    | group_request | *optional* (example:  superadmin) |
    | failed_login_attempts | *optional* (example:  0) |
    | change_username | *optional* (example:  false) |
    | change_password | *optional* (example:  false) |
    | reset_password | *optional* (example:  false) |
    | email_verify | *optional* (example:  false) |
    | group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
    | email | *optional* (example:  test@test.ai) |
    | created_on | *optional* (example:  1568419646794) |
    | last_login | *optional* (example:  null) |
      * @param {any} name id or name (example: superadmin)
      */
    static async inherited(name, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/name/${name}/users/inherited`,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
      * get - Gets all the users that belong to the group.

    ##### Optional Query Params

    | Param | Description |
    | --- | --- |
    | id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
    | username | *optional* (example:  user7) |
    | locked | *optional* (example:  true) |
    | locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
    | group_request | *optional* (example:  superadmin) |
    | failed_login_attempts | *optional* (example:  0) |
    | change_username | *optional* (example:  false) |
    | change_password | *optional* (example:  false) |
    | reset_password | *optional* (example:  false) |
    | email_verify | *optional* (example:  false) |
    | group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
    | email | *optional* (example:  test@test.ai) |
    | created_on | *optional* (example:  1568419646794) |
    | last_login | *optional* (example:  null) |
      * @param {any} name id or name (example: superadmin)
      */
    static async get(name, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/name/${name}/users`,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }
}
/**
 * 
 */
class GroupType {
    constructor() {}


    /**
     * deletePermission - Removes a permission/route from a group of a particular type.
     * @param {any} type Type of the group (example: group)
     * @param {any} name Name of the group (example: anonymous)
     * @param {any} permission Name or Route (example: test-one-three-*)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async deletePermission(type, name, permission, authorization_bearer, opts) {
        var options = {
            method: 'DELETE',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/type/${type}/name/${name}/permission/${permission}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * addPermission - Adds a permission to a group of a particular type.
     * @param {any} type Type of the group (example: group)
     * @param {any} name Name of the group (example: anonymous)
     * @param {any} permission Permission  (example: test-one-three-*)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async addPermission(type, name, permission, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/type/${type}/name/${name}/insert/permission/${permission}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
      * addRoute - Adds a route to a group of a particular type.

    ```javascript
    {
        "route": "test/permissions/*", // optional
        "host": null, // optional, defaults to travelling host
        "method": "*", // optional, defaults to '*'
        "remove_from_path": 'test/', // optional 
        "name": "test-permissions-*"  // Required and needs to be unqiue, defaults to method + route seperated by '-' instead of `/`
    }
    ```
      * @param {Object} body
      * @param {any} type  
      * @param {any} name Name of the group 
      * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
      * @example
      * body
      * ```js
      * {
     *     "route": "test/permissions/*",
     *     "host": null,
     *     "method": "*",
     *     "name": "test-permissions-*"
     * }
      * ```
      */
    static async addRoute(body, type, name, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/type/${type}/name/${name}/insert/route`,
            body,
            json: true,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * removeInheritance - Removes an inheritance from a group of a particular type.
     * @param {any} type The type of the group (example: accounts)
     * @param {any} name Name of the group (example: test1234)
     * @param {any} inherited Name of the group to inherit from (example: superadmin)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async removeInheritance(type, name, inherited, authorization_bearer, opts) {
        var options = {
            method: 'DELETE',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/type/${type}/name/${name}/remove/inheritance/${inherited}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * inheritFrom - Adds an inheritance to a group of a particular type.
     * @param {any} type The type of the group (example: testgroup)
     * @param {any} name Name of the group (example: group1)
     * @param {any} inherited Name of the group to inherit from (example: test123)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async inheritFrom(type, name, inherited, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/type/${type}/name/${name}/inherit/from/${inherited}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * setDefault - Sets the group of a particular type to be the default group for new users.
     * @param {any} type The type of the group (example: account)
     * @param {any} name id or name (example: group1)
     */
    static async setDefault(type, name, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/type/${type}/name/${name}/set/default`,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * delete - delete group of a particular type by its name or id
     * @param {any} type The type of the group 
     * @param {any} name id or name  
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async delete(type, name, authorization_bearer, opts) {
        var options = {
            method: 'DELETE',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/type/${type}/name/${name}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * get - Get a group by it's id or name of a particular type.
     * @param {any} type The type of the group (example: accounts)
     * @param {any} id id or name  (example: group1)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async get(type, id, authorization_bearer, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/type/${type}/name/${id}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * edit - Edits a group of a particular type
     * @param {Object} body
     * @param {any} type The type of the group 
     * @param {any} name id or name  
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     * @example
     * body
     * ```js
     * {
     *     "inherited": ["a717b880-b17b-4995-9610-cf451a06d015", "7ec8c351-7b8a-4ea8-95cc-0d990b225768"]
     * }
     * ```
     */
    static async edit(body, type, name, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/type/${type}/name/${name}`,
            body,
            json: true,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * createByName - Add a new blank group with the set name and type
     * @param {any} type Type of the new group (example: accounts)
     * @param {any} name Name of the new group (example: test1234)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async createByName(type, name, authorization_bearer, opts) {
        var options = {
            method: 'POST',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/type/${type}/name/${name}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * create - Add a new group of a particular type
     * @param {Object} body
     * @param {any} type The type of the group 
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     * @example
     * body
     * ```js
     * {
     *     "name": "group1",
     *     "type": "accounts",
     *     "allowed": [{
     *         "route": "/test",
     *         "host": "http://127.0.0.1:1237/",
     *         "remove_from_path": "test",
     *         "method": "*",
     *         "name": "all-test"
     *     }],
     *     "is_default": false
     * }
     * ```
     */
    static async create(body, type, authorization_bearer, opts) {
        var options = {
            method: 'POST',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/type/${type}`,
            body,
            json: true,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static get Users() {
        return GroupTypeUsers;
    }

    static get User() {
        return GroupTypeUser;
    }
}
/**
 * Both requests are disabled. Dont use.
 */
class GroupTypeUsers {
    constructor() {}


    /**
      * get - Gets all the users that belong to the group  of a particular type by its name or id.

    ##### Optional Query Params

    | Param | Description |
    | --- | --- |
    | id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
    | username | *optional* (example:  user7) |
    | locked | *optional* (example:  true) |
    | locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
    | group_request | *optional* (example:  superadmin) |
    | failed_login_attempts | *optional* (example:  0) |
    | change_username | *optional* (example:  false) |
    | change_password | *optional* (example:  false) |
    | reset_password | *optional* (example:  false) |
    | email_verify | *optional* (example:  false) |
    | group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
    | email | *optional* (example:  test@test.ai) |
    | created_on | *optional* (example:  1568419646794) |
    | last_login | *optional* (example:  null) |
      * @param {any} type  
      * @param {any} name  
      */
    static async get(type, name, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/type/${type}/name/${name}/users`,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
      * inherited - Gets all the users that belong to the group  of a particular type by its name or id and all of its inherited groups.

    ##### Optional Query Params

    | Param | Description |
    | --- | --- |
    | id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
    | username | *optional* (example:  user7) |
    | locked | *optional* (example:  true) |
    | locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
    | group_request | *optional* (example:  superadmin) |
    | failed_login_attempts | *optional* (example:  0) |
    | change_username | *optional* (example:  false) |
    | change_password | *optional* (example:  false) |
    | reset_password | *optional* (example:  false) |
    | email_verify | *optional* (example:  false) |
    | group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
    | email | *optional* (example:  test@test.ai) |
    | created_on | *optional* (example:  1568419646794) |
    | last_login | *optional* (example:  null) |
      * @param {any} type The type of the group (example: groups)
      * @param {any} name  (example: group4)
      */
    static async inherited(type, name, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/type/${type}/name/${name}/users/inherited`,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }
}
/**
 * 
 */
class GroupTypeUser {
    constructor() {}


    /**
     * delete - Delete a user by it's id or username from group of a particular type.
     * @param {any} type The type of the group (example: accounts)
     * @param {any} id id or name (example: user7)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async delete(type, id, authorization_bearer, opts) {
        var options = {
            method: 'DELETE',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/type/${type}/user/${id}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * editPropertyValue - Edit a current user's property data as a path param.
     * @param {any} type The type of the group (example: group)
     * @param {any} id id or name (example: user5)
     * @param {any} property  (example: email)
     * @param {any} value  (example: swag@yolo.com)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async editPropertyValue(type, id, property, value, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/type/${type}/user/${id}/${property}/${value}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * editProperty - Edit a user's property by it's id or username from group of a particular type.
     * @param {Object} body
     * @param {any} type The type of the group (example: accounts)
     * @param {any} id id or name (example: user6)
     * @param {any} property  (example: email)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     * @example
     * body
     * ```js
     * {
     *     "locked": false
     * }
     * ```
     */
    static async editProperty(body, type, id, property, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/type/${type}/user/${id}/${property}`,
            body,
            authorization: {
                bearer: authorization_bearer
            },
            json: true,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * edit - Edit a user by it's id or username from group of a particular type.
     * @param {Object} body
     * @param {any} type The type of the group (example: accounts)
     * @param {any} id id or name (example: user6)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     * @example
     * body
     * ```js
     * {
     *     "locked": false
     * }
     * ```
     */
    static async edit(body, type, id, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/type/${type}/user/${id}`,
            body,
            authorization: {
                bearer: authorization_bearer
            },
            json: true,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * getProperty - Get a user's property by it's id or username from group of a particular type.
     * @param {any} type The type of the group (example: accounts)
     * @param {any} id id or name (example: user6)
     * @param {any} property  (example: email)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async getProperty(type, id, property, authorization_bearer, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/type/${type}/user/${id}/${property}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * get - Get a user by it's id or username from group of a particular type.
     * @param {any} type The type of the group (example: accounts)
     * @param {any} id id or name (example: user6)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async get(type, id, authorization_bearer, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/type/${type}/user/${id}`,
            authorization: {
                bearer: authorization_bearer
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }
}
/**
 * 
 */
class GroupRequest {
    constructor() {}

    static get User() {
        return GroupRequestUser;
    }
}
/**
 * 
 */
class GroupRequestUser {
    constructor() {}


    /**
     * edit - Edit a user by it's id or username from the user's `group_request` of a particular type.
     * @param {Object} body
     * @param {any} type  (example: accounts)
     * @param {any} id  (example: user6)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     * @example
     * body
     * ```js
     * {
     *     "locked": false
     * }
     * ```
     */
    static async edit(body, type, id, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/request/type/${type}/user/${id}`,
            body,
            authorization: {
                bearer: authorization_bearer
            },
            json: true,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * editProperty - Edit a user's property by it's id or username from the user's `group_request` of a particular type.
     * @param {Object} body
     * @param {any} type  (example: accounts)
     * @param {any} id  (example: user6)
     * @param {any} property  (example: email)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     * @example
     * body
     * ```js
     * {
     *     "locked": false
     * }
     * ```
     */
    static async editProperty(body, type, id, property, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/request/type/${type}/user/${id}/${property}`,
            body,
            authorization: {
                bearer: authorization_bearer
            },
            json: true,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }
}
/**
 * #### Auth endpoints 
 * 
 */
class Auth {
    constructor() {}


    /**
     * accessToken - Oauth2 `client_credentials` access token flow. Body must be `application/x-www-form-urlencoded` and must contain the `grant_type`. `client_id` & `client_secret` will be sent in a `Basic` Authorization header as `base64(client_id:client_secret)`
     */
    static async accessToken(grant_type, code, client_id, client_secret, redirect_uri, opts) {
        var options = {
            method: 'POST',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/auth/token`,
            form: {
                grant_type,
                code,
                client_id,
                client_secret,
                redirect_uri
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * activate - Activates and unlocks user
     * @param {any} token  (example: activation_token)
     */
    static async activate(token, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/auth/activate`,
            qs: {
                token
            },
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * resetPassword - Resets the password if the recovery token is vaild of the user.
     * @param {Object} body
     * @param {any} token  (example: [thegeneratedtoken])
     * @example
     * body
     * ```js
     * {
     *     "password": "asdf"
     * }
     * ```
     */
    static async resetPassword(body, token, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/auth/password/reset`,
            qs: {
                token
            },
            body,
            json: true,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * forgotPassword - Generates a recovery token and sends a email to the attached user (if they exist) 
     * @param {Object} body
     * @example
     * body
     * ```js
     * {
     *     "email": "joseph@abe.ai"
     * }
     * ```
     */
    static async forgotPassword(body, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/auth/password/forgot`,
            body,
            json: true,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * logout - 
     */
    static async logout(opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/auth/logout`,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
     * login - Register a user
     * @param {Object} body
     * @example
     * body
     * ```js
     * {
     *     "username": "user5",
     *     "password": "swagmoney69xd420"
     * }
     * ```
     */
    static async login(body, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/auth/login`,
            body,
            json: true,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }


    /**
      * register - Register a user

    `group_request`	is optional.
      * @param {Object} body
      * @example
      * body
      * ```js
      * {
     *     "username": "user5",
     *     "password": "swagmoney69xd420",
     *     "email": "test@test.com"
     * }
      * ```
      */
    static async register(body, opts) {
        var options = {
            method: 'POST',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/auth/register`,
            body,
            json: true,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }
}
module.exports = function(host) {
    if (host) {
        hostUrl = host;
    }
    return {
        Travelling,
        Config,
        Users,
        User,
        UserCurrent,
        Groups,
        GroupsType,
        Group,
        GroupUsers,
        GroupType,
        GroupTypeUsers,
        GroupTypeUser,
        GroupRequest,
        GroupRequestUser,
        Auth
    };
}
