const config = require('./config');
const parse = require('./parse');
const crypto = require('crypto');
const encryptKey = crypto.scryptSync(config.cookie.token.secret, config.cookie.token.salt, 32);

const User = require('../database/models/user');
const helpers = require('../server/tracing/helpers')();
class CookieToken {
  constructor() {}

  static async checkToken(req, res, router, oldspan) {
    var span;

    if (oldspan) {
      span = req.startSpan('checkToken', oldspan);
    }

    try {
      var tok = req.cookies['trav:tok'];

      if (!tok) {
        if (span) {
          span.updateName('checkToken [invalid tok]');
          span.end();
        }

        return false;
      }

      var ip = parse.getIp(req);

      //console.log(tok, tok.toString('ascii'), tok.toString('base64'));
      var dToken = await this.decrypt(tok.toString('ascii'));
      var cred = dToken.split('|');

      //console.log(cred, cred[4], ip);
      if (config.cookie.security.ipHijackProtection && cred[4] != ip) {
        if (span) {
          span.updateName('checkToken [ipHijackProtection]');
          config.log.logger.warn(
            helpers.text(`IP Hijack Detected": (${cred[0]}, ${cred[1]}) ${cred[4]} =/= ${ip}`, span)
          );
          span.end();
        }

        return false;
      }

      if (Date.now() - Number(cred[3]) < config.cookie.token.expiration * 86400000) {
        // 90 days in millis

        var user = await User.findAllBy({ domain: cred[0], id: cred[1], password: cred[2] });

        if (!user || user.length < 1) {
          if (span) {
            span.updateName('checkToken [no user]');
            span.end();
          }

          /* Ending the span. */
          return false;
        } else {
          if (user.length > 1) {
            config.log.logger.warn(
              helpers.text(`Multiple users returned back for ${cred[1]} when there should only be one!`, span)
            );
          }

          if (span) {
            span.updateName('checkToken [valid]');
            span.end();
          }

          return user[0];
        }
      } else {
        this.removeAuthCookie(res, span);
        if (span) {
          span.updateName('checkToken [invalid]');
          span.end();
        }

        return false;
      }
    } catch (e) {
      this.removeAuthCookie(res, span);
      if (span) {
        span.updateName('checkToken [invalid]');
        span.recordException(e);
        span.end();
      }

      config.log.logger.debug(e);
      return false;
    }
  }

  static setAuthCookie(tok, res, date) {
    const expires = new Date(date.getTime() + config.cookie.token.expiration * 86400000);

    res.setCookie('trav:tok', tok, {
      expires,
      secure: config.https,
      httpOnly: true,
      domain: config.cookie.domain,
      path: '/'
    });

    if (config.cookie.token.checkable === true) {
      // Also send accessible cookie with token expiration
      res.setCookie('trav:ls', 1, {
        expires,
        secure: config.https,
        httpOnly: false, // This should be the only cookie set to false
        domain: config.cookie.domain,
        path: '/'
      });
    }

    return res;
  }

  static removeAuthCookie(res, oldspan) {
    var span;

    if (oldspan && helpers) {
      span = helpers.startSpan('removeAuthCookie', oldspan);
    }

    const expires = Date.now();
    res.setCookie('trav:tok', null, {
      expires,
      secure: config.https,
      httpOnly: true,
      domain: config.cookie.domain,
      path: '/'
    });

    if (config.cookie.token.checkable === true) {
      res.setCookie('trav:ls', null, {
        expires,
        secure: config.https,
        httpOnly: false,
        domain: config.cookie.domain,
        path: '/'
      });
    }

    res.setCookie('trav:ssid', null, {
      expires,
      httpOnly: true,
      secure: config.https,
      domain: config.cookie.domain,
      path: '/'
    });

    if (span) {
      span.end();
    }

    return res;
  }

  // password are the hashed password only!
  static async getToken(domain, id, password, ip, date) {
    return await this.encrypt(
      `${domain}|${id}|${password}|${date}|${config.cookie.security.ipHijackProtection ? ip : ''}`
    );
  }

  // password are the hashed password only!
  static async newTokenInCookie(domain, id, password, ip, res) {
    var date = Date.now();
    var tok = await this.getToken(domain, id, password, ip, date);

    this.setAuthCookie(tok, res, new Date(date));
  }

  static encrypt(text, setEncryptKey) {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, opIV) => {
        if (err) {
          reject(err);
        }

        var cipher = crypto.createCipheriv('aes-256-cbc', setEncryptKey || encryptKey, opIV);

        var encrypted = '';

        cipher.on('readable', () => {
          let chunk;

          while (null !== (chunk = cipher.read())) {
            encrypted += chunk.toString('base64');
          }
        });

        cipher.on('end', () => {
          //  console.log(text, encrypted + '|' + opIV.toString('base64'));
          resolve(encrypted + '|' + opIV.toString('base64'));
        });

        cipher.write(text);
        cipher.end();
      });
    });
  }

  static decrypt(text, setEncryptKey) {
    return new Promise((resolve, reject) => {
      var decrypted = '';

      try {
        text = text.split('|');

        const decipher = crypto.createDecipheriv(
          'aes-256-cbc',
          setEncryptKey || encryptKey,
          Buffer.alloc(16, text[1], 'base64')
        );

        decrypted = decipher.update(text[0], 'base64', 'ascii');
        decrypted += decipher.final('ascii');

        resolve(decrypted);
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = CookieToken;
