'use strict';

const Group = require('../../database/models/group');
const regex = require('../../utils/regex');

var setGroup = function(req, group, router) {
    var invalidGroup = false;

    if (regex.safeName.exec(req.body.name)) {
        group.name = req.body.name;
    } else {
        invalidGroup = {
            type: 'group-name-error',
            msg: 'Group name contain invaild characters.',
        };
    }

    if (req.body.inherited) {
        group.inherited = req.body.inherited.filter(Number);

        if (group.inherited.some((val, i) => group.inherited.indexOf(val) !== i) || group.inherited.indexOf(group.id) > -1) {
            invalidGroup = {
                type: 'group-inherited-duplicate-id-error',
                msg: 'Inherited groups array contain duplicate ids or its own id',
            };
        } else {
            var groupIds = router.unmergedGroups.map(g=> g.id);

            if (!group.inherited.every(id => groupIds.includes(id))) {
                invalidGroup = {
                    type: 'group-inherited-invalid-ids-error',
                    msg: 'Inherited groups array contain ids that do not correspond to real groups',
                };
            }
        }
    }

    if (regex.safeName.exec(req.body.type)) {
        group.type = req.body.type;
    } else {
        invalidGroup = {
            type: 'group-type-error',
            msg: 'Group type contain invaild characters.',
        };
    }

    if (req.body.is_default) {
        group.is_default = Boolean(req.body.is_default);
    }

    if (req.body.allowed) {
        group.allowed = [];
        for (var i = 0; i < req.body.allowed.length; i++) {
            if (!group.addRoute(req.body.allowed[i])) {
                invalidGroup = {
                    type: 'group-route-duplicate-error',
                    msg: 'Duplicate Route with same route or name/permission',
                };
                break;
            }
        }
    }

    return {invalidGroup, group};
};

module.exports = function(app, opts, done) {
    const router = opts.router;

    // Add Group
    app.put('/group', async (req, res) => {
        if (!req.body.name) {
            res.code(400).send(
                {
                    type: 'error',
                    msg: 'A group requires a name',
                });
        } else if (req.body.id || regex.safeName.exec(req.body.name)) {
            req.body.name = req.body.name.toLowerCase();
            if (!req.body.type) {
                req.body.type = 'group';
            }

            var id = req.body.id ? {id: Number(req.body.id)} : {name: req.body.name};

            var fgroup = await router.getGroup(id);

            if (fgroup.length > 0) {
                res.code(400).send(
                    {
                        type: 'error',
                        msg: 'Group with the name or id already exists.',
                    });
            } else {
                var {invalidGroup, group} = setGroup(req, new Group(req.body), router);

                if (invalidGroup) {
                    res.code(400).send(invalidGroup);
                } else {
                    var ngroup = await Group.create(group.changedProps);

                    res.code(200).send(ngroup);
                    router.needsGroupUpdate = true;
                }
            }
        } else {
            res.code(400).send(
                {
                    type: 'group-id-name-error',
                    msg: 'Group has invaild id or name set',
                });
        }
    });

    // Edit Group
    app.put('/group/:groupname', async (req, res) => {
        if (!req.params.groupname) {
            res.code(400).send(
                {
                    type: 'group-no-name-error',
                    msg: 'A group requires a name',
                });
        } else {
            var name = req.params.groupname.toLowerCase();
            var fgroup = await router.getGroup(name);

            if (fgroup.length <= 0) {
                res.code(400).send(
                    {
                        type: 'group-nonexistent-error',
                        msg: 'No group with the name or id exists.',
                    });
            } else {
                var {invalidGroup, group} = setGroup(req, fgroup[0], router);

                if (invalidGroup) {
                    res.code(400).send(invalidGroup);
                } else {
                    await group.save();

                    res.code(200).send(group);
                    router.needsGroupUpdate = true;
                }
            }
        }
    });

    app.put('/group/:groupname/route', async (req, res) => {
        if (!req.params.groupname) {
            res.code(400).send(
                {
                    type: 'error',
                    msg: 'A group requires a name',
                });
        } else {
            var name = req.params.groupname.toLowerCase();
            var group = await router.getGroup(name);

            if (!group) {
                res.code(400).send(
                    {
                        type: 'error',
                        msg: 'No group with the name or id already exists.',
                    });
            } else {

                if (group.addRoute(req.body)) {
                    await group.save();
                    router.needsGroupUpdate = true;
                    res.code(200).send(group);
                } else {
                    res.code(400).send({
                        type: 'error',
                        msg: 'Group already has that route or name/permission',
                    });
                }
            }
        }
    });

    app.get('/groups', async (req, res) => {
        res.send(await router.getGroups());
    });

    app.get('/groups/type/:type', async (req, res) => {
        var groups = await router.getGroups();

        res.send(groups.filter(e=>{
          return e.type == req.params.type;
        }));
    });

    app.get('/groups/types', async (req, res) => {
        var groups = await router.getGroups();
        res.send(Array.from(new Set(groups.map(g=> g.type))));
    });

    done();
};
