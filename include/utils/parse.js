const config = require(__dirname + '/config');

module.exports = {
  getIp: function getIp(req) {
    if (config.misc.cloudflareIP) {
      return (
        req.headers['cf-connecting-ip'] || req.headers['CF-Connecting-IP'] || req.headers['CF-CONNECTING-IP'] || req.ip
      );
    }
    return req.ip;
  },
  getDomainFromHeaders: (headers) => {
    var domain = 'default';

    const domainHeaders = [config.misc.cloudflareDomainHeader, config.misc.domainCustomHeader, 'host', 'origin'];

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

    // Check against allowed domains
    if (config.misc.allowedDomains[0] !== '*') {
      const allowedDomains = config.misc.allowedDomains;
      var allowed = false;

      if (allowedDomains.length) {
        for (let i = 0; i < allowedDomains.length; i++) {
          if (domain === allowedDomains[i]) {
            allowed = true;
          }
        }
      }

      if (!allowed) {
        throw new Error(`'${domain}' domain not allowed.`);
      }
    }

    return domain;
  }
};
