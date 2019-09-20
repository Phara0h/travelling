'use strict';

module.exports = {
    isEmpty: function isEmpty(obj) {
        var p;

        for (p in obj) {
            return false;
        }
        return true;
    },
    stringToBool: function stringToBool(bool) {
        if (typeof bool == 'boolean') {
            return bool;
        }
        if (bool == 'true') {
            return true;
        }
        if (bool == 'false') {
            return false;
        }
        return null;
    },
    isSetDefault: function isSetDefault(v, d) {
        if (typeof v == 'number') {
            return !Number.isNaN(v) ? v : d;
        }
        return v !== null && v !== undefined ? v : d;
    },
};
