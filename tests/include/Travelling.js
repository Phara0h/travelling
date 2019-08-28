const fasq = require('fasquest');
var hostUrl = '';
class Travelling {
    constructor() {}

    static async healthCheck() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/_health`,
        };
        return await fasq.request(options)
    }

    static async metrics() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/metrics`,
        };
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
class User {
    constructor() {}

    static async deleteById() {
        var options = {
            method: 'DELETE',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/id/9`,
        };
        return await fasq.request(options)
    }

    static async editById(body) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/id/10`,
            body,
            json: true,
        };
        return await fasq.request(options)
    }

    static async getAll() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/users`,
        };
        return await fasq.request(options)
    }

    static async getPropertyById(id, prop) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/id/${id}/${prop}`,
        };
        return await fasq.request(options)
    }

    static async getPropertyByUsername_(username, prop) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/username/${username}/${prop}`,
        };
        return await fasq.request(options)
    }

    static async getById(id) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/id/${id}`,
        };
        return await fasq.request(options)
    }

    static async getByUsername(username) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/username/${username}`,
        };
        return await fasq.request(options)
    }

    static get Current() {
        return Current;
    }
}
class Current {
    constructor() {}

    static async editProperty(body, property) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me/${property}`,
            body,
            json: true,
        };
        return await fasq.request(options)
    }

    static async edit(body) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me`,
            body,
            json: true,
        };
        return await fasq.request(options)
    }

    static async getUserProperty(property) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me/${property}`,
        };
        return await fasq.request(options)
    }

    static async routeCheck(method, route) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me/route/allowed`,
            qs: {
                method,
                route
            },
        };
        return await fasq.request(options)
    }

    static async permissionCheck(permission) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me/permission/allowed/${permission}`,
        };
        return await fasq.request(options)
    }

    static async getUser() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me`,
            json: true,
        };
        return await fasq.request(options)
    }
}
class Groups {
    constructor() {}

    static async getTypesList() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/groups/types`,
        };
        return await fasq.request(options)
    }

    static async getByType(type) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/groups/type/${type}`,
        };
        return await fasq.request(options)
    }

    static async allGroups() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/groups`,
        };
        return await fasq.request(options)
    }

    static async addRoute(body, groupname) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/${groupname}/route`,
            body,
            json: true,
        };
        return await fasq.request(options)
    }

    static async editByName(body, groupname) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/${groupname}`,
            body,
            json: true,
        };
        return await fasq.request(options)
    }

    static async create(body) {
        var options = {
            method: 'POST',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group`,
            body,
            json: true,
        };
        return await fasq.request(options)
    }
}
class Auth {
    constructor() {}

    static async activate(token) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/auth/activate`,
            qs: {
                token
            },
        };
        return await fasq.request(options)
    }

    static async resetPassword(body, token) {
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
        return await fasq.request(options)
    }

    static async forgotPassword(body) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/auth/password/forgot`,
            qs: {},
            body,
            json: true,
        };
        return await fasq.request(options)
    }

    static async logout() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/auth/logout`,
        };
        return await fasq.request(options)
    }

    static async login(body) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/auth/login`,
            body,
            json: true,
        };
        return await fasq.request(options)
    }

    static async register(body) {
        var options = {
            method: 'POST',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/auth/register`,
            body,
            json: true,
        };
        return await fasq.request(options)
    }
}
module.exports = function(host) {
    hostUrl = host;

    return Travelling;
}
