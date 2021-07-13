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

  app.put(
    '/group/id/:groupid/type/:grouptype/inherit/from/:inheritedgroupname/type/:inheritedgrouptype',
    async (req, res) => {
      await groupRoutes.addInheritedToGroup(req, res, router);
    }
  );

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
    return await groupRoutes.importGroups(req, res, router);
  });
  app.get('/groups/export', async (req, res) => {
    return await groupRoutes.exportGroups(req, res);
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
  app.put(
    '/group/type/:grouptype/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
    async (req, res) => {
      return await groupRoutes.addRemoveGroupInheritanceByGroup(req, res, true);
    }
  );
  app.delete(
    '/group/type/:grouptype/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype',
    async (req, res) => {
      return await groupRoutes.addRemoveGroupInheritanceByGroup(req, res, false);
    }
  );
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
