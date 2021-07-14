const auditRoutes = require('./functions/audit');

module.exports = function (app, opts, done) {
  app.get('/audit/user/byuser/:id', async (req, res) => {
    if (!req.query.filter) {
        req.query.filter = `by_user_id=${req.params.id}`;
      } else {
        req.query.filter += `,by_user_id=${req.params.id}`;
      }
      
    return await auditRoutes.getAuditsByUserID({ req, res, byUser: true });
  });
  
  app.get('/audit/user/ofuser/:id', async (req, res) => {
    if (!req.query.filter) {
        req.query.filter = `of_user_id=${req.params.id}`;
      } else {
        req.query.filter += `,of_user_id=${req.params.id}`;
      }

    return await auditRoutes.getAuditsByUserID({ req, res, ofUser: true });
  });

  done();
};
