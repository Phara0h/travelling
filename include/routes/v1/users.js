const fp = require('fastify-plugin')

module.exports = function (app, opts, done){
  const router = opts.router;

  app.get('/user/me',(req, res) => {
      res.send(req.session.user);
  });

  app.get('/user/me/route/allowed', async (req, res) => {
      var group = router.groups[req.session.user.group.name];

      res.send(req.session.user);
  });

  app.get('/user/me/permission/allowed/:permission',(req, res) => {
      var isAllowed = router.isPermissionAllowed(req.params.permission, router.currentGroup(req,res), req.session.user);
      res.code(isAllowed ? 200 : 401).send();
  });
  done();
};
