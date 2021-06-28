const Audit = require('../database/models/audit');
const config = require('./config');

function createAudit(opts) {
    switch (opts.action) {
        case 'Edit':
            editAction(opts);
            break;
        case 'Delete':
            deleteAction(opts);
            break;
        default:
            config.log.logger.debug(`Unknown audit action: ${opts.action}`);
    }
}

async function editAction(opts) {
    for (i = 0; i < Object.keys(opts.newObj).length; i++) {
        const prop = Object.keys(opts.newObj)[i];
        const oldPropValue = opts.oldObj[prop];
        const newPropValue = opts.newObj[prop];

        if (newPropValue !== oldPropValue) {
            const newAudit = createAuditObject(opts, prop, oldPropValue, newPropValue);
            await Audit.create(newAudit);
        }
    }
}

async function deleteAction(opts) {
    const newAudit = createAuditObject(opts);
    await Audit.create(newAudit);
}

function createAuditObject(opts, prop, oldPropValue, newPropValue) {
    return {
        action: opts.action,
        by_user_id: opts.byUser.id,
        by_user_email: opts.byUser.email,
        by_user_username: opts.byUser.username,
        of_user_id: opts.ofUser.id,
        of_user_email: opts.ofUser.email,
        of_user_username: opts.ofUser.username,
        prop: prop,
        old_val: oldPropValue,
        new_val: newPropValue
    }
}

module.exports = {
    createAudit
}
