const Audit = require('../../../database/models/audit');

async function getAudits(opts) {
  var query = null;
  var additionalFilter = null;

  if (opts.req.query.resolve) {
    // Audit base query joins users to retrieve first and last names
    query =
      'select audits.id, audits.created_on, audits.action, audits.subaction, audits.by_user_id, audits.of_user_id, audits.prop, audits.old_val, audits.new_val, users1.firstName as by_user_firstname, users1.lastname as by_user_lastname, users1.domain as by_user_domain, users2.firstName as of_user_firstname, users2.lastname as of_user_lastname, users2.domain as of_user_domain from audits join users as users1 on users1.id = audits.by_user_id join users as users2 on users2.id = audits.of_user_id ';
  }

  // Strip filter white space
  if (opts.req.query.filter && opts.req.query.filter.indexOf(' ') > -1) {
    opts.req.query.filter = opts.req.query.filter.replace(/\s/g, '');
  }

  // Add self exclude filter
  if (opts.req.query.selfexclusion === true || opts.req.query.selfexclusion === 'true') {
    additionalFilter = 'NOT audits.of_user_id = audits.by_user_id';
  }

  try {
    return await Audit.findAllByFilter({
      query,
      filter: opts.req.query.filter,
      additionalFilter,
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
