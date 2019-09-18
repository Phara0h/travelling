const httpProxy = require('http-proxy');
const http = require('http');
const https = require('https');
const url = require('url');
const fp = require('fastify-plugin')

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
        this.unmergedGroups = [];
        this.mappedGroups = {};
        this.redis = require('../redis');

        // websocket listener
        server.on('upgrade', function(req, socket, head) {
            //  var res = config.ssl ? new https.ServerResponse(req) : new http.ServerResponse(req);
            var res = new http.ServerResponse(req);

            res.assignSocket(socket);
            req._wssocket = socket;
            //return app(req, res);
        });

        this.proxy.on('error', function(err, req, res) {
            log.error(err);
            if (res.status) {res.status(504);}
            res.end();
        });

    }


    async updateGroupList() {
      log.debug('Updating Groups')
      var grps = await Group.findAll();
      this.mappedGroups = {};
      this.unmergedGroups = grps;
        for (var i = 0; i < grps.length; i++) {
            this.mappedGroups[grps[i].id] = grps[i]._;
            this.groups[grps[i].name] = database.groupInheritedMerge(new Group(grps[i]._), grps);
        }

        this.redis.needsGroupUpdate = false;
    }



    async hookRequest(req,res) {
      if (this.redis.needsGroupUpdate) {
          this.redis.needsGroupUpdate = false;
          await this.updateGroupList();
      }
      this.routeUrl(req, res);
      return;
    }

    async routeUrl(req, res) {
        var authenticated = req.isAuthenticated;
        var sessionUser = req.session.data ? req.session.data.user : null;

        if(this.redis.needsGroupUpdate) {
          await this.updateGroupList();
        }

        var group = await this.currentGroup(req,res);

        if (sessionUser && sessionUser.locked) {
            req.logout(req,res);
            res.code(401).send('Account Locked');
        } else if (group) {
            // the route object
            var r = this.isRouteAllowed(req.raw.method, req.raw.url, group, sessionUser);
            if (r) {
                // sets user id cookie every time to protect against tampering.
                if (authenticated) {
                    req.headers['un'] = sessionUser.username;
                    req.headers['g'] = sessionUser.group.name;
                    req.headers['perm'] = r.name;
                    req.headers['aid'] = sessionUser.id;
                }

                if (req.raw.url.indexOf('/travelling/api/') == 0) {
                  if (config.log.requests) {
                      if (authenticated) {

                          log.info(sessionUser.username + ' (' + sessionUser.group.name + ') | ' + req.raw.ip + ' | [' + req.raw.method + '] '+req.req.url);
                      } else {
                          log.info('Unregistered User' + ' (anonymous)' + ' | ' + req.raw.ip + ' | [' + req.raw.method + '] '+req.req.url);
                      }
                    }
                    return false;
                } else {
                    var target = {
                        target: this.transformRoute(sessionUser, r, r.host || `${config.https ? 'https' : 'http'}://127.0.0.1:${config.port}`),
                    };

                    if (r.removeFromPath) {
                        req.raw.url = req.raw.url.replace(this.transformRoute(sessionUser, r, r.removeFromPath), '');
                    }

                    if(r.host)
                    {
                      if (req._wssocket) {
                          if (target.target.indexOf('wss') > -1) {
                            this.proxyssl.ws(req.raw, req._wssocket, target);
                          } else {
                            this.proxy.ws(req.raw, req._wssocket, target);
                          }
                      } else {
                          // This gets around websites host checking / blocking
                          //delete req.raw.headers.host;

                          if (target.target.indexOf('https') > -1) {
                            this.proxyssl.web(req.req, res.res, target);
                          } else {
                            this.proxy.web(req.req, res.res, target);
                          }
                      }
                      return true;
                    }

                    return false;
                }
                if (config.log.requests) {
                    if (authenticated) {
                        log.info(sessionUser.username + ' (' + sessionUser.group.name + ') | ' + req.ip + ' | [' + req.raw.method + '] '+req.req.url+' -> ' + target.target+req.raw.url);
                    } else {
                        log.info('Unregistered User' + ' (anonymous)' + ' | ' + req.ip + ' | [' + req.raw.method + '] '+req.req.url+' -> ' + target.target);
                    }

                }
                return true
            } else if (!authenticated) {
                // if (req.raw.url.indexOf('api') > -1) {
                //     res.code(401).send('Access Denied');
                // }
                if(req.req.url != config.portal.path) {
                  //console.log(req.raw.url, req.raw.url, config.portal.path)
                  this.setBackurl(res,req);
                  res.redirect(config.portal.path);
                }
                else {
                  res.code(401).send('Access Denied');
                }
                //}

                if (config.log.unauthorizedAccess) {
                    log.warn('Unauthorized', 'Unregistered User' + ' (anonymous)' + ' | ' + req.ip + ' | [' + req.raw.method + '] '+req.req.url);
                }
                return false;

            } else {
                res.code(401).send('Access Denied');

                if (config.log.unauthorizedAccess) {
                  log.warn('Unauthorized', sessionUser.username + ' (' + sessionUser.group.name + ') | ' + req.ip + ' | [' + req.raw.method + '] '+req.req.url);
                }
            }
        } else {
            await this.updateGroupList();
            this.setBackurl(res,req);
            res.redirect(config.portal.path);
        }
    }

    isRouteAllowed(method, url, routes, user) {

        var surl = url.split('?')[0].split(/[\/]/g).filter(String);

        for (var i = 0; i < routes.length; i++) {

            if (!routes[i].method || !method || method == routes[i].method || routes[i].method == '*') {
                  var route = this.transformRoute(user, routes[i], routes[i].route).split(/[\/]/g).filter(String);
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

    isPermissionAllowed(perm,routes,user) {
      var permRoute = perm.split(/[\-]/g).filter(String);

      for (var i = 0; i < routes.length; i++) {
          var permission = this.transformRoute(user, routes[i], routes[i].name).split(/[\-]/g);
          if (permission.length == permRoute.length || permission.length <= permRoute.length + 1 && (permission[permission.length - 1] == '*' || permission[0] == '*')) {
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

    transformRoute(usr, route, path) {
      var user = !usr ? {group:{}} : usr;
        return path.replace(/(:id|:username|:email|:group|:grouptype|:permission)/g, (a, b, c)=>{
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
                case ':group':
                    prop = user.group.name || prop;
                    break;
                case ':grouptype':
                    prop = user.group.type || prop;
                    break;
                case ':permission':
                    prop = this.transformRoute(usr, route, route.name || prop);
                    break;
            }
            return prop;
        });
    }

    async currentGroup(req,res) {

      if(this.redis.needsGroupUpdate) {
        await this.updateGroupList();
      }

      return !req.isAuthenticated ? this.groups['anonymous'] : this.groups[req.session.data.user.group.name];
    }

    async defaultGroup() {

      if(this.redis.needsGroupUpdate) {
        await this.updateGroupList();
      }

      for (var i = 0; i < this.unmergedGroups.length; i++) {
          if(this.unmergedGroups[i].is_default) {
            return this.unmergedGroups[i];
          }
      }
    }

    async getGroup(id) {

      if(this.redis.needsGroupUpdate) {
        await this.updateGroupList();
      }
      for (var i = 0; i < this.unmergedGroups.length; i++) {
          if(this.unmergedGroups[i].id == id || this.unmergedGroups[i].name == id) {
            return this.unmergedGroups[i];
          }
      }
      return null;
    }

    async getGroupByType(type) {

      if(this.redis.needsGroupUpdate) {
        await this.updateGroupList();
      }

      for (var i = 0; i < this.unmergedGroups.length; i++) {
          if(this.unmergedGroups[i].type == type) {
            return this.unmergedGroups[i];
          }
      }
    }

    async getGroups() {

      if(this.redis.needsGroupUpdate) {
        await this.updateGroupList();
      }

      return this.unmergedGroups;
    }

    async getMappedGroups() {

      if(this.redis.needsGroupUpdate) {
        await this.updateGroupList();
      }

      return this.mappedGroups;
    }

    setBackurl(res,req) {
      res.setCookie('trav:backurl', req.raw.method+"|"+req.raw.url, {
        expires: new Date(Date.now() + 240000),
        secure: config.https,
        httpOnly: true,
        path: '/'
      });
    }
}


module.exports = Router;
