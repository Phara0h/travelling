const Group = require('../../database/models/group');
const User = require('../../database/models/user');

const misc = require('../../utils/misc');
const userUtils = require('../../utils/user.js');
const gm = require('../../server/groupmanager');
const groupRoutes = require('./functions/groups');


module.exports = function (app, opts, done) {
  const router = opts.router;

  // Add Group
  app.post('/group', async (req, res) => {
    await groupRoutes.addGroup(req, res, router);
  });

  app.post('/group/type/:grouptype', async (req, res) => {
    await groupRoutes.addGroup(req, res, router);
  });

  app.post('/group/id/:groupid', async (req, res) => {
    req.body = {
      name: req.params.groupid
    };
    await groupRoutes.addGroup(req, res, router);
  });

  app.post('/group/id/:groupid/type/:grouptype', async (req, res) => {
    req.body = {
      name: req.params.groupid,
      type: req.params.grouptype
    };
    await groupRoutes.addGroup(req, res, router);
  });

  // Edit Group Routes
  app.put('/group/id/:groupid/insert/route', async (req, res) => {
    await groupRoutes.addRouteGroup(req, res, router);
  });

  app.put('/group/id/:groupid/insert/permission/:permission', async (req, res) => {
    req.body = {
      name: req.params.permission
    };
    await groupRoutes.addRouteGroup(req, res, router);
  });

  app.put('/group/id/:groupid/type/:grouptype/insert/route', async (req, res) => {
    await groupRoutes.addRouteGroup(req, res, router);
  });

  app.put('/group/id/:groupid/type/:grouptype/insert/permission/:permission', async (req, res) => {
    req.body = {
      name: req.params.permission
    };
    await groupRoutes.addRouteGroup(req, res, router);
  });

  // Delete Group Routes
  app.delete('/group/id/:groupid/permission/:permission', async (req, res) => {
    req.body = {
      name: req.params.permission
    };
    await groupRoutes.deleteRouteGroup(req, res, router);
  });

  app.delete('/group/id/:groupid/type/:grouptype/permission/:permission', async (req, res) => {
    req.body = {
      name: req.params.permission
    };
    await groupRoutes.deleteRouteGroup(req, res, router);
  });

  // Edit Groups
  app.put('/group/id/:groupid', async (req, res) => {
    await groupRoutes.editGroup(req, res, router);
  });

  app.put('/group/id/:groupid/type/:grouptype', async (req, res) => {
    await groupRoutes.editGroup(req, res, router);
  });

  app.put('/group/id/:groupid/set/default', async (req, res) => {
    req.body = {
      is_default: true
    };
    await groupRoutes.editGroup(req, res, router);
  });

  app.put('/group/id/:groupid/type/:grouptype/set/default', async (req, res) => {
    req.body = {
      is_default: true
    };
    await groupRoutes.editGroup(req, res, router);
  });

  app.put('/group/id/:groupid/inherit/from/:inheritedgroupname/type/:inheritedgrouptype', async (req, res) => {
    await groupRoutes.addInheritedToGroup(req, res, router);
  });

  app.put('/group/id/:groupid/type/:grouptype/inherit/from/:inheritedgroupname/type/:inheritedgrouptype', async (req, res) => {
    await groupRoutes.addInheritedToGroup(req, res, router);
  });

  app.delete('/group/id/:groupid/remove/inheritance/:inheritedgroupname/type/:inheritedgrouptype', async (req, res) => {
    await groupRoutes.removeInheritance(req, res, router);
  });

  app.delete(
    '/group/id/:groupid/type/:grouptype/remove/inheritance/:inheritedgroupname/type/:inheritedgrouptype',
    async (req, res) => {
      await groupRoutes.removeInheritance(req, res, router);
    }
  );

  // Delete Group
  app.delete('/group/id/:groupid', async (req, res) => {
    await groupRoutes.deleteGroup(req, res, router);
  });

  app.delete('/group/id/:groupid/type/:grouptype', async (req, res) => {
    await groupRoutes.deleteGroup(req, res, router);
  });

  // Get Group
  app.get('/group/id/:groupid', async (req, res) => {
    var group = await groupRoutes.getGroup(req, res, router);

    if (!group) {
      return;
    }
    res.code(200).send(group);
  });

  app.get('/group/id/:groupid/type/:grouptype', async (req, res) => {
    var group = await groupRoutes.getGroup(req, res, router);

    if (!group) {
      return;
    }
    res.code(200).send(group);
  });

  // Get Group's User
  app.get('/group/id/:groupid/type/:grouptype/users', async (req, res) => {
    var group = await groupRoutes.getGroup(req, res, router);

    if (!group) {
      return;
    }

    if (!misc.isEmpty(req.query) && userUtils.checkValidUser(req.query)) {
      var query = userUtils.setUser({ group_ids: [group.id] }, req.query);

      res.code(200).send(await User.findAllBy(query));
      return;
    }

    res.code(200).send(await User.findAllBy({ group_ids: [group.id] }));
  });

  app.get('/group/id/:groupid/type/:grouptype/users/inherited', async (req, res) => {
    var group = await groupRoutes.getGroup(req, res, router);

    if (!group) {
      return;
    }

    var query = !misc.isEmpty(req.query) && userUtils.checkValidUser(req.query) ? req.query : {};

    res.code(200).send(await groupRoutes.getInhertedUsers(group, [], query));
  });

  app.get('/group/id/:groupid/users', async (req, res) => {
    var group = await groupRoutes.getGroup(req, res, router);

    if (!group) {
      return;
    }
    if (!misc.isEmpty(req.query) && userUtils.checkValidUser(req.query)) {
      var query = userUtils.setUser({ group_ids: [group.id] }, req.query);

      res.code(200).send(await User.findAllBy(query));
      return;
    }

    res.code(200).send(await User.findAllBy({ group_ids: [group.id] }));
  });

  app.get('/group/id/:groupid/users/inherited', async (req, res) => {
    var group = await groupRoutes.getGroup(req, res, router);

    if (!group) {
      return;
    }

    var query = !misc.isEmpty(req.query) && userUtils.checkValidUser(req.query) ? req.query : {};

    res.code(200).send(await groupRoutes.getInhertedUsers(group, [], query));
  });

  // Get Groups
  app.get('/groups', async (req, res) => {
    res.send(await gm.getGroups());
  });

  app.get('/groups/type/:grouptype', async (req, res) => {
    var groups = await gm.getGroups();

    req.params.grouptype = req.params.grouptype.toLowerCase();
    res.send(
      groups.filter((e) => {
        return e.type == req.params.grouptype;
      })
    );
  });

  app.get('/groups/types', async (req, res) => {
    var groups = await gm.getGroups();

    res.send(Array.from(new Set(groups.map((g) => g.type))));
  });

  // import/export Groups

  app.put('/groups/import', async (req, res) => {
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
          groups.push(await groupRoutes.setGroup({ body: group }, new Group(fgroup), router, req.body));
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

    res.code(200).send();
  });

  app.get('/groups/export', async (req, res) => {
    var groups = await gm.getGroups();
    var mappedGroups = await gm.getMappedGroups();
    var exported = {};

    // console.log('Groups Before', groups);
    // console.log('Merge Groups Before', mappedGroups);
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

    // console.log('Groups After', groups);
    // console.log('Merge Groups After', mappedGroups);

    res.code(200).send(exported);
  });

  // Users by group type and group id
  app.get('/group/id/:groupid/type/:grouptype/user/:id', async (req, res) => {
    return await groupRoutes.getUserByGroup(req, res, router);
  });
  app.get('/group/id/:groupid/type/:grouptype/user/:id/property/:prop', async (req, res) => {
    return await groupRoutes.getUserByGroup(req, res, router);
  });
  app.put(
    '/group/id/:groupid/type/:grouptype/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
    async (req, res) => {
      return await groupRoutes.addRemoveGroupInheritanceByGroup(req, res, true);
    }
  );
  app.delete(
    '/group/id/:groupid/type/:grouptype/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
    async (req, res) => {
      return await groupRoutes.addRemoveGroupInheritanceByGroup(req, res, false);
    }
  );
  app.put('/group/id/:groupid/type/:grouptype/user/:id', async (req, res) => {
    return await groupRoutes.editUserByGroup(req, res, router);
  });
  app.put('/group/id/:groupid/type/:grouptype/user/:id/property/:prop', async (req, res) => {
    return await groupRoutes.editUserByGroup(req, res, router);
  });
  app.put('/group/id/:groupid/type/:grouptype/user/:id/property/:prop/:propdata', async (req, res) => {
    return await groupRoutes.editUserByGroup(req, res, router);
  });
  app.delete('/group/id/:groupid/type/:grouptype/user/:id', async (req, res) => {
    return await groupRoutes.deleteUserByGroup(req, res, router);
  });

  // Users by group type
  app.get('/group/type/:grouptype/user/:id', async (req, res) => {
    return await groupRoutes.getUserByGroup(req, res, router);
  });
  app.get('/group/type/:grouptype/user/:id/property/:prop', async (req, res) => {
    return await groupRoutes.getUserByGroup(req, res, router);
  });
  app.put('/group/type/:grouptype/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype', async (req, res) => {
    return await groupRoutes.addRemoveGroupInheritanceByGroup(req, res, true);
  });
  app.delete('/group/type/:grouptype/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype', async (req, res) => {
    return await groupRoutes.addRemoveGroupInheritanceByGroup(req, res, false);
  });
  app.put('/group/type/:grouptype/user/:id', async (req, res) => {
    return await groupRoutes.editUserByGroup(req, res, router);
  });
  app.put('/group/type/:grouptype/user/:id/property/:prop', async (req, res) => {
    return await groupRoutes.editUserByGroup(req, res, router);
  });
  app.put('/group/type/:grouptype/user/:id/property/:prop/:propdata', async (req, res) => {
    return await groupRoutes.editUserByGroup(req, res, router);
  });
  app.delete('/group/type/:grouptype/user/:id', async (req, res) => {
    return await groupRoutes.deleteUserByGroup(req, res, router);
  });

  // Users Group request
  app.put('/group/request/type/:grouptype/user/:id', async (req, res) => {
    return await groupRoutes.editUserByGroup(req, res, router);
  });
  app.delete('/group/request/type/:grouptype/user/:id', async (req, res) => {
    return await groupRoutes.deleteUserByGroup(req, res, router);
  });

  app.put('/group/request/type/:grouptype/user/:id/property/:prop', async (req, res) => {
    return await groupRoutes.editUserByGroup(req, res, router);
  });
  app.put(
    '/group/request/type/:grouptype/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
    async (req, res) => {
      return await groupRoutes.addRemoveGroupInheritanceByGroup(req, res, true);
    }
  );

  done();
};
