const config = require(__dirname + '/config');

module.exports = {
  getIp: function getIp(req) {
    if (config.misc.cloudflareIP) {
      return req.headers['cf-connecting-ip'] || req.headers['CF-Connecting-IP'] || req.headers['CF-CONNECTING-IP'] || req.ip;
    }
    return req.ip;
  }
};
