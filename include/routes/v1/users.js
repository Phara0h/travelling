const regex = require('../../utils/regex');
const User = require('../../database/models/user');

module.exports = function(app, opts, done) {
    const router = opts.router;

    var getUser = async (req, res, resolveGroup = false) => {

        if (req.params.username && !regex.safeName.exec(req.params.username) || req.params.id && Number.isNaN(req.params.id)) {
            res.code(400);
            return {
                type: 'user-find-by-error',
                msg: 'No user by that username or id was found.',
            };
        }

        var id = req.params.username ? {username: req.params.username} : {id: req.params.id};
        var user = await User.findLimtedBy(id, 'AND', 1);

        if (user && user.length > 0) {

            if (resolveGroup) {
                await user[0].resolveGroup();
            }

            if (req.params.prop && !user[0]._.hasOwnProperty(req.params.prop)) {
                res.code(400);
                return {
                    type: 'user-prop-error',
                    msg: 'Not a property of user',
                };
            }

            res.code(200);
            return req.params.prop ? user[0][req.params.prop] : user[0];
        }

        res.code(400);
        return {
            type: 'user-find-by-error',
            msg: 'No user by that username or id was found.',
        };
    };

    var getUserResolveGroup = async (req, res) => {
        return await getUser(req, res, true);
    };

    app.get('/user/username/:username', getUser);
    app.get('/user/username/:username/:prop', getUser);
    app.get('/user/id/:id', getUser);
    app.get('/user/id/:id/:prop', getUser);

    app.get('/user/resolve/group/username/:username', getUserResolveGroup);
    app.get('/user/resolve/group/username/:username/:prop', getUserResolveGroup);
    app.get('/user/resolve/group/id/:id', getUserResolveGroup);
    app.get('/user/resolve/group/id/:id/:prop', getUserResolveGroup);

    app.get('/users', async (req, res) => {
        res.send(await User.findAll());
    });

    app.get('/user/me', (req, res) => {
        res.send(req.session.user);
    });

    app.get('/user/me/:prop', (req, res) => {
        if (req.session.user._.hasOwnProperty(req.params.prop)) {
            res.code(200).send(req.session.user._[req.params.prop]);
        } else {
            res.code(400).send({
                type: 'user-prop-error',
                msg: 'Not a property of user',
            });
        }
    });

    app.get('/user/me/route/allowed', async (req, res) => {
        var isAllowed = router.isRouteAllowed(req.query.method, req.query.route, router.currentGroup(req, res), req.session.user);

        res.code(isAllowed ? 200 : 401).send();
    });

    app.get('/user/me/permission/allowed/:permission', (req, res) => {
        var isAllowed = router.isPermissionAllowed(req.params.permission, router.currentGroup(req, res), req.session.user);

        res.code(isAllowed ? 200 : 401).send();
    });
    done();
};
