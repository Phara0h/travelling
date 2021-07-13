const Group = require('../../../database/models/group');
const User = require('../../../database/models/user');

const misc = require('../../../utils/misc');
const regex = require('../../../utils/regex');
const userUtils = require('../../../utils/user.js');
const config = require('../../../utils/config');
const audit = require('../../../utils/audit');
const gm = require('../../../server/groupmanager');
const userRoutes = require('./users');

function isCircularPath(id, group, groups, nodes = []) {
  if (nodes.indexOf(id) == 0) {
    return true;
  }
  nodes.push(id);

  if (group.inherited) {
    for (var i = 0; i < group.inherited.length; i++) {
      nodes.push(group.inherited[i]);
      if (isCircularPath(group.inherited[i], groups[group.inherited[i]], groups, nodes)) {
        return true;
      }
    }
  }

  return false;
}

function checkCircularGroupRef(group, groups, found = []) {
  // config.log.logger.debug(group, groups);
  if (group.inherited) {
    for (var i = 0; i < group.inherited.length; i++) {
      if (isCircularPath(group.inherited[i], groups[group.inherited[i]], groups, [group.id || group.name])) {
        return true;
      }
    }
  }
  return false;
}

async function setGroup(req, group, router, groups = null) {
  if (req.body.name) {
    if (regex.safeName.exec(req.body.name) == null) {
      throw {
        type: 'group-name-error',
        msg: 'Group name contain invalid characters.'
      };
    }
    group.name = req.body.name;
  }

  if (req.body.id) {
    if (regex.uuidv4.exec(req.body.id) == null) {
      throw {
        type: 'group-id-error',
        msg: 'Group id contain invalid characters.'
      };
    }
    group.id = req.body.id;
  }

  if (req.body.inherited) {
    group.inherited = req.body.inherited.filter((i) => {
      return regex.uuidv4.exec(i) != null;
    });

    if (
      group.inherited.some((val, i) => group.inherited.indexOf(val) !== i) ||
      group.inherited.indexOf(group.id) > -1
    ) {
      throw {
        type: 'group-inherited-duplicate-id-error',
        msg: 'Inherited groups array contain duplicate ids or its own id'
      };
    } else {
      var groupIds = (await gm.getGroups()).map((g) => g.id);

      if (!group.inherited.every((id) => groupIds.includes(id))) {
        throw {
          type: 'group-inherited-invalid-ids-error',
          msg: 'Inherited groups array contain ids that do not correspond to real groups'
        };
      }
    }

    if (checkCircularGroupRef(group, groups || (await gm.getMappedGroups()))) {
      throw {
        type: 'group-inherited-circular-error',
        msg: 'Inherited groups array contains a cicular ref.'
      };
    }
  }

  if (req.body.type) {
    if (regex.safeName.exec(req.body.type) == null) {
      throw {
        type: 'group-type-error',
        msg: 'Group type contain invalid characters.'
      };
    }
    group.type = req.body.type;
  }

  if (req.body.is_default) {
    group.is_default = misc.stringToBool(req.body.is_default);
  }

  if (req.body.allowed) {
    group.allowed = [];
    for (var i = 0; i < req.body.allowed.length; i++) {
      if (!group.addRoute(req.body.allowed[i])) {
        throw {
          type: 'group-route-duplicate-error',
          msg: 'Duplicate Route with same route or name/permission'
        };
      }
    }
  }

  return group;
}

async function getGroup(req, res, router) {
  var name = req.params.groupid.toLowerCase();

  var fgroup = await gm.getGroup(name, req.params.grouptype);

  if (!fgroup || (req.params.grouptype && fgroup.type != req.params.grouptype)) {
    res.code(400).send({
      type: 'group-nonexistent-error',
      msg: 'No group with the name or id exists.'
    });
    return false;
  }
  return fgroup;
}

async function getUserByGroup(req, res, router) {
  const groupRequest = req.raw.url.indexOf('/group/request/type/') > -1;

  var groups = await getGroupsByType(req, res, router);

  if (req.params.groupid) {
    groups = groups.filter((g) => g.id == req.params.groupid || g.name == req.params.groupid);
  }

  if (groups.length < 1) {
    res.code(400);
    return {
      type: 'group-nonexistent-error',
      msg: 'No groups with that name or id exists.'
    };
  }

  const prop = req.params.prop;

  // delete prop so we get back full user
  delete req.params.prop;
  var user = await userRoutes.getUser({ req, res, needsDomain: false, router });

  // set prop back for other functions to use
  req.params.prop = prop;

  if (req.params.prop && user[req.params.prop] === undefined) {
    res.code(400);
    return {
      type: 'user-prop-error',
      msg: 'Not a property of user'
    };
  }

  if (user.msg) {
    res.code(400).send(user);
    return false;
  }

  if (!req.params.grouptype) {
    res.code(400).send({
      type: 'group-user-nonexistent-error',
      msg: 'No user with that groups type exists.'
    });
    return false;
  }
  // console.log(groups, user.group.type, user.group_request, req.params.grouptype);
  groups = groups.filter(
    (g) => user.hasGroupType(g.type) || (groupRequest && user.group_request === req.params.grouptype)
  );

  if (req.params.groupid) {
    groups = groups.filter((g) => user.hasGroupId(req.params.groupid) || user.hasGroupName(req.params.groupid));
  }

  if (groups.length < 1) {
    res.code(400).send({
      type: 'group-user-nonexistent-error',
      msg: 'No user with that groups name or id exists.'
    });
    return false;
  }
  res.code(200);
  return prop ? user[prop] : user;
}

async function getGroupsByType(req, res, router) {
  var groups = await gm.getGroups();

  return groups.filter((g) => g.type == req.params.grouptype);
}

async function editUserByGroup(req, res, router) {
  var user = await getUserByGroup(req, res, router);

  if (user && user.msg) {
    res.code(400);
    return user;
  }

  var editedUser = await userRoutes.editUser({ req, res, needsDomain: false, router });

  if (editedUser.msg) {
    res.code(400);
    return editedUser;
  }

  res.code(200);
  return editedUser;
}

async function addRemoveGroupInheritanceByGroup(req, res, add = true) {
  const group = await gm.getGroup(req.params.inheritgroupid, req.params.inheritgrouptype);

  if (group && group.msg) {
    res.code(400);
    return group;
  }

  var user = await getUserByGroup(req, res);

  if (user.msg) {
    return user;
  }

  // req.params.grouptype = req.params.inheritgrouptype;
  // req.params.groupid = req.params.inheritgroupid;

  user = await userRoutes.addRemoveGroupInheritance(user, group, add, req);
  res.code(user && user.msg ? 400 : 200);

  return user;
}

async function deleteUserByGroup(req, res, router) {
  var user = await getUserByGroup(req, res, router);

  if (user && user.msg) {
    res.code(400);
    return false;
  }
  var deletedUser = userRoutes.deleteUser({ req, res, needsDomain: true, router });

  if (deletedUser && deletedUser.msg) {
    res.code(400);
    return deletedUser;
  }

  res.code(200);
  return deletedUser;
}

async function addGroup(req, res, router) {
  if (!req.body.name) {
    res.code(400).send({
      type: 'error',
      msg: 'A group requires a name'
    });
    return;
  }

  req.body.name = req.body.name.toLowerCase();

  if (req.params.grouptype) {
    req.body.type = req.params.grouptype.toLowerCase();
  }

  if (!req.body.type) {
    req.body.type = 'group';
  }
  var fgroup = await gm.getGroup(req.body.id || req.body.name, req.body.type);

  if (fgroup) {
    res.code(400).send({
      type: 'error',
      msg: 'Group with the name or id already exists.'
    });
    return;
  }

  var group;

  try {
    group = await setGroup(req, new Group(), router);
  } catch (e) {
    res.code(400).send(e);
    return;
  }

  if (group.is_default) {
    var dgroup = await gm.defaultGroup();

    if (group.id != dgroup.id) {
      dgroup.is_default = false;
      await dgroup.save();
    }
  }

  var ngroup = await Group.create(group.changedProps);

  if (config.audit.create.enable === true) {
    var auditObj = {
      action: 'CREATE',
      subaction: 'GROUP',
      newObj: ngroup
    };
    if (req.session.data) {
      auditObj.byUserId = req.session.data.user.id;
    }
    await audit.createSingleAudit(auditObj);
  }

  gm.redis.needsGroupUpdate = true;
  res.code(200).send(ngroup);
}

async function editGroup(req, res, router) {
  if (!req.params.groupid) {
    res.code(400).send({
      type: 'group-no-name-error',
      msg: 'A group requires a name'
    });
    return;
  }

  var fgroup = await getGroup(req, res, router);

  if (!fgroup) {
    return;
  }

  var group;

  try {
    group = await setGroup(req, new Group(fgroup._), router);
  } catch (e) {
    res.code(400).send(e);
    return;
  }

  if (group.is_default) {
    var dgroup = await gm.defaultGroup();

    if (group.id != dgroup.id) {
      dgroup.is_default = false;
      await dgroup.save();

      gm.redis.needsGroupUpdate = true;

      if (config.audit.edit.enable === true) {
        var auditObj = {
          action: 'EDIT',
          subaction: 'DEFAULT_GROUP',
          oldObj: fgroup,
          newObj: dgroup
        };
        if (req.session.data) {
          auditObj.byUserId = req.session.data.user.id;
        }
        await audit.splitAndCreateAudits(auditObj);
      }
    }
  } else {
    if (config.audit.edit.enable === true) {
      var auditObj = {
        action: 'EDIT',
        subaction: 'GROUP',
        oldObj: fgroup,
        newObj: group
      };
      if (req.session.data) {
        auditObj.byUserId = req.session.data.user.id;
      }
      await audit.splitAndCreateAudits(auditObj);
    }
  }

  await group.save();

  gm.redis.needsGroupUpdate = true;

  res.code(200).send(await gm.getGroup(group.id));
}

async function addRouteGroup(req, res, router) {
  if (!req.params.groupid) {
    res.code(400).send({
      type: 'error',
      msg: 'A group requires a name'
    });
    return;
  }

  var fgroup = await getGroup(req, res, router);

  if (!fgroup) {
    return;
  }

  if (!fgroup.addRoute(req.body)) {
    res.code(400).send({
      type: 'error',
      msg: 'Group already has that route or name/permission'
    });
    return;
  }

  await fgroup.save();

  if (config.audit.edit.enable === true) {
    var auditObj = {
      action: 'EDIT',
      subaction: 'GROUP_ADD_ROUTE',
      newObj: req.body
    };
    if (req.session.data) {
      auditObj.byUserId = req.session.data.user.id;
    }
    await audit.createSingleAudit(auditObj);
  }

  gm.redis.needsGroupUpdate = true;
  res.code(200).send(fgroup);
}

async function deleteRouteGroup(req, res, router) {
  if (!req.params.groupid) {
    res.code(400).send({
      type: 'error',
      msg: 'A group requires a name'
    });
    return;
  }

  var fgroup = await getGroup(req, res, router);

  if (!fgroup) {
    return;
  }

  if (!fgroup.removeRoute(req.body)) {
    res.code(400).send({
      type: 'error',
      msg: 'Group does not have that route/permission'
    });
    return;
  }

  await fgroup.save();

  if (config.audit.edit.enable === true) {
    var auditObj = {
      action: 'EDIT',
      subaction: 'GROUP_REMOVE_ROUTE',
      oldObj: req.body
    };
    if (req.session.data) {
      auditObj.byUserId = req.session.data.user.id;
    }
    await audit.createSingleAudit(auditObj);
  }

  gm.redis.needsGroupUpdate = true;
  res.code(200).send(fgroup);
}

async function deleteGroup(req, res, router) {
  if (!req.params.groupid) {
    res.code(400).send({
      type: 'group-no-name-error',
      msg: 'A group requires a name'
    });
    return;
  }

  var fgroup = await getGroup(req, res, router);
  const fGroupId = fgroup.id;

  if (!fgroup) {
    return;
  }

  await fgroup.delete();

  if (config.audit.delete.enable === true) {
    var auditObj = {
      action: 'DELETE',
      subaction: 'GROUP',
      oldObj: fgroup
    };
    if (req.session.data) {
      auditObj.byUserId = req.session.data.user.id;
    }
    await audit.createSingleAudit(auditObj);
  }

  gm.redis.needsGroupUpdate = true;
  res.code(200).send();
}

async function getInhertedUsers(group, users, query = {}) {
  if (group.inheritedGroups) {
    for (var i = 0; i < group.inheritedGroups.length; i++) {
      users = await getInhertedUsers(group.inheritedGroups[i], users, query);
    }
  }

  return (users = users.concat(await User.findAllBy(userUtils.setUser({ group_ids: [group.id] }, query))));
}

async function addInheritedToGroup(req, res, router) {
  var group = await getGroup(req, res, router);

  if (!group) {
    return;
  }

  var inhertedGroup = await gm.getGroup(
    req.params.inheritedgroupname.toLowerCase(),
    req.params.inheritedgrouptype.toLowerCase()
  );

  if (!inhertedGroup) {
    res.code(400).send({
      type: 'error',
      msg: 'No group to inherit from by that name.'
    });
    return;
  }

  if (!group.inherited) {
    group.inherited = [];
  }

  req.body = {
    inherited: [...group.inherited, inhertedGroup.id]
  };
  await editGroup(req, res, router);

  if (config.audit.edit.enable === true) {
    var auditObj = {
      action: 'EDIT',
      subaction: 'GROUP_ADD_INHERITANCE',
      newObj: inhertedGroup
    };
    if (req.session.data) {
      auditObj.byUserId = req.session.data.user.id;
    }
    await audit.createSingleAudit(auditObj);
  }
}

async function removeInheritance(req, res, router) {
  var group = await getGroup(req, res, router);

  if (!group) {
    return;
  }

  var inhertedGroup = await gm.getGroup(
    req.params.inheritedgroupname.toLowerCase(),
    req.params.inheritedgrouptype.toLowerCase()
  );

  if (!inhertedGroup) {
    res.code(400).send({
      type: 'error',
      msg: 'No group to remove inheritance from by that name.'
    });
    return;
  }
  var inheritedIndex = group.inherited.indexOf(inhertedGroup.id);

  if (!group.inherited || inheritedIndex == -1) {
    res.code(400).send({
      type: 'error',
      msg: 'No group to remove inheritance from by that name.'
    });
    return;
  }

  group.inherited.splice(inheritedIndex, 1);

  req.body = {
    inherited: group.inherited
  };
  await editGroup(req, res, router);

  if (config.audit.edit.enable === true) {
    var auditObj = {
      action: 'EDIT',
      subaction: 'GROUP_REMOVE_INHERITANCE',
      oldObj: inhertedGroup
    };
    if (req.session.data) {
      auditObj.byUserId = req.session.data.user.id;
    }
    await audit.createSingleAudit(auditObj);
  }
}

async function importGroups(req, res, router) {
  // Possibly should put a check or lock to stop all group editing until import is done.
  var grouptypes = Object.keys(req.body);
  var groups = [];
  var inheritance = {};
  var savedGroups = {};

  for (var k = 0; k < grouptypes.length; k++) {
    var keys = Object.keys(req.body[grouptypes[k]]);

    for (var i = 0; i < keys.length; i++) {
      var group = req.body[grouptypes[k]][keys[i]];

      group.name = keys[i];
      group.type = grouptypes[k];

      var keyGroupName = group.type + '|' + group.name;

      try {
        if (group.inherited && group.inherited.length > 0) {
          inheritance[keyGroupName] = [];
          for (var j = 0; j < group.inherited.length; j++) {
            inheritance[keyGroupName].push(group.inherited[j]);
          }
        }
        var fgroup = await gm.getGroup(group.name, group.type);

        if (fgroup) {
          fgroup._.inherited = null;
          fgroup = fgroup._;
        } else {
          fgroup = {};
        }

        fgroup.is_default = group.is_default;
        groups.push(await setGroup({ body: group }, new Group(fgroup), router, req.body));
      } catch (e) {
        res.code(400).send(e);
        return;
      }
    }

    for (var i = 0; i < groups.length; i++) {
      if (groups[i].is_default) {
        var dgroup = await gm.defaultGroup();

        if (groups[i].name != dgroup.name && groups[i].type != dgroup.type) {
          dgroup.is_default = false;
          await dgroup.save();
        }
      }
      if (groups[i].id) {
        await groups[i].save();
      } else {
        await groups[i].create();
      }

      savedGroups[groups[i].type + '|' + groups[i].name] = groups[i];
    }
  }

  var inheritanceKeys = Object.keys(inheritance);

  var failedInheritance = [];

  for (var i = 0; i < inheritanceKeys.length; i++) {
    savedGroups[inheritanceKeys[i]].inherited = [];
    for (var j = 0; j < inheritance[inheritanceKeys[i]].length; j++) {
      if (savedGroups[inheritance[inheritanceKeys[i]][j]]) {
        savedGroups[inheritanceKeys[i]].inherited.push(savedGroups[inheritance[inheritanceKeys[i]][j]].id);
      } else {
        failedInheritance.push({ group: inheritanceKeys[i], inheritance: inheritance[inheritanceKeys[i]][j] });
      }
    }
    await savedGroups[inheritanceKeys[i]].save();
  }
  gm.redis.needsGroupUpdate = true;

  if (failedInheritance.length > 0) {
    res.code(240).send({
      type: 'group-export-failed-inheritances',
      msg: 'All groups imported but these inheritances were not done since the group names do not exist.',
      failedInheritance
    });
    return;
  }

  if (config.audit.edit.enable === true) {
    var auditObj = {
      action: 'EDIT',
      subaction: 'IMPORT_GROUPS',
      newObj: req.body
    };
    if (req.session.data) {
      auditObj.byUserId = req.session.data.user.id;
    }
    await audit.createSingleAudit(auditObj);
  }

  res.code(200).send();
}

async function exportGroups(req, res) {
  var groups = await gm.getGroups();
  var mappedGroups = await gm.getMappedGroups();
  var exported = {};

  for (var i = 0; i < groups.length; i++) {
    var group = new Group({ ...groups[i]._ });

    if (group.inheritedGroups) {
      group.inheritedGroups = undefined;
    }
    if (group.inherited && group.inherited.length > 0) {
      for (var j = 0; j < group.inherited.length; j++) {
        group.inherited[j] = mappedGroups[group.inherited[j]].type + '|' + mappedGroups[group.inherited[j]].name;
      }
    }
    group.id = undefined;
    if (!exported[group.type]) {
      exported[group.type] = {};
    }
    exported[group.type][group.name] = {};
    if (group.allowed && group.allowed.length > 0) {
      exported[group.type][group.name].allowed = group.allowed;
    }
    if (group.inherited && group.inherited.length > 0) {
      exported[group.type][group.name].inherited = group.inherited;
    }
    if (group.is_default) {
      exported[group.type][group.name].is_default = group.is_default;
    }
  }

  res.code(200).send(exported);
}

module.exports = {
  setGroup,
  getGroup,
  getUserByGroup,
  getGroupsByType,
  editUserByGroup,
  addRemoveGroupInheritanceByGroup,
  deleteUserByGroup,
  deleteGroup,
  addGroup,
  editGroup,
  addRouteGroup,
  deleteRouteGroup,
  getInhertedUsers,
  addInheritedToGroup,
  removeInheritance,
  importGroups,
  exportGroups
};
