const auditRoutes = require('./functions/audit');
const { validateAuditAction, validateAuditSubaction } = require('../../utils/audit');
const regex = require('../../utils/regex');

module.exports = function (app, opts, done) {
  app.get('/audit/user/byuser/:id', async (req, res) => {
    const id = req.params.id;

    if (!id || !regex.uuidCheck(id)) {
      res.code(400);
      return {
        type: 'validation-error',
        msg: 'Please provide a valid uuid.'
      };
    }

    if (!req.query.filter) {
      req.query.filter = `by_user_id=${id}`;
    } else {
      req.query.filter += `,by_user_id=${id}`;
    }

    return await auditRoutes.getAudits({ req, res });
  });

  app.get('/audit/count/user/byuser/:id', async (req, res) => {
    const id = req.params.id;

    if (!id || !regex.uuidCheck(id)) {
      res.code(400);
      return {
        type: 'validation-error',
        msg: 'Please provide a valid uuid.'
      };
    }

    if (!req.query.filter) {
      req.query.filter = `by_user_id=${id}`;
    } else {
      req.query.filter += `,by_user_id=${id}`;
    }

    return await auditRoutes.getAudits({ req, res, count: true });
  });

  app.get('/audit/user/ofuser/:id', async (req, res) => {
    const id = req.params.id;

    if (!id || !regex.uuidCheck(id)) {
      res.code(400);
      return {
        type: 'validation-error',
        msg: 'Please provide a valid uuid.'
      };
    }

    if (!req.query.filter) {
      req.query.filter = `of_user_id=${id}`;
    } else {
      req.query.filter += `,of_user_id=${id}`;
    }

    return await auditRoutes.getAudits({ req, res });
  });

  app.get('/audit/count/user/ofuser/:id', async (req, res) => {
    const id = req.params.id;

    if (!id || !regex.uuidCheck(id)) {
      res.code(400);
      return {
        type: 'validation-error',
        msg: 'Please provide a valid uuid.'
      };
    }

    if (!req.query.filter) {
      req.query.filter = `of_user_id=${id}`;
    } else {
      req.query.filter += `,of_user_id=${id}`;
    }

    return await auditRoutes.getAudits({ req, res, count: true });
  });

  app.get('/audit/action/:action', async (req, res) => {
    const action = req.params.action;

    if (!action) {
      res.code(400);
      return {
        type: 'missing-param-error',
        msg: 'Please provide an action.'
      };
    }

    const error = validateAuditAction(action);

    if (error.msg) {
      res.code(400);
      return error;
    }

    if (!req.query.filter) {
      req.query.filter = `action=${action}`;
    } else {
      req.query.filter += `,action=${action}`;
    }

    return await auditRoutes.getAudits({ req, res });
  });

  app.get('/audit/subaction/:subaction', async (req, res) => {
    const subaction = req.params.subaction;

    if (!subaction) {
      res.code(400);
      return {
        type: 'missing-param-error',
        msg: 'Please provide an subaction.'
      };
    }

    const error = validateAuditSubaction(subaction);

    if (error.msg) {
      res.code(400);
      return error;
    }

    if (!req.query.filter) {
      req.query.filter = `subaction=${subaction}`;
    } else {
      req.query.filter += `,subaction=${subaction}`;
    }

    return await auditRoutes.getAudits({ req, res });
  });

  app.get('/audit/action/:action/subaction/:subaction', async (req, res) => {
    const action = req.params.action;
    const subaction = req.params.subaction;

    if (!subaction || !action) {
      res.code(400);
      return {
        type: 'missing-param-error',
        msg: 'Please provide an action/subaction.'
      };
    }

    const validAction = validateAuditAction(action);
    const validSubction = validateAuditSubaction(subaction);

    if (validAction.msg || validSubction.msg) {
      res.code(400);
      return {
        type: 'missing-param-error',
        msg: 'Please provide a valid action/subaction.'
      };
    }

    if (!req.query.filter) {
      req.query.filter = `action=${action},subaction=${subaction}`;
    } else {
      req.query.filter += `,action=${action},subaction=${subaction}`;
    }

    return await auditRoutes.getAudits({ req, res });
  });

  done();
};
