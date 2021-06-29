const Group = require('../../../database/models/group');
const User = require('../../../database/models/user');

const misc = require('../../../utils/misc');
const regex = require('../../../utils/regex');
const userUtils = require('../../../utils/user.js');
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

    if (group.inherited.some((val, i) => group.inherited.indexOf(val) !== i) || group.inherited.indexOf(group.id) > -1) {
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
  groups = groups.filter((g) => user.hasGroupType(g.type) || (groupRequest && user.group_request === req.params.grouptype));

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

  if (!fgroup) {
    return;
  }

  await fgroup.delete();
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

  var inhertedGroup = await gm.getGroup(req.params.inheritedgroupname.toLowerCase(), req.params.inheritedgrouptype.toLowerCase());

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
}

async function removeInheritance(req, res, router) {
  var group = await getGroup(req, res, router);

  if (!group) {
    return;
  }

  var inhertedGroup = await gm.getGroup(req.params.inheritedgroupname.toLowerCase(), req.params.inheritedgrouptype.toLowerCase());

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
}


  module.exports = { 
    setGroup,
    getGroup,
    getUserByGroup,
    getGroupsByType,
    editUserByGroup,
    addRemoveGroupInheritanceByGroup,
    deleteUserByGroup,
    addGroup,
    editGroup,
    addRouteGroup,
    deleteRouteGroup,
    getInhertedUsers,
    addInheritedToGroup,
    removeInheritance    
};
