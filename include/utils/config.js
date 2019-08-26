'use strict';

var isSetDefault = function(v, d) {
    if(typeof v == 'number') {
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
      requests: isSetDefault(process.env.TRAVELLING_LOG_REQUESTS == 'true', true),
      unauthorizedAccess: isSetDefault(process.env.TRAVELLING_LOG_UNAUTHORIZED_ACCESS == 'true', true)
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
        expiration: isSetDefault(Number(process.env.TRAVELLING_COOKIE_EXPIRATION), 10) //seconds
    },
    username: {
      minchar:isSetDefault(Number(process.env.TRAVELLING_USERNAME_MINCHAR), 3),
    },
    password: {
        consecutive: isSetDefault(process.env.TRAVELLING_PASSWORD_CONSECUTIVE == 'true', true),
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
            salt: isSetDefault(process.env.TRAVELLING_PG_CRYPTO_IMPLEMENTATION_SALT, null),
            encryptUserData: isSetDefault(process.env.TRAVELLING_PG_CRYPTO_ENCRYPT_USER_DATA == 'true', false)
        },
    },
    email: {
      from: isSetDefault(process.env.TRAVELLING_EMAIL_FROM, null),
      recovery : {
        expiration: isSetDefault(Number(process.env.TRAVELLING_EMAIL_RECOVERY_EXPIRATION), 900) //seconds
      },
      activation: {
          expiration: isSetDefault(Number(process.env.TRAVELLING_EMAIL_ACTIVATION_EXPIRATION), 86400) //seconds
      },
      template: {
        passwordResetBody:isSetDefault(process.env.TRAVELLING_EMAIL_RESET_PASSWORD_TEMPLATE_BODY, './templates/email-reset-password-body.html'),
        passwordResetSubject: isSetDefault(process.env.TRAVELLING_EMAIL_RESET_PASSWOR_TEMPLATE_SUBJECT, './templates/email-reset-password-subject.html'),
        activationBody:isSetDefault(process.env.TRAVELLING_EMAIL_ACTIVATION_TEMPLATE_BODY, './templates/email-activation-body.html'),
        activationSubject: isSetDefault(process.env.TRAVELLING_EMAIL_ACTIVATION_TEMPLATE_SUBJECT, './templates/email-activation-subject.html')
      },
      test: {
        enable: isSetDefault(process.env.TRAVELLING_EMAIL_TEST_ENABLE == 'true', false)
      },
      smtp: {
        enable: isSetDefault(process.env.TRAVELLING_EMAIL_SMTP_ENABLE == 'true', false),
        host: isSetDefault(process.env.TRAVELLING_EMAIL_SMTP_HOST, "127.0.0.1"),
        port: isSetDefault(process.env.TRAVELLING_EMAIL_SMTP_PORT, 465),
        secure: isSetDefault(process.env.TRAVELLING_EMAIL_SMTP_SECURE == 'true', true), // use TLS
        auth: {
           user: isSetDefault(process.env.TRAVELLING_EMAIL_SMTP_AUTH_USER, null),
           pass: isSetDefault(process.env.TRAVELLING_EMAIL_SMTP_AUTH_PASSWORD, null),
        },
        tls: {
           // do not fail on invalid certs
           rejectUnauthorized: isSetDefault(process.env.TRAVELLING_EMAIL_SMTP_TLS_REJECT_UNAUTHORIZED, false),
        }
      },
      aws : {
        enable: isSetDefault(process.env.TRAVELLING_EMAIL_AWS_ENABLE  == 'true', false),
        config: isSetDefault(process.env.TRAVELLING_EMAIL_AWS_CONFIG, null),
      }
    },
    registration: {
      requireEmailActivation: isSetDefault(process.env.TRAVELLING_REGISTRATION_REQUIRE_EMAIL_ACTIVATION  == 'true', false),
      requireManualActivation: isSetDefault(process.env.TRAVELLING_REGISTRATION_REQUIRE_MANUAL_ACTIVATION  == 'true', false)
    }
};

module.exports = config;
