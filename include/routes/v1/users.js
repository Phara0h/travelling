const User = require('../../database/models/user');
const Token = require('../../database/models/token');
const TokenHandler = require('../../token');

const userUtils = require('../../utils/user');
const config = require('../../utils/config');
const audit = require('../../utils/audit');
const misc = require('../../utils/misc');
const gm = require('../../server/groupmanager');
const userRoutes = require('./functions/users');
const parse = require('../../utils/parse');
const regex = require('../../utils/regex');

module.exports = function (app, opts, done) {
  const router = opts.router;

  // var getUserResolveGroup = async (req, res) => {
  //     return await getUser(req, res, true);
  // };

  app.get('/user/id/:id', async (req, res) => {
    return await userRoutes.getUser({ req, res, needsDomain: false, router });
  });

  app.get('/user/id/:id/property/:prop', async (req, res) => {
    return await userRoutes.getUser({ req, res, needsDomain: false, router });
  });

  app.put('/user/id/:id/inheritance/group/:groupid/type/:grouptype', async (req, res) => {
    const group = await userRoutes.getGroup(req, res);

    if (group && group.msg) {
      res.code(400);
      return group;
    }

    var user = await userRoutes.getUser({ req, res, needsDomain: false });

    if (user && user.msg) {
      res.code(400);
      return user;
    }

    user = await userRoutes.addRemoveGroupInheritance(user, group, true, req);
    res.code(user && user.msg ? 400 : 200);

    return user;
  });

  app.delete('/user/id/:id/inheritance/group/:groupid/type/:grouptype', async (req, res) => {
    const group = await userRoutes.getGroup(req, res);

    if (group && group.msg) {
      res.code(400);
      return group;
    }

    var user = await userRoutes.getUser({ req, res, needsDomain: false });

    if (user && user.msg) {
      res.code(400);
      return user;
    }

    user = await userRoutes.addRemoveGroupInheritance(user, group, false, req);
    res.code(user && user.msg ? 400 : 200);

    return user;
  });

  app.put('/user/id/:id', async (req, res) => {
    return await userRoutes.editUser({ req, res, needsDomain: false, router });
  });

  app.put('/user/id/:id/property/:prop', async (req, res) => {
    return await userRoutes.editUser({ req, res, needsDomain: false, router });
  });

  app.put('/user/id/:id/property/userdata/:prop', async (req, res) => {
    req.params.prop = `user_data.${req.params.prop}`;
    return await userRoutes.editUser({ req, res, needsDomain: false, router });
  });

  app.put('/user/id/:id/property/:prop/:propdata', async (req, res) => {
    return await userRoutes.editUser({ req, res, needsDomain: false, router });
  });

  app.put('/user/id/:id/property/userdata/:prop/:propdata', async (req, res) => {
    req.params.prop = `user_data.${req.params.prop}`;
    return await userRoutes.editUser({ req, res, needsDomain: false, router });
  });

  app.delete('/user/id/:id', async (req, res) => {
    return await userRoutes.deleteUser({ req, res, needsDomain: false, router });
  });

  // Domain operations
  app.get('/user/domain/:domain/id/:id', async (req, res) => {
    return await userRoutes.getUser({ req, res, needsDomain: true, router });
  });

  app.get('/user/domain/:domain/id/:id/property/:prop', async (req, res) => {
    return await userRoutes.getUser({ req, res, needsDomain: true, router });
  });

  app.put('/user/domain/:domain/id/:id/inheritance/group/:groupid/type/:grouptype', async (req, res) => {
    const group = await userRoutes.getGroup(req, res);

    if (group && group.msg) {
      res.code(400);
      return group;
    }

    var user = await userRoutes.getUser({ req, res, needsDomain: true });

    if (user && user.msg) {
      res.code(400);
      return user;
    }

    user = await userRoutes.addRemoveGroupInheritance(user, group, true, req);
    res.code(user && user.msg ? 400 : 200);

    return user;
  });

  app.delete('/user/domain/:domain/id/:id/inheritance/group/:groupid/type/:grouptype', async (req, res) => {
    const group = await userRoutes.getGroup(req, res);

    if (group && group.msg) {
      res.code(400);
      return group;
    }

    var user = await userRoutes.getUser({ req, res, needsDomain: true });

    if (user && user.msg) {
      res.code(400);
      return user;
    }

    user = await userRoutes.addRemoveGroupInheritance(user, group, false, req);
    res.code(user && user.msg ? 400 : 200);

    return user;
  });

  app.put('/user/domain/:domain/id/:id', async (req, res) => {
    return await userRoutes.editUser({ req, res, needsDomain: true, router });
  });

  app.put('/user/domain/:domain/id/:id/property/:prop', async (req, res) => {
    return await userRoutes.editUser({ req, res, needsDomain: true, router });
  });

  app.put('/user/domain/:domain/id/:id/property/userdata/:prop', async (req, res) => {
    req.params.prop = `user_data.${req.params.prop}`;
    return await userRoutes.editUser({ req, res, needsDomain: true, router });
  });

  app.put('/user/domain/:domain/id/:id/property/:prop/:propdata', async (req, res) => {
    return await userRoutes.editUser({ req, res, needsDomain: true, router });
  });

  app.put('/user/domain/:domain/id/:id/property/userdata/:prop/:propdata', async (req, res) => {
    req.params.prop = `user_data.${req.params.prop}`;
    return await userRoutes.editUser({ req, res, needsDomain: true, router });
  });

  app.delete('/user/domain/:domain/id/:id', async (req, res) => {
    return await userRoutes.deleteUser({ req, res, needsDomain: true, router });
  });

  // app.get('/user/resolve/group/username/:username', getUserResolveGroup);
  // app.get('/user/resolve/group/username/:username/:prop', getUserResolveGroup);
  // app.get('/user/resolve/group/name/:id', getUserResolveGroup);
  // app.get('/user/resolve/group/name/:id/:prop', getUserResolveGroup);

  app.get('/users', async (req, res) => {
    if (req.query.filter && req.query.filter.indexOf(' ') > -1) {
      req.query.filter = req.query.filter.replace(/\s/g, '');
    }

    try {
      return await User.findAllByFilter({
        sort: req.query.sort,
        limit: req.query.limit,
        skip: req.query.skip,
        filter: req.query.filter,
        sortdir: req.query.sortdir,
        ids: req.query.ids,
        params: req.query.params
      });
    } catch {
      res.code(400).send({
        type: 'user-filter-error',
        msg: 'Invalid filter.'
      });
    }
  });

  app.get('/users/count', async (req, res) => {
    if (req.query.filter && req.query.filter.indexOf(' ') > -1) {
      req.query.filter = req.query.filter.replace(/\s/g, '');
    }

    try {
      return await User.findAllByFilter({
        limit: req.query.limit,
        skip: req.query.skip,
        filter: req.query.filter,
        ids: req.query.ids,
        count: true
      });
    } catch (e) {
      res.code(400).send({
        type: 'user-filter-error',
        msg: 'Invalid filter.'
      });
    }
  });

  app.get('/users/domain/:domain', async (req, res) => {
    if (req.query.filter && req.query.filter.indexOf(' ') > -1) {
      req.query.filter = req.query.filter.replace(/\s/g, '');
    }

    if (!req.query.filter) {
      req.query.filter = 'domain=' + req.params.domain;
    } else {
      req.query.filter += ',domain=' + req.params.domain;
    }

    try {
      return await User.findAllByFilter({
        sort: req.query.sort,
        limit: req.query.limit,
        skip: req.query.skip,
        filter: req.query.filter,
        sortdir: req.query.sortdir,
        ids: req.query.ids,
        params: req.query.params
      });
    } catch {
      res.code(400).send({
        type: 'user-filter-error',
        msg: 'Invalid filter.'
      });
    }
  });

  app.get('/users/domain/:domain/count', async (req, res) => {
    if (req.query.filter && req.query.filter.indexOf(' ') > -1) {
      req.query.filter = req.query.filter.replace(/\s/g, '');
    }

    if (!req.query.filter) {
      req.query.filter = 'domain=' + req.params.domain;
    } else {
      req.query.filter += ',domain=' + req.params.domain;
    }

    try {
      return await User.findAllByFilter({
        limit: req.query.limit,
        skip: req.query.skip,
        filter: req.query.filter,
        ids: req.query.ids,
        count: true
      });
    } catch {
      res.code(400).send({
        type: 'user-filter-error',
        msg: 'Invalid filter.'
      });
    }
  });

  app.get('/users/group/request/:group_request', async (req, res) => {
    if (!misc.isEmpty(req.query) && userUtils.checkValidUser(req.query)) {
      req.query.group_request = req.params.group_request;
      var query = userUtils.setUser({}, req.query);

      return await User.findAllBy(query);
    }

    return await User.findAllBy({ group_request: req.params.group_request });
  });

  app.get('/user/me', (req, res) => {
    res.send(req.session.data.user);
  });

  app.get('/user/me/property/:prop', (req, res) => {
    if (userUtils.checkUserProps(req.params.prop)) {
      res.code(200).send(req.session.data.user[req.params.prop]);
    } else {
      res.code(400).send({
        type: 'user-prop-error',
        msg: 'Not a property of user'
      });
    }
  });

  app.put('/user/me/inheritance/group/:groupid/type/:grouptype', async (req, res) => {
    req.params.id = req.session.data.user.id;

    const group = await userRoutes.getGroup(req, res);

    if (group && group.msg) {
      res.code(400);
      return group;
    }

    var user = await userRoutes.getUser({ req, res, needsDomain: false });

    if (user && user.msg) {
      res.code(400);
      return user;
    }

    user = await userRoutes.addRemoveGroupInheritance(user, group, true, req);
    res.code(user && user.msg ? 400 : 200);

    return user;
  });

  app.delete('/user/me/inheritance/group/:groupid/type/:grouptype', async (req, res) => {
    req.params.id = req.session.data.user.id;

    const group = await userRoutes.getGroup(req, res);

    if (group && group.msg) {
      res.code(400);
      return group;
    }

    var user = await userRoutes.getUser({ req, res, needsDomain: false });

    if (user && user.msg) {
      res.code(400);
      return user;
    }

    user = await userRoutes.addRemoveGroupInheritance(user, group, false, req);
    res.code(user && user.msg ? 400 : 200);

    return user;
  });

  app.put('/user/me', async (req, res) => {
    req.params.id = req.session.data.user.id;
    req.params.domain = req.session.data.user.domain;
    return await userRoutes.editUser({ req, res, needsDomain: true, router });
  });

  app.put('/user/me/property/:prop', async (req, res) => {
    req.params.id = req.session.data.user.id;
    req.params.domain = req.session.data.user.domain;
    return await userRoutes.editUser({ req, res, needsDomain: true, router });
  });

  app.put('/user/me/property/userdata/:prop', async (req, res) => {
    req.params.id = req.session.data.user.id;
    req.params.domain = req.session.data.user.domain;
    req.params.prop = `user_data.${req.params.prop}`;
    return await userRoutes.editUser({ req, res, needsDomain: true, router });
  });

  app.put('/user/me/property/:prop/:propdata', async (req, res) => {
    req.params.id = req.session.data.user.id;
    req.params.domain = req.session.data.user.domain;
    return await userRoutes.editUser({ req, res, needsDomain: true, router });
  });

  app.put('/user/me/property/userdata/:prop/:propdata', async (req, res) => {
    req.params.id = req.session.data.user.id;
    req.params.domain = req.session.data.user.domain;
    req.params.prop = `user_data.${req.params.prop}`;
    return await userRoutes.editUser({ req, res, needsDomain: true, router });
  });

  app.get('/user/me/route/allowed', async (req, res) => {
    if (req.session) {
      const groups = await gm.currentGroup(req, res);
      const headersDomain = parse.getDomainFromHeaders(req.headers);

      for (var i = 0; i < groups.length; i++) {
        if (
          router.isRouteAllowed(
            req.query.method,
            req.query.route,
            groups[i].routes,
            !req.isAuthenticated ? null : req.session.data.user,
            groups[i].group,
            headersDomain
          )
        ) {
          res.code(200);
          return true;
        }
      }
    }

    res.code(401);
    return false;
  });

  app.post('/user/me/routes/allowed', async (req, res) => {
    if (req.session) {
      const groups = await gm.currentGroup(req, res);
      const headersDomain = parse.getDomainFromHeaders(req.headers);
      const addedRoutes = [];

      if (req.body && req.body.length) {
        var routes = [];
        for (var j = 0; j < req.body.length; j++) {
          var method = req.body[j].method || `*`;
          var route = req.body[j].route;

          if (route) {
            for (var i = 0; i < groups.length; i++) {
              if(addedRoutes[`${method}-${route}`] === undefined) {
                var croute = { 
                  method,
                  route,
                  allowed: router.isRouteAllowed(method,route,groups[i].routes,!req.isAuthenticated ? null : req.session.data.user,groups[i].group, headersDomain) ? true : false
                };
                routes.push(croute)

                if(croute.allowed) {
                  break;
                }

                addedRoutes[`${method}-${route}`] = routes.length - 1;
              } else {
                var croute = routes[addedRoutes[`${method}-${route}`]];
                if(!croute.allowed) {
                  croute.allowed = router.isRouteAllowed(method,route,groups[i].routes,!req.isAuthenticated ? null : req.session.data.user,groups[i].group, headersDomain) ? true : false;
                  routes[addedRoutes[`${method}-${route}`]] = croute;
                  
                  if(croute.allowed ) {
                    break;
                  }
                }
              }
            }
          }
        }
        res.code(200);
        return routes;
      } else {
        res.code(400);
        return {
          type: 'routes-check-error',
          msg: 'No array of routes provided'
        }
      }
    }
    res.code(401);
    return false;
  });

  app.get('/user/me/permission/allowed/:permission', async (req, res) => {
    if (req.session) {
      const groups = await gm.currentGroup(req, res);

      for (var i = 0; i < groups.length; i++) {
        if (
          router.isPermissionAllowed(
            req.params.permission,
            groups[i].routes,
            !req.isAuthenticated ? null : req.session.data.user,
            groups[i].group
          )
        ) {
          res.code(200);
          return true;
        }
      }
    }

    res.code(401);
    return false;
  });

  app.post('/user/me/token', async (req, res) => {
    let token;

    try {
      token = await TokenHandler.getOAuthToken(
        req.session.data.user.id,
        req.body.type || 'oauth',
        req.body.name || null,
        req.body.urls
      );

      if (config.audit.create.enable === true) {
        var hashedToken = await Token.findById(token.id);
        delete hashedToken.secret_encrypt;

        var auditObj = {
          action: 'CREATE',
          subaction: 'USER_OAUTH2_TOKEN',
          newObj: hashedToken
        };

        if (req.session.data) {
          auditObj.byUserId = req.session.data.user.id;
          auditObj.ofUserId = req.session.data.user.id;
        }

        await audit.createSingleAudit(auditObj);
      }

      res.code(200).send({ client_id: token.name || token.id, client_secret: token.secret });
      return;
    } catch (e) {
      res.code(400).send({
        type: 'token-error',
        msg: e
      });
      config.log.logger.debug(e);
      return;
    }
  });

  app.delete('/user/me/token/:id', async (req, res) => {
    var token = null;

    try {
      token = await TokenHandler.deleteOAuthToken(req.params.id, req.session.data.user.id);
      if (!token) {
        res.code(400).send({
          type: 'token-error',
          msg: 'Unabled to delete token.'
        });
        return;
      }

      if (config.audit.delete.enable === true) {
        var auditObj = {
          action: 'DELETE',
          subaction: 'USER_OAUTH2_TOKEN',
          oldObj: token
        };

        if (req.session.data) {
          auditObj.byUserId = req.session.data.user.id;
          auditObj.ofUserId = req.session.data.user.id;
        }

        await audit.createSingleAudit(auditObj);
      }

      res.code(200).send();
      return;
    } catch (e) {
      res.code(400).send({
        type: 'token-error',
        msg: 'Unabled to delete token.'
      });
      config.log.logger.debug(e);
      return;
    }
  });

  done();
};
