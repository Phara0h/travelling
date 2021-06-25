// TODO: Create utils for adding audit logs
//
// function createAudit (opts)
// opts: {
//    action
//    by_user
//    of_user
//    old_obj
//    new_obj
// }
// Find users and pull remaining ids
//
// Split new / old changes into separate objs
//
// call insertAudit func
// } 
//
// function insertAudit (entry)
// inserts into db
// 

function createAudit(opts) {
    console.log('CREATE AUDIT...')
    console.log(opts) 

    for (i = 0; i < Object.keys(opts.newObj).length; i++) {
        const prop = Object.keys(opts.newObj)[i];
        const oldPropValue = opts.oldObj[prop];
        const newPropValue = opts.newObj[prop];

        if (newPropValue !== oldPropValue) {
            insertAudit({
                action: opts.action,
                by_user_id: opts.byUser.id,
                by_user_email: opts.byUser.email,
                by_user_username: opts.byUser.username,
                of_user_id: opts.ofUser.id,
                of_user_email: opts.ofUser.email,
                of_user_username: opts.ofUser.username,
                prop: prop,
                old_val: oldPropValue,
                new_val: newPropValue,
            });
        }
    }
}

function insertAudit(fields) {
    // Make query to insert audit
    console.log('INSERTING INTO DB...');
    console.log(fields);
}


module.exports = {
    createAudit
}