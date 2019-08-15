'use strict';

var isSetDefault = function(v, d) {
    return v !== null && v !== undefined ? v : d;
};

module.exports = {
    port: isSetDefault(process.env.TRAVELLING_PORT, 443),
    key: process.env.TRAVELLING_KEY,
    cert: process.env.TRAVELLING_CERT,
    log: isSetDefault(process.env.TRAVELLING_LOGGER, console),
    cookie: {
        secret: isSetDefault(process.env.TRAVELLING_COOKIE_SECRET, null),
    },
    username: {
      minchar:isSetDefault(process.env.TRAVELLING_USERNAME_MINCHAR, 4),
    },
    password: {
        consecutive: isSetDefault(process.env.TRAVELLING_PASSWORD_CONSECUTIVE, true),
        minchar: isSetDefault(process.env.TRAVELLING_PASSWORD_MINCHAR, 1),
        maxchar: isSetDefault(process.env.TRAVELLING_PASSWORD_MAXCHAR, 100),
        special: isSetDefault(process.env.TRAVELLING_PASSWORD_SPECIAL, 0),
        number: isSetDefault(process.env.TRAVELLING_PASSWORD_NUMBER, 0),
        lowercase: isSetDefault(process.env.TRAVELLING_PASSWORD_LOWERCASE, 1),
        uppercase: isSetDefault(process.env.TRAVELLING_PASSWORD_UPPERCASE, 0),
    },
    login: {
        maxLoginAttempts: isSetDefault(process.env.TRAVELLING_LOGIN_MAX_LOGIN_ATTEMPTS, 10)
    },
    token: {
        secret: isSetDefault(process.env.TRAVELLING_TOKEN_SECRET, null),
        salt: isSetDefault(process.env.TRAVELLING_TOKEN_SALT, null),
        expiration: isSetDefault(process.env.TRAVELLING_TOKEN_EXPIRATION, 90), //days
    },
    pg: {
        url: isSetDefault(process.env.DATABASE_URL, null),
        crypto: {
            implementation: isSetDefault(process.env.TRAVELLING_PG_CRYPTO_IMPLEMENTATION, './include/utils/cryptointerface'),
            secret: isSetDefault(process.env.TRAVELLING_PG_CRYPTO_IMPLEMENTATION_SECRET, null),
            salt: isSetDefault(process.env.TRAVELLING_PG_CRYPTO_IMPLEMENTATION_SALT, null),
        },
    },
};
