const { resolve } = require('path');

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
  },
  getVersion: function () {
    var version = null;

    if (!version) {
      try {
        version = require(resolve(__dirname, '../../package.json')).version;
      } catch (error) {}
    }

    if (!version) {
      try {
        version = require(process.cwd() + '/package.json').version;
      } catch (error) {}
    }

    return version;
  },
  getLocalIP: function () {
    const { networkInterfaces } = require('os');

    return Object.values(networkInterfaces())
      .flat()
      .find((i) => i.family == 'IPv4' && !i.internal).address;
  }
};
