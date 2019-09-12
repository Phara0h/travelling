'use strict';

var isSetDefault = function(v, d) {
    if(typeof v == 'number') {
      return (!Number.isNaN(v)) ? v : d;
    }
    return (v !== null && v !== undefined) ? v : d;
};

var stringToBool = function(bool) {
  if(bool == 'true' ) {
    return true;
  }
  if(bool == 'false') {
    return false
  }
  return null;
}

const config = {
    port: isSetDefault(Number(process.env.TRAVELLING_PORT), 443),
    key: process.env.TRAVELLING_KEY,
    cert: process.env.TRAVELLING_CERT,
    cors: {
      enable: isSetDefault(stringToBool(process.env.TRAVELLING_CORS_ENABLE), false),
      origin: isSetDefault(process.env.TRAVELLING_CORS_HEADER_ORIGIN, null),
      methods: isSetDefault(process.env.TRAVELLING_CORS_HEADER_METHODS, null),
      headers: isSetDefault(process.env.TRAVELLING_CORS_HEADER_HEADERS, null),
      age: isSetDefault(Number(process.env.TRAVELLING_CORS_HEADER_MAX_AGE), 3600)
    },
    https: isSetDefault(stringToBool(process.env.TRAVELLING_HTTPS), true),
    log: {
      enable: isSetDefault(stringToBool(process.env.TRAVELLING_LOG_ENABLE), true),
      colors: isSetDefault(stringToBool(process.env.TRAVELLING_LOG_COLORS), true),
      fastifyLogger: isSetDefault(stringToBool(process.env.TRAVELLING_LOG_FASTIFY_LOGGER), true),
      logger: isSetDefault(process.env.TRAVELLING_LOG_LOGGER, __dirname+'/logger.js'),
      requests: isSetDefault(stringToBool(process.env.TRAVELLING_LOG_REQUESTS), true),
      unauthorizedAccess: isSetDefault(stringToBool(process.env.TRAVELLING_LOG_UNAUTHORIZED_ACCESS), true)
    },
    portal: {
      enable: isSetDefault(stringToBool(process.env.TRAVELLING_PORTAL_ENABLE), true),
      path: isSetDefault(process.env.TRAVELLING_PORTAL_PATH, '/travelling/portal/'),
      host: isSetDefault(process.env.TRAVELLING_PORTAL_HOST, null),
      filePath: isSetDefault(process.env.TRAVELLING_PORTAL_FILE_PATH, __dirname+'/../../client'),
    },
    proxy: {
      timeout: isSetDefault(Number(process.env.TRAVELLING_PROXY_TIMEOUT), 0)
    },
    cookie: {
      session: {
          secret: isSetDefault(process.env.TRAVELLING_COOKIE_SESSION_SECRET, null),
          expiration: isSetDefault(Number(process.env.TRAVELLING_COOKIE_SESSION_EXPIRATION), 10) //seconds
      },
      token: {
          secret: isSetDefault(process.env.TRAVELLING_COOKIE_TOKEN_SECRET, null),
          salt: isSetDefault(process.env.TRAVELLING_COOKIE_TOKEN_SALT, null),
          expiration: isSetDefault(Number(process.env.TRAVELLING_COOKIE_TOKEN_EXPIRATION), 90) //days
      }
    },
    username: {
      minchar:isSetDefault(Number(process.env.TRAVELLING_USERNAME_MINCHAR), 4),
    },
    password: {
        consecutive: isSetDefault(stringToBool(process.env.TRAVELLING_PASSWORD_CONSECUTIVE), false),
        minchar: isSetDefault(Number(process.env.TRAVELLING_PASSWORD_MINCHAR), 8),
        maxchar: isSetDefault(Number(process.env.TRAVELLING_PASSWORD_MAXCHAR), ''),
        special: isSetDefault(Number(process.env.TRAVELLING_PASSWORD_SPECIAL), 1),
        number: isSetDefault(Number(process.env.TRAVELLING_PASSWORD_NUMBER), 1),
        lowercase: isSetDefault(Number(process.env.TRAVELLING_PASSWORD_LOWERCASE), 1),
        uppercase: isSetDefault(Number(process.env.TRAVELLING_PASSWORD_UPPERCASE), 1)
    },
    login: {
        maxLoginAttempts: isSetDefault(Number(process.env.TRAVELLING_LOGIN_MAX_LOGIN_ATTEMPTS), 10)
    },
    token: {
      access: {
          expiration: isSetDefault(Number(process.env.TRAVELLING_TOKEN_ACCESS_EXPIRATION), 1440) //minutes
      }
    },
    pg: {
        url: isSetDefault(process.env.DATABASE_URL, null),
        crypto: {
            implementation: isSetDefault(process.env.TRAVELLING_PG_CRYPTO_IMPLEMENTATION, __dirname+'/cryptointerface.js'),
            secret: isSetDefault(process.env.TRAVELLING_PG_CRYPTO_IMPLEMENTATION_SECRET, null),
            salt: isSetDefault(process.env.TRAVELLING_PG_CRYPTO_IMPLEMENTATION_SALT, null),
            encryptUserData: isSetDefault(stringToBool(process.env.TRAVELLING_PG_CRYPTO_ENCRYPT_USER_DATA), false)
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
        enable: isSetDefault(stringToBool(process.env.TRAVELLING_EMAIL_TEST_ENABLE), false)
      },
      smtp: {
        enable: isSetDefault(stringToBool(process.env.TRAVELLING_EMAIL_SMTP_ENABLE), false),
        host: isSetDefault(process.env.TRAVELLING_EMAIL_SMTP_HOST, "127.0.0.1"),
        port: isSetDefault(process.env.TRAVELLING_EMAIL_SMTP_PORT, 465),
        secure: isSetDefault(stringToBool(process.env.TRAVELLING_EMAIL_SMTP_SECURE), true), // use TLS
        auth: {
           user: isSetDefault(process.env.TRAVELLING_EMAIL_SMTP_AUTH_USER, null),
           pass: isSetDefault(process.env.TRAVELLING_EMAIL_SMTP_AUTH_PASSWORD, null),
        },
        tls: {
           // do not fail on invalid certs
           rejectUnauthorized: isSetDefault(stringToBool(process.env.TRAVELLING_EMAIL_SMTP_TLS_REJECT_UNAUTHORIZED), false),
        }
      },
      aws : {
        enable: isSetDefault(stringToBool(process.env.TRAVELLING_EMAIL_AWS_ENABLE ), false),
        config: isSetDefault(process.env.TRAVELLING_EMAIL_AWS_CONFIG, null),
      }
    },
    registration: {
      requireEmailActivation: isSetDefault(stringToBool(process.env.TRAVELLING_REGISTRATION_REQUIRE_EMAIL_ACTIVATION ), false),
      requireManualActivation: isSetDefault(stringToBool(process.env.TRAVELLING_REGISTRATION_REQUIRE_MANUAL_ACTIVATION ), false)
    }
};

module.exports = config;
