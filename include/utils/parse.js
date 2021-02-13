const config = require(__dirname + '/config');

module.exports = {
  getIp: function getIp(req) {
    if (config.misc.cloudflareIP) {
      return req.headers['CF-Connecting-IP'] || req.ip;
    }
    return req.ip;
  }
};
