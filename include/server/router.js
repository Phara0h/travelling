const httpProxy = require('http-proxy');
const http = require('http');
const https = require('https');
const url = require('url');
const config = require('../utils/config');
const database = require('../database')
const Group = require('../database/models/group');
const log = config.log.logger;

class Router {
    constructor(server) {
        this.proxy = httpProxy.createProxyServer(
            {
                ws: true,
                secure: false,
                agent: new http.Agent({keepAlive: true, timeout: config.proxy.timeout}),
                timeout: 0,
            });

        this.proxyssl = httpProxy.createProxyServer(
            {
                ws: true,
                secure: false,
                agent: new https.Agent({keepAlive: true, timeout: config.proxy.timeout}),
                timeout: 0,
            });

        this.groups = [];
        this.needsGroupUpdate = true;

        // websocket listener
        server.on('upgrade', function(req, socket, head) {
            //  var res = config.ssl ? new https.ServerResponse(req) : new http.ServerResponse(req);
            var res = new http.ServerResponse(req);

            res.assignSocket(socket);
            req._wssocket = socket;
            return app(req, res);
        });

        this.proxy.on('error', function(err, req, res) {
            log.error(err);
            if (res.status) {res.status(504);}
            res.end();
        });
    }


    async updateGroupList() {
      var grps = await Group.findAll();
        for (var i = 0; i < grps.length; i++) {
            this.groups[grps[i].name] = database.groupInheritedMerge(grps[i], grps);
        }
    }

    async hookRequest(req,res) {
      if (this.needsGroupUpdate) {
          this.needsGroupUpdate = false;
          await this.updateGroupList();
      }
      this.routeUrl(req, res);
      return;
    }
    async routeUrl(req, res) {
        var authenticated = req.isAuthenticated;
        var sessionUser = req.session.user;

        var group = !authenticated ? this.groups['anonymous'] : this.groups[sessionUser.group.name];

        if (sessionUser && sessionUser.locked) {
            req.logout(req,res);
            res.code(401).send('Account Locked');
        } else if (group) {
            // the route object
            var r = this.isRouteAllowed(req.raw.method, req.raw.url, group, sessionUser);

            if (r) {
                // sets user id cookie every time to protect against tampering.
                // res.cookie('travelling:aid', sessionUser._id);
                // res.cookie('travelling:un', sessionUser.username);
                // res.cookie('travelling:g', sessionUser.group.name)
                if (authenticated) {
                    req.headers['un'] = sessionUser.username;
                    req.headers['g'] = sessionUser.group.name;
                    req.headers['aid'] = sessionUser.id;
                }

                if (req.raw.url.indexOf('/travelling/') == 0) {
                    return true;
                } else {
                    var target = {
                        target: this.transformRoute(sessionUser, r.host == null ? req.protocol + '://' + req.headers.host : r.host),
                    };

                    if (r.removeFromPath) {
                        req.raw.url = req.raw.url.replace(this.transformRoute(sessionUser, r.removeFromPath), '');
                    }

                    if (req._wssocket) {
                        if (target.target.indexOf('wss') > -1) {
                          this.proxyssl.ws(req.raw, req._wssocket, target);
                        } else {
                          this.proxy.ws(req.raw, req._wssocket, target);
                        }
                    } else {
                        // This gets around websites host checking / blocking
                        delete req.raw.headers.host;
                        if (target.target.indexOf('https') > -1) {
                          this.proxyssl.web(req.req, res.res, target);
                        } else {
                          this.proxy.web(req.req, res.res, target);
                        }
                    }
                }
                if (config.log.requests) {
                    if (authenticated) {
                        log.info(sessionUser.username + ' (' + sessionUser.group.name + ') | ' + req.ip + ' | [' + req.raw.method + '] ' + req.raw.url);
                    } else {
                        log.warn('Unregistered User' + ' (anonymous)' + ' | ' + req.ip + ' | [' + req.raw.method + '] ' + req.raw.url);
                    }
                }
            } else if (!authenticated) {
                // if (req.raw.url.indexOf('api') > -1) {
                //     res.code(401).send('Access Denied');
                // } else {
                    req.session._backurl = req.raw.url;
                    res.redirect(config.portal.path);
                //}

                if (config.log.unauthorizedAccess) {
                    log.log('Unauthorized', 'Unregistered User' + ' (anonymous)' + ' | ' + req.ip + ' | [' + req.raw.method + '] ' + req.raw.url);
                }

            } else {
                res.code(401).send('Access Denied');

                if (config.log.unauthorizedAccess) {
                  log.log('Unauthorized', sessionUser.username + ' (' + sessionUser.group.name + ') | ' + req.ip + ' | [' + req.raw.method + '] ' + req.raw.url);
                }
            }
        } else {
            await this.updateGroupList();
            req.session._backurl = req.raw.url;
            res.redirect(config.portal.path);
        }

       return true;
    }

    isRouteAllowed(method, url, routes, user) {

        var surl = url.split('?')[0].split(/[\/]/g).filter(String);
        for (var i = 0; i < routes.length; i++) {
            if (!routes[i].method || !method || method == routes[i].method) {
                var route = this.transformRoute(user, routes[i].route).split(/[\/]/g).filter(String);
                if (route.length == surl.length || route.length <= surl.length + 1 && (route[route.length - 1] == '*' || route[0] == '*')) {
                    var allowed = true;

                    for (var j = 0; j < route.length; j++) {
                        if (route[j] != surl[j] && route[j] != '*') {
                            if (route[j].length > 0) {
                                var subSurl = surl[j].split(/[\.\-_]/g).reverse(); // checking for . - _ in-between for wildcards
                                var subRoute = route[j].split(/[\.\-_]/g).reverse();

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
                    if (allowed) {return routes[i];}
                }
            }
        }
        return false;
    };

    transformRoute(user, route) {
        return route.replace(/(:id|:username|:email|:group)/g, (a, b, c)=>{
            var prop = '';

            if (!user) {return prop;}

            switch (a) {
                case ':id':
                    prop = user._id || prop;
                    break;
                case ':username':
                    prop = user.username || prop;
                    break;
                case ':email':
                    prop = user.email || prop;
                    break;
                case ':group':
                    prop = user.group.name || prop;
                    break;
            }
            return prop;
        });
    }
}


module.exports = Router;
// module.exports = function(log, db, server, app){return new Routing(log, db, server, app)}; // if running into Hoisting issues use this, not fully tested though.
