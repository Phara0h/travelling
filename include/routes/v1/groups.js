'use strict';

const Group = require('../../database/models/group');
const User = require('../../database/models/user');

const misc = require('../../utils/misc');
const regex = require('../../utils/regex');
const userUtils = require('../../utils/user.js');
const userRoutes = require('./users');
const gm = require('../../server/groupmanager');

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
                msg: 'Group name contain invalid characters.',
            };
        }
        group.name = req.body.name;
    }

    if (req.body.id) {
        if (regex.uuidv4.exec(req.body.id) == null) {
            throw {
                type: 'group-id-error',
                msg: 'Group id contain invalid characters.',
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
            var groupIds = (await gm.getGroups()).map(g=> g.id);

            if (!group.inherited.every(id => groupIds.includes(id))) {
                throw {
                    type: 'group-inherited-invalid-ids-error',
                    msg: 'Inherited groups array contain ids that do not correspond to real groups',
                };
            }
        }

        if (checkCircularGroupRef(group, groups || await gm.getMappedGroups())) {
            throw {
                type: 'group-inherited-circular-error',
                msg: 'Inherited groups array contains a cicular ref.',
            };
        }
    }

    if (req.body.type) {
        if (regex.safeName.exec(req.body.type) == null) {
            throw {
                type: 'group-type-error',
                msg: 'Group type contain invalid characters.',
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
            }
        }
    }

    return group;
}

async function getGroup(req, res, router) {
    var name = req.params.groupname.toLowerCase();
    var fgroup = await gm.getGroup(name, req.params.grouptype);

    if (!fgroup || req.params.grouptype && fgroup.type != req.params.grouptype.toLowerCase()) {
        res.code(400).send({
            type: 'group-nonexistent-error',
            msg: 'No group with the name or id exists.',
        });
        return false;
    }
    return fgroup;
}

async function getUserByGroup(req, res, router) {
    const groupRequest = req.req.url.indexOf('/group/request/type/') > -1;

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

    const prop = req.params.prop;

    // delete prop so we get back full user
    delete req.params.prop;
    var user = await userRoutes.getUser(req, res, router);

    // set prop back for other functions to use\
    req.params.prop = prop;

    if (user.msg) {
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
    // console.log(groups, user.group.type, user.group_request, req.params.grouptype);
    groups = groups.filter(g=>g.type === user.group.type || groupRequest && user.group_request === req.params.grouptype);

    if (req.params.groupname) {

        groups = groups.filter(g=>user.group_id === req.params.groupname || user.group.name === req.params.groupname);
    }

    if (groups.length < 1) {
        res.code(400).send({
            type: 'group-user-nonexistent-error',
            msg: 'No user with that groups name or id exists.',
        });
        return false;
    }
    res.code(200);
    return prop ? user[prop] : user;
}

async function getGroupsByType(req, res, router) {
    var groups = await gm.getGroups();

    return groups.filter(g=>g.type == req.params.grouptype);
}

async function editUserByGroup(req, res, router) {
    var user = await getUserByGroup(req, res, router);

    if (!user) {
        return false;
    }
    var editedUser = userRoutes.editUser(req, res, router);

    if (editedUser.msg) {
        return editedUser;
    }

    res.code(200);
    return editedUser;
}

async function deleteUserByGroup(req, res, router) {
    var user = await getUserByGroup(req, res, router);

    if (!user) {
        return false;
    }
    var deletedUser = userRoutes.deleteUser(req, res, router);

    if (deletedUser.msg) {
        return deletedUser;
    }

    res.code(200);
    return deletedUser;
}

async function addGroup(req, res, router) {
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
    var fgroup = await gm.getGroup(req.body.id || req.body.name, req.body.type);

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

    if (!fgroup.addRoute(req.body)) {
        res.code(400).send({
            type: 'error',
            msg: 'Group already has that route or name/permission',
        });
        return;
    }

    await fgroup.save();
    gm.redis.needsGroupUpdate = true;
    res.code(200).send(fgroup);
}

async function deleteRouteGroup(req, res, router) {

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

    if (!fgroup.removeRoute(req.body)) {
        res.code(400).send({
            type: 'error',
            msg: 'Group does not have that route/permission',
        });
        return;
    }

    await fgroup.save();
    gm.redis.needsGroupUpdate = true;
    res.code(200).send(fgroup);
}

async function deleteGroup(req, res, router) {
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
    gm.redis.needsGroupUpdate = true;
    res.code(200).send();
}

async function getInhertedUsers(group, users, query = {}) {
    if (group.inheritedGroups) {

        for (var i = 0; i < group.inheritedGroups.length; i++) {

            users = await getInhertedUsers(group.inheritedGroups[i], users, query);
        }

    }

    return users = users.concat(await User.findAllBy(userUtils.setUser({group_id: group.id}, query)));
}

async function addInheritedToGroup(req, res, router) {
    var group = await getGroup(req, res, router);

    if (!group) {
        return;
    }

    var inhertedGroup = await gm.getGroup(req.params.inheritedGroupName.toLowerCase());

    if (!inhertedGroup) {
        res.code(400).send({
            type: 'error',
            msg: 'No group to inherit from by that name.',
        });
        return;
    }

    if (!group.inherited) {
        group.inherited = [];
    }

    group.inherited.push(inhertedGroup.id);

    req.body = {
        inherited: group.inherited,
    };
    await editGroup(req, res, router);
}

async function removeInheritance(req, res, router) {
    var group = await getGroup(req, res, router);

    if (!group) {
        return;
    }

    var inhertedGroup = await gm.getGroup(req.params.inheritedGroupName.toLowerCase());

    if (!inhertedGroup) {
        res.code(400).send({
            type: 'error',
            msg: 'No group to remove inheritance from by that name.',
        });
        return;
    }
    var inheritedIndex = group.inherited.indexOf(inhertedGroup.id);

    if (!group.inherited || inheritedIndex == -1) {
        res.code(400).send({
            type: 'error',
            msg: 'No group to remove inheritance from by that name.',
        });
        return;
    }

    group.inherited.splice(inheritedIndex, 1);

    req.body = {
        inherited: group.inherited,
    };
    await editGroup(req, res, router);
}

module.exports = function(app, opts, done) {
    const router = opts.router;

    // Add Group
    app.post('/group', async (req, res) => {
        await addGroup(req, res, router);
    });

    app.post('/group/type/:grouptype', async (req, res) => {

        await addGroup(req, res, router);
    });

    app.post('/group/name/:groupname', async (req, res) => {
        req.body = {
            name: req.params.groupname,
        };
        await addGroup(req, res, router);
    });

    app.post('/group/type/:grouptype/name/:groupname', async (req, res) => {
        req.body = {
            name: req.params.groupname,
            type: req.params.grouptype,
        };
        await addGroup(req, res, router);
    });

    // Edit Group Routes
    app.put('/group/name/:groupname/insert/route', async (req, res) => {
        await addRouteGroup(req, res, router);
    });

    app.put('/group/name/:groupname/insert/permission/:permission', async (req, res) => {
        req.body = {
            name: req.params.permission,
        };
        await addRouteGroup(req, res, router);
    });

    app.put('/group/type/:grouptype/name/:groupname/insert/route', async (req, res) => {
        await addRouteGroup(req, res, router);
    });

    app.put('/group/type/:grouptype/name/:groupname/insert/permission/:permission', async (req, res) => {
        req.body = {
            name: req.params.permission,
        };
        await addRouteGroup(req, res, router);
    });

    // Delete Group Routes
    app.delete('/group/name/:groupname/permission/:permission', async (req, res) => {
        req.body = {
            name: req.params.permission,
        };
        await deleteRouteGroup(req, res, router);
    });

    app.delete('/group/type/:grouptype/name/:groupname/permission/:permission', async (req, res) => {
        req.body = {
            name: req.params.permission,
        };
        await deleteRouteGroup(req, res, router);
    });

    // Edit Groups
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

    app.put('/group/name/:groupname/inherit/from/:inheritedGroupName', async (req, res) => {
        await addInheritedToGroup(req, res, router);
    });

    app.put('/group/type/:grouptype/name/:groupname/inherit/from/:inheritedGroupName', async (req, res) => {
        await addInheritedToGroup(req, res, router);
    });

    app.delete('/group/name/:groupname/remove/inheritance/:inheritedGroupName', async (req, res) => {
        await removeInheritance(req, res, router);
    });

    app.delete('/group/type/:grouptype/name/:groupname/remove/inheritance/:inheritedGroupName', async (req, res) => {
        await removeInheritance(req, res, router);
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
        if (!misc.isEmpty(req.query) && userUtils.checkValidUser(req.query, false)) {
            var query = userUtils.setUser({group_id: group.id}, req.query);

            res.code(200).send(await User.findAllBy(query));
        }
        res.code(200).send(await User.findAllBy({group_id: group.id}));

    });

    app.get('/group/type/:grouptype/name/:groupname/users/inherited', async (req, res) => {
        var group = await getGroup(req, res, router);

        if (!group) {
            return;
        }

        var query = !misc.isEmpty(req.query) && userUtils.checkValidUser(req.query, false) ? req.query : {};

        res.code(200).send(await getInhertedUsers(group, [], query));
    });
    app.get('/group/name/:groupname/users', async (req, res) => {
        var group = await getGroup(req, res, router);

        if (!group) {
            return;
        }
        if (!misc.isEmpty(req.query) && userUtils.checkValidUser(req.query, false)) {
            var query = userUtils.setUser({group_id: group.id}, req.query);

            res.code(200).send(await User.findAllBy(query));
        }
        res.code(200).send(await User.findAllBy({group_id: group.id}));

    });

    app.get('/group/name/:groupname/users/inherited', async (req, res) => {
        var group = await getGroup(req, res, router);

        if (!group) {
            return;
        }

        var query = !misc.isEmpty(req.query) && userUtils.checkValidUser(req.query, false) ? req.query : {};

        res.code(200).send(await getInhertedUsers(group, [], query));
    });

    // Get Groups
    app.get('/groups', async (req, res) => {
        res.send(await gm.getGroups());
    });

    app.get('/groups/type/:grouptype', async (req, res) => {
        var groups = await gm.getGroups();

        req.params.grouptype = req.params.grouptype.toLowerCase();
        res.send(groups.filter(e=>{
            return e.type == req.params.grouptype;
        }));
    });

    app.get('/groups/types', async (req, res) => {
        var groups = await gm.getGroups();

        res.send(Array.from(new Set(groups.map(g=> g.type))));
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
                req.body[grouptypes[k]][keys[i]].name = keys[i];
                var group = req.body[grouptypes[k]][keys[i]];
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
                    groups.push(await setGroup({body: group}, new Group(fgroup), router, req.body));
                } catch (e) {
                    res.code(400).send(e);
                }
            }

            for (var i = 0; i < groups.length; i++) {
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
                    failedInheritance.push({group: inheritanceKeys[i], inheritance: inheritance[inheritanceKeys[i]][j]});
                }
            }
            await savedGroups[inheritanceKeys[i]].save();
        }
        gm.redis.needsGroupUpdate = true;

        if (failedInheritance.length > 0) {
            res.code(240).send({
                type: 'group-export-failed-inheritances',
                msg: 'All groups imported but these inheritances were not done since the group names do not exist.',
                failedInheritance,
            });
            return;
        }

        res.code(200).send();
    });

    app.get('/groups/export', async (req, res) => {
        var groups = await gm.getGroups();
        var mappedGroups = await gm.getMappedGroups();
        var exported = {
        };

        // console.log('Groups Before', groups);
        // console.log('Merge Groups Before', mappedGroups);
        for (var i = 0; i < groups.length; i++) {
            var group = new Group({...groups[i]._});

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
            exported[group.type][group.name] = group;
            exported[group.type][group.name].name = undefined;
        }

        // console.log('Groups After', groups);
        // console.log('Merge Groups After', mappedGroups);

        res.code(200).send(exported);
    });

    // Get Users

    app.get('/group/type/:grouptype/name/:groupname/user/:id', async (req, res) => {return await getUserByGroup(req, res, router);});
    app.get('/group/type/:grouptype/name/:groupname/user/:id/:prop', async (req, res) => {return await getUserByGroup(req, res, router);});
    app.get('/group/type/:grouptype/user/:id', async (req, res) => {return await getUserByGroup(req, res, router);});
    app.get('/group/type/:grouptype/user/:id/:prop', async (req, res) => {return await getUserByGroup(req, res, router);});

    // Edit Users

    app.put('/group/type/:grouptype/name/:groupname/user/:id', async (req, res) => {return await editUserByGroup(req, res, router);});
    app.put('/group/type/:grouptype/name/:groupname/user/:id/:prop', async (req, res) => {return await editUserByGroup(req, res, router);});
    app.put('/group/type/:grouptype/user/:id', async (req, res) => {return await editUserByGroup(req, res, router);});
    app.put('/group/type/:grouptype/user/:id/:prop', async (req, res) => {return await editUserByGroup(req, res, router);});

    // Edit Users Group request

    app.put('/group/request/type/:grouptype/user/:id', async (req, res) => {return await editUserByGroup(req, res, router);});
    app.put('/group/request/type/:grouptype/user/:id/:prop', async (req, res) => {
        return await editUserByGroup(req, res, router);
    });

    // Delete Users

    app.delete('/group/type/:grouptype/name/:groupname/user/:id', async (req, res) => {return await deleteUserByGroup(req, res, router);});
    app.delete('/group/type/:grouptype/user/:id', async (req, res) => {return await deleteUserByGroup(req, res, router);});

    done();
};
