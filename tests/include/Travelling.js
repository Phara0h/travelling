const fasq = require('fasquest');
var hostUrl = '';
class Travelling {
    constructor() {}

    static async healthCheck(opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/_health`,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static async metrics(opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/metrics`,
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
class User {
    constructor() {}

    static async deleteByUsername(username, opts) {
        var options = {
            method: 'DELETE',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/username/${username}`,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static async deleteById(id, opts) {
        var options = {
            method: 'DELETE',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/id/${id}`,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static async editByUsername(body, username, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/username/${username}`,
            body,
            json: true,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static async editPropertyByUsername(body, username, prop, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/username/${username}/${prop}`,
            body,
            json: true,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static async editPropertyById(body, id, prop, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/id/${id}/${prop}`,
            body,
            json: true,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static async editById(body, id, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/id/${id}`,
            body,
            json: true,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static async getAll(opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/users`,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static async getPropertyById(id, prop, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/id/${id}/${prop}`,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static async getPropertyByUsername(username, prop, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/username/${username}/${prop}`,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static async getById(id, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/id/${id}`,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static async getByUsername(username, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/username/${username}`,
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
class Current {
    constructor() {}

    static async editProperty(body, property, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me/${property}`,
            body,
            json: true,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static async edit(body, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me`,
            body,
            json: true,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static async getUserProperty(property, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me/${property}`,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static async routeCheck(method, route, opts) {
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
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static async permissionCheck(permission, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me/permission/allowed/${permission}`,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static async getUser(opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me`,
            json: true,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }
}
class Groups {
    constructor() {}

    static async getTypesList(opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/groups/types`,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static async getByType(type, opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/groups/type/${type}`,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static async allGroups(opts) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/groups`,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static async addRoute(body, groupname, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/${groupname}/route`,
            body,
            json: true,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static async editByName(body, groupname, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/${groupname}`,
            body,
            json: true,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

    static async create(body, opts) {
        var options = {
            method: 'POST',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group`,
            body,
            json: true,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }
}
class Auth {
    constructor() {}

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

    static async forgotPassword(body, opts) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/auth/password/forgot`,
            qs: {},
            body,
            json: true,
        };
        if (opts) {
            options = Object.assign(options, opts);
        }
        return await fasq.request(options)
    }

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
    hostUrl = host;

    return Travelling;
}
