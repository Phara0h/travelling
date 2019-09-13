const regex = require('../../utils/regex');
const User = require('../../database/models/user');
const TokenHandler = require('../../token');
const userUtils = require('../../utils/user');
const config = require('../../utils/config');
const misc = require('../../utils/misc');

module.exports = function(app, opts, done) {
    const router = opts.router;

    var deleteUser = async (req, res) => {

        if (req.params.username && !regex.safeName.exec(req.params.username) || req.params.id && req.params.id.length != 36) {
            res.code(400);
            return {
                type: 'user-find-by-error',
                msg: 'No user by that username or id was found.',
            };
        }

        var id = req.params.username ? {username: req.params.username} : {id: req.params.id};

        var user = await User.deleteAllBy(id, 'AND');

        if (user && user.length > 0) {

            await user[0].resolveGroup(router);

            var session = await req.sessionStore.get(user[0].id);

            if (session) {
                await req.sessionStore.destroy(session.sessionId);
            }

            res.code(200);
            return user[0];
        }

        res.code(400);
        return {
            type: 'user-delete-error',
            msg: 'No user by that username or id was found.',
        };
    };

    var editUser = async (req, res) => {

        if (req.params.username && !regex.safeName.exec(req.params.username) || req.params.id && req.params.id.length != 36) {
            res.code(400);
            return {
                type: 'user-find-by-error',
                msg: 'No user by that username or id was found.',
            };
        }

        var id = req.params.username ? {username: req.params.username} : {id: req.params.id};
        var model = req.body;

        if (req.params.prop) {
            model = {[req.params.prop]: req.body};
        }

        var isVaild = await userUtils.checkVaildUser(model);

        if (isVaild !== true) {
            res.code(400);
            return isVaild;
        }

        var user = await User.updateLimitedBy(id, model, 'AND', 1);

        if (user && user.length > 0) {

            await user[0].resolveGroup(router);

            res.code(200);
            // Update any current logged in users
            var session = await req.sessionStore.get(user[0].id);

            if (session) {
                session.data = {user: user[0]};
                await req.sessionStore.set(session.sessionId, session);
            }

            return req.params.prop ? user[0][req.params.prop] : user[0];
        }

        res.code(400);
        return {
            type: 'user-edit-error',
            msg: 'No user by that username or id was found.',
        };
    };

    var getUser = async (req, res) => {

        if (!req.params.id && !req.params.username || req.params.username && !regex.safeName.exec(req.params.username) || req.params.id !== undefined && req.params.id !== null && req.params.id.length != 36) {
            res.code(400);
            return {
                type: 'user-find-by-error',
                msg: 'No user by that username or id was found.',
            };
        }

        var id = req.params.username ? {username: req.params.username} : {id: req.params.id};
        var user = await User.findLimtedBy(id, 'AND', 1);
        // console.log(id, user, user.length)

        if (user && user.length > 0) {

            await user[0].resolveGroup(router);

            if (req.params.prop && !user[0]._[req.params.prop]) {
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

    app.put('/user/username/:username', editUser);
    app.put('/user/username/:username/:prop', editUser);
    app.put('/user/id/:id', editUser);
    app.put('/user/id/:id/:prop', editUser);

    app.delete('/user/id/:id', deleteUser);
    app.delete('/user/username/:username', deleteUser);

    // app.get('/user/resolve/group/username/:username', getUserResolveGroup);
    // app.get('/user/resolve/group/username/:username/:prop', getUserResolveGroup);
    // app.get('/user/resolve/group/id/:id', getUserResolveGroup);
    // app.get('/user/resolve/group/id/:id/:prop', getUserResolveGroup);

    app.get('/users', async (req, res) => {

        if (!misc.isEmpty(req.query) && userUtils.checkVaildUser(req.query, false)) {
            var query = userUtils.setUser({}, req.query);

            return await User.findAllBy(query);
        }
        return await User.findAll();
    });

    app.get('/user/me', (req, res) => {
        res.send(req.session.data.user);
    });

    app.get('/user/me/:prop', (req, res) => {
        if (req.session.data.user._.hasOwnProperty(req.params.prop)) {
            res.code(200).send(req.session.data.user._[req.params.prop]);
        } else {
            res.code(400).send({
                type: 'user-prop-error',
                msg: 'Not a property of user',
            });
        }
    });

    app.put('/user/me', async (req, res) => {
        req.params.id = req.session.data.user.id;
        return await editUser(req, res);
        // var isVaild = await userUtils.checkVaildUser(req.body);
        // if(isVaild !== true) {
        //     res.code(400).send(isVaild);
        // } else {
        //   userUtils.setUser(req.session.data.user,req.body)
        //   await req.session.data.user.save();
        //   await req.session.data.user.resolveGroup(router);
        //   res.send(req.session.data.user);
        // }
    });

    app.put('/user/me/:prop', async (req, res) => {
        req.params.id = req.session.data.user.id;
        return await editUser(req, res);
        // var prop = {[req.params.prop]:req.body};
        // var isVaild = await userUtils.checkVaildUser(prop);
        // if(isVaild !== true) {
        //     res.code(400).send(isVaild);
        // } else {
        //   userUtils.setUser(req.session.data.user,prop)
        //   await req.session.data.user.save();
        //   await req.session.data.user.resolveGroup(router);
        //   res.send(req.session.data.user);
        // }
    });

    app.get('/user/me/route/allowed', async (req, res) => {

        var isAllowed = req.session ? router.isRouteAllowed(req.query.method, req.query.route, await router.currentGroup(req, res), !req.isAuthenticated ? null : req.session.data.user) : false;

        res.code(isAllowed ? 200 : 401).send();
    });

    app.get('/user/me/permission/allowed/:permission', async (req, res) => {

        var isAllowed = req.session ? router.isPermissionAllowed(req.params.permission, await router.currentGroup(req, res), !req.isAuthenticated ? null : req.session.data.user) : false;

        res.code(isAllowed ? 200 : 401).send();
    });

    app.post('/user/me/token', async (req, res) => {
        var token = null;

        try {
            token = await TokenHandler.getOAuthToken(req.session.data.user.id, req.body.type || 'oauth', req.body.name || null);
            res.code(200).send({client_id: token.name || token.id, client_secret: token.secret});
            return;
        } catch (e) {
            res.code(400).send({
                type: 'token-error',
                msg: 'Tokens name needs to have [A-Za-z0-9_@.] as the only vaild characters and not already exist.',
            });
            return;
        }

    });

    app.delete('/user/me/token/:id', async (req, res) => {
        var token = null;

        try {
            token = await TokenHandler.deleteOAuthToken(req.params.id, req.session.data.user.id);
            if (!token) {
                res.code(400).send({
                    type: 'token-error',
                    msg: 'Unabled to delete token.',
                });
                return;
            }
            res.code(200).send();
            return;
        } catch (e) {

            res.code(400).send({
                type: 'token-error',
                msg: 'Unabled to delete token.',
            });
            config.log.logger.debug(e);
            return;
        }
        res.code(200).send();
        return;
    });

    done();
};
