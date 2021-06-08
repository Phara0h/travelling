const regex = require('../../utils/regex');
const User = require('../../database/models/user');
const TokenHandler = require('../../token');
const userUtils = require('../../utils/user');
const config = require('../../utils/config');
const misc = require('../../utils/misc');
const gm = require('../../server/groupmanager');
const Database = require('../../database');

async function deleteUser(req, res, router) {
  var id = _getId(req);

  if (!id) {
    res.code(400);
    return {
      type: 'user-find-by-error',
      msg: 'No user by that username or id was found.'
    };
  }

  var user = await User.deleteAllBy(id, 'AND');

  if (user && user.length > 0) {
    await user[0].resolveGroup(router);

    var session = await req.sessionStore.get(user[0].id);

    if (session) {
      await req.sessionStore.destroy(session.sessionId);
    }

    res.code(200);
    return user[0];
  }

  res.code(400);
  return {
    type: 'user-delete-error',
    msg: 'No user by that username or id was found.'
  };
}

async function editUser(req, res, router) {
  var id = _getId(req);

  if (!id) {
    res.code(400);
    return {
      type: 'user-find-by-error',
      msg: 'No user by that username or id was found.'
    };
  }

  // filter group_id
  req.body = filterUser(req);

  var model = req.body;

  if (req.params.prop) {
    model = req.params.propdata ? { [req.params.prop]: req.params.propdata } : { [req.params.prop]: req.body };
  }

  var isValid = await userUtils.checkValidUser(model);

  if (isValid === true) {
    isValid = await Database.checkDupe(model);
  }
  if (isValid !== true) {
    res.code(400);
    return isValid;
  }

  var updatedProps = userUtils.setUser({}, model);

  if (misc.isEmpty(updatedProps)) {
    res.code(400);
    return {
      type: 'user-prop-error',
      msg: 'Not a property of user'
    };
  }

  var user = await User.updateLimitedBy(id, updatedProps, 'AND', 1);

  if (user && user.length > 0) {
    if (req.params.prop && user[0][req.params.prop] === undefined) {
      res.code(400);
      return {
        type: 'user-prop-error',
        msg: 'Not a property of user'
      };
    }

    const groupsData = await user[0].resolveGroup(router);

    res.code(200);
    // Update any current logged in users
    var session = await req.sessionStore.get(user[0].id);

    if (session) {
      session.data = { user: user[0], groupsData };
      await req.sessionStore.set(session.sessionId, session);
    }

    return req.params.prop ? user[0][req.params.prop] : user[0];
  }

  res.code(400);
  return {
    type: 'user-edit-error',
    msg: 'No user by that username or id was found.'
  };
}

async function getUser(req, res) {
  var id = _getId(req);

  if (!id) {
    res.code(400);
    return {
      type: 'user-find-by-error',
      msg: 'No user by that username or id was found.'
    };
  }

  var user = await User.findLimtedBy(id, 'AND', 1);

  if (user && user.length > 0) {
    if (req.params.prop && user[0][req.params.prop] === undefined) {
      res.code(400);
      return {
        type: 'user-prop-error',
        msg: 'Not a property of user'
      };
    }

    await user[0].resolveGroup();

    res.code(200);
    return req.params.prop ? user[0][req.params.prop] : user[0];
  }

  res.code(400);
  return {
    type: 'user-find-by-error',
    msg: 'No user by that username or id was found.'
  };
}
async function updateSessionUser(user, req) {
  const groupsData = await user.resolveGroup();
  // Update any current logged in users
  var session = await req.sessionStore.get(user.id);

  if (session) {
    session.data = { user, groupsData };
    await req.sessionStore.set(session.sessionId, session);
  }
}

async function getGroup(req, res) {
  var group = null;

  if (req.params.groupid) {
    group = await gm.getGroup(req.params.groupid, req.params.grouptype || 'group');
  }

  if (!group) {
    return {
      type: 'user-edit-group-error',
      msg: 'No group with that type by that name or id was found.'
    };
  }

  return group;
}

async function addRemoveGroupInheritance(user, group, add = true, req) {
  if (user) {
    // console.log(group);
    user = add ? await user.addGroup(group) : await user.removeGroup(group);

    if (!user) {
      return {
        type: `user-${add ? 'add' : 'remove'}-group-error`,
        msg: `User could not ${add ? 'add' : 'remove'} group.`
      };
    }
    await updateSessionUser(user, req);
    return user;
  }

  // console.log(user);

  return {
    type: 'user-edit-error',
    msg: 'No user by that username or id was found.'
  };
}
function filterUser(req) {
  if (!req.body) {
    return req.body;
  }

  if (req.body.group_ids) {
    // if (req.params.prop == 'group_ids' && req.params.propdata) {
    // req.body.group_ids = req.params.propdata;
    // } else {
    delete req.body.group_ids;
    // }
  }

  if (config.user.isolateByDomain) {
    if (req.body.domain) {
      delete req.body.domain;
    }
  }

  return req.body;
}

function _getId(req) {
  if (!req.params.id) {
    return null;
  }
  // if prob an email addresss
  if (req.params.id.indexOf('@') > -1) {
    return { email: req.params.id };
  }

  if (!regex.uuidCheck(req.params.id)) {
    if (regex.username.exec(req.params.id)) {
      return { username: req.params.id };
    } else {
      return null;
    }
  }

  return { id: req.params.id };
}

function routes(app, opts, done) {
  const router = opts.router;

  // var getUserResolveGroup = async (req, res) => {
  //     return await getUser(req, res, true);
  // };

  app.get('/user/id/:id', async (req, res) => {
    return await getUser(req, res, router);
  });
  app.get('/user/id/:id/property/:prop', async (req, res) => {
    return await getUser(req, res, router);
  });

  app.put('/user/id/:id/inheritance/group/:groupid/type/:grouptype', async (req, res) => {
    const group = await getGroup(req, res);

    // console.log(group);
    if (group && group.msg) {
      res.code(400);
      return group;
    }

    var user = await getUser(req, res);

    if (user && user.msg) {
      res.code(400);
      return user;
    }

    user = await addRemoveGroupInheritance(user, group, true, req);
    res.code(user && user.msg ? 400 : 200);

    return user;
  });

  app.delete('/user/id/:id/inheritance/group/:groupid/type/:grouptype', async (req, res) => {
    const group = await getGroup(req, res);

    if (group && group.msg) {
      res.code(400);
      return group;
    }

    var user = await getUser(req, res);

    if (user && user.msg) {
      res.code(400);
      return user;
    }

    user = await addRemoveGroupInheritance(user, group, false, req);
    res.code(user && user.msg ? 400 : 200);

    return user;
  });

  app.put('/user/id/:id', async (req, res) => {
    return await editUser(req, res, router);
  });
  app.put('/user/id/:id/property/:prop', async (req, res) => {
    return await editUser(req, res, router);
  });
  app.put('/user/id/:id/property/:prop/:propdata', async (req, res) => {
    return await editUser(req, res, router);
  });

  app.delete('/user/id/:id', async (req, res) => {
    return await deleteUser(req, res, router);
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
      return await User.findAllByFilter({ filter: req.query.filter, sort: req.query.sort, limit: req.query.limit, sortdir: req.query.sortdir });
    } catch {
      res.code(400).send({
        type: 'user-filter-error',
        msg: 'Invalid filter.'});
    }
  });

  app.get('/users/count', async (req, res) => {
    if (req.query.filter && req.query.filter.indexOf(' ') > -1) {
      req.query.filter = req.query.filter.replace(/\s/g, '');
    }

    try {
      return await User.findAllByFilter({ filter: req.query.filter, count: true })
    } catch (e) {
      res.code(400).send({
        type: 'user-filter-error',
        msg: 'Invalid filter.'});
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
      return await User.findAllByFilter({ filter: req.query.filter, sort: req.query.sort, limit: req.query.limit, sortdir: req.query.sortdir });
    } catch {
      res.code(400).send({
        type: 'user-filter-error',
        msg: 'Invalid filter.'});
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
      return await User.findAllByFilter({ filter: req.query.filter, count: true })
    } catch {
      res.code(400).send({
        type: 'user-filter-error',
        msg: 'Invalid filter.'});
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
    if (req.session.data.user[req.params.prop] !== undefined) {
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

    const group = await getGroup(req, res);

    if (group && group.msg) {
      res.code(400);
      return group;
    }

    var user = await getUser(req, res);

    if (user && user.msg) {
      res.code(400);
      return user;
    }

    user = await addRemoveGroupInheritance(user, group, true, req);
    res.code(user && user.msg ? 400 : 200);

    return user;
  });

  app.delete('/user/me/inheritance/group/:groupid/type/:grouptype', async (req, res) => {
    req.params.id = req.session.data.user.id;

    const group = await getGroup(req, res);

    if (group && group.msg) {
      res.code(400);
      return group;
    }

    var user = await getUser(req, res);

    if (user && user.msg) {
      res.code(400);
      return user;
    }

    user = await addRemoveGroupInheritance(user, group, false, req);
    res.code(user && user.msg ? 400 : 200);

    return user;
  });

  app.put('/user/me', async (req, res) => {
    req.params.id = req.session.data.user.id;
    return await editUser(req, res, router);
  });

  app.put('/user/me/property/:prop', async (req, res) => {
    req.params.id = req.session.data.user.id;
    return await editUser(req, res, router);
  });

  app.put('/user/me/property/:prop/:propdata', async (req, res) => {
    req.params.id = req.session.data.user.id;
    return await editUser(req, res, router);
  });

  app.get('/user/me/route/allowed', async (req, res) => {
    if (req.session) {
      const groups = await gm.currentGroup(req, res);

      for (var i = 0; i < groups.length; i++) {
        if (
          router.isRouteAllowed(
            req.query.method,
            req.query.route,
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
}

module.exports = {
  routes,
  getUser,
  deleteUser,
  editUser,
  addRemoveGroupInheritance
};
