'use strict';
const misc = require('./misc');

const config = {
    port: misc.isSetDefault(Number(process.env.TRAVELLING_PORT), 443),
    ip: misc.isSetDefault(process.env.TRAVELLING_IP, '0.0.0.0'),
    key: misc.isSetDefault(process.env.TRAVELLING_KEY, __dirname + '/localhost.key'),
    cert: misc.isSetDefault(process.env.TRAVELLING_CERT, __dirname + '/localhost.csr'),
    cors: {
        enable: misc.isSetDefault(process.env.TRAVELLING_CORS_ENABLE, false),
        origin: misc.isSetDefault(process.env.TRAVELLING_CORS_HEADER_ORIGIN, null),
        methods: misc.isSetDefault(process.env.TRAVELLING_CORS_HEADER_METHODS, null),
        headers: misc.isSetDefault(process.env.TRAVELLING_CORS_HEADER_HEADERS, null),
        credentials: misc.isSetDefault(misc.stringToBool(process.env.TRAVELLING_CORS_HEADER_CREDENTIALS), true),
        age: misc.isSetDefault(Number(process.env.TRAVELLING_CORS_HEADER_MAX_AGE), 3600),
    },
    https: misc.isSetDefault(misc.stringToBool(process.env.TRAVELLING_HTTPS), true),
    log: {
        enable: misc.isSetDefault(misc.stringToBool(process.env.TRAVELLING_LOG_ENABLE), true),
        colors: misc.isSetDefault(misc.stringToBool(process.env.TRAVELLING_LOG_COLORS), true),
        level: misc.isSetDefault(process.env.TRAVELLING_LOG_LEVEL, 'info'),
        logger: misc.isSetDefault(process.env.TRAVELLING_LOG_LOGGER, __dirname + '/logger.js'),
        requests: misc.isSetDefault(misc.stringToBool(process.env.TRAVELLING_LOG_REQUESTS), true),
        unauthorizedAccess: misc.isSetDefault(misc.stringToBool(process.env.TRAVELLING_LOG_UNAUTHORIZED_ACCESS), true),
        fastify: {
            logger: misc.isSetDefault(process.env.TRAVELLING_LOG_FASTIFY_LOGGER, false),
            requestLogging: misc.isSetDefault(misc.stringToBool(process.env.TRAVELLING_LOG_FASTIFY_LOGGER_REQUEST), true),
            requestIdHeader: misc.isSetDefault(process.env.TRAVELLING_LOG_FASTIFY_LOGGER_REQ_ID_HEADER, 'travelling-req-id'),
            requestIdLogLabel: misc.isSetDefault(process.env.TRAVELLING_LOG_FASTIFY_LOGGER_REQ_ID_LOG_LABEL, 'travellingReqID'),
        },
    },
    portal: {
        enable: misc.isSetDefault(misc.stringToBool(process.env.TRAVELLING_PORTAL_ENABLE), true),
        path: misc.isSetDefault(process.env.TRAVELLING_PORTAL_PATH, '/travelling/portal/'),
        host: misc.isSetDefault(process.env.TRAVELLING_PORTAL_HOST, null),
        filePath: misc.isSetDefault(process.env.TRAVELLING_PORTAL_FILE_PATH, __dirname + '/../../client/dist'),
        logo: misc.isSetDefault(process.env.TRAVELLING_PORTAL_LOGO, __dirname + '/../../client/assets/logo.svg'),
        styles: misc.isSetDefault(process.env.TRAVELLING_PORTAL_STYLES, __dirname + '/../../client/assets/styles.css'),
        icon: misc.isSetDefault(process.env.TRAVELLING_PORTAL_ICON, __dirname + '/../../client/assets/favicon.ico'),
    },
    proxy: {
        timeout: misc.isSetDefault(Number(process.env.TRAVELLING_PROXY_TIMEOUT), 0),
    },
    redis: {
        enable: misc.isSetDefault(misc.stringToBool(process.env.TRAVELLING_REDIS_ENABLE), false),
        url: misc.isSetDefault(process.env.TRAVELLING_REDIS_URL, 'redis://127.0.0.1:6379/'),
        events: {
            url: misc.isSetDefault(process.env.TRAVELLING_REDIS_EVENTS_URL, misc.isSetDefault(process.env.TRAVELLING_REDIS_URL, 'redis://127.0.0.1:6379/')),
        },
    },
    cookie: {
        session: {
            secret: misc.isSetDefault(process.env.TRAVELLING_COOKIE_SESSION_SECRET, null),
            expiration: misc.isSetDefault(Number(process.env.TRAVELLING_COOKIE_SESSION_EXPIRATION), 300), // seconds
        },
        token: {
            secret: misc.isSetDefault(process.env.TRAVELLING_COOKIE_TOKEN_SECRET, null),
            salt: misc.isSetDefault(process.env.TRAVELLING_COOKIE_TOKEN_SALT, null),
            expiration: misc.isSetDefault(Number(process.env.TRAVELLING_COOKIE_TOKEN_EXPIRATION), 30), // days
        },
        domain: misc.isSetDefault(process.env.TRAVELLING_COOKIE_DOMAIN, null),
        security: {
            ipHijackProtection: misc.isSetDefault(misc.stringToBool(process.env.TRAVELLING_COOKIE_SECURITY_IP_HIJACK_PROTECTION), true),
        },
    },
    username: {
        minchar: misc.isSetDefault(Number(process.env.TRAVELLING_USERNAME_MINCHAR), 4),
    },
    password: {
        consecutive: misc.isSetDefault(misc.stringToBool(process.env.TRAVELLING_PASSWORD_CONSECUTIVE), false),
        minchar: misc.isSetDefault(Number(process.env.TRAVELLING_PASSWORD_MINCHAR), 8),
        maxchar: misc.isSetDefault(Number(process.env.TRAVELLING_PASSWORD_MAXCHAR), ''),
        special: misc.isSetDefault(Number(process.env.TRAVELLING_PASSWORD_SPECIAL), 1),
        number: misc.isSetDefault(Number(process.env.TRAVELLING_PASSWORD_NUMBER), 1),
        lowercase: misc.isSetDefault(Number(process.env.TRAVELLING_PASSWORD_LOWERCASE), 1),
        uppercase: misc.isSetDefault(Number(process.env.TRAVELLING_PASSWORD_UPPERCASE), 1),
    },
    login: {
        maxLoginAttempts: misc.isSetDefault(Number(process.env.TRAVELLING_LOGIN_MAX_LOGIN_ATTEMPTS), 10),
    },
    token: {
        access: {
            expiration: misc.isSetDefault(Number(process.env.TRAVELLING_TOKEN_ACCESS_EXPIRATION), 1440), // minutes
        },
        code: {
            expiration: misc.isSetDefault(Number(process.env.TRAVELLING_TOKEN_CODE_EXPIRATION), 5), // minutes
            authorizeFlow: misc.isSetDefault(misc.stringToBool(process.env.TRAVELLING_TOKEN_CODE_AUTHORIZE_FLOW), true),
        },
    },
    pg: {
        url: misc.isSetDefault(process.env.TRAVELLING_DATABASE_URL, null),
        crypto: {
            implementation: misc.isSetDefault(process.env.TRAVELLING_PG_CRYPTO_IMPLEMENTATION, __dirname + '/cryptointerface.js'),
            secret: misc.isSetDefault(process.env.TRAVELLING_PG_CRYPTO_IMPLEMENTATION_SECRET, null),
            salt: misc.isSetDefault(process.env.TRAVELLING_PG_CRYPTO_IMPLEMENTATION_SALT, null),
            encryptUserData: misc.isSetDefault(misc.stringToBool(process.env.TRAVELLING_PG_CRYPTO_ENCRYPT_USER_DATA), false),
        },
    },
    email: {
        from: misc.isSetDefault(process.env.TRAVELLING_EMAIL_FROM, null),
        recovery: {
            expiration: misc.isSetDefault(Number(process.env.TRAVELLING_EMAIL_RECOVERY_EXPIRATION), 900), // seconds
        },
        activation: {
            expiration: misc.isSetDefault(Number(process.env.TRAVELLING_EMAIL_ACTIVATION_EXPIRATION), 86400), // seconds
        },
        test: {
            enable: misc.isSetDefault(misc.stringToBool(process.env.TRAVELLING_EMAIL_TEST_ENABLE), false),
        },
        smtp: {
            enable: misc.isSetDefault(misc.stringToBool(process.env.TRAVELLING_EMAIL_SMTP_ENABLE), false),
            host: misc.isSetDefault(process.env.TRAVELLING_EMAIL_SMTP_HOST, '127.0.0.1'),
            port: misc.isSetDefault(process.env.TRAVELLING_EMAIL_SMTP_PORT, 465),
            secure: misc.isSetDefault(misc.stringToBool(process.env.TRAVELLING_EMAIL_SMTP_SECURE), true), // use TLS
            auth: {
                user: misc.isSetDefault(process.env.TRAVELLING_EMAIL_SMTP_AUTH_USER, null),
                pass: misc.isSetDefault(process.env.TRAVELLING_EMAIL_SMTP_AUTH_PASSWORD, null),
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: misc.isSetDefault(misc.stringToBool(process.env.TRAVELLING_EMAIL_SMTP_TLS_REJECT_UNAUTHORIZED), true),
            },
        },
        aws: {
            enable: misc.isSetDefault(misc.stringToBool(process.env.TRAVELLING_EMAIL_AWS_ENABLE), false),
            config: misc.isSetDefault(process.env.TRAVELLING_EMAIL_AWS_CONFIG, null),
        },
        template: {
            passwordResetBody: misc.isSetDefault(process.env.TRAVELLING_EMAIL_RESET_PASSWORD_TEMPLATE_BODY, __dirname + '/../../templates/email-reset-password-body.html'),
            passwordResetSubject: misc.isSetDefault(process.env.TRAVELLING_EMAIL_RESET_PASSWORD_TEMPLATE_SUBJECT, __dirname + '/../../templates/email-reset-password-subject.html'),
            activationBody: misc.isSetDefault(process.env.TRAVELLING_EMAIL_ACTIVATION_TEMPLATE_BODY, __dirname + '/../../templates/email-activation-body.html'),
            activationSubject: misc.isSetDefault(process.env.TRAVELLING_EMAIL_ACTIVATION_TEMPLATE_SUBJECT, __dirname + '/../../templates/email-activation-subject.html'),
        },
    },
    registration: {
        requireEmailActivation: misc.isSetDefault(misc.stringToBool(process.env.TRAVELLING_REGISTRATION_REQUIRE_EMAIL_ACTIVATION), false),
        requireManualActivation: misc.isSetDefault(misc.stringToBool(process.env.TRAVELLING_REGISTRATION_REQUIRE_MANUAL_ACTIVATION), false),
    },
};

module.exports = config;
