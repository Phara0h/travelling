const config = require(__dirname + '/config');

module.exports = {
  getIp: function getIp(req) {
    var ip = null;
    if (config.misc.cloudflareIP) {
      ip = req.headers['cf-connecting-ip'] || req.headers['CF-Connecting-IP'] || req.headers['CF-CONNECTING-IP'];
    }
    if(!ip) {
      ip = req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For'] || req.headers['x-forwarded-host'] || req.headers['X-Forwarded-Host'] || req.ip;
    }

    return ip;
  },
  getDomainFromHeaders: (headers) => {
    var domain = 'default';

    const domainHeaders = [config.misc.domainCustomHeader, config.misc.cloudflareDomainHeader, 'host', 'origin'];

    // Check headers for domain
    for (let i = 0; i < domainHeaders.length; i++) {
      if (domainHeaders[i] && headers[domainHeaders[i]]) {
        const url = headers[domainHeaders[i]];

        if (url && url.indexOf('://') > -1) {
          domain = url.split('://')[1];
        } else {
          domain = url;
        }

        break;
      }
    }

    return domain;
  }
};
