const Audit = require('../database/models/audit');

/**
 * Create audit that has just one change (e.g. CREATE user)
 */
async function createSingleAudit(opts, prop) {
  const newAudit = createAuditObject(opts, prop, opts.oldObj, opts.newObj);
  await Audit.create(newAudit);
}

/**z
 * Split and create multiple audits (e.g. EDIT
 * multiple properties of a user, each modified
 * property will be added to the audit separately.
 */
async function splitAndCreateAudits(opts) {
  const keys = Object.keys(opts.newObj);
  const keysLength = keys.length;

  for (i = 0; i < keysLength; i++) {
    const prop = keys[i];
    const oldPropValue = opts.oldObj[prop];
    const newPropValue = opts.newObj[prop];

    if (newPropValue !== oldPropValue) {
      const newAudit = createAuditObject(opts, prop, oldPropValue, newPropValue);

      // Ignore models and changedProps
      if (newAudit.prop !== 'models' && newAudit.prop !== 'changedProps') {
        await Audit.create(newAudit);
      }
    }
  }
}

function createAuditObject(opts, prop, oldPropValue, newPropValue) {
  var audit = {};

  if (opts.action) {
    audit.action = opts.action;
  }
  if (opts.subaction) {
    audit.subaction = opts.subaction;
  }
  if (opts.byUserId) {
    audit.by_user_id = opts.byUserId;
  }
  if (opts.ofUserId) {
    audit.of_user_id = opts.ofUserId;
  }
  if (prop) {
    audit.prop = prop.toString();
  }
  if (oldPropValue) {
    try {
      audit.old_val = JSON.stringify(oldPropValue);
    } catch {
      audit.old_val = oldPropValue.toString();
    }
  }
  if (newPropValue) {
    try {
      audit.new_val = JSON.stringify(newPropValue);
    } catch {
      audit.new_val = newPropValue.toString();
    }
  }

  return audit;
}

module.exports = {
  createSingleAudit,
  splitAndCreateAudits
};
