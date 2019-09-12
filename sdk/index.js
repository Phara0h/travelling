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

    static get User() {
        return User;
    }

    static get Groups() {
        return Groups;
    }

    static get Auth() {
        return Auth;
    }
}
/**
 * 
 */
class User {
    constructor() {}


    /**
     * deleteByUsername - Delete a user by it's username.
     * @param {any} username  (example: test)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async deleteByUsername(username, authorization_bearer, opts) {
        var options = {
            method: 'DELETE',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/username/${username}`,
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
     * deleteById - Delete a user by it's Id.
     * @param {any} id  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async deleteById(id, authorization_bearer, opts) {
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
     * editByUsername - Edit a user's by username.
     * @param {Object} body
     * @param {any} username  (example: test)
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
    static async editByUsername(body, username, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/username/${username}`,
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
     * editPropertyByUsername - Edit a user's property by Username.
     * @param {Object} body
     * @param {any} username  (example: test)
     * @param {any} prop  (example: email)
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
    static async editPropertyByUsername(body, username, prop, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/username/${username}/${prop}`,
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
     * editPropertyById - Edit a user's property by id.
     * @param {Object} body
     * @param {any} id  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
     * @param {any} prop  (example: username)
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
    static async editPropertyById(body, id, prop, authorization_bearer, opts) {
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
     * editById - Edit a user's by id.
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
    static async editById(body, id, authorization_bearer, opts) {
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
     * getAll - Gets all the users
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async getAll(authorization_bearer, opts) {
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


    /**
     * getPropertyById - Get a user's property by it's id.
     * @param {any} id  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
     * @param {any} prop  (example: username)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async getPropertyById(id, prop, authorization_bearer, opts) {
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
     * getPropertyByUsername - Gets the user's property
     * @param {any} username  (example: user1)
     * @param {any} prop  (example: id)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async getPropertyByUsername(username, prop, authorization_bearer, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/username/${username}/${prop}`,
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
     * getById - Get a user by it's id.
     * @param {any} id  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async getById(id, authorization_bearer, opts) {
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


    /**
     * getByUsername - Get user by their username
     * @param {any} username  (example: user1)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async getByUsername(username, authorization_bearer, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/username/${username}`,
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
        return Current;
    }
}
/**
 * 
 */
class Current {
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
     * registerToken - Registers a new credentials service for client_credentials based access token auth.
     * @param {Object} body
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     * @example
     * body
     * ```js
     * {
     *     "name": "test"
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
     * getUserProperty - Gets the currently logged in user's single property 
     * @param {any} property  (example: username)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async getUserProperty(property, authorization_bearer, opts) {
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
     * getUser - Gets the currently logged in user
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async getUser(authorization_bearer, opts) {
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
     * getByType - Gets all groups of a certain type.
     * @param {any} type  
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async getByType(type, authorization_bearer, opts) {
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
     * allGroups - Get all the groups
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     */
    static async allGroups(authorization_bearer, opts) {
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


    /**
     * addRoute - Adds a route to a group.
     * @param {Object} body
     * @param {any} groupname  (example: cuipermissions)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     * @example
     * body
     * ```js
     * {
     *     "route": "cui/permissions/*",
     *     "host": null,
     *     "method": "*",
     *     "name": "*-cui-*"
     * }
     * ```
     */
    static async addRoute(body, groupname, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/${groupname}/route`,
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
     * editByName - Edits a group
     * @param {Object} body
     * @param {any} groupname  (example: 15)
     * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
     * @example
     * body
     * ```js
     * {
     *     "id": 15,
     *     "name": "anonymous",
     *     "type": "group",
     *     "allowed": [{
     *             "route": "/cui/portal/*",
     *             "host": "http://127.0.0.1:4203",
     *             "removeFromPath": "/cui/portal",
     *             "method": "*",
     *             "name": "*-cui-portal-*"
     *         },
     *         {
     *             "route": "/sockjs-node/*",
     *             "host": "http://127.0.0.1:4203",
     *             "method": "*",
     *             "name": "*-cui-portal-files4-*"
     *         },
     *         {
     *             "route": "/assets/*",
     *             "host": "http://127.0.0.1:4203",
     *             "method": "*",
     *             "name": "*-cui-portal-files6-*"
     *         },
     *         {
     *             "route": "/*.*",
     *             "host": "http://127.0.0.1:4203",
     *             "method": "*",
     *             "name": "*-cui-portal-files-*"
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
     *         }
     *     ],
     *     "inherited": null,
     *     "is_default": true
     * }
     * ```
     */
    static async editByName(body, groupname, authorization_bearer, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/${groupname}`,
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
}
/**
 * #### Auth endpoints 
 * 
 */
class Auth {
    constructor() {}


    /**
     * accessToken - Oauth2 `client_credentials` access token flow. Body must be `application/x-www-form-urlencoded` and must contain the `grant_type`. `client_id` & `client_secret` will be sent in a `Basic` Authorization header as `base64(client_id:client_secret)`
     * @param {string} authorization_client username/client_id
     * @param {string} authorization_secret password/client_secret
     */
    static async accessToken(grant_type, authorization_client, authorization_secret, opts) {
        var options = {
            method: 'POST',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/auth/token`,
            form: {
                grant_type
            },
            authorization: {
                basic: {
                    client: authorization_client,
                    secret: authorization_secret
                }
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
     * @param {Object} body
     * @example
     * body
     * ```js
     * {
     *     "username": "user5",
     *     "password": "swagmoney69xd420",
     *     "email": "jt@abe.ai"
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
    return Travelling;
}
