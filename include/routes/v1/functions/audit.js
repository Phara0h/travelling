const Audit = require('../../../database/models/audit');

async function getAuditsByUserID(opts) {
    const id = opts.req.params.id;
    
    if (!id) {
        opts.res.code(400);
        return {
            type: 'missing-param-error',
            msg: 'Please provide required parameter(s).'
        };
    }

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
            sortdir: opts.req.query.sortdir,
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
    getAuditsByUserID
}
