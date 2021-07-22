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

function validateAuditAction(action) {
  const actions = [
    'CREATE',
    'EDIT',
    'DELETE'
  ];

  let match = false;

  for (let i = 0; i < actions.length; i++) {
    if (action === actions[i]) {
      match = true;
    }
  }

  if (!match) {
    return {
      type: 'audit-action-error',
      msg: 'Must be a valid audit action'
    };
  } else {
    return true;
  }
}

function validateAuditSubaction(subaction) {
  const subactions = [
    'USER',
    'GROUP',
    'TOKEN',
    'USER_OAUTH2_TOKEN',
    'USER_RESET_PASSWORD',
    'USER_PROPERTY',
    'DEFAULT_GROUP',
    'GROUP_ADD_ROUTE',
    'GROUP_REMOVE_ROUTE',
    'USER_ADD_GROUP_INHERITANCE',
    'USER_REMOVE_GROUP_INHERITANCE',
    'IMPORT_GROUPS'
  ];

  let match = false;

  for (let i = 0; i < subactions.length; i++) {
    if (subaction === subactions[i]) {
      match = true;
    }
  }

  if (!match) {
    return {
      type: 'audit-subaction-error',
      msg: 'Must be a valid audit subaction'
    };
  } else {
    return true;
  }
}

module.exports = {
  createSingleAudit,
  splitAndCreateAudits,
  validateAuditAction,
  validateAuditSubaction
};
