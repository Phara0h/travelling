'use strict';

var isSetDefault = function(v, d) {


    if(typeof v == 'number')
    {
      return (!Number.isNaN(v)) ? v : d;
    }
    return (v !== null && v !== undefined) ? v : d;
};

const config = {
    port: isSetDefault(Number(process.env.TRAVELLING_PORT), 443),
    key: process.env.TRAVELLING_KEY,
    cert: process.env.TRAVELLING_CERT,
    log: {
      logger:require(isSetDefault(process.env.TRAVELLING_LOG_LOGGER, 'console')),
      requests: isSetDefault(Boolean(process.env.TRAVELLING_LOG_REQUESTS), true),
      unauthorizedAccess: isSetDefault(Boolean(process.env.TRAVELLING_LOG_UNAUTHORIZED_ACCESS), true)
    },
    portal: {
      path: isSetDefault(process.env.TRAVELLING_PORTAL_PATH, '/travelling/portal/'),
      host: isSetDefault(process.env.TRAVELLING_PORTAL_HOST, null),
      filePath: isSetDefault(process.env.TRAVELLING_PORTAL_FILE_PATH, './client'),
    },
    proxy: {
      timeout: isSetDefault(Number(process.env.TRAVELLING_PROXY_TIMEOUT), 0)
    },
    cookie: {
        secret: isSetDefault(process.env.TRAVELLING_COOKIE_SECRET, null),
    },
    username: {
      minchar:isSetDefault(Number(process.env.TRAVELLING_USERNAME_MINCHAR), 3),
    },
    password: {
        consecutive: isSetDefault(Boolean(process.env.TRAVELLING_PASSWORD_CONSECUTIVE), true),
        minchar: isSetDefault(Number(process.env.TRAVELLING_PASSWORD_MINCHAR), 1),
        maxchar: isSetDefault(Number(process.env.TRAVELLING_PASSWORD_MAXCHAR), 100),
        special: isSetDefault(Number(process.env.TRAVELLING_PASSWORD_SPECIAL), 0),
        number: isSetDefault(Number(process.env.TRAVELLING_PASSWORD_NUMBER), 0),
        lowercase: isSetDefault(Number(process.env.TRAVELLING_PASSWORD_LOWERCASE), 1),
        uppercase: isSetDefault(Number(process.env.TRAVELLING_PASSWORD_UPPERCASE), 0)
    },
    login: {
        maxLoginAttempts: isSetDefault(Number(process.env.TRAVELLING_LOGIN_MAX_LOGIN_ATTEMPTS), 10)
    },
    token: {
        secret: isSetDefault(process.env.TRAVELLING_TOKEN_SECRET, null),
        salt: isSetDefault(process.env.TRAVELLING_TOKEN_SALT, null),
        expiration: isSetDefault(Number(process.env.TRAVELLING_TOKEN_EXPIRATION), 90) //days
    },
    pg: {
        url: isSetDefault(process.env.DATABASE_URL, null),
        crypto: {
            implementation: isSetDefault(process.env.TRAVELLING_PG_CRYPTO_IMPLEMENTATION, './include/utils/cryptointerface'),
            secret: isSetDefault(process.env.TRAVELLING_PG_CRYPTO_IMPLEMENTATION_SECRET, null),
            salt: isSetDefault(process.env.TRAVELLING_PG_CRYPTO_IMPLEMENTATION_SALT, null)
        },
    },
};

module.exports = config;
