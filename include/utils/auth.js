const CookieToken = require('./cookietoken');
const TokenHandler = require('../token');
const config = require('./config');
const parse = require('./parse');
const helpers = require('../server/tracing/helpers')();
var logout = (req, res, oldspan) => {
  var span;

  if (oldspan) {
    span = req.startSpan('logout', oldspan);
  }

  req.sessionStore.destroy(req.session.sessionId);
  CookieToken.removeAuthCookie(res, span);
  res.setCookie('trav:ssid', null, {
    expires: Date.now(),
    httpOnly: true,
    secure: config.https,
    domain: config.cookie.domain,
    path: '/'
  });
  req.isAuthenticated = false;
  if (span) {
    span.end();
  }
};

var checkAuthHeader = async (req, res, router, oldspan) => {
  var span;

  if (oldspan) {
    // console.log(oldspan);
    span = req.startSpan('checkAuthHeader', oldspan);
  }

  if (req.headers.authorization) {
    var splitAuth = req.headers.authorization.split(' ');

    if (splitAuth.length < 2) {
      if (span) {
        span.end();
      }

      return false;
    }

    splitAuth[0] = splitAuth[0].toLowerCase();

    if (splitAuth[0] == 'basic') {
      if (span) {
        span.updateName('checkAuthHeader [basic not bearer]');
        span.end();
      }

      return { auth: false, route: true };
    }

    if (splitAuth[0] != 'bearer') {
      if (span) {
        span.updateName('checkAuthHeader [not bearer]');
        span.end();
      }

      return false;
    }

    // Maybe optomize this with sessions?
    var user = await TokenHandler.checkAccessToken(splitAuth[1], span);

    if (!user) {
      if (span) {
        span.updateName('checkAuthHeader [invalid]');
        span.end();
      }

      return { auth: false, route: false, invalidToken: true };
    }

    var groups = await user.resolveGroup(span);

    req.session = { data: { user, groups } };
    if (span) {
      span.updateName('checkAuthHeader [valid]');
      span.end();
    }

    return { auth: true, route: true };
  }

  if (span) {
    span.updateName('checkAuthHeader [no header found]');
    span.end();
  }

  return false;
};

var checkSession = (req, res, router, oldspan) => {
  var span;

  if (oldspan) {
    span = req.startSpan('checkSession', oldspan);
  }

  if (req.session && req.session.data && req.session.data.user) {
    if (req.session.data.user.locked) {
      if (span) {
        span.updateName('checkSession [user locked]');
        span.end();
      }

      return { auth: false, route: true };
    }

    if (span) {
      span.updateName('checkSession [valid]');
      span.end();
    }

    return { auth: true, route: true };
  }

  if (span) {
    span.updateName('checkSession [invalid]');
    span.end();
  }

  return false;
};

var checkCookie = async (req, res, router, oldspan) => {
  var span;

  if (oldspan) {
    span = req.startSpan('checkCookie', oldspan);
  }

  if (req.cookies['trav:tok']) {
    try {
      var user = await CookieToken.checkToken(req, res, router, span);

      if (!user || user.locked) {
        if (span) {
          span.updateName('checkCookie [user locked]');
          span.end();
        }

        return { auth: false, route: true };
      }

      const groupsData = await user.resolveGroup(span);

      req.createSession(user.id, { user, groupsData });

      config.log.logger.info(
        helpers.text(
          `User Token Session Refreshed: ${user.username ? user.username : user.email} (${groupsData.names}) | ${parse.getIp(
            req
          )}`,
          span
        )
      );

      if (span) {
        span.updateName('checkCookie [valid]');
        span.end();
      }

      return { auth: true, route: true };
    } catch (e) {
      config.log.logger.debug(e);
      if (span) {
        span.updateName('checkCookie [invalid]');
        span.recordException(e);
        span.end();
      }

      return { auth: false, route: true };
    }
  }

  if (span) {
    span.end();
  }

  return false;
};

var checkLoggedIn = async (req, res, router, oldspan) => {
  var span;

  if (oldspan) {
    //console.log(oldspan.context());
    span = req.startSpan('checkLoggedIn', oldspan);
  }

  var authHeader = await checkAuthHeader(req, res, router, span);

  if (authHeader) {
    if (span) {
      span.end();
    }

    return authHeader;
  }

  var session = checkSession(req, res, router, span);

  if (session) {
    if (span) {
      span.end();
    }

    return session;
  }

  var cookie = await checkCookie(req, res, router, span);

  if (cookie) {
    if (span) {
      span.end();
    }

    return cookie;
  }

  if (span) {
    span.end();
  }

  return { auth: false, route: true };
};

/**
 * Generate a random character with 1 Uppercase, 1 lowercase,
 * 1 special character, and no consecutive characters.
 * @param {Object} passwordLength Length of password
 * @returns
 */
function generateRandomPassword(passwordLength = 20, retryCount = 0, oldspan) {
  const span = helpers.startSpan('utils.auth.generateRandomPassword()', oldspan);

  config.log.logger.debug(helpers.text(`utils.auth.generateRandomPassword(${passwordLength})`, span));

  try {
    const lowercase = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'x',
      'y',
      'z'
    ];
    const uppercase = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'X',
      'Y',
      'Z'
    ];
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const specialCharacters = ['@', '#', '$', '%', '^', '&', '*', '!', '?', '-', '_', '.'];
    var types = [lowercase, uppercase, numbers, specialCharacters];
    var result = '';

    // Generate uppercase, number, and special characters
    for (var i = 0; i < config.password.uppercase; i++) {
      result += uppercase.splice(Math.floor(Math.random() * uppercase.length), 1);
    }

    for (var i = 0; i < config.password.lowercase; i++) {
      result += lowercase.splice(Math.floor(Math.random() * lowercase.length), 1);
    }

    for (var i = 0; i < config.password.number; i++) {
      result += numbers.splice(Math.floor(Math.random() * numbers.length), 1);
    }

    for (var i = 0; i < config.password.special; i++) {
      result += specialCharacters.splice(Math.floor(Math.random() * specialCharacters.length), 1);
    }

    var max = config.password.maxchar === '' ? config.password.randomGenerationLength : config.password.maxchar;
    // Fill in rest with random chars until length is full

    while (max > result.length) {
      var type = types[Math.floor(Math.random() * types.length)];

      result += type.splice(Math.floor(Math.random() * type.length), 1);
    }

    span.end();
    return result;
  } catch (e) {
    if (retryCount < 3) {
      config.log.logger.debug('Retrying password generation.');

      this.generateRandomPassword(passwordLength, retryCount + 1, span);
    } else {
      config.log.logger.error(e);
      throw new Error('Failed to generate password.');
    }
  }
}

module.exports = {
  generateRandomPassword,
  checkLoggedIn,
  logout
};
