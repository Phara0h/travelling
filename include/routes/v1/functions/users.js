const regex = require('../../../utils/regex');
const userUtils = require('../../../utils/user');
const config = require('../../../utils/config');
const misc = require('../../../utils/misc');
const gm = require('../../../server/groupmanager');
const audit = require('../../../utils/audit');

const Database = require('../../../database');
const User = require('../../../database/models/user');
const Audit = require('../../../database/models/audit');

async function deleteUser(opts) {
  var id = _getId(opts.req);
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
          ofUserId: user.id
      }
      if (opts.req.session.data) { auditObj.byUserId = opts.req.session.data.user.id }
        audit.createSingleAudit(auditObj);
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
  var id = _getId(opts.req);
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
  var oldModel = await getUser(opts);

  if (opts.req.params.prop) {
    model = opts.req.params.propdata
      ? { [opts.req.params.prop]: opts.req.params.propdata }
      : { [opts.req.params.prop]: opts.req.body };

    oldModel = { [opts.req.params.prop]: oldModel }
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

    if (config.audit.edit.enable === true) {
      var auditObj = {
          action: 'EDIT', 
          subaction: 'USER_PROPERTY',
          ofUserId: user.id,
          oldObj: oldModel,
          newObj: model
      }
      if (opts.req.session.data) { auditObj.byUserId = opts.req.session.data.user.id }
      audit.splitAndCreateAudits(auditObj);
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


  return Audit.findLimtedBy({ id: opts.req.params.id })


  /////
  var id = _getId(opts.req);
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

  if (opts.needsDomain) {
    user = await User.findLimtedBy({ domain, ...id }, 'AND', 1);
  } else {
    user = await User.findLimtedBy(id, 'AND', 1);
  }

  if (user && user.length > 0) {
    if (opts.req.params.prop && user[0][opts.req.params.prop] === undefined) {
      opts.res.code(400);
      return {
        type: 'user-prop-error',
        msg: 'Not a property of user'
      };
    }

    await user[0].resolveGroup();

    opts.res.code(200);
    return opts.req.params.prop ? user[0][opts.req.params.prop] : user[0];
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
    user = add ? await user.addGroup(group) : await user.removeGroup(group);

    if (!user) {
      return {
        type: `user-${add ? 'add' : 'remove'}-group-error`,
        msg: `User could not ${add ? 'add' : 'remove'} group.`
      };
    }
    await updateSessionUser(user, req);

    if (config.audit.edit.enable === true) {
      var auditObj = {
          action: 'EDIT', 
          subaction: add ? 'USER_ADD_GROUP_INHERITANCE' : 'USER_REMOVE_GROUP_INHERITANCE',
          ofUserId: user.id
      }
      if (req.session.data) { auditObj.byUserId = req.session.data.user.id }
      if (add === true) {
        auditObj.newObj = { groupId: group.id}
      } else if (add === false) {
        auditObj.oldObj = { groupId: group.id}
      }

      audit.createSingleAudit(auditObj);
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

  
module.exports = { 
    getUser,
    deleteUser,
    editUser,
    getGroup,
    addRemoveGroupInheritance
};
