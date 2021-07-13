const auditRoutes = require('./functions/audit');

module.exports = function (app, opts, done) {
    app.get('/audit/user/byuser/:id', async (req, res) => {
        return await auditRoutes.getAuditsByUserID({ req, res, byUser: true });
    });
    app.get('/audit/user/ofuser/:id', async (req, res) => {
        return await auditRoutes.getAuditsByUserID({ req, res, ofUser: true });
    });

    done();
};