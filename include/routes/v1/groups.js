'use strict';

const Group = require('../../database/models/group');
const User = require('../../database/models/user');

const misc = require('../../utils/misc');
const regex = require('../../utils/regex');
const userUtils = require('../../utils/user.js');
const userRoutes = require('./users');

var setGroup = async function(req, group, router) {
    var invalidGroup = false;

    if (req.body.name) {
        if (regex.safeName.exec(req.body.name) == null) {
            throw {
                type: 'group-name-error',
                msg: 'Group name contain invaild characters.',
            };
        }
        group.name = req.body.name;
    }

    if (req.body.id) {
        if (regex.uuidv4.exec(req.body.id) == null) {
            throw {
                type: 'group-name-error',
                msg: 'Group name contain invaild characters.',
            };
        }
        group.id = req.body.id;
    }

    if (req.body.inherited) {
        group.inherited = req.body.inherited.filter(i=>{
            return regex.uuidv4.exec(i) != null;
        });

        if (group.inherited.some((val, i) => group.inherited.indexOf(val) !== i) || group.inherited.indexOf(group.id) > -1) {
            throw {
                type: 'group-inherited-duplicate-id-error',
                msg: 'Inherited groups array contain duplicate ids or its own id',
            };
        } else {
            var groupIds = router.unmergedGroups.map(g=> g.id);

            if (!group.inherited.every(id => groupIds.includes(id))) {
                throw {
                    type: 'group-inherited-invalid-ids-error',
                    msg: 'Inherited groups array contain ids that do not correspond to real groups',
                };
            }
        }
    }

    if (req.body.type) {
        if (regex.safeName.exec(req.body.type) == null) {
            throw {
                type: 'group-type-error',
                msg: 'Group type contain invaild characters.',
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
                    msg: 'Duplicate Route with same route or name/permission',
                };
                break;
            }
        }
    }

    return group;
};

var getGroup = async function(req, res, router) {
    var name = req.params.groupname.toLowerCase();
    var fgroup = await router.getGroup(name);

    if (!fgroup || req.params.grouptype && fgroup.type != req.params.grouptype.toLowerCase()) {
        res.code(400).send({
            type: 'group-nonexistent-error',
            msg: 'No group with the name or id exists.',
        });
        return false;
    }
    return fgroup;
};

var getUserByGroup = async function(req, res, router) {

    var groups = await getGroupsByType(req, res, router);

    if (req.params.groupname) {
        groups = groups.filter(g=>g.id == req.params.groupname || g.name == req.params.groupname);
    }

    if (groups.length < 1) {
        res.code(400).send({
            type: 'group-nonexistent-error',
            msg: 'No groups with that name or id exists.',
        });
        return false;
    }

    var user = await userRoutes.getUser(req, res, router);

    if (!user.id) {
        res.code(400).send(user);
        return false;
    }

    if (!req.params.grouptype) {
        res.code(400).send({
            type: 'group-user-nonexistent-error',
            msg: 'No user with that groups type exists.',
        });
        return false;
    }

    groups = groups.filter(g=>g.type == user.group.type);

    if (req.params.groupname) {
        groups = groups.filter(g=>user.group_id == req.params.groupname && user.group.name == req.params.groupname);
    }

    if (groups.length < 1) {
        res.code(400).send({
            type: 'group-user-nonexistent-error',
            msg: 'No user with that groups name or id exists.',
        });
        return false;
    }
    res.code(200);
    return user;
};

var getGroupsByType = async function(req, res, router) {
    var groups = await router.getGroups();

    return groups.filter(g=>g.type == req.params.grouptype);
};

var editUserByGroup = async function(req,res,router) {
  var user = await getUserByGroup(req, res, router);
  if(!user) {
    return false;
  }
  var editedUser = userRoutes.editUser(req,res,router);

  if(!editedUser) {
    return false;
  }

  res.code(200);
  return editedUser;
}

var deleteUserByGroup = async function(req,res,router) {
  var user = await getUserByGroup(req, res, router);
  if(!user) {
    return false;
  }
  var deletedUser = userRoutes.deleteUser(req,res,router);

  if(!deletedUser) {
    return false;
  }

  res.code(200);
  return deletedUser;
}

var addGroup = async function(req, res, router) {
    if (!req.body.name) {
        res.code(400).send(
            {
                type: 'error',
                msg: 'A group requires a name',
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
    var fgroup = await router.getGroup(req.body.id || req.body.name);

    if (fgroup) {
        res.code(400).send(
            {
                type: 'error',
                msg: 'Group with the name or id already exists.',
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
        var dgroup = await router.defaultGroup();

        if (group.id != dgroup.id) {
            dgroup.is_default = false;
            await dgroup.save();
        }
    }

    var ngroup = await Group.create(group.changedProps);

    router.needsGroupUpdate = true;
    res.code(200).send(ngroup);

};

var editGroup = async function(req, res, router) {
    if (!req.params.groupname) {
        res.code(400).send(
            {
                type: 'group-no-name-error',
                msg: 'A group requires a name',
            });
        return;
    }

    var fgroup = await getGroup(req, res, router);

    if (!fgroup) {
        return;
    }

    var group;

    try {
        group = await setGroup(req, fgroup, router);
    } catch (e) {
        res.code(400).send(e);
        return;
    }

    if (group.is_default) {
        var dgroup = await router.defaultGroup();

        if (group.id != dgroup.id) {
            dgroup.is_default = false;
            await dgroup.save();
            router.needsGroupUpdate = true;
        }
    }

    await group.save();
    router.needsGroupUpdate = true;

    res.code(200).send(await router.getGroup(group.id));
};

var addRouteGroup = async function(req, res, router) {

    if (!req.params.groupname) {
        res.code(400).send(
            {
                type: 'error',
                msg: 'A group requires a name',
            });
        return;
    }

    var fgroup = await getGroup(req, res, router);

    if (!fgroup) {
        return;
    }

    if (!group.addRoute(req.body)) {
        res.code(400).send({
            type: 'error',
            msg: 'Group already has that route or name/permission',
        });
        return;
    }

    await group.save();
    router.needsGroupUpdate = true;
    res.code(200).send(group);
};

var deleteGroup = async function(req, res, router) {
    if (!req.params.groupname) {
        res.code(400).send(
            {
                type: 'group-no-name-error',
                msg: 'A group requires a name',
            });
        return;
    }

    var fgroup = await getGroup(req, res, router);

    if (!fgroup) {
        return;
    }

    await fgroup.delete();
    router.needsGroupUpdate = true;
    res.code(200).send();
};

var getInhertedUsers = async function(group, users, query = {}) {
    if (group.inheritedGroups) {

        for (var i = 0; i < group.inheritedGroups.length; i++) {

            users = await getInhertedUsers(group.inheritedGroups[i], users, query);
        }

    }

    return users = users.concat(await User.findAllBy(userUtils.setUser({group_id: group.id}, query)));
};

module.exports = function(app, opts, done) {
    const router = opts.router;

    // Add Group
    app.post('/group', async (req, res) => {
        await addGroup(req, res, router);
    });

    app.post('/group/type/:grouptype', async (req, res) => {

        await addGroup(req, res, router);
    });

    // Edit Group
    app.put('/group/name/:groupname/insert/route', async (req, res) => {
        await addRouteGroup(req, res, router);
    });

    app.put('/group/type/:grouptype/name/:groupname/insert/route', async (req, res) => {
        await addRouteGroup(req, res, router);
    });

    app.put('/group/name/:groupname', async (req, res) => {
        await editGroup(req, res, router);
    });

    app.put('/group//type/:grouptype/name/:groupname', async (req, res) => {
        await editGroup(req, res, router);
    });

    app.put('/group/name/:groupname/set/default', async (req, res) => {
        req.body = {
            is_default: true,
        };
        await editGroup(req, res, router);
    });

    app.put('/group/type/:grouptype/name/:groupname/set/default', async (req, res) => {
        req.body = {
            is_default: true,
        };
        await editGroup(req, res, router);
    });

    // Delete Group
    app.delete('/group/name/:groupname', async (req, res) => {
        await deleteGroup(req, res, router);
    });

    app.delete('/group/type/:grouptype/name/:groupname', async (req, res) => {
        await deleteGroup(req, res, router);
    });

    // Get Group
    app.get('/group/name/:groupname', async (req, res) => {
        var group = await getGroup(req, res, router);

        if (!group) {
            return;
        }
        res.code(200).send(group);
    });

    app.get('/group/type/:grouptype/name/:groupname', async (req, res) => {
        var group = await getGroup(req, res, router);

        if (!group) {
            return;
        }
        res.code(200).send(group);
    });

    // Get Group's User
    app.get('/group/type/:grouptype/name/:groupname/users', async (req, res) => {
        var group = await getGroup(req, res, router);

        if (!group) {
            return;
        }
        if (!misc.isEmpty(req.query) && userUtils.checkVaildUser(req.query, false)) {
            var query = userUtils.setUser({group_id: group.id}, req.query);

            res.code(200).send(await User.findAllBy(query));
        }
        res.code(200).send(await User.findAllBy({group_id: group.id}));

    });

    app.get('/group/type/:grouptype/users', async (req, res) => {
        var group = await getGroup(req, res, router);

        if (!group) {
            return;
        }

        if (!misc.isEmpty(req.query) && userUtils.checkVaildUser(req.query, false)) {
            var query = userUtils.setUser({group_id: group.id}, req.query);

            res.code(200).send(await User.findAllBy(query));
        }
        res.code(200).send(await User.findAllBy({group_id: group.id}));
    });

    app.get('/group/type/:grouptype/users/inherited', async (req, res) => {
        var group = await getGroup(req, res, router);

        if (!group) {
            return;
        }

        if (!misc.isEmpty(req.query) && userUtils.checkVaildUser(req.query, false)) {
            var query = userUtils.setUser({group_id: group.id}, req.query);

            res.code(200).send(await User.findAllBy(query));
        }

        res.code(200).send(await getInhertedUsers(group, []));

    });

    app.get('/group/type/:grouptype/name/:groupname/users/inherited', async (req, res) => {
        var group = await getGroup(req, res, router);

        if (!group) {
            return;
        }

        var query = !misc.isEmpty(req.query) && userUtils.checkVaildUser(req.query, false) ? req.query : {};

        res.code(200).send(await getInhertedUsers(group, [], query));
    });

    // Get Groups
    app.get('/groups', async (req, res) => {
        res.send(await router.getGroups());
    });

    app.get('/groups/type/:grouptype', async (req, res) => {
        var groups = await router.getGroups();

        req.params.grouptype = req.params.grouptype.toLowerCase();
        res.send(groups.filter(e=>{
            return e.type == req.params.grouptype;
        }));
    });

    app.get('/groups/types', async (req, res) => {
        var groups = await router.getGroups();

        res.send(Array.from(new Set(groups.map(g=> g.type))));
    });

    // Get Users

    app.get('/group/type/:grouptype/name/:groupname/user/:id', async (req, res) => {return await getUserByGroup(req, res, router);});
    app.get('/group/type/:grouptype/name/:groupname/user/:id/:prop', async (req, res) => {return await getUserByGroup(req, res, router);});
    app.get('/group/type/:grouptype/user/:id', async (req, res) => {return await getUserByGroup(req, res, router);});
    app.get('/group/type/:grouptype/user/:id/:prop', async (req, res) => {return await getUserByGroup(req, res, router);});

    // Edit Users

    app.put('/group/type/:grouptype/name/:groupname/user/:id', async (req, res) => {return await editUserByGroup(req, res, router);});
    app.put('/group/type/:grouptype/name/:groupname/user/:id/:prop',async (req, res) => {return await editUserByGroup(req, res, router);});
    app.put('/group/type/:grouptype/user/:id',async (req, res) => {return await editUserByGroup(req, res, router);});
    app.put('/group/type/:grouptype/user/:id/:prop',async (req, res) => {return await editUserByGroup(req, res, router);});

    // Delete Users

    app.delete('/group/type/:grouptype/name/:groupname/user/:id',async (req, res) => {return await deleteUserByGroup(req, res, router);});
    app.delete('/group/type/:grouptype/user/:id',async (req, res) => {return await deleteUserByGroup(req, res, router);});

    done();
};
