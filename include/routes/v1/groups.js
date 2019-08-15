'use strict';

const Group = require('../../database/models/group');

module.exports = function(app, opts, done) {

    app.put('/group', async (req, res) => {
        if (!req.body.name) {
            res.code(400).send(
                {
                    type: 'error',
                    msg: 'A group requires a name',
                });
        } else if (req.body.id || req.body.name) {
            req.body.name = req.body.name.toLowerCase();

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

    app.get('/groups', async (req, res) => {
        res.send(await Group.findAll());
    });

    done();
};
