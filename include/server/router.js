const httpProxy = require('http-proxy');
const http = require('http');
const https = require('https');
const config = require('../utils/config');
const gm = require('./groupmanager');
const log = config.log.logger;
const regex = require('../utils/regex');
const parse = require('../utils/parse');
//const { proxy } = require('fast-proxy')({});
const ignored_log_routes = ['/' + config.serviceName + '/metrics', '/' + config.serviceName + '/health'];

class Router {
  constructor(server) {
    this.proxy = httpProxy.createProxyServer({
      ws: true,
      secure: false,
      agent: new http.Agent({ keepAlive: true, timeout: config.proxy.timeout }),
      timeout: 0
    });

    this.proxyssl = httpProxy.createProxyServer({
      ws: true,
      secure: false,
      agent: new https.Agent({ keepAlive: true, timeout: config.proxy.timeout }),
      timeout: 0
    });

    // websocket listener
    server.on('upgrade', function (req, socket, head) {
      //  var res = config.ssl ? new https.ServerResponse(req) : new http.ServerResponse(req);
      var res = new http.ServerResponse(req);

      res.assignSocket(socket);
      req._wssocket = socket;
      // return app(req, res);
    });

    this.proxy.on('error', function (err, req, res) {
      log.error(err);
      res.statusCode = 504;
      res.end();
    });

    this.proxyssl.on('error', function (err, req, res) {
      log.error(err);
      res.statusCode = 504;
      res.end();
    });
  }

  async routeUrl(req, res) {
    var authenticated = req.isAuthenticated;
    var sessionUser = req.session.data ? req.session.data.user : null;
    var sessionGroupsData = req.session.data ? req.session.data.groupsData : null;

    await gm.updateGroupsIfNeeeded();

    var groups = await gm.currentGroup(req, res);

    if (sessionUser && sessionUser.locked) {
      req.logout(req, res);
      res.code(401).send('Account Locked');
      return false;
    }
    if (groups) {
      // the route object
      var r = null;
      var routedGroup = null;

      for (var i = 0; i < groups.length; i++) {
        routedGroup = groups[i].group;
        r = this.isRouteAllowed(req.raw.method, req.raw.url, groups[i].routes, sessionUser, routedGroup);
        if (r) {
          break;
        }
      }

      if (req.raw.url.indexOf(config.portal.path) == 0) {
        return false;
      }

      if (!r && !authenticated) {
        // if (req.raw.url.indexOf('api') > -1) {
        //     res.code(401).send('Access Denied');
        // }

        if (
          req.raw.url != config.portal.path &&
          req.raw.url.indexOf('/' + config.serviceName + '/api/') != 0 &&
          req.raw.url.indexOf('/' + config.serviceName + '/assets/') != 0
        ) {
          // console.log(req.raw.url, req.raw.url, config.portal.path)
          this.setBackurl(res, req);
          res.redirect(config.portal.path);
        } else {
          res.code(401).send('Access Denied');
        }
        // }

        if (config.log.unauthorizedAccess) {
          log.warn(
            'Unauthorized',
            'Unregistered User' + ' (anonymous)' + ' | ' + parse.getIp(req) + ' | [' + req.raw.method + '] ' + req.raw.url
          );
        }
        return false;
      }

      if (!r) {
        res.code(401).send('Access Denied');

        if (config.log.unauthorizedAccess) {
          if (!sessionGroupsData) {
            sessionGroupsData = await sessionUser.resolveGroup();
          }
          log.warn(
            'Unauthorized',
            sessionUser.username +
              ' (' +
              sessionGroupsData.names +
              ') | ' +
              parse.getIp(req) +
              ' | [' +
              req.raw.method +
              '] ' +
              req.raw.url
          );
        }
        return false;
      }
      // sets user id cookie every time to protect against tampering.
      if (authenticated && config.proxy.sendTravellingHeaders) {
        if (config.user.username.enabled) {
          req.headers['t-user'] = sessionUser.username;
        }

        req.headers['t-grpn'] = routedGroup.name;
        req.headers['t-grpt'] = routedGroup.type;
        req.headers['t-dom'] = sessionUser.domain;
        req.headers['t-id'] = sessionUser.id;
        req.headers['t-email'] = sessionUser.email;
        req.headers['t-perm'] = r.name;
        req.headers['t-ip'] = parse.getIp(req) || '0.0.0.0';
      }

      if (req.raw.url.indexOf('/' + config.serviceName + '/') == 0 && !r.host) {
        if (config.log.requests && ignored_log_routes.indexOf(req.raw.url) == -1) {
          if (authenticated) {
            log.info(
              (sessionUser.username || sessionUser.email) +
                ' (' +
                routedGroup.name +
                ') | ' +
                parse.getIp(req) +
                ' | [' +
                req.raw.method +
                '] ' +
                req.raw.url
            );
          } else {
            log.info(
              'Unregistered User' + ' (anonymous)' + ' | ' + parse.getIp(req) + ' | [' + req.raw.method + '] ' + req.raw.url
            );
          }
        }
        return false;
      }

      var target = {
        target: this.transformRoute(
          sessionUser,
          r,
          r.host || `${config.https ? 'https' : 'http'}://127.0.0.1:${config.port}`,
          routedGroup
        )
      };

      if (r.remove_from_path) {
        req.raw.url = req.raw.url.replace(this.transformRoute(sessionUser, r, r.remove_from_path, routedGroup), '');
      }
      if (config.log.requests && ignored_log_routes.indexOf(req.raw.url) == -1) {
        if (authenticated) {
          log.info(
            (sessionUser.username || sessionUser.email) +
              ' (' +
              routedGroup.name +
              ') | ' +
              parse.getIp(req) +
              ' | [' +
              req.raw.method +
              '] ' +
              req.raw.url +
              ' -> ' +
              target.target +
              req.raw.url
          );
        } else {
          log.info(
            'Unregistered User' +
              ' (anonymous)' +
              ' | ' +
              parse.getIp(req) +
              ' | [' +
              req.raw.method +
              '] ' +
              req.raw.url +
              ' -> ' +
              target.target
          );
        }
      }

      if (r.host && req._wssocket) {
        if (target.target.indexOf('wss') > -1) {
          this.proxyssl.ws(req.raw, req._wssocket, target);
        } else {
          this.proxy.ws(req.raw, req._wssocket, target);
        }
        return true;
      }

      if (r.host) {
        // This gets around websites host checking / blocking
        delete req.raw.headers.host;

        if (target.target.indexOf('https') > -1) {
          //console.log(req.raw.url, { base: target.target, opts: { requests: { https: true } } });
          //  proxy(req.raw, res.raw, target.target + req.raw.url);
          this.proxyssl.web(req.raw, res.raw, target);
        } else {
          //proxy(req.raw, res.raw, req.raw.url, { base: target.target });
          this.proxy.web(req.raw, res.raw, target);
        }
        return true;
      }

      return false;
    }

    // await this.updateGroupList();
    // this.setBackurl(res, req);
    // res.redirect(config.portal.path);

    // Should never get here;
    log.wtf('router you what?');
    return false;
  }

  // @TODO Change these regex to precompiled ones inside regex.js

  /* eslint-disable */
  isRouteAllowed(method, url, routes, user, currentGroup) {
    var surl = url.split('?')[0].split(/[\/]/g).filter(String);

    for (var i = 0; i < routes.length; i++) {
      if (!routes[i].method || !method || method == routes[i].method || routes[i].method == '*') {
        var route = this.transformRoute(user, routes[i], routes[i].route, currentGroup);

        if (!route) {
          continue;
        }
        route = route.split(/[\/]/g).filter(String);

        if (
          route.length == surl.length ||
          (route.length <= surl.length + 1 && (route[route.length - 1] == '*' || route[0] == '*'))
        ) {
          var allowed = true;

          for (var j = 0; j < route.length; j++) {
            if (route[j] != surl[j] && route[j] != '*') {
              if (route[j].length > 0) {
                // checking for @. - _ in-between for wildcards
                var subSurl = surl[j].split(/[\@\.\-_]/g).reverse();
                var subRoute = route[j].split(/[\@\.\-_]/g).reverse();

                for (var k = 0; k < subRoute.length; k++) {
                  if (subRoute[k] != subSurl[k] && subRoute[k] != '*') {
                    allowed = false;
                    break;
                  }
                }
                break;
              } else {
                allowed = false;
                break;
              }
            }
          }
          if (allowed) {
            return routes[i];
          }
        }
      }
    }
    return false;
  }

  isPermissionAllowed(perm, routes, user, currentGroup) {
    var permRoute = perm.split(/[\-]/g).filter(String);

    for (var i = 0; i < routes.length; i++) {
      var permission = this.transformRoute(user, routes[i], routes[i].name, currentGroup).split(/[\-]/g);

      if (
        permission.length == permRoute.length ||
        (permission.length <= permRoute.length + 1 &&
          (permission[permission.length - 1] == '*' || permission[0] == '*'))
      ) {
        var allowed = true;

        for (var j = 0; j < permission.length; j++) {
          if (permission[j] != permRoute[j] && permission[j] != '*') {
            allowed = false;
            break;
          }
        }

        if (allowed) {
          return routes[i];
        }
      }
    }
    return false;
  }

  transformRoute(usr, route, path, group) {
    var user = !usr ? { group: {} } : usr;
    if (!path) {
      return path;
    }
    return path.replace(regex.transformRoute, (a, b, c) => {
      var prop = '';

      switch (a) {
        case ':id':
          prop = user.id || prop;
          break;
        case ':username':
          prop = user.username || prop;
          break;
        case ':email':
          prop = user.email || prop;
          break;
        case ':domain':
          prop = user.domain || prop;
        case ':grouptype':
          prop = group.type || prop;
          break;
        case ':group':
          prop = group.name || prop;
          break;
        case ':permission':
          prop = this.transformRoute(usr, route, route.name || prop, group);
          break;
      }
      return prop;
    });
  }

  setBackurl(res, req) {
    res.setCookie('trav:backurl', req.raw.method + '|' + req.raw.url, {
      expires: new Date(Date.now() + 240000),
      secure: config.https,
      httpOnly: true,
      domain: config.cookie.domain,
      path: '/'
    });
  }
}

module.exports = Router;
