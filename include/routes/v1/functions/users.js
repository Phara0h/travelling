const regex = require('../../../utils/regex');
const userUtils = require('../../../utils/user');
const config = require('../../../utils/config');
const misc = require('../../../utils/misc');
const gm = require('../../../server/groupmanager');
const audit = require('../../../utils/audit');

const Database = require('../../../database');
const User = require('../../../database/models/user');

async function deleteUser(opts) {
  var id = userUtils.getId(opts.req);
  var domain = opts.req.params.domain;
  var user;

  if (!id) {
    opts.res.code(400);
    return {
      type: 'user-find-by-error',
      msg: 'No user by that username or id was found.'
    };
  }

  if (opts.needsDomain && !domain) {
    opts.res.code(400);
    return {
      type: 'user-missing-param-error',
      msg: 'No domain was provided.'
    };
  }

  var previousUser;

  if (config.audit.delete.enable === true) {
    previousUser = await getUser(opts);
  }

  if (opts.needsDomain) {
    user = await User.deleteAllBy({ domain, ...id }, 'AND', 1);
  } else {
    user = await User.deleteAllBy(id, 'AND');
  }

  if (user && user.length > 0) {
    await user[0].resolveGroup(opts.router);

    var session = await opts.req.sessionStore.get(user[0].id);

    if (session) {
      await opts.req.sessionStore.destroy(session.sessionId);
    }

    if (config.audit.delete.enable === true) {
      var auditObj = {
        action: 'DELETE',
        subaction: 'USER',
        ofUserId: user[0].id,
        oldObj: previousUser
      };

      if (opts.req.session.data) {
        auditObj.byUserId = opts.req.session.data.user.id;
      }
      await audit.createSingleAudit(auditObj, 'DELETE');
    }

    opts.res.code(200);
    return user[0];
  }

  opts.res.code(400);
  return {
    type: 'user-delete-error',
    msg: `No user by that id, username, email ${opts.needsDomain ? 'with that domain ' : ''}was found.`
  };
}

async function editUser(opts) {
  var id = userUtils.getId(opts.req);
  var domain = opts.req.params.domain;

  if (!id) {
    opts.res.code(400);
    return {
      type: 'user-find-by-error',
      msg: 'No user by that username or id was found.'
    };
  }

  if (opts.needsDomain && !domain) {
    opts.res.code(400);
    return {
      type: 'user-missing-param-error',
      msg: 'No domain was provided.'
    };
  }

  // filter group_id
  opts.req.body = filterUser(opts.req);

  var model = opts.req.body;
  var oldModel;

  if (config.audit.edit.enable === true) {
    oldModel = await getUser(opts);
  }

  if (opts.req.params.prop) {
    model = opts.req.params.propdata
      ? { [opts.req.params.prop]: opts.req.params.propdata }
      : { [opts.req.params.prop]: opts.req.body };

    if (config.audit.edit.enable === true) {
      oldModel = { [opts.req.params.prop]: oldModel };
    }
  }

  var isValid = await userUtils.checkValidUser(model);

  if (isValid === true) {
    isValid = await Database.checkDupe(model);
  }
  if (isValid !== true) {
    opts.res.code(400);
    return isValid;
  }

  var updatedProps = userUtils.setUser({}, model);

  if (misc.isEmpty(updatedProps)) {
    opts.res.code(400);
    return {
      type: 'user-prop-error',
      msg: 'Not a property of user'
    };
  }

  let changedProps;

  if (config.audit.edit.enable === true) {
    changedProps = Object.assign({}, updatedProps);
  }

  var user;

  if (opts.needsDomain) {
    user = await User.updateLimitedBy({ domain, ...id }, updatedProps, 'AND', 1);
  } else {
    user = await User.updateLimitedBy(id, updatedProps, 'AND', 1);
  }

  if (user && user.length > 0) {
    if (opts.req.params.prop && user[0][opts.req.params.prop] === undefined) {
      opts.res.code(400);
      return {
        type: 'user-prop-error',
        msg: 'Not a property of user'
      };
    }

    const groupsData = await user[0].resolveGroup(opts.router);

    opts.res.code(200);

    // Update any current logged in users
    var session = await opts.req.sessionStore.get(user[0].id);

    if (session) {
      session.data = { user: user[0], groupsData };
      await opts.req.sessionStore.set(session.sessionId, session);
    }
    await user[0].updated();

    if (config.audit.edit.enable === true) {
      var auditObj = {
        action: 'EDIT',
        subaction: 'USER_PROPERTY',
        ofUserId: user[0].id,
        oldObj: oldModel,
        newObj: changedProps
      };

      if (opts.req.session.data) {
        auditObj.byUserId = opts.req.session.data.user.id;
      }
      await audit.splitAndCreateAudits(auditObj);
    }

    return opts.req.params.prop ? user[0][opts.req.params.prop] : user[0];
  }

  opts.res.code(400);
  return {
    type: 'user-edit-error',
    msg: `No user by that id, username, email ${opts.needsDomain ? 'with that domain ' : ''}was found.`
  };
}

async function getUser(opts) {
  var id = userUtils.getId(opts.req);
  var domain = opts.req.params.domain;
  var user;

  if (!id) {
    opts.res.code(400);
    return {
      type: 'user-find-by-error',
      msg: 'No user by that username or id was found.'
    };
  }

  if (opts.needsDomain && !domain) {
    opts.res.code(400);
    return {
      type: 'user-missing-param-error',
      msg: 'No domain was provided.'
    };
  }

  if (opts.req.params.prop && !userUtils.checkUserProps(opts.req.params.prop)) {
    opts.res.code(400);
    return {
      type: 'user-prop-error',
      msg: 'Not a property of user'
    };
  }

  if (opts.needsDomain) {
    user = await User.findLimtedBy({ domain, ...id }, 'AND', 1, opts.req.params.prop || '*');
  } else {
    user = await User.findLimtedBy(id, 'AND', 1, opts.req.params.prop || '*');
  }

  if (user && user.length > 0) {
    if (opts.req.params.prop) {
      if (opts.req.params.prop === 'groups') {
        await user[0].resolveGroup();
      }

      opts.res.code(200);
      return user[0][opts.req.params.prop];
    }

    // Record view audit (if not viewing self)
    if (config.audit.view.enable === true && user[0].id !== opts.req.session.data.user.id) {
      var auditObj = {
        action: 'VIEW',
        subaction: 'USER',
        ofUserId: user[0].id
      };

      if (opts.req.session.data) {
        auditObj.byUserId = opts.req.session.data.user.id;
      }

      await audit.createSingleAudit(auditObj);
    }

    await user[0].resolveGroup();

    opts.res.code(200);
    return user[0];
  }

  opts.res.code(400);
  return {
    type: 'user-find-by-error',
    msg: `No user by that id, username, email ${opts.needsDomain ? 'with that domain ' : ''}was found.`
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
    var previousGroup;

    if (config.audit.edit.enable === true) {
      if (user.groups && !add) {
        previousGroup = user.groups;
      }
    }

    user = add ? await user.addGroup(group) : await user.removeGroup(group);

    if (!user) {
      return {
        type: `user-${add ? 'add' : 'remove'}-group-error`,
        msg: `User could not ${add ? 'add' : 'remove'} group.`
      };
    }
    await updateSessionUser(user, req);
    await user.updated();
    if (config.audit.edit.enable === true) {
      var newGroup;

      if (add) {
        newGroup = group;
      }

      var auditObj = {
        action: 'EDIT',
        subaction: add ? 'USER_ADD_GROUP_INHERITANCE' : 'USER_REMOVE_GROUP_INHERITANCE',
        ofUserId: user.id,
        oldObj: previousGroup,
        newObj: newGroup
      };

      if (req.session.data) {
        auditObj.byUserId = req.session.data.user.id;
      }

      await audit.createSingleAudit(auditObj, 'groups');
    }

    return user;
  }

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

module.exports = {
  getUser,
  deleteUser,
  editUser,
  getGroup,
  addRemoveGroupInheritance
};
