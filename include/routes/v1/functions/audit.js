const Audit = require('../../../database/models/audit');

async function getAudits(opts) {
  var query = null;

  if (opts.resolve) {
    // Audit base query joins users to retrieve first and last names
    query =
      'select audits.id, audits.created_on, audits.action, audits.subaction, audits.by_user_id, audits.of_user_id, audits.prop, audits.old_val, audits.new_val, users.firstName as by_user_firstname, users.lastname as by_user_lastname from audits join users on audits.by_user_id = users.id ';
  }

  // Strip filter white space
  if (opts.req.query.filter && opts.req.query.filter.indexOf(' ') > -1) {
    opts.req.query.filter = opts.req.query.filter.replace(/\s/g, '');
  }

  try {
    return await Audit.findAllByFilter({
      query,
      filter: opts.req.query.filter,
      limit: opts.req.query.limit,
      skip: opts.req.query.skip,
      sort: opts.req.query.sort,
      sortdir: opts.req.query.sortdir
    });
  } catch (e) {
    opts.res.code(400);
    return {
      type: 'audit-filter-error',
      msg: 'Invalid filter or other query param.'
    };
  }
}

module.exports = {
  getAudits
};
