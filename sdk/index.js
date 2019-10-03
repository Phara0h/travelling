const fasq = require('fasquest');
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
            uri: hostUrl + "/" + `travelling/api/v1/users/${group_request}`,
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
     * delete - Delete a user by it's Id.
     * @param {any} id  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
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
     * @param {any} id  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
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
     * @param {any} id  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
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
     * @param {any} id  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
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
     *     "anonymous": {
     *         "type": "group",
     *         "allowed": [{
     *                 "route": "/travelling/portal/*",
     *                 "host": null,
     *                 "removeFromPath": "/travelling/portal",
     *                 "method": "*",
     *                 "name": "*-travelling-portal-*"
     *             },
     *             {
     *                 "route": "/travelling/api/v1/auth/*",
     *                 "host": null,
     *                 "method": "*",
     *                 "name": "*-travelling-api-v1-auth-*"
     *             },
     *             {
     *                 "route": "/travelling/api/v1/user/me/route/allowed",
     *                 "host": null,
     *                 "method": "GET",
     *                 "name": "get-travelling-api-v1-user-me-route-allowed"
     *             },
     *             {
     *                 "route": "/travelling/api/v1/user/me/permission/allowed/*",
     *                 "host": null,
     *                 "method": "GET",
     *                 "name": "get-travelling-api-v1-user-me-permission-allowed-*"
     *             },
     *             {
     *                 "route": "/travelling/assets/*",
     *                 "host": null,
     *                 "removeFromPath": "/travelling/assets/",
     *                 "method": "*",
     *                 "name": "*-travelling-assets-*"
     *             },
     *             {
     *                 "route": "travelling/api/v1/config/password",
     *                 "host": null,
     *                 "method": "GET",
     *                 "name": "gettravelling-api-v1-config-password"
     *             },
     *             {
     *                 "route": "/favicon.ico",
     *                 "host": null,
     *                 "method": "GET",
     *                 "name": "get-favicon.ico"
     *             }
     *         ],
     *         "inherited": null,
     *         "is_default": false
     *     },
     *     "group2": {
     *         "type": "accounts",
     *         "allowed": null,
     *         "inherited": [
     *             "group1"
     *         ],
     *         "is_default": false
     *     },
     *     "group4": {
     *         "type": "accounts",
     *         "allowed": null,
     *         "inherited": [
     *             "group2",
     *             "group3"
     *         ],
     *         "is_default": false
     *     },
     *     "group1": {
     *         "type": "accounts",
     *         "allowed": null,
     *         "inherited": null,
     *         "is_default": false
     *     },
     *     "group3": {
     *         "type": "accounts",
     *         "allowed": null,
     *         "inherited": [
     *             "group9"
     *         ],
     *         "is_default": false
     *     },
     *     "group9": {
     *         "type": "swag2",
     *         "allowed": null,
     *         "inherited": null,
     *         "is_default": true
     *     },
     *     "superadmin": {
     *         "type": "group",
     *         "allowed": [{
     *             "host": null,
     *             "route": "/travelling/*",
     *             "method": "*",
     *             "name": "*-travelling-*"
     *         }],
     *         "inherited": [
     *             "anonymous"
     *         ],
     *         "is_default": false
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
}
/**
 * 
 */
class Group {
    constructor() {}


    /**
     * delete - delete group by its id or name
     * @param {Object} body
     * @param {any} name id or name  
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
     *         "removeFromPath": "test",
     *         "method": "*",
     *         "name": "all-test"
     *     }],
     *     "is_default": false
     * }
     * ```
     */
    static async delete(body, name, authorization_bearer, opts) {
        var options = {
            method: 'DELETE',
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
     * addRoute - Adds a route to a group.
     * @param {Object} body
     * @param {any} name  
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     * @example
     * body
     * ```js
     * {
     *     "route": "cui/permissions/*",
     *     "host": null,
     *     "method": "*",
     *     "name": "cui-*"
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
     *             "removeFromPath": "/travelling/portal",
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
     *             "removeFromPath": "/travelling/assets/",
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
     *         "removeFromPath": "test",
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
            uri: hostUrl + "/" + `travelling/api/v1/group/name/${name}/inherited`,
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
            uri: hostUrl + "/" + `travelling/api/v1/name/${name}/users`,
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
     * addRoute - Adds a route to a group of a particular type.
     * @param {Object} body
     * @param {any} type  
     * @param {any} name  
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     * @example
     * body
     * ```js
     * {
     *     "route": "cui/permissions/*",
     *     "host": null,
     *     "method": "*",
     *     "name": "cui-*"
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
     * setDefault - Sets the group of a particular type to be the default group for new users.
     * @param {any} type  (example: account)
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
     * @param {Object} body
     * @param {any} type The type of the group 
     * @param {any} name id or name  
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
     *         "removeFromPath": "test",
     *         "method": "*",
     *         "name": "all-test"
     *     }],
     *     "is_default": false
     * }
     * ```
     */
    static async delete(body, type, name, authorization_bearer, opts) {
        var options = {
            method: 'DELETE',
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
     *         "removeFromPath": "test",
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
     * editByName - Edits a group of a particular type
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
    static async editByName(body, type, name, authorization_bearer, opts) {
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

    static get Users() {
        return TypeUsers;
    }

    static get User() {
        return TypeUser;
    }
}
/**
 * 
 */
class TypeUsers {
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
class TypeUser {
    constructor() {}


    /**
     * delete - Delete a user by it's id or username from group of a particular type.
     * @param {any} type  (example: accounts)
     * @param {any} id  (example: user7)
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
     * edit - Edit a user by it's id or username from group of a particular type.
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
     * get - Get a user by it's id or username from group of a particular type.
     * @param {any} type  (example: accounts)
     * @param {any} id  (example: user6)
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
        Users,
        User,
        UserCurrent,
        Groups,
        Group,
        GroupUsers,
        GroupType,
        TypeUsers,
        TypeUser,
        Auth
    };
}
