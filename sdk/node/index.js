'use strict';
const qs = require('querystring');
const url = require('url');
const client = {
  https: require('https'),
  http: require('http'),
};

const REDIRECT_CODES = [301, 302, 303, 307];
class SimpleError extends Error {
  constructor() {
    super('Error happened due to simple constraint not being 2xx status code.');
    this.name = 'FR_Simple';
  }
}
class RequestError extends Error {
  constructor(e) {
    super('Error happened reguarding a request: ' + e.message);
    this.name = 'FR_Request_' + e.name;
  }
}

class RequestTimeoutError extends Error {
  constructor(e) {
    super('Error happened reguarding a request: ' + e.message);
    this.name = 'FR_Request_Timeout';
  }
}

class Fasquest {
  constructor() {
    this.agent = {
      http: new client.http.Agent({
        keepAlive: true,
      }),
      https: new client.https.Agent({
        keepAlive: true,
      }),
    };
  }
  request(options, cb = null) {
    if (!cb) {
      return this.requestPromise(options);
    } else {
      this._request(options, (req, res, err) => {
        cb({
          req,
          res,
          err,
        });
      });
    }
  }
  requestPromise(options) {
    return new Promise((resolve, reject) => {
      this._request(options, (req, res, err) => {
        if (err) {
          reject({
            req,
            res,
            err,
          });
        } else {
          resolve(options.resolveWithFullResponse ? res : res.body);
        }
      });
    });
  }
  _request(ops, cb, count = 0) {
    var options = this._setOptions(ops);

    var req = client[options.proto].request(options, (res) => {
      res.body = '';

      res.on('data', (chunk) => {
        res.body += chunk;
      });

      res.on('end', () => {
        if (options.timeout) {
          clearTimeout(t);
        }
        // remove as causes circular references

        if (
          REDIRECT_CODES.indexOf(res.statusCode) !== -1 &&
          count < options.redirect_max
        ) {
          options.uri = url.resolve(options.uri, res.headers.location);
          return this._request(this._setOptions(options), cb, ++count);
        } else {
          if (
            res.headers['content-type'] &&
            res.headers['content-type'].indexOf('json') > -1
          ) {
            try {
              res.body = JSON.parse(res.body);
            } catch (e) {
              // do nothing
            }
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

    if (options.timeout) {
      var t = setTimeout(() => {
        req.destroy();
      }, options.timeout || 60000);
    }

    req.on('error', (e) => {
      var err =
        e.message.indexOf('socket hang up') > -1
          ? new RequestTimeoutError(e)
          : new RequestError(e);

      return cb(req, null, err);
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  }
  _setOptions(opts) {
    var options = {};

    options.simple = opts.simple !== false;
    options.method = opts.method || 'GET';
    options.uri = opts.uri;
    if (opts.qs) {
      var escQS = qs.stringify(opts.qs);

      if (escQS.length > 0) {
        options.uri += (options.uri.indexOf('?') > -1 ? '&' : '?') + escQS;
      }
    }
    options = this._uri_to_options(options.uri, options);
    options.agent = opts.agent || this.agent[opts.proto];
    options.headers = {};
    if (opts.headers) {
      var h = Object.keys(opts.headers);

      for (var i = 0; i < h.length; i++) {
        options.headers[h[i]] = opts.headers[h[i]];
      }
    }
    if (opts.json) {
      options.headers['Content-Type'] = 'application/json';
      if (opts.body) {
        options.body = JSON.stringify(opts.body);
      }
    } else if (opts.form) {
      options.body = qs.stringify(opts.form);

      options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      options.headers['Content-Length'] = Buffer.byteLength(options.body);
    } else if (opts.body) {
      options.headers['Content-Length'] = Buffer.byteLength(opts.body);
      if (!options.headers['Content-Type']) {
        options.headers['Content-Type'] = 'text/plain';
      }
      options.body = opts.body;
    }
    if (opts.authorization) {
      if (opts.authorization.basic) {
        options.headers['Authorization'] =
          'Basic ' +
          Buffer.from(
            opts.authorization.basic.client +
              ':' +
              opts.authorization.basic.secret,
            'ascii'
          ).toString('base64');
      } else if (opts.authorization.bearer) {
        options.headers['Authorization'] =
          'Bearer ' + opts.authorization.bearer;
      }
    }
    if (!opts.redirect_max && opts.redirect_max !== 0) {
      options.redirect_max = 5;
    }

    return options;
  }
  _uri_to_options(uri, options) {
    var convertedUri = {
      proto: '',
      path: '',
      port: 80,
      host: '',
    };
    var splitURI = uri.split('://');

    convertedUri.proto = splitURI[0];
    var possiblePort = splitURI[1].indexOf(':');

    if (possiblePort > -1 && !isNaN(splitURI[1][possiblePort + 1])) {
      const pindex = splitURI[1].indexOf('/');

      if (pindex > -1) {
        convertedUri.path = splitURI[1].slice(pindex);
        convertedUri.port = splitURI[1].slice(possiblePort + 1, pindex);
      } else {
        convertedUri.port = splitURI[1].slice(possiblePort + 1);
      }
      convertedUri.host = splitURI[1].slice(0, possiblePort);
    } else {
      convertedUri.port = convertedUri.proto == 'https' ? 443 : 80;
    }
    const hostIndex = splitURI[1].indexOf('/');

    if (hostIndex > -1) {
      convertedUri.path = convertedUri.path || splitURI[1].slice(hostIndex);
      convertedUri.host = convertedUri.host || splitURI[1].slice(0, hostIndex);
    } else {
      convertedUri.path = convertedUri.path || '/';
      convertedUri.host = convertedUri.host || splitURI[1];
    }
    options.proto = convertedUri.proto;
    options.path = convertedUri.path;
    options.port = convertedUri.port;
    options.host = convertedUri.host;
    return options;
  }
}
module.exports = new Fasquest();

const fasq = new Fasquest();
var hostUrl = '';
var defaultOpts = null;

/**
 *
 */
class Travelling {
  constructor() {}
  static get _postgenClassUrls() {
    return { healthcheck: 'health', metrics: 'metrics' };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * healthCheck - server's health check
   *
   * Path: health
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async healthCheck(authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `health`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * metrics - servers metrics
   *
   * Path: metrics
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async metrics(authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `metrics`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  static get Config() {
    return Config;
  }

  static get Groups() {
    return Groups;
  }

  static get Group() {
    return Group;
  }

  static get Users() {
    return Users;
  }

  static get User() {
    return User;
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
  static get _postgenClassUrls() {
    return { getproperty: 'api/v1/config/:property' };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * getProperty - Gets a property from travellings config.
   *
   * Path: api/v1/config/:property
   * @param {any} property  (example: password)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async getProperty(property, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/config/${property}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 *
 */
class Groups {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      export: 'api/v1/groups/export',
      import: 'api/v1/groups/import',
      get: 'api/v1/groups',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * export - Exports all groups in the proper format to be imported.
   *
   * Path: api/v1/groups/export
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async export(authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/groups/export`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * import - Imports all groups from the exported format.
   *
   * Path: api/v1/groups/import
   * @param {Object} body
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   *     "group": {
   *         "anonymous": {
   *             "type": "group",
   *             "allowed": [
   *                 {
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
   *                     "removeFromPath": "/travelling/assets/",
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
   *             ],
   *             "inherited": null,
   *             "is_default": false
   *         },
   *         "group3": {
   *             "type": "group",
   *             "allowed": null,
   *             "inherited": [
   *                 "testgroup|group1",
   *                 "group|group2"
   *             ],
   *             "is_default": false
   *         },
   *         "superadmin": {
   *             "type": "group",
   *             "allowed": [
   *                 {
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
   *             ],
   *             "is_default": false
   *         },
   *         "group4": {
   *             "type": "group",
   *             "allowed": null,
   *             "inherited": [],
   *             "is_default": false
   *         },
   *         "group2": {
   *             "type": "group",
   *             "allowed": [
   *                 {
   *                     "route": "/test/get",
   *                     "host": "https://127.0.0.1:4268/:username/:group",
   *                     "removeFromPath": "/test/get",
   *                     "method": "GET",
   *                     "name": "get-test-get"
   *                 },
   *                 {
   *                     "route": "/test/post",
   *                     "host": "http://127.0.0.1:4267/?id=:id&permission=:permission",
   *                     "removeFromPath": "/test/post",
   *                     "method": "POST",
   *                     "name": "post-test-post"
   *                 }
   *             ],
   *             "inherited": [
   *                 "testgroup|group1"
   *             ],
   *             "is_default": false
   *         },
   *         "group5": {
   *             "type": "group",
   *             "allowed": [
   *                 {
   *                     "route": "/test/delete/:grouptype",
   *                     "host": "https://127.0.0.1:4268",
   *                     "removeFromPath": "/test/delete",
   *                     "method": "DELETE",
   *                     "name": "delete-test-delete-:grouptype"
   *                 }
   *             ],
   *             "inherited": [
   *                 "group|group4",
   *                 "group|superadmin"
   *             ],
   *             "is_default": true
   *         },
   *         "group1": {
   *             "type": "group",
   *             "allowed": null,
   *             "inherited": null,
   *             "is_default": false
   *         }
   *     },
   *     "testgroup": {
   *         "group1": {
   *             "type": "testgroup",
   *             "allowed": null,
   *             "inherited": [
   *                 "group|group4"
   *             ],
   *             "is_default": false
   *         },
   *         "superadmin": {
   *             "type": "testgroup",
   *             "allowed": null,
   *             "inherited": null,
   *             "is_default": false
   *         }
   *     }
   * }
   * ```
   */
  static async import(body, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/groups/import`,
      body,
      json: true,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * get - Get all the groups
   *
   * Path: api/v1/groups
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async get(authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/groups`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
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
  static get _postgenClassUrls() {
    return {
      all: 'api/v1/groups/type/:type',
      gettypeslist: 'api/v1/groups/types',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * all - Gets all groups of a particular type
   *
   * Path: api/v1/groups/type/:type
   * @param {any} type The type of the group
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async all(type, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/groups/type/${type}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * getTypesList - Gets all the types of groups currently made.
   *
   * Path: api/v1/groups/types
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async getTypesList(authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/groups/types`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 *
 */
class Group {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      addpermission: 'api/v1/group/id/:id/insert/permission/:permission',
      deletepermission: 'api/v1/group/id/:id/permission/:permission',
      addroute: 'api/v1/group/id/:id/insert/route',
      removeinheritance:
        'api/v1/group/id/:id/remove/inheritance/:inherited/type/:grouptype',
      inheritfrom:
        'api/v1/group/id/:id/inherit/from/:inherited/type/:grouptype',
      setdefault: 'api/v1/group/id/:id/set/default',
      delete: 'api/v1/group/id/:id',
      edit: 'api/v1/group/id/:id',
      get: 'api/v1/group/id/:id',
      createbyname: 'api/v1/group/id/:id',
      create: 'api/v1/group',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * addPermission - Adds a permission to a group.
   *
   * Path: api/v1/group/id/:id/insert/permission/:permission
   * @param {any} id Name of the group (example: anonymous)
   * @param {any} permission Permission (example: test-one-two-*)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async addPermission(id, permission, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl + '/' + `api/v1/group/id/${id}/insert/permission/${permission}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * deletePermission - Removes a permission/route from a group.
   *
   * Path: api/v1/group/id/:id/permission/:permission
   * @param {any} id Name of the group (example: anonymous)
   * @param {any} permission Name or Route (example: test-one-two-*)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async deletePermission(id, permission, authorization_bearer, opts) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/permission/${permission}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
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
  *
  * Path: api/v1/group/id/:id/insert/route
  * @param {Object} body
  * @param {any} id  
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  * @example
  * body
  * ```json
  * {
 * 	"route": "test/permissions/*",
 *     "host": null, 
 *     "method": "*", 
 *     "name": "test-permissions-*"  
 * }
  * ```
  */
  static async addRoute(body, id, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/insert/route`,
      body,
      json: true,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * removeInheritance - Removes an inheritance from a group.
   *
   * Path: api/v1/group/id/:id/remove/inheritance/:inherited/type/:grouptype
   * @param {any} id Name of the group (example: test1234)
   * @param {any} inherited Name of the group to inherit from (example: group4)
   * @param {any} grouptype The type of the inherited group
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async removeInheritance(
    id,
    inherited,
    grouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/id/${id}/remove/inheritance/${inherited}/type/${grouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * inheritFrom - Adds an inheritance to a group.
   *
   * Path: api/v1/group/id/:id/inherit/from/:inherited/type/:grouptype
   * @param {any} id Name of the group (example: test1234)
   * @param {any} inherited Name of the group to inherit from (example: group4)
   * @param {any} grouptype The type of the inherited group
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async inheritFrom(
    id,
    inherited,
    grouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/id/${id}/inherit/from/${inherited}/type/${grouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * setDefault - Sets the group to be the default group for new users.
   *
   * Path: api/v1/group/id/:id/set/default
   * @param {any} id id or name (example: group6)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async setDefault(id, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/set/default`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * delete - delete group by its id or name
   *
   * Path: api/v1/group/id/:id
   * @param {any} id id or name
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async delete(id, authorization_bearer, opts) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * edit - Edits a group
   *
   * Path: api/v1/group/id/:id
   * @param {Object} body
   * @param {any} id  (example: ab31efc8-40a5-4d38-a347-adb4e38d0075)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   *     "allowed": [
   *         {
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
  static async edit(body, id, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}`,
      body,
      json: true,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * get - Get a group by it's id or name.
   *
   * Path: api/v1/group/id/:id
   * @param {any} id id or name  (example: group1)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async get(id, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * createByName - Add a new blank group with the set name.
   *
   * Path: api/v1/group/id/:id
   * @param {any} id Name of the new group (example: test123)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async createByName(id, authorization_bearer, opts) {
    var options = {
      method: 'POST',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * create - Add a new group
   *
   * Path: api/v1/group
   * @param {Object} body
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   *     "name": "group1",
   *     "type": "accounts",
   *     "allowed": [
   *         {
   *             "route": "/test",
   *             "host": "http://127.0.0.1:1237/",
   *             "remove_from_path": "test",
   *             "method": "*",
   *             "name": "all-test"
   *         }
   *     ],
   *     "is_default": false
   * }
   * ```
   */
  static async create(body, authorization_bearer, opts) {
    var options = {
      method: 'POST',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group`,
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  static get Users() {
    return GroupUsers;
  }

  static get User() {
    return GroupUser;
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
  static get _postgenClassUrls() {
    return {
      inherited: 'api/v1/group/id/:id/users/inherited',
      get: 'api/v1/group/id/:id/users',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

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
  *
  * Path: api/v1/group/id/:id/users/inherited
  * @param {any} id id or name (example: superadmin)
  */
  static async inherited(id, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/users/inherited`,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
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
  *
  * Path: api/v1/group/id/:id/users
  * @param {any} id id or name (example: superadmin)
  */
  static async get(id, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/users`,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 *
 */
class GroupUser {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      delete: 'api/v1/group/id/:group/type/:type/user/:id',
      removegroupinheritance:
        'api/v1/group/id/:group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
      addgroupinheritance:
        'api/v1/group/id/:group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
      editpropertyvalue:
        'api/v1/group/id/:group/type/:type/user/:id/property/:property/:value',
      editproperty:
        'api/v1/group/id/:group/type/:type/user/:id/property/:property',
      edit: 'api/v1/group/id/:group/type/:type/user/:id',
      getproperty:
        'api/v1/group/id/:group/type/:type/user/:id/property/:property',
      get: 'api/v1/group/id/:group/type/:type/user/:id',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * delete - Delete a user by it's id or username from group of a particular type.
   *
   * Path: api/v1/group/id/:group/type/:type/user/:id
   * @param {any} group id or name of the group
   * @param {any} type The type of the group (example: accounts)
   * @param {any} id id or name (example: user7)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async delete(group, type, id, authorization_bearer, opts) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${group}/type/${type}/user/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * removeGroupInheritance - Remove a user to a group of a particular type of group.
   *
   * Path: api/v1/group/id/:group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype
   * @param {any} group id or name of the group (example: group1)
   * @param {any} type type of group (example: group)
   * @param {any} id id or name of the user (example: user5)
   * @param {any} inheritgroupid id or name of the  group to inherit (example: group2)
   * @param {any} inheritgrouptype type of the  group to inherit (example: group)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async removeGroupInheritance(
    group,
    type,
    id,
    inheritgroupid,
    inheritgrouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/id/${group}/type/${type}/user/${id}/inheritance/group/${inheritgroupid}/type/${inheritgrouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * addGroupInheritance - Add a group for the current user from a group of a particular type.
   *
   * Path: api/v1/group/id/:group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype
   * @param {any} group id or name of the group (example: group1)
   * @param {any} type type of group (example: group)
   * @param {any} id id or name of the user (example: user5)
   * @param {any} inheritgroupid id or name of the  group to inherit (example: group2)
   * @param {any} inheritgrouptype type of the  group to inherit (example: group)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async addGroupInheritance(
    group,
    type,
    id,
    inheritgroupid,
    inheritgrouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/id/${group}/type/${type}/user/${id}/inheritance/group/${inheritgroupid}/type/${inheritgrouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * editPropertyValue - Edit a current user's property data as a path param from a group of a particular type.
   *
   * Path: api/v1/group/id/:group/type/:type/user/:id/property/:property/:value
   * @param {any} group id or name of the group
   * @param {any} type The type of the group (example: group)
   * @param {any} id id or name (example: user5)
   * @param {any} property  (example: email)
   * @param {any} value  (example: swag@yolo.com)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async editPropertyValue(
    group,
    type,
    id,
    property,
    value,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/id/${group}/type/${type}/user/${id}/property/${property}/${value}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * editProperty - Edit a user's property by it's id or username from a group of a particular type.
   *
   * Path: api/v1/group/id/:group/type/:type/user/:id/property/:property
   * @param {Object} body
   * @param {any} group id or name of the group
   * @param {any} type The type of the group (example: accounts)
   * @param {any} id id or name (example: user6)
   * @param {any} property  (example: email)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   * 	"locked": false
   * }
   * ```
   */
  static async editProperty(
    body,
    group,
    type,
    id,
    property,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/id/${group}/type/${type}/user/${id}/property/${property}`,
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * edit - Edit a user by it's id or username from group of a particular type.
   *
   * Path: api/v1/group/id/:group/type/:type/user/:id
   * @param {Object} body
   * @param {any} group id or name of the group
   * @param {any} type The type of the group (example: accounts)
   * @param {any} id id or name (example: user6)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   * 	"locked": false
   * }
   * ```
   */
  static async edit(body, group, type, id, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${group}/type/${type}/user/${id}`,
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * getProperty - Get a user's property by it's id or username from group of a particular type.
   *
   * Path: api/v1/group/id/:group/type/:type/user/:id/property/:property
   * @param {any} group id or name of the group
   * @param {any} type The type of the group (example: accounts)
   * @param {any} id id or name (example: user6)
   * @param {any} property  (example: email)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async getProperty(
    group,
    type,
    id,
    property,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'GET',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/id/${group}/type/${type}/user/${id}/property/${property}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * get - Get a user by it's id or username from group of a particular type.
   *
   * Path: api/v1/group/id/:group/type/:type/user/:id
   * @param {any} group id or name of the group
   * @param {any} type The type of the group (example: accounts)
   * @param {any} id id or name (example: user6)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async get(group, type, id, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${group}/type/${type}/user/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 *
 */
class GroupType {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      deletepermission: 'api/v1/group/id/:id/type/:type/permission/:permission',
      addpermission:
        'api/v1/group/id/:id/type/:type/insert/permission/:permission',
      addroute: 'api/v1/group/id/:id/type/:type/insert/route',
      removeinheritance:
        'api/v1/group/id/:id/type/:type/remove/inheritance/:inherited/type/:grouptype',
      inheritfrom:
        'api/v1/group/id/:id/type/:type/inherit/from/:inherited/type/:grouptype',
      setdefault: 'api/v1/group/id/:id/type/:type/set/default',
      delete: 'api/v1/group/id/:id/type/:type',
      get: 'api/v1/group/id/:id/type/:type',
      edit: 'api/v1/group/id/:id/type/:type',
      createbyname: 'api/v1/group/id/:id/type/:type',
      create: 'api/v1/group/type/:type',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * deletePermission - Removes a permission/route from a group of a particular type.
   *
   * Path: api/v1/group/id/:id/type/:type/permission/:permission
   * @param {any} id Name of the group (example: anonymous)
   * @param {any} type Type of the group (example: group)
   * @param {any} permission Name or Route (example: test-one-three-*)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async deletePermission(
    id,
    type,
    permission,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/id/${id}/type/${type}/permission/${permission}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * addPermission - Adds a permission to a group of a particular type.
   *
   * Path: api/v1/group/id/:id/type/:type/insert/permission/:permission
   * @param {any} id Name of the group (example: anonymous)
   * @param {any} type Type of the group (example: group)
   * @param {any} permission Permission  (example: test-one-three-*)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async addPermission(id, type, permission, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/id/${id}/type/${type}/insert/permission/${permission}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
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
  *
  * Path: api/v1/group/id/:id/type/:type/insert/route
  * @param {Object} body
  * @param {any} id Name of the group 
  * @param {any} type  
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  * @example
  * body
  * ```json
  * {
 * 	"route": "test/permissions/*",
 *     "host": null, 
 *     "method": "*", 
 *     "name": "test-permissions-*"  
 * }
  * ```
  */
  static async addRoute(body, id, type, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/type/${type}/insert/route`,
      body,
      json: true,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * removeInheritance - Removes an inheritance from a group of a particular type.
   *
   * Path: api/v1/group/id/:id/type/:type/remove/inheritance/:inherited/type/:grouptype
   * @param {any} id Name of the group (example: test1234)
   * @param {any} type The type of the group (example: accounts)
   * @param {any} inherited Name of the group to inherit from (example: superadmin)
   * @param {any} grouptype The type of the inherited group
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async removeInheritance(
    id,
    type,
    inherited,
    grouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/id/${id}/type/${type}/remove/inheritance/${inherited}/type/${grouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * inheritFrom - Adds an inheritance to a group of a particular type.
   *
   * Path: api/v1/group/id/:id/type/:type/inherit/from/:inherited/type/:grouptype
   * @param {any} id Name of the group (example: group1)
   * @param {any} type The type of the group (example: testgroup)
   * @param {any} inherited Name of the group to inherit from (example: test123)
   * @param {any} grouptype The type of the inherited group
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async inheritFrom(
    id,
    type,
    inherited,
    grouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/id/${id}/type/${type}/inherit/from/${inherited}/type/${grouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * setDefault - Sets the group of a particular type to be the default group for new users.
   *
   * Path: api/v1/group/id/:id/type/:type/set/default
   * @param {any} id id or name (example: group1)
   * @param {any} type The type of the group (example: account)
   */
  static async setDefault(id, type, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/type/${type}/set/default`,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * delete - delete group of a particular type by its name or id
   *
   * Path: api/v1/group/id/:id/type/:type
   * @param {any} id id or name
   * @param {any} type The type of the group
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async delete(id, type, authorization_bearer, opts) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/type/${type}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * get - Get a group by it's id or name of a particular type.
   *
   * Path: api/v1/group/id/:id/type/:type
   * @param {any} id id or name  (example: group1)
   * @param {any} type The type of the group (example: accounts)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async get(id, type, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/type/${type}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * edit - Edits a group of a particular type
   *
   * Path: api/v1/group/id/:id/type/:type
   * @param {Object} body
   * @param {any} id id or name
   * @param {any} type The type of the group
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {"inherited":["a717b880-b17b-4995-9610-cf451a06d015","7ec8c351-7b8a-4ea8-95cc-0d990b225768"]}
   * ```
   */
  static async edit(body, id, type, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/type/${type}`,
      body,
      json: true,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * createByName - Add a new blank group with the set name and type
   *
   * Path: api/v1/group/id/:id/type/:type
   * @param {any} id Name of the new group (example: test1234)
   * @param {any} type Type of the new group (example: accounts)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async createByName(id, type, authorization_bearer, opts) {
    var options = {
      method: 'POST',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/type/${type}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * create - Add a new group of a particular type
   *
   * Path: api/v1/group/type/:type
   * @param {Object} body
   * @param {any} type The type of the group
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   *     "name": "group1",
   *     "type": "accounts",
   *     "allowed": [
   *         {
   *             "route": "/test",
   *             "host": "http://127.0.0.1:1237/",
   *             "remove_from_path": "test",
   *             "method": "*",
   *             "name": "all-test"
   *         }
   *     ],
   *     "is_default": false
   * }
   * ```
   */
  static async create(body, type, authorization_bearer, opts) {
    var options = {
      method: 'POST',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/type/${type}`,
      body,
      json: true,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
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
  static get _postgenClassUrls() {
    return {
      get: 'api/v1/group/id/:id/type/:type/users',
      inherited: 'api/v1/group/id/:id/type/:type/users/inherited',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

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
  *
  * Path: api/v1/group/id/:id/type/:type/users
  * @param {any} id  
  * @param {any} type  
  */
  static async get(id, type, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/type/${type}/users`,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
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
  *
  * Path: api/v1/group/id/:id/type/:type/users/inherited
  * @param {any} id  (example: group4)
  * @param {any} type The type of the group (example: groups)
  */
  static async inherited(id, type, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/id/${id}/type/${type}/users/inherited`,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 *
 */
class GroupTypeUser {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      delete: 'api/v1/group/type/:type/user/:id',
      removegroupinheritance:
        'api/v1/group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
      addgroupinheritance:
        'api/v1/group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
      editpropertyvalue:
        'api/v1/group/type/:type/user/:id/property/:property/:value',
      editproperty: 'api/v1/group/type/:type/user/:id/property/:property',
      edit: 'api/v1/group/type/:type/user/:id',
      getproperty: 'api/v1/group/type/:type/user/:id/property/:property',
      get: 'api/v1/group/type/:type/user/:id',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * delete - Delete a user by it's id or username from group of a particular type.
   *
   * Path: api/v1/group/type/:type/user/:id
   * @param {any} type The type of the group (example: accounts)
   * @param {any} id id or name (example: user7)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async delete(type, id, authorization_bearer, opts) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/type/${type}/user/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * removeGroupInheritance - Remove a user to a group of a particular type of group.
   *
   * Path: api/v1/group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype
   * @param {any} type type of group (example: group)
   * @param {any} id id or name of the user (example: user5)
   * @param {any} inheritgroupid id or name of the  group to inherit (example: group2)
   * @param {any} inheritgrouptype type of the  group to inherit (example: group)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async removeGroupInheritance(
    type,
    id,
    inheritgroupid,
    inheritgrouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/type/${type}/user/${id}/inheritance/group/${inheritgroupid}/type/${inheritgrouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * addGroupInheritance - Add a user to a group of a particular type of group.
   *
   * Path: api/v1/group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype
   * @param {any} type type of group (example: group)
   * @param {any} id id or name of the user (example: user5)
   * @param {any} inheritgroupid id or name of the  group to inherit (example: group2)
   * @param {any} inheritgrouptype type of the  group to inherit (example: group)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async addGroupInheritance(
    type,
    id,
    inheritgroupid,
    inheritgrouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/type/${type}/user/${id}/inheritance/group/${inheritgroupid}/type/${inheritgrouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * editPropertyValue - Edit a current user's property data as a path param from a group of a particular type.
   *
   * Path: api/v1/group/type/:type/user/:id/property/:property/:value
   * @param {any} type The type of the group (example: group)
   * @param {any} id id or name (example: user5)
   * @param {any} property  (example: email)
   * @param {any} value  (example: swag@yolo.com)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async editPropertyValue(
    type,
    id,
    property,
    value,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/type/${type}/user/${id}/property/${property}/${value}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * editProperty - Edit a user's property by it's id or username from a group of a particular type.
   *
   * Path: api/v1/group/type/:type/user/:id/property/:property
   * @param {Object} body
   * @param {any} type The type of the group (example: accounts)
   * @param {any} id id or name (example: user6)
   * @param {any} property  (example: email)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   * 	"locked": false
   * }
   * ```
   */
  static async editProperty(
    body,
    type,
    id,
    property,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/type/${type}/user/${id}/property/${property}`,
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * edit - Edit a user by it's id or username from group of a particular type.
   *
   * Path: api/v1/group/type/:type/user/:id
   * @param {Object} body
   * @param {any} type The type of the group (example: accounts)
   * @param {any} id id or name (example: user6)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   * 	"locked": false
   * }
   * ```
   */
  static async edit(body, type, id, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/type/${type}/user/${id}`,
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * getProperty - Get a user's property by it's id or username from group of a particular type.
   *
   * Path: api/v1/group/type/:type/user/:id/property/:property
   * @param {any} type The type of the group (example: accounts)
   * @param {any} id id or name (example: user6)
   * @param {any} property  (example: email)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async getProperty(type, id, property, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/type/${type}/user/${id}/property/${property}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * get - Get a user by it's id or username from group of a particular type.
   *
   * Path: api/v1/group/type/:type/user/:id
   * @param {any} type The type of the group (example: accounts)
   * @param {any} id id or name (example: user6)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async get(type, id, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/type/${type}/user/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 *
 */
class GroupRequest {
  constructor() {}
  static get _postgenClassUrls() {
    return {};
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  static get User() {
    return GroupRequestUser;
  }
}
/**
 *
 */
class GroupRequestUser {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      delete: 'api/v1/group/request/type/:type/user/:id',
      addgroupinheritance:
        'api/v1/group/request/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
      editproperty:
        'api/v1/group/request/type/:type/user/:id/property/:property',
      edit: 'api/v1/group/request/type/:type/user/:id',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * delete - Delete a user by it's id or username from the user's `group_request` of a particular type.
   *
   * Path: api/v1/group/request/type/:type/user/:id
   * @param {Object} body
   * @param {any} type  (example: testgroup)
   * @param {any} id  (example: user69)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   * 	"locked": false
   * }
   * ```
   */
  static async delete(body, type, id, authorization_bearer, opts) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/request/type/${type}/user/${id}`,
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * addGroupInheritance - Add a user to a group from the user's `group_request` of a particular type.
   *
   * Path: api/v1/group/request/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype
   * @param {any} type type of group (example: group)
   * @param {any} id id or name of the user (example: user5)
   * @param {any} inheritgroupid id or name of the  group to inherit (example: group2)
   * @param {any} inheritgrouptype type of the  group to inherit (example: group)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async addGroupInheritance(
    type,
    id,
    inheritgroupid,
    inheritgrouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/request/type/${type}/user/${id}/inheritance/group/${inheritgroupid}/type/${inheritgrouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * editProperty - Edit a user's property by it's id or username from the user's `group_request` of a particular type.
   *
   * Path: api/v1/group/request/type/:type/user/:id/property/:property
   * @param {Object} body
   * @param {any} type  (example: accounts)
   * @param {any} id  (example: user6)
   * @param {any} property  (example: email)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * "chad@yolo.com"
   * ```
   */
  static async editProperty(
    body,
    type,
    id,
    property,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/group/request/type/${type}/user/${id}/property/${property}`,
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * edit - Edit a user by it's id or username from the user's `group_request` of a particular type.
   *
   * Path: api/v1/group/request/type/:type/user/:id
   * @param {Object} body
   * @param {any} type  (example: accounts)
   * @param {any} id  (example: user6)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   * 	"locked": false
   * }
   * ```
   */
  static async edit(body, type, id, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/group/request/type/${type}/user/${id}`,
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 *
 */
class Users {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      bygrouprequest: 'api/v1/users/group/request/:group_request',
      count: 'api/v1/users/count',
      get: 'api/v1/users',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

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
  *
  * Path: api/v1/users/group/request/:group_request
  * @param {any} group_request name of the group  (example: superadmin)
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  */
  static async byGroupRequest(group_request, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/users/group/request/${group_request}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
  * count - Gets all the users

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
  *
  * Path: api/v1/users/count
  * @param {any} limit Number of maximum results. (example: 2) (example: 2)
  * @param {any} skip Number of db rows skipped. (example: 10) (example: 10)
  * @param {any} filter Filter parameters (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) (example: created_on>2021-06-06,created_on<2021-06-08)
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  */
  static async count(limit, skip, filter, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/users/count`,
      qs: { limit, skip, filter },
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
  * get - Gets all the users

##### Filter Params

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
  *
  * Path: api/v1/users
  * @param {any} sort Sort by any user object key (examples: id, domain, locked, etc.) (example: created_on)
  * @param {any} limit Number of maximum results. (example: 2) (example: 2)
  * @param {any} skip Number of db rows skipped. (example: 10) (example: 10)
  * @param {any} filter Filter parameters (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) (example: locked=false,created_on>2021-06-03,created_on<2021-06-06)
  * @param {any} sortdir Sort direction (example ascending order: ASC) (example: ASC)
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  */
  static async get(
    sort,
    limit,
    skip,
    filter,
    sortdir,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/users`,
      qs: { sort, limit, skip, filter, sortdir },
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  static get Domain() {
    return UsersDomain;
  }
}
/**
 *
 */
class UsersDomain {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      count: 'api/v1/users/domain/:domain/count',
      get: 'api/v1/users/domain/:domain',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
  * count - Gets all the users

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
  *
  * Path: api/v1/users/domain/:domain/count
  * @param {any} domain  (example: test.com)
  * @param {any} limit Number of maximum results. (example: 2) (example: 5)
  * @param {any} skip Number of db rows skipped. (example: 10) (example: 10)
  * @param {any} filter Filter parameters (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) (example: created_on>2022-06-01,created_on<2022-06-08)
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  */
  static async count(domain, limit, skip, filter, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/users/domain/${domain}/count`,
      qs: { limit, skip, filter },
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
  * get - Gets all the users

##### Filter Params

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
  *
  * Path: api/v1/users/domain/:domain
  * @param {any} domain  (example: test.com)
  * @param {any} sort Sort by any user object key (examples: id, domain, locked, etc.) (example: created_on)
  * @param {any} limit Number of maximum results. (example: 2) (example: 1)
  * @param {any} skip Number of db rows skipped. (example: 10) (example: 10)
  * @param {any} filter Filter parameters (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) (example: created_on>2021-06-01,created_on<2021-06-08)
  * @param {any} sortdir Sort direction (example ascending order: ASC) (example: ASC)
  * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
  */
  static async get(
    domain,
    sort,
    limit,
    skip,
    filter,
    sortdir,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/users/domain/${domain}`,
      qs: { sort, limit, skip, filter, sortdir },
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 *
 */
class User {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      delete: 'api/v1/user/id/:id',
      removegroupinheritance:
        'api/v1/user/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
      addgroupinheritance:
        'api/v1/user/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
      editpropertyvalue: 'api/v1/user/id/:id/property/:property/:value',
      editproperty: 'api/v1/user/id/:id/property/:property',
      edit: 'api/v1/user/id/:id',
      getproperty: 'api/v1/user/id/:id/property/:property',
      get: 'api/v1/user/id/:id',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * delete - Delete a user by it's Id.
   *
   * Path: api/v1/user/id/:id
   * @param {any} id Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async delete(id, authorization_bearer, opts) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/id/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * removeGroupInheritance - Remove a user from a group.
   *
   * Path: api/v1/user/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype
   * @param {any} id id or name of the user (example: user5)
   * @param {any} inheritgroupid id or name of the  group to inherit (example: group2)
   * @param {any} inheritgrouptype type of the  group to inherit (example: group)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async removeGroupInheritance(
    id,
    inheritgroupid,
    inheritgrouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/user/id/${id}/inheritance/group/${inheritgroupid}/type/${inheritgrouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * addGroupInheritance - Add a user to a group.
   *
   * Path: api/v1/user/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype
   * @param {any} id id or name of the user (example: user5)
   * @param {any} inheritgroupid id or name of the  group to inherit (example: group2)
   * @param {any} inheritgrouptype type of the  group to inherit (example: group)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async addGroupInheritance(
    id,
    inheritgroupid,
    inheritgrouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/user/id/${id}/inheritance/group/${inheritgroupid}/type/${inheritgrouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * editPropertyValue - Edit a current user's property data as a path param.
   *
   * Path: api/v1/user/id/:id/property/:property/:value
   * @param {any} id Id or Username
   * @param {any} property  (example: group_id)
   * @param {any} value  (example: 595d3f9a-5383-4da9-a465-b975d8a5e28e)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async editPropertyValue(
    id,
    property,
    value,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/id/${id}/property/${property}/${value}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * editProperty - Edit a user's property by id.
   *
   * Path: api/v1/user/id/:id/property/:property
   * @param {Object} body
   * @param {any} id Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
   * @param {any} property
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```text
   * user6
   * ```
   */
  static async editProperty(body, id, property, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/id/${id}/property/${property}`,
      body,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * edit - Edit a user's by id.
   *
   * Path: api/v1/user/id/:id
   * @param {Object} body
   * @param {any} id Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   * 	"username" : "user6",
   * 	"password" : "Awickednewawesomepasword4242!@"
   * }
   * ```
   */
  static async edit(body, id, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/id/${id}`,
      body,
      json: true,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * getProperty - Get a user's property by it's id.
   *
   * Path: api/v1/user/id/:id/property/:property
   * @param {any} id Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
   * @param {any} property
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async getProperty(id, property, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/id/${id}/property/${property}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * get - Get a user by it's id.
   *
   * Path: api/v1/user/id/:id
   * @param {any} id  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async get(id, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/id/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  static get Domain() {
    return UserDomain;
  }

  static get Current() {
    return UserCurrent;
  }
}
/**
 *
 */
class UserDomain {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      delete: 'api/v1/user/domain/:domain/id/:id',
      removegroupinheritance:
        'api/v1/user/domain/:domain/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
      addgroupinheritance:
        'api/v1/user/domain/:domain/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
      editpropertyvalue:
        'api/v1/user/domain/:domain/id/:id/property/:property/:value',
      editproperty: 'api/v1/user/domain/:domain/id/:id/property/:property',
      edit: 'api/v1/user/domain/:domain/id/:id',
      getproperty: 'api/v1/user/domain/:domain/id/:id/property/:property',
      get: 'api/v1/user/domain/:domain/id/:id',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * delete - Delete a user by it's Id.
   *
   * Path: api/v1/user/domain/:domain/id/:id
   * @param {any} domain
   * @param {any} id Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async delete(domain, id, authorization_bearer, opts) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/domain/${domain}/id/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * removeGroupInheritance - Remove a user from a group.
   *
   * Path: api/v1/user/domain/:domain/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype
   * @param {any} domain
   * @param {any} id id or name of the user (example: user5)
   * @param {any} inheritgroupid id or name of the  group to inherit (example: group2)
   * @param {any} inheritgrouptype type of the  group to inherit (example: group)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async removeGroupInheritance(
    domain,
    id,
    inheritgroupid,
    inheritgrouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/user/domain/${domain}/id/${id}/inheritance/group/${inheritgroupid}/type/${inheritgrouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * addGroupInheritance - Add a user to a group.
   *
   * Path: api/v1/user/domain/:domain/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype
   * @param {any} domain
   * @param {any} id id or name of the user (example: user5)
   * @param {any} inheritgroupid id or name of the  group to inherit (example: group2)
   * @param {any} inheritgrouptype type of the  group to inherit (example: group)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async addGroupInheritance(
    domain,
    id,
    inheritgroupid,
    inheritgrouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/user/domain/${domain}/id/${id}/inheritance/group/${inheritgroupid}/type/${inheritgrouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * editPropertyValue - Edit a current user's property data as a path param.
   *
   * Path: api/v1/user/domain/:domain/id/:id/property/:property/:value
   * @param {any} domain
   * @param {any} id Id or Username
   * @param {any} property  (example: group_id)
   * @param {any} value  (example: 595d3f9a-5383-4da9-a465-b975d8a5e28e)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async editPropertyValue(
    domain,
    id,
    property,
    value,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/user/domain/${domain}/id/${id}/property/${property}/${value}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * editProperty - Edit a user's property by id.
   *
   * Path: api/v1/user/domain/:domain/id/:id/property/:property
   * @param {Object} body
   * @param {any} domain
   * @param {any} id Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
   * @param {any} property
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```text
   * user6
   * ```
   */
  static async editProperty(
    body,
    domain,
    id,
    property,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/user/domain/${domain}/id/${id}/property/${property}`,
      body,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * edit - Edit a user's by id.
   *
   * Path: api/v1/user/domain/:domain/id/:id
   * @param {Object} body
   * @param {any} domain
   * @param {any} id Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   * 	"username" : "user6",
   * 	"password" : "Awickednewawesomepasword4242!@"
   * }
   * ```
   */
  static async edit(body, domain, id, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/domain/${domain}/id/${id}`,
      body,
      json: true,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * getProperty - Get a user's property by it's id.
   *
   * Path: api/v1/user/domain/:domain/id/:id/property/:property
   * @param {any} domain
   * @param {any} id Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
   * @param {any} property
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async getProperty(domain, id, property, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/user/domain/${domain}/id/${id}/property/${property}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * get - Get a user by it's id.
   *
   * Path: api/v1/user/domain/:domain/id/:id
   * @param {any} domain
   * @param {any} id  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async get(domain, id, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/domain/${domain}/id/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 *
 */
class UserCurrent {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      registertoken: 'api/v1/user/me/token',
      removegroupinheritance:
        'api/v1/user/me/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
      addgroupinheritance:
        'api/v1/user/me/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
      editpropertyvalue: 'api/v1/user/me/property/:property/:value',
      editproperty: 'api/v1/user/me/property/:property',
      deletetoken: 'api/v1/user/me/token/:id',
      edit: 'api/v1/user/me',
      getproperty: 'api/v1/user/me/property/:property',
      routecheck: 'api/v1/user/me/route/allowed',
      permissioncheck: 'api/v1/user/me/permission/allowed/:permission',
      get: 'api/v1/user/me',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * registerToken - Registers a new credentials service for client_credentials based access token auth.
   *
   * Path: api/v1/user/me/token
   * @param {Object} body
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   * 	"name": "conversate"
   * }
   * ```
   */
  static async registerToken(body, authorization_bearer, opts) {
    var options = {
      method: 'POST',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/me/token`,
      body,
      json: true,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * removeGroupInheritance - Remove a user from a group.
   *
   * Path: api/v1/user/me/inheritance/group/:inheritgroupid/type/:inheritgrouptype
   * @param {any} inheritgroupid id or name of the  group to inherit (example: group2)
   * @param {any} inheritgrouptype type of the  group to inherit (example: group)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async removeGroupInheritance(
    inheritgroupid,
    inheritgrouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/user/me/inheritance/group/${inheritgroupid}/type/${inheritgrouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * addGroupInheritance - Add a user to a group.
   *
   * Path: api/v1/user/me/inheritance/group/:inheritgroupid/type/:inheritgrouptype
   * @param {any} inheritgroupid id or name of the  group to inherit (example: group2)
   * @param {any} inheritgrouptype type of the  group to inherit (example: group)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async addGroupInheritance(
    inheritgroupid,
    inheritgrouptype,
    authorization_bearer,
    opts
  ) {
    var options = {
      method: 'PUT',
      simple: false,
      uri:
        hostUrl +
        '/' +
        `api/v1/user/me/inheritance/group/${inheritgroupid}/type/${inheritgrouptype}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * editPropertyValue - Edit a current user's property data as a path param.
   *
   * Path: api/v1/user/me/property/:property/:value
   * @param {any} property  (example: group_id)
   * @param {any} value  (example: 595d3f9a-5383-4da9-a465-b975d8a5e28e)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async editPropertyValue(property, value, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/me/property/${property}/${value}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * editProperty - Edit a current user's property data.
   *
   * Path: api/v1/user/me/property/:property
   * @param {Object} body
   * @param {any} property  (example: user_data)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   * 	"test": 123
   * }
   * ```
   */
  static async editProperty(body, property, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/me/property/${property}`,
      body,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * deleteToken - Deletes a client_credentials based access token auth.
   *
   * Path: api/v1/user/me/token/:id
   * @param {any} id id or name of the token
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async deleteToken(id, authorization_bearer, opts) {
    var options = {
      method: 'DELETE',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/me/token/${id}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * edit - Updates the current logged in user.
   *
   * Path: api/v1/user/me
   * @param {Object} body
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   * @example
   * body
   * ```json
   * {
   *     "username": "user6",
   *     "password": "Awickednewawesomepasword4242!@"
   * }
   * ```
   */
  static async edit(body, authorization_bearer, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/me`,
      body,
      json: true,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * getProperty - Gets the currently logged in user's single property
   *
   * Path: api/v1/user/me/property/:property
   * @param {any} property  (example: username)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async getProperty(property, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/me/property/${property}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * routeCheck - Checks if current logged in user can access the route with method.
   *
   * Path: api/v1/user/me/route/allowed
   * @param {any} method  (example: get)
   * @param {any} route  (example: /travelling/api/v1/group/request/type/anonymous/user/)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async routeCheck(method, route, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/me/route/allowed`,
      qs: { method, route },
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * permissionCheck - Checks to see if the current user can access content based on permission.
   *
   * Path: api/v1/user/me/permission/allowed/:permission
   * @param {any} permission name of the route/permission (example: get-travelling)
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async permissionCheck(permission, authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/me/permission/allowed/${permission}`,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * get - Gets the currently logged in user
   *
   * Path: api/v1/user/me
   * @param {string} authorization_bearer The client_credentials generated OAUth2 access token.
   */
  static async get(authorization_bearer, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/user/me`,
      json: true,
      authorization: {
        bearer: authorization_bearer,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 * #### Auth endpoints
 *
 */
class Auth {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      accesstoken: 'api/v1/auth/token',
      authorize: 'api/v1/auth/oauth/authorize',
      activate: 'api/v1/auth/activate',
      resetpasswordautologin: 'api/v1/auth/password/reset/login',
      resetpassword: 'api/v1/auth/password/reset',
      forgotpassword: 'api/v1/auth/password/forgot',
      logout: 'api/v1/auth/logout',
      login: 'api/v1/auth/login',
      register: 'api/v1/auth/register',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * accessToken - Oauth2 `client_credentials` access token flow. Body must be `application/x-www-form-urlencoded` and must contain the `grant_type`. `client_id` & `client_secret` will be sent in a `Basic` Authorization header as `base64(client_id:client_secret)`
   *
   * Path: api/v1/auth/token
   */
  static async accessToken(grant_type, client_id, client_secret, code, opts) {
    var options = {
      method: 'POST',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/token`,
      form: {
        grant_type,
        client_id,
        client_secret,
        code,
      },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * authorize - Authorization Code Grant
   *
   * Path: api/v1/auth/oauth/authorize
   * @param {any} client_id
   * @param {any} response_type
   * @param {any} state
   * @param {any} redirect_uri
   * @param {any} group_request
   */
  static async authorize(
    client_id,
    response_type,
    state,
    redirect_uri,
    group_request,
    opts
  ) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/oauth/authorize`,
      qs: { client_id, response_type, state, redirect_uri, group_request },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * activate - Activates and unlocks user
   *
   * Path: api/v1/auth/activate
   * @param {any} token  (example: activation_token)
   */
  static async activate(token, opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/activate`,
      qs: { token },
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * resetPasswordAutoLogin - Resets the password if the recovery token is valid of the user, then authenticates the user and returns cookies.
   *
   * Path: api/v1/auth/password/reset/login
   * @param {Object} body
   * @param {any} token  (example: [thegeneratedtoken])
   * @example
   * body
   * ```json
   * {
   * 	"password":"asdf"
   * }
   * ```
   */
  static async resetPasswordAutoLogin(body, token, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/password/reset/login`,
      qs: { token },
      body,
      json: true,
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * resetPassword - Resets the password if the recovery token is valid of the user.
   *
   * Path: api/v1/auth/password/reset
   * @param {Object} body
   * @param {any} token  (example: [thegeneratedtoken])
   * @example
   * body
   * ```json
   * {
   * 	"password":"asdf"
   * }
   * ```
   */
  static async resetPassword(body, token, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/password/reset`,
      qs: { token },
      body,
      json: true,
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * forgotPassword - Generates a recovery token and sends a email to the attached user (if they exist)
   *
   * Path: api/v1/auth/password/forgot
   * @param {Object} body
   * @example
   * body
   * ```json
   * {
   * 	"email": "test@test.com"
   * }
   * ```
   */
  static async forgotPassword(body, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/password/forgot`,
      body,
      json: true,
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * logout -
   *
   * Path: api/v1/auth/logout
   */
  static async logout(opts) {
    var options = {
      method: 'GET',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/logout`,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * login - Register a user
   *
   * Path: api/v1/auth/login
   * @param {Object} body
   * @example
   * body
   * ```json
   * {
   * 	"username": "test",
   * 	"password": "Pas5w0r!d",
   *     "domain": "default"
   * }
   * ```
   */
  static async login(body, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/login`,
      body,
      json: true,
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
  * register - Register a user

`group_request`	is optional.
  *
  * Path: api/v1/auth/register
  * @param {Object} body
  * @example
  * body
  * ```json
  * {
 * 	"username":"test",
 * 	"password":"Pas5w0r!d",
 * 	"email": "test@test.com",
 *     "domain": "default"
 * }
  * ```
  */
  static async register(body, opts) {
    var options = {
      method: 'POST',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/register`,
      body,
      json: true,
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  static get Token() {
    return AuthToken;
  }

  static get Domain() {
    return AuthDomain;
  }
}
/**
 *
 */
class AuthToken {
  constructor() {}
  static get _postgenClassUrls() {
    return { forgotpassword: 'api/v1/auth/password/forgot' };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * forgotPassword - Generates a recovery token and returns the token to the attached user (if they exist) instead of sending an email.
   **CAUTION SECURITY RISK: Would not expose this URL publicly or have it be allowed by anyone who is not a superadmin type level**
   *
   * Path: api/v1/auth/password/forgot
   * @param {Object} body
   * @example
   * body
   * ```json
   * {
   * 	"email": "test@test.com"
   * }
   * ```
   */
  static async forgotPassword(body, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/password/forgot`,
      body,
      json: true,
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 *
 */
class AuthDomain {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      forgotpassword: 'api/v1/auth/password/forgot/domain/:domain',
      login: 'api/v1/auth/login/domain/:domain',
      register: 'api/v1/auth/register/domain/:domain',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * forgotPassword - Generates a recovery token and sends a email to the attached user (if they exist)
   *
   * Path: api/v1/auth/password/forgot/domain/:domain
   * @param {Object} body
   * @param {any} domain  (example: dragohmventures.com)
   * @example
   * body
   * ```json
   * {
   * 	"email": "kelvin@dragohmventures.com"
   * }
   * ```
   */
  static async forgotPassword(body, domain, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/password/forgot/domain/${domain}`,
      body,
      json: true,
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
   * login - Register a user
   *
   * Path: api/v1/auth/login/domain/:domain
   * @param {Object} body
   * @param {any} domain  (example: test.com)
   * @example
   * body
   * ```json
   * {
   * 	"username": "test",
   * 	"password": "Pas5w0r!d",
   *     "domain": "default"
   * }
   * ```
   */
  static async login(body, domain, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/login/domain/${domain}`,
      body,
      json: true,
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  /**
  * register - Register a user

`group_request`	is optional.
  *
  * Path: api/v1/auth/register/domain/:domain
  * @param {Object} body
  * @param {any} domain  (example: test.com)
  * @example
  * body
  * ```json
  * {
 * 	"password":"Pas5w0r!d",
 * 	"email": "test@test.com"
 * }
  * ```
  */
  static async register(body, domain, opts) {
    var options = {
      method: 'POST',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/register/domain/${domain}`,
      body,
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }

  static get Token() {
    return AuthDomainToken;
  }
}
/**
 *
 */
class AuthDomainToken {
  constructor() {}
  static get _postgenClassUrls() {
    return {
      forgotpassword: 'api/v1/auth/token/password/forgot/domain/:domain',
    };
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  /**
   * forgotPassword - Generates a recovery token and returns the token to the attached user (if they exist) instead of sending an email.
   **CAUTION SECURITY RISK: Would not expose this URL publicly or have it be allowed by anyone who is not a superadmin type level**
   *
   * Path: api/v1/auth/token/password/forgot/domain/:domain
   * @param {Object} body
   * @param {any} domain
   * @example
   * body
   * ```json
   * {
   * 	"email": "test@test.com"
   * }
   * ```
   */
  static async forgotPassword(body, domain, opts) {
    var options = {
      method: 'PUT',
      simple: false,
      uri: hostUrl + '/' + `api/v1/auth/token/password/forgot/domain/${domain}`,
      body,
      json: true,
      json: true,
    };
    if (defaultOpts) {
      options = Object.assign(options, defaultOpts);
    }
    if (opts) {
      options = Object.assign(options, opts);
    }
    return await fasq.request(options);
  }
}
/**
 * SDK - importing the SDK for use
 * @param {string} host the hostname to the service (example: http://127.0.0.1)
 * @param {object} opts options that will be appened to every request. [Fasquest Lib Options](https://github.com/Phara0h/Fasquest) (example: {headers: {'API-KEY':'34098hodf'}})
 * @example
 * init
 * ```js
 * const { Travelling } = require('./sdk.js')('http://127.0.0.1');
 * ```
 */
function SDK(host, opts) {
  if (host) {
    hostUrl = host;
  }
  if (opts) {
    defaultOpts = opts;
  }
  return {
    Travelling,
    Config,
    Groups,
    GroupsType,
    Group,
    GroupUsers,
    GroupUser,
    GroupType,
    GroupTypeUsers,
    GroupTypeUser,
    GroupRequest,
    GroupRequestUser,
    Users,
    UsersDomain,
    User,
    UserDomain,
    UserCurrent,
    Auth,
    AuthToken,
    AuthDomain,
    AuthDomainToken,
  };
}
module.exports = SDK;

