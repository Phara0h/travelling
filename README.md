<h1 style="display:flex;">
  <span style="margin-right:10px">
    <img src="/client/assets/logo-invert.svg" data-canonical-src="/client/assets/logo-invert.svg" width="42" height="42"/>
  </span>
  Travelling
</h1>

A blazing fast dynamic route level groups/permissions api gateway.

<!-- TOC START min:1 max:8 link:true asterisk:false update:true -->
  - [REST Docs](#rest-docs)
  - [API Docs](#api-docs)
  - [Install](#install)
    - [Minimum New Setup](#minimum-new-setup)
  - [Security](#security)
  - [Configuration](#configuration)
    - [Basic](#basic)
        - [TRAVELLING_PORT](#travelling_port)
        - [TRAVELLING_IP](#travelling_ip)
        - [TRAVELLING_KEY](#travelling_key)
        - [TRAVELLING_CERT](#travelling_cert)
        - [TRAVELLING_HTTPS](#travelling_https)
    - [Cors](#cors)
        - [TRAVELLING_CORS_ENABLE](#travelling_cors_enable)
        - [TRAVELLING_CORS_HEADER_ORIGIN](#travelling_cors_header_origin)
        - [TRAVELLING_CORS_HEADER_METHODS](#travelling_cors_header_methods)
        - [TRAVELLING_CORS_HEADER_CREDENTIALS](#travelling_cors_header_credentials)
        - [TRAVELLING_CORS_HEADER_MAX_AGE](#travelling_cors_header_max_age)
    - [Logging](#logging)
        - [TRAVELLING_LOG_ENABLE](#travelling_log_enable)
        - [TRAVELLING_LOG_LOGGER](#travelling_log_logger)
        - [TRAVELLING_LOG_COLORS](#travelling_log_colors)
        - [TRAVELLING_LOG_LEVEL](#travelling_log_level)
        - [TRAVELLING_LOG_REQUESTS](#travelling_log_requests)
        - [TRAVELLING_LOG_UNAUTHORIZED_ACCESS](#travelling_log_unauthorized_access)
    - [Fastify Logger](#fastify-logger)
        - [TRAVELLING_LOG_FASTIFY_LOGGER](#travelling_log_fastify_logger)
        - [TRAVELLING_LOG_FASTIFY_LOGGER_REQUEST](#travelling_log_fastify_logger_request)
        - [TRAVELLING_LOG_FASTIFY_LOGGER_REQ_ID_HEADER](#travelling_log_fastify_logger_req_id_header)
        - [TRAVELLING_LOG_FASTIFY_LOGGER_REQ_ID_LOG_LABEL](#travelling_log_fastify_logger_req_id_log_label)
    - [Portal](#portal)
        - [TRAVELLING_PORTAL_ENABLE](#travelling_portal_enable)
        - [TRAVELLING_PORTAL_PATH](#travelling_portal_path)
        - [TRAVELLING_PORTAL_HOST](#travelling_portal_host)
        - [TRAVELLING_PORTAL_FILE_PATH](#travelling_portal_file_path)
        - [TRAVELLING_PORTAL_LOGO](#travelling_portal_logo)
        - [TRAVELLING_PORTAL_STYLES](#travelling_portal_styles)
        - [TRAVELLING_PORTAL_ICON](#travelling_portal_icon)
    - [Proxy](#proxy)
        - [TRAVELLING_PROXY_TIMEOUT](#travelling_proxy_timeout)
        - [TRAVELLING_PROXY_SEND_TRAVELLING_HEADERS](#travelling_proxy_send_travelling_headers)
    - [Redis](#redis)
        - [TRAVELLING_REDIS_ENABLE](#travelling_redis_enable)
        - [TRAVELLING_REDIS_URL](#travelling_redis_url)
        - [TRAVELLING_REDIS_EVENTS_URL](#travelling_redis_events_url)
    - [Cookie](#cookie)
        - [TRAVELLING_COOKIE_SESSION_SECRET](#travelling_cookie_session_secret)
        - [TRAVELLING_COOKIE_SESSION_EXPIRATION](#travelling_cookie_session_expiration)
        - [TRAVELLING_COOKIE_TOKEN_SECRET](#travelling_cookie_token_secret)
        - [TRAVELLING_COOKIE_TOKEN_SALT](#travelling_cookie_token_salt)
        - [TRAVELLING_COOKIE_TOKEN_EXPIRATION](#travelling_cookie_token_expiration)
        - [TRAVELLING_COOKIE_DOMAIN](#travelling_cookie_domain)
        - [TRAVELLING_COOKIE_SECURITY_IP_HIJACK_PROTECTION](#travelling_cookie_security_ip_hijack_protection)
    - [USER](#user)
        - [TRAVELLING_USER_ISOLATE_BY_DOMAIN](#travelling_user_isolate_by_domain)
        - [TRAVELLING_USER_USERNAME_MINCHAR](#travelling_user_username_minchar)
        - [TRAVELLING_USER_USERNAME_ENABLE](#travelling_user_username_enable)
    - [Authentication](#authentication)
        - [TRAVELLING_PASSWORD_CONSECUTIVE](#travelling_password_consecutive)
        - [TRAVELLING_PASSWORD_MINCHAR](#travelling_password_minchar)
        - [TRAVELLING_PASSWORD_MAXCHAR](#travelling_password_maxchar)
        - [TRAVELLING_PASSWORD_SPECIAL](#travelling_password_special)
        - [TRAVELLING_PASSWORD_NUMBER](#travelling_password_number)
        - [TRAVELLING_PASSWORD_LOWERCASE](#travelling_password_lowercase)
        - [TRAVELLING_PASSWORD_UPPERCASE](#travelling_password_uppercase)
        - [TRAVELLING_LOGIN_MAX_LOGIN_ATTEMPTS](#travelling_login_max_login_attempts)
    - [OAUTH2](#oauth2)
        - [TRAVELLING_TOKEN_ACCESS_EXPIRATION](#travelling_token_access_expiration)
        - [TRAVELLING_TOKEN_CODE_EXPIRATION](#travelling_token_code_expiration)
        - [TRAVELLING_TOKEN_CODE_AUTHORIZE_FLOW](#travelling_token_code_authorize_flow)
    - [Postgres](#postgres)
        - [TRAVELLING_DATABASE_URL](#travelling_database_url)
        - [TRAVELLING_PG_CRYPTO_IMPLEMENTATION](#travelling_pg_crypto_implementation)
        - [TRAVELLING_PG_CRYPTO_IMPLEMENTATION_SECRET](#travelling_pg_crypto_implementation_secret)
        - [TRAVELLING_PG_CRYPTO_IMPLEMENTATION_SALT](#travelling_pg_crypto_implementation_salt)
        - [TRAVELLING_PG_CRYPTO_ENCRYPT_USER_DATA](#travelling_pg_crypto_encrypt_user_data)
    - [Email](#email)
        - [TRAVELLING_EMAIL_FROM](#travelling_email_from)
        - [TRAVELLING_EMAIL_RECOVERY_EXPIRATION](#travelling_email_recovery_expiration)
        - [TRAVELLING_EMAIL_ACTIVATION_EXPIRATION](#travelling_email_activation_expiration)
        - [TRAVELLING_EMAIL_TEST_ENABLE](#travelling_email_test_enable)
        - [TRAVELLING_EMAIL_SMTP_ENABLE](#travelling_email_smtp_enable)
        - [TRAVELLING_EMAIL_SMTP_HOST](#travelling_email_smtp_host)
        - [TRAVELLING_EMAIL_SMTP_PORT](#travelling_email_smtp_port)
        - [TRAVELLING_EMAIL_SMTP_SECURE](#travelling_email_smtp_secure)
        - [TRAVELLING_EMAIL_SMTP_AUTH_USER](#travelling_email_smtp_auth_user)
        - [TRAVELLING_EMAIL_SMTP_SECURE](#travelling_email_smtp_secure-1)
        - [TRAVELLING_EMAIL_SMTP_TLS_REJECT_UNAUTHORIZED](#travelling_email_smtp_tls_reject_unauthorized)
        - [TRAVELLING_EMAIL_AWS_ENABLE](#travelling_email_aws_enable)
        - [TRAVELLING_EMAIL_AWS_CONFIG](#travelling_email_aws_config)
      - [Templates](#templates)
        - [TRAVELLING_EMAIL_RESET_PASSWORD_TEMPLATE_BODY](#travelling_email_reset_password_template_body)
        - [TRAVELLING_EMAIL_RESET_PASSWORD_TEMPLATE_SUBJECT](#travelling_email_reset_password_template_subject)
        - [TRAVELLING_EMAIL_ACTIVATION_TEMPLATE_BODY](#travelling_email_activation_template_body)
        - [TRAVELLING_EMAIL_ACTIVATION_TEMPLATE_SUBJECT](#travelling_email_activation_template_subject)
    - [Registration](#registration)
        - [TRAVELLING_REGISTRATION_REQUIRE_EMAIL_ACTIVATION](#travelling_registration_require_email_activation)
        - [TRAVELLING_REGISTRATION_REQUIRE_MANUAL_ACTIVATION](#travelling_registration_require_manual_activation)
<!-- TOC END -->

## REST Docs

[REST Docs](https://documenter.getpostman.com/view/7072151/SVfJUrSZ?version=latest)

## API Docs

[API documentation](../sdk/README.md)

## Install

### Minimum New Setup

1. Download the latest release or run `git clone https://github.com/abeai/travelling.git`

2. Inside the root Travelling folder run: `npm install`

3. Set the `TRAVELLING_DATABASE_URL` environment variable which needs to be pointing to a new PostgreSQL database to start. Do this by creating a `.env` file inside the root Travelling folder. For example:

   ```EditorConfig
   TRAVELLING_DATABASE_URL=postgres://postgres@localhost/travelling
   ```

4. Set the salts and secrets for the following:

   ```EditorConfig
   ## Cookie Session Settings
   TRAVELLING_COOKIE_SESSION_SECRET=Yzy)8EbJOUJf+~e^%#7-lo1)RJUs.UVPBu4d3qqd0ZDQ!A~ti%Sq<kPy)nfVSn0;TRBeD0_QeMxKzp]Yn{hQe4j#ZtQ{L$0O>+hBJl^-%TKX<S>u|~xz;hFS(DO32tw#

   ## Cookie Token Settings
   TRAVELLING_COOKIE_TOKEN_SECRET=qVsI_O|Y0VPz>xvW-Uu!&5lejE3M4w-l0KvCI!v4q|9|F0W+v9g-hb!*yX8*3O%Ty@4$~:@1!VX*?Sl&c}KW&a4..gceGHg)KoiVpc9-8bCnrmG&&}iI;7VY+-+&U(?:
   TRAVELLING_COOKIE_TOKEN_SALT=?)WJ.$!570)5[@bDNip!q.t1J#/B.fJ{cyC--Zd/IJwJ/~L+(&#XOz|FuIoc{k;@8wf#gOrn||Ng1+2bDxOuQ6$_6QK{aWUfc-PZ{L62(0JRKizR~Y*/K8YT]?gLHB+S

   ## Postgres Crypto Settings
   TRAVELLING_PG_CRYPTO_IMPLEMENTATION_SECRET=:Y@K$;nE8r~D]dR-#%<PyI]/]^v&#lIz7T(OHrI@sAA_Y/+C%bYVfoY5(r#3IN6tC_fn9vpy%CKXh?K0k:<M/[PXs*r2CO~:]!2qBmB,9}RW)8i$$P#uFt_>u,v_M9K}
   TRAVELLING_PG_CRYPTO_IMPLEMENTATION_SALT=Wdwrmww~NxDAFn2/@~1SfV6&Iq7/PR;]k2Me*gK*(|I!sxcr/V,_0Bbys25dIF!sm,}XG)%U!(9|3gS4Hy1Hjo}D.WsF{!6|+x,t{O6T^S):kuglmBokNNqQeHL^bWk%
   ```

   These are example secrets and salts ***DO NOT USE THESE VALUES*** generate your own. You can use the included script via `./scripts/generateRandom.sh` to generate a 128 character random string to use for salts and secrets. See [Security](#Security) for more details on keeping Travelling secure.

See [Configuration](#Configuration) for all other configurable options.

## Security

It is recommended to follow this security tips to help keep Travelling as secure as possible.

* Use HTTPS
* Use a key and cert signed by a known third party ssl vender. (Make sure chrome supports them)
* Don't use Cors unless you really have to.
* Request logs are helpful for tracking down malicious requests
* Run Travelling behind DDOS protection. For example Cloudflare.
* Rotate cookie session/token secrets and salts often. (Once a month is a good recommendation)
* Set username passwords and username's to OWSAP current recommendations.
* Keep OAuth2 Code Tokens short lived for maximum security.
* Use strong secret's and salts for Postgres encryption. **KEEP THESE SAFE**.
* Email authentication helps prevent invalid users and makes it harder for bots to generate accounts.

## Configuration

Configuration is done through environment variables. All variables have a default values except for what is stated in [Minimum New Setup](#MinimumNewSetup)

### Basic

##### TRAVELLING_PORT

*Travelling's serving port.* </br>

> **Default**: `443`

##### TRAVELLING_IP

*Travelling's serving IP.* </br>

> **Default**: `0.0.0.0`

##### TRAVELLING_KEY

*The path to the SSL key that is used for [https](#TRAVELLING_HTTPS)* </br>

> **Default**: `travelling/localhost.key`

##### TRAVELLING_CERT

*The path to the SSL cert that is used for [https](#TRAVELLING_HTTPS)* </br>

> **Default**: `travelling/localhost.csr`

##### TRAVELLING_HTTPS

*Enables https serving.* </br>

> **Default**: `travelling/localhost.csr`

___

### Cors

Recommended to keep this disabled due to security reasons. Only enable this if you really need it and know the risks.

##### TRAVELLING_CORS_ENABLE

*Allows external services to make api calls to Travelling.* </br>

> **Default**: `false`

##### TRAVELLING_CORS_HEADER_ORIGIN

*Full host path or wildstar * host pathed subdomains to allow. This is returned back with all requests.* </br>

> **Default**: Rewrites the origin to whatever external host is making the call. This allows all external calls allowed and is not recommended.  </br>
> **Example**: `*.domain.com`

##### TRAVELLING_CORS_HEADER_METHODS

*`access-control-allow-methods` header that is returned back with all requests.* </br>

> **Default**: Rewrites it's self to the `access-control-request-method` header request or sets to `*` if there is no request.  </br>
> **Example**: `GET,DELETE`

##### TRAVELLING_CORS_HEADER_CREDENTIALS

*`access-control-allow-credentials` header that is returned back with  all routes under `/travelling/api/v1/auth/`* </br>

> **Default**: `true`  </br>

##### TRAVELLING_CORS_HEADER_MAX_AGE

*`access-control-max-age` header that is returned back with all CORS options request.* </br>

> **Default**: `3600`  </br>

___

### Logging

For maximum performance it is recommended to disable [TRAVELLING_LOG_FASTIFY_LOGGER_REQUEST](#TRAVELLING_LOG_FASTIFY_LOGGER_REQUEST) and [TRAVELLING_LOG_FASTIFY_LOGGER](#TRAVELLING_LOG_FASTIFY_LOGGER)

##### TRAVELLING_LOG_ENABLE

*Enables [TRAVELLING_LOG_LOGGER](#TRAVELLING_LOG_LOGGER).* </br>

> **Default**: `true`

##### TRAVELLING_LOG_LOGGER

*An absolute file path to a custom node.js logger. This must **not** be set for the settings [TRAVELLING_LOG_LEVEL](#TRAVELLING_LOG_LEVEL) & [TRAVELLING_LOG_COLORS](#TRAVELLING_LOG_COLORS) to function. It also needs to support the same interface as Node's built in console logger.* </br>

> **Default**: `travelling/include/utils/logger.js`

##### TRAVELLING_LOG_COLORS

*Enables console colors to be used with [TRAVELLING_LOG_LOGGER](#TRAVELLING_LOG_LOGGER).* </br>

> **Default**: `true`  

##### TRAVELLING_LOG_LEVEL

*Sets the log level for [TRAVELLING_LOG_LOGGER](#TRAVELLING_LOG_LOGGER). The options are `trace`,`debug`,`info`,`warn`,`error`,`fatal`.* </br>

> **Default**: `info`  

##### TRAVELLING_LOG_REQUESTS

*Enables logging of every request of all requests with [TRAVELLING_LOG_LOGGER](#TRAVELLING_LOG_LOGGER).* </br>

> **Default**: `true`

##### TRAVELLING_LOG_UNAUTHORIZED_ACCESS

*Enables logging of every unauthorized access requests made with [TRAVELLING_LOG_LOGGER](#TRAVELLING_LOG_LOGGER).* </br>

> **Default**: `true`

___

### Fastify Logger

##### TRAVELLING_LOG_FASTIFY_LOGGER

*Enables logging for fastify's built-in pino logger. This can be set to a true/false value or a absolute path of a javascript file to set pino's settings / implement a custom logger from the pino interface.* </br>

> **Default**: `false` </br>
> **Example**: js file setting pino settings.

```javascript
module.exports = {
    level: 'info'
}
```

##### TRAVELLING_LOG_FASTIFY_LOGGER_REQUEST

*Enables logging of every request and response in pino's format. Recommended not to have this and [TRAVELLING_LOG_LOGGER](#TRAVELLING_LOG_LOGGER) enabled at once* </br>

> **Default**: `true`

##### TRAVELLING_LOG_FASTIFY_LOGGER_REQ_ID_HEADER

*The name of the header that gets set by pino's correlation id system.* </br>

> **Default**: `travelling-req-id` </br>

##### TRAVELLING_LOG_FASTIFY_LOGGER_REQ_ID_LOG_LABEL

*The name of the property that gets set by pino's correlation id system.* </br>

> **Default**: `travellingReqID` </br>

___

### Portal

##### TRAVELLING_PORTAL_ENABLE

*Enables the portal which has the client for login/logout/register/forgotPassword/oauth2Code functionality. This should always be enabled.* </br>

> **Default**: `true`

##### TRAVELLING_PORTAL_PATH

*The route that travelling will serve the client at.* </br>

> **Default**: `/travelling/portal/`

##### TRAVELLING_PORTAL_HOST

*This is used once on the first startup of Travelling during group initialization. This sets the remote host of a custom client to be served under the [TRAVELLING_PORTAL_HOST](#TRAVELLING_PORTAL_HOST) path.* </br>

> **Default**: `travelling/localhost.key`

##### TRAVELLING_PORTAL_FILE_PATH

*The absolute filepath to the root directory of the client files. Recommended not to be changed unless unless there is a need for a fully custom rewrite of Travelling's client pages.* </br>

> **Default**: `travelling/client/dist`

##### TRAVELLING_PORTAL_LOGO

*The absolute filepath to the logo to be displayed on the client side.* </br>

> **Default**: `travelling/client/assets/logo.svg`

##### TRAVELLING_PORTAL_STYLES

*The absolute filepath to the css file to be displayed on the client side.* </br>

> **Default**: `travelling/client/assets/styles.css`

##### TRAVELLING_PORTAL_ICON

*The absolute filepath to the faveicon to be displayed on the client side.* </br>

> **Default**: `travelling/client/assets/favicon.ico`

___

### Proxy

##### TRAVELLING_PROXY_TIMEOUT

*How long in seconds the proxy should wait on a request to finish. `0` is Infinity* </br>

> **Default**: `0`

##### TRAVELLING_PROXY_SEND_TRAVELLING_HEADERS

*Allows Travelling to send permission/user/group based headers along with the proxy route* </br>

> **Default**: `false`

| Header | Description                                   |
| ------ | --------------------------------------------- |
| `un`   | User's Username.                              |
| `uid`  | User's Id.                                    |
| `gn`   | User's Group's name that allowed the request. |
| `gt `  | User's Group's type that allowed the request. |
| `perm` | Permission's name that allowed the request.   |

___

### Redis

##### TRAVELLING_REDIS_ENABLE

*Enables redis to be used when multiple instances of travelling are running and being load balanced against.* </br>

> **Default**: `false` Uses in memory store which could be problematic depending on how many groups and routes there are.

##### TRAVELLING_REDIS_URL

*The URL to a redis instance to be used by travelling as a data store.* </br>

> **Default**: `redis://127.0.0.1:6379/`

##### TRAVELLING_REDIS_EVENTS_URL

*The URL to a redis instance to be used by travelling as a pub/sub event system.* </br>

> **Default**: `redis://127.0.0.1:6379/`

___

### Cookie

Travelling uses a dual cookie system. One is a persistent token cookie for longterm login and the other is a short lived session cookie made to put less load on the system and speed things up making it not need to decrypt the token cookie every request.

##### TRAVELLING_COOKIE_SESSION_SECRET

*The session secret used to generate the session cookie with. This needs to stay a secret and should be changed ever so often for [security](#Security) reasons* </br>

> **Default**: ` ` This needs to be set!

##### TRAVELLING_COOKIE_SESSION_EXPIRATION

*How long the session cookie will last for in seconds. Recommended to set it to the average number of seconds a user tends to use your service for.* </br>

> **Default**: `300`

##### TRAVELLING_COOKIE_TOKEN_SECRET

*The token secret used to generate the persistent token cookie with. This needs to stay a secret and should be changed ever so often for [security](#Security) reasons* </br>

> **Default**: `null` This needs to be set!

##### TRAVELLING_COOKIE_TOKEN_SALT

*The token salt used to generate the persistent token cookie with. This needs to stay a secret and should be changed ever so often for [security](#security) reasons* </br>

> **Default**: `null` This needs to be set!

##### TRAVELLING_COOKIE_TOKEN_EXPIRATION

*How long the persistent token cookie will last for in days.* </br>

> **Default**: `30`

##### TRAVELLING_COOKIE_DOMAIN

*How long the persistent token cookie will last for in days.* </br>

> **Default**: `null`

##### TRAVELLING_COOKIE_SECURITY_IP_HIJACK_PROTECTION

*Enables cookie linked to remote ip's. Disabling this removes one more layer of protection against CRSF attacks, but might be needed depending on your [Cors](#cors) settings.* </br>

> **Default**: `true`

___

### USER

##### TRAVELLING_USER_ISOLATE_BY_DOMAIN

*This allows users that have same username/email to register and be isolated by the domain property. This is useful if you have multiple websites and you want to keep your users isolated from each other.* </br>

> **Default**: `false`

##### TRAVELLING_USER_USERNAME_MINCHAR

*The minimum amount of characters a username has to have.* </br>

> **Default**: `4`

##### TRAVELLING_USER_USERNAME_ENABLE

*Require users to have usernames* </br>

> **Default**: `true`

___

### Authentication

##### TRAVELLING_PASSWORD_CONSECUTIVE

*Disables user's passwords from having any consecutive characters.* </br>

> **Default**: `false`

##### TRAVELLING_PASSWORD_MINCHAR

*The minimum amount of characters a user's password has to have* </br>

> **Default**: `8`

##### TRAVELLING_PASSWORD_MAXCHAR

*The maximum amount of characters a user's password is allowed to have. Leaving this unset makes it unlimited* </br>

> **Default**: ` `

##### TRAVELLING_PASSWORD_SPECIAL

*The minimum amount of special characters a user's password has to have.* </br>

> **Default**: `30`

##### TRAVELLING_PASSWORD_NUMBER

*The minimum amount of numbers characters a user's password has to have.* </br>

> **Default**: `1`

##### TRAVELLING_PASSWORD_LOWERCASE

*The minimum amount of lowercase characters a user's password has to have.* </br>

> **Default**: `1`

##### TRAVELLING_PASSWORD_UPPERCASE

*The minimum amount of uppercase characters a user's password has to have.* </br>

> **Default**: `1`

##### TRAVELLING_LOGIN_MAX_LOGIN_ATTEMPTS

*The maximum amount of failed login attempts until a user is locked.* </br>

> **Default**: `10`

___

### OAUTH2

##### TRAVELLING_TOKEN_ACCESS_EXPIRATION

*How long a OAUTH2 Access token will last for in minutes.* </br>

> **Default**: `1440`

##### TRAVELLING_TOKEN_CODE_EXPIRATION

*How long a OAUTH2 Code token will last for in minutes.* </br>

> **Default**: `5`

##### TRAVELLING_TOKEN_CODE_AUTHORIZE_FLOW

*Enforces the user to click a authorize button to allow a client to login for the user.* </br>

> **Default**: `true`

___

### Postgres

##### TRAVELLING_DATABASE_URL

*The Postgres connection url for Travelling to connect to.* </br>

> **Default**: `null` This needs to be set!

##### TRAVELLING_PG_CRYPTO_IMPLEMENTATION

*The absolute path to the encryption interface that is used for Travelling's database encryption fields. If a custom implementation is wanted please check out `travelling/include/utils/cryptointerface.js` for methods needed to be functional.* </br>

> **Default**: `travelling/include/utils/cryptointerface.js`

##### TRAVELLING_PG_CRYPTO_IMPLEMENTATION_SECRET

*The secret used inside [TRAVELLING_PG_CRYPTO_IMPLEMENTATION](#TRAVELLING_PG_CRYPTO_IMPLEMENTATION). This needs to stay a secret and should be changed ever so often for [security](#Security) reasons.* </br>

> **Default**: `null` This needs to be set!

##### TRAVELLING_PG_CRYPTO_IMPLEMENTATION_SALT

*The salt used inside [TRAVELLING_PG_CRYPTO_IMPLEMENTATION](#TRAVELLING_PG_CRYPTO_IMPLEMENTATION). This needs to stay a secret and should be changed ever so often for [security](#security) reasons.* </br>

> **Default**: `null` This needs to be set!

##### TRAVELLING_PG_CRYPTO_ENCRYPT_USER_DATA

*Enables the `user_data` field inside the user object to be encrypted. If sensitive data is stored in within that field it is recommended to enable this.* </br>

> **Default**: `false`

___

### Email

##### TRAVELLING_EMAIL_FROM

*The email that will be used as the `from` address. Recommended to set it to a no-reply email address* </br>

> **Default**: `null`

##### TRAVELLING_EMAIL_RECOVERY_EXPIRATION

*The number of seconds for the email recovery link to last for. Recommended to keep this somewhat short-lived for [security](#security) reasons.* </br>

> **Default**: `900`

##### TRAVELLING_EMAIL_ACTIVATION_EXPIRATION

*The number of seconds for the email activation link to last for.* </br>

> **Default**: `86400`

##### TRAVELLING_EMAIL_TEST_ENABLE

*Enables the use of a test email service that will display the login credentials inside the log at start. This is used by our integration test. However, it is helpful to enable this if custom [Templates](#Templates) are written. Only one type of email support should be used `Test`, `SMTP` or `AWS`.* </br>

> **Default**: `false`

##### TRAVELLING_EMAIL_SMTP_ENABLE

*Enables the use of a SMTP email service. Only one type of email support should be used `Test`, `SMTP` or `AWS`.* </br>

> **Default**: `false`

##### TRAVELLING_EMAIL_SMTP_HOST

*The host of the SMTP service.* </br>

> **Default**: `127.0.0.1`

##### TRAVELLING_EMAIL_SMTP_PORT

*The port of the SMTP service.* </br>

> **Default**: `465`

##### TRAVELLING_EMAIL_SMTP_SECURE

*Enables TLS for SMTP.* </br>

> **Default**: `true`

##### TRAVELLING_EMAIL_SMTP_AUTH_USER

*Username for SMTP service.* </br>

> **Default**: `null`

##### TRAVELLING_EMAIL_SMTP_SECURE

*Password for SMTP service.* </br>

> **Default**: `null`

##### TRAVELLING_EMAIL_SMTP_TLS_REJECT_UNAUTHORIZED

*Enables rejection of TLS certs that are self served or invalid. Recommended to keep it enabled for [security](#security) reasons.* </br>

> **Default**: `true`

##### TRAVELLING_EMAIL_AWS_ENABLE

*Enables the use of the AWS SES email service. Only one type of email support should be used `Test`, `SMTP` or `AWS`.* </br>

> **Default**: `false`

##### TRAVELLING_EMAIL_AWS_CONFIG

*The absolute path to the AWS json credentials config to use for accessing the SES service. See AWS's configuration documentation on the format of this file.* </br>

> **Default**: `null` // This needs to be set to use AWS SES email service.

#### Templates

Templates all use html/handlebars. Check out the example default templates inside the `travelling/templates/` folder for examples.

**Reset Template Variables**:

| Variable     | Description                                                                                                                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{{user}}`   | This is the user object for the reset email. Use dot notation to access any of its properties for example: `{{user.username}}`.                                                                                           |
| `{{config}}` | This is the config object for Travelling. Use dot notation to access any of its properties for example `{{config.port}}`.                                                                                                 |
| `{{token}} ` | The reset token that Travelling needs to reset the password. Recommended to just copy and paste the full a href from the [TRAVELLING_EMAIL_RESET_PASSWORD_TEMPLATE_BODY](#TRAVELLING_EMAIL_RESET_PASSWORD_TEMPLATE_BODY). |
| `{{ip}}`     | This is the IP object from the user requesting the reset password. The following properties are valid. `query`,`city`, `regionName`, `country`.                                                                           |

**Activation Template Variables**:

| Variable     | Description                                                                                                                                                                                                                |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{{user}}`   | This is the user object for the activation email. Use dot notation to access any of its properties for example: `{{user.username}}`.                                                                                       |
| `{{config}}` | This is the config object for Travelling. Use dot notation to access any of its properties for example `{{config.port}}`.                                                                                                  |
| `{{token}} ` | The reset token that Travelling needs to activate the user's account. Recommended to just copy and paste the full a href from the [TRAVELLING_EMAIL_ACTIVATION_TEMPLATE_BODY](#TRAVELLING_EMAIL_ACTIVATION_TEMPLATE_BODY). |

##### TRAVELLING_EMAIL_RESET_PASSWORD_TEMPLATE_BODY

*The absolute path to the email reset password template body. This is used as the body inside all reset password  emails.* </br>

> **Default**: `travelling/templates/email-reset-password-body.html`

##### TRAVELLING_EMAIL_RESET_PASSWORD_TEMPLATE_SUBJECT

*The absolute path to the email reset password template subject. This is used as the subject line inside all reset password emails.* </br>

> **Default**: `templates/email-reset-password-subject.html`

##### TRAVELLING_EMAIL_ACTIVATION_TEMPLATE_BODY

*The absolute path to the email activation template body. This is used as the body inside all activation emails.* </br>

> **Default**: `templates/email-activation-body.html`

##### TRAVELLING_EMAIL_ACTIVATION_TEMPLATE_SUBJECT

*The absolute path to the email activation template subject.This is used as the subject line inside all activation emails.* </br>

> **Default**: `templates/email-activation-subject.html`

___

### Registration

##### TRAVELLING_REGISTRATION_REQUIRE_EMAIL_ACTIVATION

*Enables the requirement of each newly registered user to activate their account through the email link.* </br>

> **Default**: `false`

##### TRAVELLING_REGISTRATION_REQUIRE_MANUAL_ACTIVATION

*Enables the requirement of each newly registered user to have a active user with permissions to unlock their account for them.* </br>

> **Default**: `false`
