const Audit = require('../../../database/models/audit');

async function getAudits(opts) {
  // Strip filter white space
  if (opts.req.query.filter && opts.req.query.filter.indexOf(' ') > -1) {
    opts.req.query.filter = opts.req.query.filter.replace(/\s/g, '');
  }

  try {
    return await Audit.findAllByFilter({
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
