const Audit = require('../database/models/audit');
const config = require('./config');

function createAudit(opts) {
    switch (opts.action) {
        case 'Create':
            createAction(opts);
            break;
        case 'Edit':
            editAction(opts);
            break;
        case 'Delete':
            deleteAction(opts);
            break;
        case 'AddGroupInheritance':
            addRemoveGroupInheritance(opts);
            break;
        case 'RemoveGroupInheritance':
            addRemoveGroupInheritance(opts);
            break;
        default:
            config.log.logger.debug(`Unknown audit action: ${opts.action}`);
    }
}

async function createAction(opts) {
    const newAudit = createAuditObject(opts, prop = 'user', oldPropValue = opts.oldObj, newPropValue = opts.newObj);
    await Audit.create(newAudit);
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

async function addRemoveGroupInheritance(opts) {
    const newAudit = createAuditObject(opts, prop = 'inheritgroupid', oldPropValue = opts.oldObj, newPropValue = opts.newObj);
    await Audit.create(newAudit);
}

function createAuditObject(opts, prop, oldPropValue, newPropValue) {
    var audit = {};

    if (opts.action) { audit.action = opts.action }
    if (opts.byUser.id) { audit.by_user_id = opts.byUser.id }
    if (opts.byUser.email) { audit.by_user_email = opts.byUser.email }
    if (opts.byUser.username) { audit.by_user_username = opts.byUser.username }
    if (opts.ofUser.id) { audit.of_user_id = opts.ofUser.id }
    if (opts.ofUser.email) { audit.of_user_email = opts.ofUser.email }
    if (opts.ofUser.username) { audit.of_user_username = opts.ofUser.username }
    if (prop) { audit.prop = prop.toString() }
    if (oldPropValue) { audit.old_val = oldPropValue.toString() }
    if (newPropValue) { audit.new_val = newPropValue.toString() }

    return audit;
}

module.exports = {
    createAudit
}
