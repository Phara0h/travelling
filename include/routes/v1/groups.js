'use strict';

const Group = require('../../database/models/group');

module.exports = function(app, opts, done) {
    const router = opts.router;
    app.put('/group', async (req, res) => {
        if (!req.body.name) {
            res.code(400).send(
                {
                    type: 'error',
                    msg: 'A group requires a name',
                });
        } else if (req.body.id || req.body.name) {
            req.body.name = req.body.name.toLowerCase();
            if(!req.body.type){
              req.body.type = 'group';
            }


            var id = req.body.id ? {id: req.body.id} : {name: req.body.name};

            var group = await Group.findAllBy(id);

            if (group.length > 0) {
                res.code(400).send(
                    {
                        type: 'error',
                        msg: 'Group with the name or id already exists.',
                    });
            } else {
                var ngroup = await Group.create(req.body);

                res.code(200).send(ngroup);
                // routing.needsGroupUpdate = true;
            }
        }
    });

    app.put('/group/:groupname', async (req, res) => {
        if (!req.params.groupname) {
            res.code(400).send(
                {
                    type: 'error',
                    msg: 'A group requires a name',
                });
        } else {
            var name = req.params.groupname.toLowerCase();
            var group = await Group.findLimtedBy({name},'AND', 1);

            if (group.length <= 0) {
                res.code(400).send(
                    {
                        type: 'error',
                        msg: 'No group with the name or id already exists.',
                    });
            } else {
                group = group[0];
                if(req.body.name) {
                  group.name = req.body.name;
                }
                if(req.body.inherited) {
                  group.inherited = req.body.inherited;
                }
                if(req.body.type) {
                  group.type = req.body.type;
                }
                if(req.body.is_default) {
                  group.is_default = Boolean(req.body.is_default);
                }
                if(req.body.allowed) {
                  group.allowed = [];
                  for (var i = 0; i < req.body.allowed.length; i++) {
                    group.addRoute(req.body.allowed[i]);
                  }
                }
                await group.save();

                res.code(200).send(group);
                router.needsGroupUpdate = true;
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
            var group = await Group.findLimtedBy({name},'AND', 1);

            if (group.length <= 0) {
                res.code(400).send(
                    {
                        type: 'error',
                        msg: 'No group with the name or id already exists.',
                    });
            } else {
                group = group[0];

                group.addRoute(req.body);
                console.log(group)
                await group.save();
                console.log(group)
                res.code(200).send(group);
                router.needsGroupUpdate = true;
            }
        }
    });


    app.get('/groups', async (req, res) => {
        res.send(await Group.findAll());
    });

    done();
};
