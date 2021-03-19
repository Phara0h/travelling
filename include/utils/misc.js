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
      return !isNaN(v) ? v : d;
    }
    return v !== null && v !== undefined ? v : d;
  },
  stringToNativeType: function stringToNativeType(s) {
    if (s == 'true') {
      return true;
    }
    if (s == 'false') {
      return false;
    }
    if (s == 'null') {
      return null;
    }
    if (s == 'undefined') {
      return undefined;
    }
    if (!isNaN(s)) {
      return Number(s);
    }
    return s;
  },
  toLower: function toLower(s) {
    return typeof s == 'string' ? s.toLowerCase() : s;
  }
};
