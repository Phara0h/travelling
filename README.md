<h1 style="display:flex;">
  <span style="margin-right:10px">
    <img src="https://raw.githubusercontent.com/Phara0h/travelling/master/client/assets/logo-invert.svg" data-canonical-src="https://raw.githubusercontent.com/Phara0h/travelling/master/client/assets/logo-invert.svg" width="42" height="42"/>
  </span>
  Travelling
</h1>

A blazing fast dynamic route level groups/permissions api gateway.

<!-- TOC START min:1 max:8 link:true asterisk:false update:true -->
  - [REST Docs](#rest-docs)
  - [Install](#install)
    - [Minimum New Setup](#minimum-new-setup)
  - [Security](#security)
  - [Configuration](#configuration)
  - [SDK](#sdk)
  - [Changelog](#changelog)
  - [License](#license)
<!-- TOC END -->

## REST Docs

[REST Docs](https://documenter.getpostman.com/view/208035/TWDUqyFx?version=latest)

## Install

### Minimum New Setup

1. Download the latest release or run `git clone https://github.com/phara0h/travelling.git`

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

[Configuration](./documents/CONFIG.md) is done through environment variables. All variables have a default values except for what is stated in [Minimum New Setup](#MinimumNewSetup)

<!-- TOC -->

- [Basic](#basic)
    - [TRAVELLING_PORT](#travelling_port)
    - [TRAVELLING_IP](#travelling_ip)
    - [TRAVELLING_KEY](#travelling_key)
    - [TRAVELLING_CERT](#travelling_cert)
    - [TRAVELLING_HTTPS](#travelling_https)
    - [TRAVELLING_SERVICE_NAME](#travelling_service_name)
- [Misc](#misc)
    - [TRAVELLING_MISC_CLOUDFLAREIP](#travelling_misc_cloudflareip)
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
    - [TRAVELLING_USER_LOCKED_MESSAGE](#travelling_user_locked_message)
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
    - [TRAVELLING_DATABASE_USER](#travelling_database_user)
    - [TRAVELLING_DATABASE_PASSWORD](#travelling_database_password)
    - [TRAVELLING_DATABASE_PORT](#travelling_database_port)
    - [TRAVELLING_DATABASE_NAME](#travelling_database_name)
    - [TRAVELLING_DATABASE_HOST](#travelling_database_host)
    - [TRAVELLING_PG_CRYPTO_IMPLEMENTATION](#travelling_pg_crypto_implementation)
    - [TRAVELLING_PG_CRYPTO_IMPLEMENTATION_SECRET](#travelling_pg_crypto_implementation_secret)
    - [TRAVELLING_PG_CRYPTO_IMPLEMENTATION_SALT](#travelling_pg_crypto_implementation_salt)
    - [TRAVELLING_PG_CRYPTO_ENCRYPT_USER_DATA](#travelling_pg_crypto_encrypt_user_data)
- [Email](#email)
    - [TRAVELLING_EMAIL_VALIDATION_EXTERNAL_ENABLE](#travelling_email_validation_external_enable)
    - [TRAVELLING_EMAIL_VALIDATION_EXTERNAL_ENDPOINT](#travelling_email_validation_external_endpoint)
    - [TRAVELLING_EMAIL_VALIDATION_EXTERNAL_EMAIL_IN_ENDPOINT](#travelling_email_validation_external_email_in_endpoint)
    - [TRAVELLING_EMAIL_VALIDATION_EXTERNAL_EMAIL_IN_BODY](#travelling_email_validation_external_email_in_body)
    - [TRAVELLING_EMAIL_VALIDATION_EXTERNAL_METHOD](#travelling_email_validation_external_method)
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

<!-- /TOC -->

### Basic

##### TRAVELLING_PORT

_Travelling's serving port._ </br>

> **Default**: `443`

##### TRAVELLING_IP

_Travelling's serving IP._ </br>

> **Default**: `0.0.0.0`

##### TRAVELLING_KEY

_The path to the SSL key that is used for [https](#TRAVELLING_HTTPS)_ </br>

> **Default**: `travelling/localhost.key`

##### TRAVELLING_CERT

_The path to the SSL cert that is used for [https](#TRAVELLING_HTTPS)_ </br>

> **Default**: `travelling/localhost.csr`

##### TRAVELLING_HTTPS

_Enables https serving._ </br>

> **Default**: `travelling/localhost.csr`

##### TRAVELLING_SERVICE_NAME

_Changes the service's urls and other functionality around it's name._ </br>

> **Default**: `travelling`

---

### Misc

##### TRAVELLING_MISC_CLOUDFLAREIP

_If cloudflare sits infront of Travelling set this to true, so users have their real IP assigned to them._ </br>

> **Default**: `false`

---

### Cors

Recommended to keep this disabled due to security reasons. Only enable this if you really need it and know the risks.

##### TRAVELLING_CORS_ENABLE

_Allows external services to make api calls to Travelling._ </br>

> **Default**: `false`

##### TRAVELLING_CORS_HEADER_ORIGIN

_Full host path or wildstar _ host pathed subdomains to allow. This is returned back with all requests.\* </br>

> **Default**: Rewrites the origin to whatever external host is making the call. This allows all external calls allowed and is not recommended. </br> > **Example**: `*.domain.com`

##### TRAVELLING_CORS_HEADER_METHODS

_`access-control-allow-methods` header that is returned back with all requests._ </br>

> **Default**: Rewrites it's self to the `access-control-request-method` header request or sets to `*` if there is no request. </br> > **Example**: `GET,DELETE`

##### TRAVELLING_CORS_HEADER_CREDENTIALS

_`access-control-allow-credentials` header that is returned back with all routes under `/travelling/api/v1/auth/`_ </br>

> **Default**: `true` </br>

##### TRAVELLING_CORS_HEADER_MAX_AGE

_`access-control-max-age` header that is returned back with all CORS options request._ </br>

> **Default**: `3600` </br>

---

### Logging

For maximum performance it is recommended to disable [TRAVELLING_LOG_FASTIFY_LOGGER_REQUEST](#TRAVELLING_LOG_FASTIFY_LOGGER_REQUEST) and [TRAVELLING_LOG_FASTIFY_LOGGER](#TRAVELLING_LOG_FASTIFY_LOGGER)

##### TRAVELLING_LOG_ENABLE

_Enables [TRAVELLING_LOG_LOGGER](#TRAVELLING_LOG_LOGGER)._ </br>

> **Default**: `true`

##### TRAVELLING_LOG_LOGGER

_An absolute file path to a custom node.js logger. This must **not** be set for the settings [TRAVELLING_LOG_LEVEL](#TRAVELLING_LOG_LEVEL) & [TRAVELLING_LOG_COLORS](#TRAVELLING_LOG_COLORS) to function. It also needs to support the same interface as Node's built in console logger._ </br>

> **Default**: `travelling/include/utils/logger.js`

##### TRAVELLING_LOG_COLORS

_Enables console colors to be used with [TRAVELLING_LOG_LOGGER](#TRAVELLING_LOG_LOGGER)._ </br>

> **Default**: `true`

##### TRAVELLING_LOG_LEVEL

_Sets the log level for [TRAVELLING_LOG_LOGGER](#TRAVELLING_LOG_LOGGER). The options are `trace`,`debug`,`info`,`warn`,`error`,`fatal`._ </br>

> **Default**: `info`

##### TRAVELLING_LOG_REQUESTS

_Enables logging of every request of all requests with [TRAVELLING_LOG_LOGGER](#TRAVELLING_LOG_LOGGER)._ </br>

> **Default**: `true`

##### TRAVELLING_LOG_UNAUTHORIZED_ACCESS

_Enables logging of every unauthorized access requests made with [TRAVELLING_LOG_LOGGER](#TRAVELLING_LOG_LOGGER)._ </br>

> **Default**: `true`

---

### Fastify Logger

##### TRAVELLING_LOG_FASTIFY_LOGGER

_Enables logging for fastify's built-in pino logger. This can be set to a true/false value or a absolute path of a javascript file to set pino's settings / implement a custom logger from the pino interface._ </br>

> **Default**: `false` </br> > **Example**: js file setting pino settings.

```javascript
module.exports = {
  level: 'info'
};
```

##### TRAVELLING_LOG_FASTIFY_LOGGER_REQUEST

_Enables logging of every request and response in pino's format. Recommended not to have this and [TRAVELLING_LOG_LOGGER](#TRAVELLING_LOG_LOGGER) enabled at once_ </br>

> **Default**: `true`

##### TRAVELLING_LOG_FASTIFY_LOGGER_REQ_ID_HEADER

_The name of the header that gets set by pino's correlation id system._ </br>

> **Default**: `travelling-req-id` </br>

##### TRAVELLING_LOG_FASTIFY_LOGGER_REQ_ID_LOG_LABEL

_The name of the property that gets set by pino's correlation id system._ </br>

> **Default**: `travellingReqID` </br>

---

### Portal

##### TRAVELLING_PORTAL_ENABLE

_Enables the portal which has the client for login/logout/register/forgotPassword/oauth2Code functionality. This should always be enabled._ </br>

> **Default**: `true`

##### TRAVELLING_PORTAL_PATH

_The route that travelling will serve the client at._ </br>

> **Default**: `/travelling/portal/`

##### TRAVELLING_PORTAL_HOST

_This is used once on the first startup of Travelling during group initialization. This sets the remote host of a custom client to be served under the [TRAVELLING_PORTAL_HOST](#TRAVELLING_PORTAL_HOST) path._ </br>

> **Default**: `travelling/localhost.key`

##### TRAVELLING_PORTAL_FILE_PATH

_The absolute filepath to the root directory of the client files. Recommended not to be changed unless unless there is a need for a fully custom rewrite of Travelling's client pages._ </br>

> **Default**: `travelling/client/dist`

##### TRAVELLING_PORTAL_LOGO

_The absolute filepath to the logo to be displayed on the client side._ </br>

> **Default**: `travelling/client/assets/logo.svg`

##### TRAVELLING_PORTAL_STYLES

_The absolute filepath to the css file to be displayed on the client side._ </br>

> **Default**: `travelling/client/assets/styles.css`

##### TRAVELLING_PORTAL_ICON

_The absolute filepath to the faveicon to be displayed on the client side._ </br>

> **Default**: `travelling/client/assets/favicon.ico`

---

### Proxy

##### TRAVELLING_PROXY_TIMEOUT

_How long in seconds the proxy should wait on a request to finish. `0` is Infinity_ </br>

> **Default**: `0`

##### TRAVELLING_PROXY_SEND_TRAVELLING_HEADERS

_Allows Travelling to send permission/user/group based headers along with the proxy route_ </br>

> **Default**: `false`

| Header | Description                                   |
| ------ | --------------------------------------------- |
| `un`   | User's Username.                              |
| `uid`  | User's Id.                                    |
| `gn`   | User's Group's name that allowed the request. |
| `gt `  | User's Group's type that allowed the request. |
| `perm` | Permission's name that allowed the request.   |

---

### Redis

##### TRAVELLING_REDIS_ENABLE

_Enables redis to be used when multiple instances of travelling are running and being load balanced against._ </br>

> **Default**: `false` Uses in memory store which could be problematic depending on how many groups and routes there are.

##### TRAVELLING_REDIS_URL

_The URL to a redis instance to be used by travelling as a data store._ </br>

> **Default**: `redis://127.0.0.1:6379/`

##### TRAVELLING_REDIS_EVENTS_URL

_The URL to a redis instance to be used by travelling as a pub/sub event system._ </br>

> **Default**: `redis://127.0.0.1:6379/`

---

### Cookie

Travelling uses a dual cookie system. One is a persistent token cookie for longterm login and the other is a short lived session cookie made to put less load on the system and speed things up making it not need to decrypt the token cookie every request.

##### TRAVELLING_COOKIE_SESSION_SECRET

_The session secret used to generate the session cookie with. This needs to stay a secret and should be changed ever so often for [security](#Security) reasons_ </br>

> **Default**: ` ` This needs to be set!

##### TRAVELLING_COOKIE_SESSION_EXPIRATION

_How long the session cookie will last for in seconds. Recommended to set it to the average number of seconds a user tends to use your service for._ </br>

> **Default**: `300`

##### TRAVELLING_COOKIE_TOKEN_SECRET

_The token secret used to generate the persistent token cookie with. This needs to stay a secret and should be changed ever so often for [security](#Security) reasons_ </br>

> **Default**: `null` This needs to be set!

##### TRAVELLING_COOKIE_TOKEN_SALT

_The token salt used to generate the persistent token cookie with. This needs to stay a secret and should be changed ever so often for [security](#security) reasons_ </br>

> **Default**: `null` This needs to be set!

##### TRAVELLING_COOKIE_TOKEN_EXPIRATION

_How long the persistent token cookie will last for in days._ </br>

> **Default**: `30`

##### TRAVELLING_COOKIE_DOMAIN

_How long the persistent token cookie will last for in days._ </br>

> **Default**: `null`

##### TRAVELLING_COOKIE_SECURITY_IP_HIJACK_PROTECTION

_Enables cookie linked to remote ip's. Disabling this removes one more layer of protection against CRSF attacks, but might be needed depending on your [Cors](#cors) settings._ </br>

> **Default**: `true`

---

### USER

##### TRAVELLING_USER_ISOLATE_BY_DOMAIN

_This allows users that have same username/email to register and be isolated by the domain property. This is useful if you have multiple websites and you want to keep your users isolated from each other._ </br>

> **Default**: `false`

##### TRAVELLING_USER_USERNAME_MINCHAR

_The minimum amount of characters a username has to have._ </br>

> **Default**: `4`

##### TRAVELLING_USER_USERNAME_ENABLE

_Require users to have usernames_ </br>

> **Default**: `true`

##### TRAVELLING_USER_LOCKED_MESSAGE

_Require users to have usernames_ </br>

> **Default**: `Failed login attempts exceeded the limit. Contact your admin to get your account unlocked.`

---

### Authentication

##### TRAVELLING_PASSWORD_CONSECUTIVE

_Disables user's passwords from having any consecutive characters._ </br>

> **Default**: `false`

##### TRAVELLING_PASSWORD_MINCHAR

_The minimum amount of characters a user's password has to have_ </br>

> **Default**: `8`

##### TRAVELLING_PASSWORD_MAXCHAR

_The maximum amount of characters a user's password is allowed to have. Leaving this unset makes it unlimited_ </br>

> **Default**: ` `

##### TRAVELLING_PASSWORD_SPECIAL

_The minimum amount of special characters a user's password has to have._ </br>

> **Default**: `30`

##### TRAVELLING_PASSWORD_NUMBER

_The minimum amount of numbers characters a user's password has to have._ </br>

> **Default**: `1`

##### TRAVELLING_PASSWORD_LOWERCASE

_The minimum amount of lowercase characters a user's password has to have._ </br>

> **Default**: `1`

##### TRAVELLING_PASSWORD_UPPERCASE

_The minimum amount of uppercase characters a user's password has to have._ </br>

> **Default**: `1`

##### TRAVELLING_LOGIN_MAX_LOGIN_ATTEMPTS

_The maximum amount of failed login attempts until a user is locked._ </br>

> **Default**: `10`

---

### OAUTH2

##### TRAVELLING_TOKEN_ACCESS_EXPIRATION

_How long a OAUTH2 Access token will last for in minutes._ </br>

> **Default**: `1440`

##### TRAVELLING_TOKEN_CODE_EXPIRATION

_How long a OAUTH2 Code token will last for in minutes._ </br>

> **Default**: `5`

##### TRAVELLING_TOKEN_CODE_AUTHORIZE_FLOW

_Enforces the user to click a authorize button to allow a client to login for the user._ </br>

> **Default**: `true`

---

### Postgres

##### TRAVELLING_DATABASE_URL

_The Postgres connection url for Travelling to connect to._ </br>

> **Default**: `null`

##### TRAVELLING_DATABASE_USER

_The Postgres user._ </br>

> **Default**: `null`

##### TRAVELLING_DATABASE_PASSWORD

_The Postgres password._ </br>

> **Default**: `null`

##### TRAVELLING_DATABASE_PORT

_The Postgres port._ </br>

> **Default**: `null`

##### TRAVELLING_DATABASE_NAME

_The Postgres databases name._ </br>

> **Default**: `null`

##### TRAVELLING_DATABASE_HOST

_The Postgres host._ </br>

> **Default**: `null`

##### TRAVELLING_PG_CRYPTO_IMPLEMENTATION

_The absolute path to the encryption interface that is used for Travelling's database encryption fields. If a custom implementation is wanted please check out `travelling/include/utils/cryptointerface.js` for methods needed to be functional._ </br>

> **Default**: `travelling/include/utils/cryptointerface.js`

##### TRAVELLING_PG_CRYPTO_IMPLEMENTATION_SECRET

_The secret used inside [TRAVELLING_PG_CRYPTO_IMPLEMENTATION](#TRAVELLING_PG_CRYPTO_IMPLEMENTATION). This needs to stay a secret and should be changed ever so often for [security](#Security) reasons._ </br>

> **Default**: `null` This needs to be set!

##### TRAVELLING_PG_CRYPTO_IMPLEMENTATION_SALT

_The salt used inside [TRAVELLING_PG_CRYPTO_IMPLEMENTATION](#TRAVELLING_PG_CRYPTO_IMPLEMENTATION). This needs to stay a secret and should be changed ever so often for [security](#security) reasons._ </br>

> **Default**: `null` This needs to be set!

##### TRAVELLING_PG_CRYPTO_ENCRYPT_USER_DATA

_Enables the `user_data` field inside the user object to be encrypted. If sensitive data is stored in within that field it is recommended to enable this._ </br>

> **Default**: `false`

---

### Email

##### TRAVELLING_EMAIL_VALIDATION_EXTERNAL_ENABLE

_Enable external email endpoint for email validation_ </br>

> **Default**: `false`

##### TRAVELLING_EMAIL_VALIDATION_EXTERNAL_ENDPOINT

_Full url for endpoint for email validation_ </br>

> **Default**: `null`

##### TRAVELLING_EMAIL_VALIDATION_EXTERNAL_EMAIL_IN_ENDPOINT

_Appends the users email to the end of the supplied endpoint. EX: http://test.com/email/test@test.com_ </br>

> **Default**: `true`

##### TRAVELLING_EMAIL_VALIDATION_EXTERNAL_EMAIL_IN_BODY

_Sends the users email as text as a body to the supplied endpoint_ </br>

> **Default**: `false`

##### TRAVELLING_EMAIL_VALIDATION_EXTERNAL_METHOD

_Supplied endpoint's HTTP Method to use_ </br>

> **Default**: `GET`

##### TRAVELLING_EMAIL_FROM

_The email that will be used as the `from` address. Recommended to set it to a no-reply email address_ </br>

> **Default**: `null`

##### TRAVELLING_EMAIL_RECOVERY_EXPIRATION

_The number of seconds for the email recovery link to last for. Recommended to keep this somewhat short-lived for [security](#security) reasons._ </br>

> **Default**: `900`

##### TRAVELLING_EMAIL_ACTIVATION_EXPIRATION

_The number of seconds for the email activation link to last for._ </br>

> **Default**: `86400`

##### TRAVELLING_EMAIL_TEST_ENABLE

_Enables the use of a test email service that will display the login credentials inside the log at start. This is used by our integration test. However, it is helpful to enable this if custom [Templates](#Templates) are written. Only one type of email support should be used `Test`, `SMTP` or `AWS`._ </br>

> **Default**: `false`

##### TRAVELLING_EMAIL_SMTP_ENABLE

_Enables the use of a SMTP email service. Only one type of email support should be used `Test`, `SMTP` or `AWS`._ </br>

> **Default**: `false`

##### TRAVELLING_EMAIL_SMTP_HOST

_The host of the SMTP service._ </br>

> **Default**: `127.0.0.1`

##### TRAVELLING_EMAIL_SMTP_PORT

_The port of the SMTP service._ </br>

> **Default**: `465`

##### TRAVELLING_EMAIL_SMTP_SECURE

_Enables TLS for SMTP._ </br>

> **Default**: `true`

##### TRAVELLING_EMAIL_SMTP_AUTH_USER

_Username for SMTP service._ </br>

> **Default**: `null`

##### TRAVELLING_EMAIL_SMTP_SECURE

_Password for SMTP service._ </br>

> **Default**: `null`

##### TRAVELLING_EMAIL_SMTP_TLS_REJECT_UNAUTHORIZED

_Enables rejection of TLS certs that are self served or invalid. Recommended to keep it enabled for [security](#security) reasons._ </br>

> **Default**: `true`

##### TRAVELLING_EMAIL_AWS_ENABLE

_Enables the use of the AWS SES email service. Only one type of email support should be used `Test`, `SMTP` or `AWS`._ </br>

> **Default**: `false`

##### TRAVELLING_EMAIL_AWS_CONFIG

_The absolute path to the AWS json credentials config to use for accessing the SES service. See AWS's configuration documentation on the format of this file._ </br>

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

_The absolute path to the email reset password template body. This is used as the body inside all reset password emails._ </br>

> **Default**: `travelling/templates/email-reset-password-body.html`

##### TRAVELLING_EMAIL_RESET_PASSWORD_TEMPLATE_SUBJECT

_The absolute path to the email reset password template subject. This is used as the subject line inside all reset password emails._ </br>

> **Default**: `templates/email-reset-password-subject.html`

##### TRAVELLING_EMAIL_ACTIVATION_TEMPLATE_BODY

_The absolute path to the email activation template body. This is used as the body inside all activation emails._ </br>

> **Default**: `templates/email-activation-body.html`

##### TRAVELLING_EMAIL_ACTIVATION_TEMPLATE_SUBJECT

_The absolute path to the email activation template subject.This is used as the subject line inside all activation emails._ </br>

> **Default**: `templates/email-activation-subject.html`

---

### Registration

##### TRAVELLING_REGISTRATION_REQUIRE_EMAIL_ACTIVATION

_Enables the requirement of each newly registered user to activate their account through the email link._ </br>

> **Default**: `false`

##### TRAVELLING_REGISTRATION_REQUIRE_MANUAL_ACTIVATION

_Enables the requirement of each newly registered user to have a active user with permissions to unlock their account for them._ </br>

> **Default**: `false`


## SDK

[SDK](./sdk/README.md)

## Classes

<dl>
<dt><a href="#Travelling">Travelling</a></dt>
<dd></dd>
<dt><a href="#Config">Config</a></dt>
<dd></dd>
<dt><a href="#Groups">Groups</a></dt>
<dd></dd>
<dt><a href="#GroupsType">GroupsType</a></dt>
<dd></dd>
<dt><a href="#Group">Group</a></dt>
<dd></dd>
<dt><a href="#GroupUsers">GroupUsers</a></dt>
<dd></dd>
<dt><a href="#GroupUser">GroupUser</a></dt>
<dd></dd>
<dt><a href="#GroupType">GroupType</a></dt>
<dd></dd>
<dt><a href="#GroupTypeUsers">GroupTypeUsers</a></dt>
<dd><p>Both requests are disabled. Dont use.</p>
</dd>
<dt><a href="#GroupTypeUser">GroupTypeUser</a></dt>
<dd></dd>
<dt><a href="#GroupRequest">GroupRequest</a></dt>
<dd></dd>
<dt><a href="#GroupRequestUser">GroupRequestUser</a></dt>
<dd></dd>
<dt><a href="#Users">Users</a></dt>
<dd></dd>
<dt><a href="#UsersDomain">UsersDomain</a></dt>
<dd></dd>
<dt><a href="#User">User</a></dt>
<dd></dd>
<dt><a href="#UserDomain">UserDomain</a></dt>
<dd></dd>
<dt><a href="#UserCurrent">UserCurrent</a></dt>
<dd></dd>
<dt><a href="#Auth">Auth</a></dt>
<dd><h4 id="auth-endpoints">Auth endpoints</h4>
</dd>
<dt><a href="#AuthToken">AuthToken</a></dt>
<dd></dd>
<dt><a href="#AuthDomain">AuthDomain</a></dt>
<dd></dd>
<dt><a href="#AuthDomainToken">AuthDomainToken</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#SDK">SDK(host, opts)</a></dt>
<dd><p>SDK - importing the SDK for use</p>
</dd>
</dl>

<a name="Travelling"></a>

## Travelling
**Kind**: global class  

* [Travelling](#Travelling)
    * [.healthCheck(authorization_bearer)](#Travelling.healthCheck)
    * [.metrics(authorization_bearer)](#Travelling.metrics)

<a name="Travelling.healthCheck"></a>

### Travelling.healthCheck(authorization_bearer)
healthCheck - server's health check

Path: health

**Kind**: static method of [<code>Travelling</code>](#Travelling)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Travelling.metrics"></a>

### Travelling.metrics(authorization_bearer)
metrics - servers metrics

Path: metrics

**Kind**: static method of [<code>Travelling</code>](#Travelling)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Config"></a>

## Config
**Kind**: global class  
<a name="Config.getProperty"></a>

### Config.getProperty(property, authorization_bearer)
getProperty - Gets a property from travellings config.

Path: api/v1/config/:property

**Kind**: static method of [<code>Config</code>](#Config)  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>any</code> | (example: password) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Groups"></a>

## Groups
**Kind**: global class  

* [Groups](#Groups)
    * [.export(authorization_bearer)](#Groups.export)
    * [.import(body, authorization_bearer)](#Groups.import)
    * [.get(authorization_bearer)](#Groups.get)

<a name="Groups.export"></a>

### Groups.export(authorization_bearer)
export - Exports all groups in the proper format to be imported.

Path: api/v1/groups/export

**Kind**: static method of [<code>Groups</code>](#Groups)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Groups.import"></a>

### Groups.import(body, authorization_bearer)
import - Imports all groups from the exported format.

Path: api/v1/groups/import

**Kind**: static method of [<code>Groups</code>](#Groups)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
    "group": {
        "anonymous": {
            "type": "group",
            "allowed": [
                {
                    "route": "/travelling/portal/*",
                    "host": null,
                    "name": "*-travelling-portal-*"
                },
                {
                    "route": "/travelling/api/v1/auth/*",
                    "host": null,
                    "name": "*-travelling-api-v1-auth-*"
                },
                {
                    "route": "/travelling/api/v1/user/me/route/allowed",
                    "host": null,
                    "method": "GET",
                    "name": "get-travelling-api-v1-user-me-route-allowed"
                },
                {
                    "route": "/travelling/api/v1/user/me/permission/allowed/*",
                    "host": null,
                    "method": "GET",
                    "name": "get-travelling-api-v1-user-me-permission-allowed-*"
                },
                {
                    "route": "/travelling/assets/*",
                    "host": null,
                    "removeFromPath": "/travelling/assets/",
                    "method": "GET",
                    "name": "get-travelling-assets-*"
                },
                {
                    "route": "/travelling/api/v1/config/password",
                    "host": null,
                    "method": "GET",
                    "name": "get-travelling-api-v1-config-password"
                },
                {
                    "route": "/favicon.ico",
                    "host": null,
                    "method": "GET",
                    "name": "get-favicon.ico"
                }
            ],
            "inherited": null,
            "is_default": false
        },
        "group3": {
            "type": "group",
            "allowed": null,
            "inherited": [
                "testgroup|group1",
                "group|group2"
            ],
            "is_default": false
        },
        "superadmin": {
            "type": "group",
            "allowed": [
                {
                    "host": null,
                    "route": "/travelling/*",
                    "name": "*-travelling-*"
                },
                {
                    "name": "test-one-*-three"
                }
            ],
            "inherited": [
                "group|anonymous"
            ],
            "is_default": false
        },
        "group4": {
            "type": "group",
            "allowed": null,
            "inherited": [],
            "is_default": false
        },
        "group2": {
            "type": "group",
            "allowed": [
                {
                    "route": "/test/get",
                    "host": "https://127.0.0.1:4268/:username/:group",
                    "removeFromPath": "/test/get",
                    "method": "GET",
                    "name": "get-test-get"
                },
                {
                    "route": "/test/post",
                    "host": "http://127.0.0.1:4267/?id=:id&permission=:permission",
                    "removeFromPath": "/test/post",
                    "method": "POST",
                    "name": "post-test-post"
                }
            ],
            "inherited": [
                "testgroup|group1"
            ],
            "is_default": false
        },
        "group5": {
            "type": "group",
            "allowed": [
                {
                    "route": "/test/delete/:grouptype",
                    "host": "https://127.0.0.1:4268",
                    "removeFromPath": "/test/delete",
                    "method": "DELETE",
                    "name": "delete-test-delete-:grouptype"
                }
            ],
            "inherited": [
                "group|group4",
                "group|superadmin"
            ],
            "is_default": true
        },
        "group1": {
            "type": "group",
            "allowed": null,
            "inherited": null,
            "is_default": false
        }
    },
    "testgroup": {
        "group1": {
            "type": "testgroup",
            "allowed": null,
            "inherited": [
                "group|group4"
            ],
            "is_default": false
        },
        "superadmin": {
            "type": "testgroup",
            "allowed": null,
            "inherited": null,
            "is_default": false
        }
    }
}
```
<a name="Groups.get"></a>

### Groups.get(authorization_bearer)
get - Get all the groups

Path: api/v1/groups

**Kind**: static method of [<code>Groups</code>](#Groups)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupsType"></a>

## GroupsType
**Kind**: global class  

* [GroupsType](#GroupsType)
    * [.all(type, authorization_bearer)](#GroupsType.all)
    * [.getTypesList(authorization_bearer)](#GroupsType.getTypesList)

<a name="GroupsType.all"></a>

### GroupsType.all(type, authorization_bearer)
all - Gets all groups of a particular type

Path: api/v1/groups/type/:type

**Kind**: static method of [<code>GroupsType</code>](#GroupsType)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | The type of the group |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupsType.getTypesList"></a>

### GroupsType.getTypesList(authorization_bearer)
getTypesList - Gets all the types of groups currently made.

Path: api/v1/groups/types

**Kind**: static method of [<code>GroupsType</code>](#GroupsType)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Group"></a>

## Group
**Kind**: global class  

* [Group](#Group)
    * [.addPermission(id, permission, authorization_bearer)](#Group.addPermission)
    * [.deletePermission(id, permission, authorization_bearer)](#Group.deletePermission)
    * [.addRoute(body, id, authorization_bearer)](#Group.addRoute)
    * [.removeInheritance(id, inherited, grouptype, authorization_bearer)](#Group.removeInheritance)
    * [.inheritFrom(id, inherited, grouptype, authorization_bearer)](#Group.inheritFrom)
    * [.setDefault(id, authorization_bearer)](#Group.setDefault)
    * [.delete(id, authorization_bearer)](#Group.delete)
    * [.edit(body, id, authorization_bearer)](#Group.edit)
    * [.get(id, authorization_bearer)](#Group.get)
    * [.createByName(id, authorization_bearer)](#Group.createByName)
    * [.create(body, authorization_bearer)](#Group.create)

<a name="Group.addPermission"></a>

### Group.addPermission(id, permission, authorization_bearer)
addPermission - Adds a permission to a group.

Path: api/v1/group/id/:id/insert/permission/:permission

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Name of the group (example: anonymous) |
| permission | <code>any</code> | Permission (example: test-one-two-*) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Group.deletePermission"></a>

### Group.deletePermission(id, permission, authorization_bearer)
deletePermission - Removes a permission/route from a group.

Path: api/v1/group/id/:id/permission/:permission

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Name of the group (example: anonymous) |
| permission | <code>any</code> | Name or Route (example: test-one-two-*) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Group.addRoute"></a>

### Group.addRoute(body, id, authorization_bearer)
addRoute - Adds a route to a group.

```javascript
{
    "route": "test/permissions/*", // optional
    "host": null, // optional, defaults to travelling host
    "method": "*", // optional, defaults to '*'
    "remove_from_path": 'test/', // optional 
    "name": "test-permissions-*"  // Required and needs to be unqiue, defaults to method + route seperated by '-' instead of `/`
}
```

Path: api/v1/group/id/:id/insert/route

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| id | <code>any</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"route": "test/permissions/*",
    "host": null, 
    "method": "*", 
    "name": "test-permissions-*"  
}
```
<a name="Group.removeInheritance"></a>

### Group.removeInheritance(id, inherited, grouptype, authorization_bearer)
removeInheritance - Removes an inheritance from a group.

Path: api/v1/group/id/:id/remove/inheritance/:inherited/type/:grouptype

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Name of the group (example: test1234) |
| inherited | <code>any</code> | Name of the group to inherit from (example: group4) |
| grouptype | <code>any</code> | The type of the inherited group |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Group.inheritFrom"></a>

### Group.inheritFrom(id, inherited, grouptype, authorization_bearer)
inheritFrom - Adds an inheritance to a group.

Path: api/v1/group/id/:id/inherit/from/:inherited/type/:grouptype

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Name of the group (example: test1234) |
| inherited | <code>any</code> | Name of the group to inherit from (example: group4) |
| grouptype | <code>any</code> | The type of the inherited group |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Group.setDefault"></a>

### Group.setDefault(id, authorization_bearer)
setDefault - Sets the group to be the default group for new users.

Path: api/v1/group/id/:id/set/default

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name (example: group6) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Group.delete"></a>

### Group.delete(id, authorization_bearer)
delete - delete group by its id or name

Path: api/v1/group/id/:id

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Group.edit"></a>

### Group.edit(body, id, authorization_bearer)
edit - Edits a group

Path: api/v1/group/id/:id

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| id | <code>any</code> | (example: ab31efc8-40a5-4d38-a347-adb4e38d0075) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
    "allowed": [
        {
            "route": "/travelling/portal/*",
            "host": null,
            "remove_from_path": "/travelling/portal",
            "method": "*",
            "name": "*-travelling-portal-*"
        },
        {
            "route": "/travelling/api/v1/auth/*",
            "host": null,
            "method": "*",
            "name": "*-travelling-api-v1-auth-*"
        },
        {
            "route": "/travelling/api/v1/user/me/route/allowed",
            "host": null,
            "method": "GET",
            "name": "get-travelling-api-v1-user-me-route-allowed"
        },
        {
            "route": "/travelling/api/v1/user/me/permission/allowed/*",
            "host": null,
            "method": "GET",
            "name": "get-travelling-api-v1-user-me-permission-allowed-*"
        },
        {
            "route": "/travelling/assets/*",
            "host": null,
            "remove_from_path": "/travelling/assets/",
            "method": "*",
            "name": "*-travelling-assets-*"
        },
        {
            "route": "travelling/api/v1/config/password",
            "host": null,
            "method": "get"
        }
    ]
}
```
<a name="Group.get"></a>

### Group.get(id, authorization_bearer)
get - Get a group by it's id or name.

Path: api/v1/group/id/:id

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name  (example: group1) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Group.createByName"></a>

### Group.createByName(id, authorization_bearer)
createByName - Add a new blank group with the set name.

Path: api/v1/group/id/:id

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Name of the new group (example: test123) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Group.create"></a>

### Group.create(body, authorization_bearer)
create - Add a new group

Path: api/v1/group

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
    "name": "group1",
    "type": "testgroup",
    "allowed": [
        {
            "route": "/test",
            "host": "http://127.0.0.1:1237/",
            "remove_from_path": "test",
            "method": "*",
            "name": "all-test"
        }
    ],
    "is_default": false
}
```
<a name="GroupUsers"></a>

## GroupUsers
**Kind**: global class  

* [GroupUsers](#GroupUsers)
    * [.inherited(id)](#GroupUsers.inherited)
    * [.get(id)](#GroupUsers.get)

<a name="GroupUsers.inherited"></a>

### GroupUsers.inherited(id)
inherited - Gets all the users that belong to the group and all of its inherited groups.

##### Optional Query Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |

Path: api/v1/group/id/:id/users/inherited

**Kind**: static method of [<code>GroupUsers</code>](#GroupUsers)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name (example: superadmin) |

<a name="GroupUsers.get"></a>

### GroupUsers.get(id)
get - Gets all the users that belong to the group.

##### Optional Query Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |

Path: api/v1/group/id/:id/users

**Kind**: static method of [<code>GroupUsers</code>](#GroupUsers)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name (example: superadmin) |

<a name="GroupUser"></a>

## GroupUser
**Kind**: global class  

* [GroupUser](#GroupUser)
    * [.delete(group, type, id, authorization_bearer)](#GroupUser.delete)
    * [.removeGroupInheritance(group, type, id, inheritgroupid, inheritgrouptype, authorization_bearer)](#GroupUser.removeGroupInheritance)
    * [.addGroupInheritance(group, type, id, inheritgroupid, inheritgrouptype, authorization_bearer)](#GroupUser.addGroupInheritance)
    * [.editPropertyValue(group, type, id, property, value, authorization_bearer)](#GroupUser.editPropertyValue)
    * [.editProperty(body, group, type, id, property, authorization_bearer)](#GroupUser.editProperty)
    * [.edit(body, group, type, id, authorization_bearer)](#GroupUser.edit)
    * [.getProperty(group, type, id, property, authorization_bearer)](#GroupUser.getProperty)
    * [.get(group, type, id, authorization_bearer)](#GroupUser.get)

<a name="GroupUser.delete"></a>

### GroupUser.delete(group, type, id, authorization_bearer)
delete - Delete a user by it's id or username from group of a particular type.

Path: api/v1/group/id/:group/type/:type/user/:id

**Kind**: static method of [<code>GroupUser</code>](#GroupUser)  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>any</code> | id or name of the group |
| type | <code>any</code> | The type of the group (example: accounts) |
| id | <code>any</code> | id or name (example: user7) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupUser.removeGroupInheritance"></a>

### GroupUser.removeGroupInheritance(group, type, id, inheritgroupid, inheritgrouptype, authorization_bearer)
removeGroupInheritance - Remove a user to a group of a particular type of group.

Path: api/v1/group/id/:group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype

**Kind**: static method of [<code>GroupUser</code>](#GroupUser)  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>any</code> | id or name of the group (example: group1) |
| type | <code>any</code> | type of group (example: group) |
| id | <code>any</code> | id or name of the user (example: user5) |
| inheritgroupid | <code>any</code> | id or name of the  group to inherit (example: group2) |
| inheritgrouptype | <code>any</code> | type of the  group to inherit (example: group) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupUser.addGroupInheritance"></a>

### GroupUser.addGroupInheritance(group, type, id, inheritgroupid, inheritgrouptype, authorization_bearer)
addGroupInheritance - Add a group for the current user from a group of a particular type.

Path: api/v1/group/id/:group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype

**Kind**: static method of [<code>GroupUser</code>](#GroupUser)  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>any</code> | id or name of the group (example: group1) |
| type | <code>any</code> | type of group (example: group) |
| id | <code>any</code> | id or name of the user (example: user5) |
| inheritgroupid | <code>any</code> | id or name of the  group to inherit (example: group2) |
| inheritgrouptype | <code>any</code> | type of the  group to inherit (example: group) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupUser.editPropertyValue"></a>

### GroupUser.editPropertyValue(group, type, id, property, value, authorization_bearer)
editPropertyValue - Edit a current user's property data as a path param from a group of a particular type.

Path: api/v1/group/id/:group/type/:type/user/:id/property/:property/:value

**Kind**: static method of [<code>GroupUser</code>](#GroupUser)  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>any</code> | id or name of the group |
| type | <code>any</code> | The type of the group (example: group) |
| id | <code>any</code> | id or name (example: user5) |
| property | <code>any</code> | (example: email) |
| value | <code>any</code> | (example: swag@yolo.com) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupUser.editProperty"></a>

### GroupUser.editProperty(body, group, type, id, property, authorization_bearer)
editProperty - Edit a user's property by it's id or username from a group of a particular type.

Path: api/v1/group/id/:group/type/:type/user/:id/property/:property

**Kind**: static method of [<code>GroupUser</code>](#GroupUser)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| group | <code>any</code> | id or name of the group |
| type | <code>any</code> | The type of the group (example: accounts) |
| id | <code>any</code> | id or name (example: user6) |
| property | <code>any</code> | (example: email) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"locked": false
}
```
<a name="GroupUser.edit"></a>

### GroupUser.edit(body, group, type, id, authorization_bearer)
edit - Edit a user by it's id or username from group of a particular type.

Path: api/v1/group/id/:group/type/:type/user/:id

**Kind**: static method of [<code>GroupUser</code>](#GroupUser)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| group | <code>any</code> | id or name of the group |
| type | <code>any</code> | The type of the group (example: accounts) |
| id | <code>any</code> | id or name (example: user6) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"locked": false
}
```
<a name="GroupUser.getProperty"></a>

### GroupUser.getProperty(group, type, id, property, authorization_bearer)
getProperty - Get a user's property by it's id or username from group of a particular type.

Path: api/v1/group/id/:group/type/:type/user/:id/property/:property

**Kind**: static method of [<code>GroupUser</code>](#GroupUser)  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>any</code> | id or name of the group |
| type | <code>any</code> | The type of the group (example: accounts) |
| id | <code>any</code> | id or name (example: user6) |
| property | <code>any</code> | (example: email) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupUser.get"></a>

### GroupUser.get(group, type, id, authorization_bearer)
get - Get a user by it's id or username from group of a particular type.

Path: api/v1/group/id/:group/type/:type/user/:id

**Kind**: static method of [<code>GroupUser</code>](#GroupUser)  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>any</code> | id or name of the group |
| type | <code>any</code> | The type of the group (example: accounts) |
| id | <code>any</code> | id or name (example: user6) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupType"></a>

## GroupType
**Kind**: global class  

* [GroupType](#GroupType)
    * [.deletePermission(id, type, permission, authorization_bearer)](#GroupType.deletePermission)
    * [.addPermission(id, type, permission, authorization_bearer)](#GroupType.addPermission)
    * [.addRoute(body, id, type, authorization_bearer)](#GroupType.addRoute)
    * [.removeInheritance(id, type, inherited, grouptype, authorization_bearer)](#GroupType.removeInheritance)
    * [.inheritFrom(id, type, inherited, grouptype, authorization_bearer)](#GroupType.inheritFrom)
    * [.setDefault(id, type)](#GroupType.setDefault)
    * [.delete(id, type, authorization_bearer)](#GroupType.delete)
    * [.get(id, type, authorization_bearer)](#GroupType.get)
    * [.edit(body, id, type, authorization_bearer)](#GroupType.edit)
    * [.createByName(id, type, authorization_bearer)](#GroupType.createByName)
    * [.create(body, type, authorization_bearer)](#GroupType.create)

<a name="GroupType.deletePermission"></a>

### GroupType.deletePermission(id, type, permission, authorization_bearer)
deletePermission - Removes a permission/route from a group of a particular type.

Path: api/v1/group/id/:id/type/:type/permission/:permission

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Name of the group (example: anonymous) |
| type | <code>any</code> | Type of the group (example: group) |
| permission | <code>any</code> | Name or Route (example: test-one-three-*) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupType.addPermission"></a>

### GroupType.addPermission(id, type, permission, authorization_bearer)
addPermission - Adds a permission to a group of a particular type.

Path: api/v1/group/id/:id/type/:type/insert/permission/:permission

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Name of the group (example: anonymous) |
| type | <code>any</code> | Type of the group (example: group) |
| permission | <code>any</code> | Permission  (example: test-one-three-*) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupType.addRoute"></a>

### GroupType.addRoute(body, id, type, authorization_bearer)
addRoute - Adds a route to a group of a particular type.

```javascript
{
    "route": "test/permissions/*", // optional
    "host": null, // optional, defaults to travelling host
    "method": "*", // optional, defaults to '*'
    "remove_from_path": 'test/', // optional 
    "name": "test-permissions-*"  // Required and needs to be unqiue, defaults to method + route seperated by '-' instead of `/`
}
```

Path: api/v1/group/id/:id/type/:type/insert/route

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| id | <code>any</code> | Name of the group |
| type | <code>any</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"route": "test/permissions/*",
    "host": null, 
    "method": "*", 
    "name": "test-permissions-*"  
}
```
<a name="GroupType.removeInheritance"></a>

### GroupType.removeInheritance(id, type, inherited, grouptype, authorization_bearer)
removeInheritance - Removes an inheritance from a group of a particular type.

Path: api/v1/group/id/:id/type/:type/remove/inheritance/:inherited/type/:grouptype

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Name of the group (example: test1234) |
| type | <code>any</code> | The type of the group (example: accounts) |
| inherited | <code>any</code> | Name of the group to inherit from (example: superadmin) |
| grouptype | <code>any</code> | The type of the inherited group |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupType.inheritFrom"></a>

### GroupType.inheritFrom(id, type, inherited, grouptype, authorization_bearer)
inheritFrom - Adds an inheritance to a group of a particular type.

Path: api/v1/group/id/:id/type/:type/inherit/from/:inherited/type/:grouptype

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Name of the group (example: group1) |
| type | <code>any</code> | The type of the group (example: testgroup) |
| inherited | <code>any</code> | Name of the group to inherit from (example: test123) |
| grouptype | <code>any</code> | The type of the inherited group |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupType.setDefault"></a>

### GroupType.setDefault(id, type)
setDefault - Sets the group of a particular type to be the default group for new users.

Path: api/v1/group/id/:id/type/:type/set/default

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name (example: group1) |
| type | <code>any</code> | The type of the group (example: account) |

<a name="GroupType.delete"></a>

### GroupType.delete(id, type, authorization_bearer)
delete - delete group of a particular type by its name or id

Path: api/v1/group/id/:id/type/:type

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name |
| type | <code>any</code> | The type of the group |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupType.get"></a>

### GroupType.get(id, type, authorization_bearer)
get - Get a group by it's id or name of a particular type.

Path: api/v1/group/id/:id/type/:type

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name  (example: group1) |
| type | <code>any</code> | The type of the group (example: accounts) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupType.edit"></a>

### GroupType.edit(body, id, type, authorization_bearer)
edit - Edits a group of a particular type

Path: api/v1/group/id/:id/type/:type

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| id | <code>any</code> | id or name |
| type | <code>any</code> | The type of the group |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{"inherited":["a717b880-b17b-4995-9610-cf451a06d015","7ec8c351-7b8a-4ea8-95cc-0d990b225768"]}
```
<a name="GroupType.createByName"></a>

### GroupType.createByName(id, type, authorization_bearer)
createByName - Add a new blank group with the set name and type

Path: api/v1/group/id/:id/type/:type

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Name of the new group (example: test1234) |
| type | <code>any</code> | Type of the new group (example: accounts) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupType.create"></a>

### GroupType.create(body, type, authorization_bearer)
create - Add a new group of a particular type

Path: api/v1/group/type/:type

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| type | <code>any</code> | The type of the group |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
    "name": "group1",
    "type": "accounts",
    "allowed": [
        {
            "route": "/test",
            "host": "http://127.0.0.1:1237/",
            "remove_from_path": "test",
            "method": "*",
            "name": "all-test"
        }
    ],
    "is_default": false
}
```
<a name="GroupTypeUsers"></a>

## GroupTypeUsers
Both requests are disabled. Dont use.

**Kind**: global class  

* [GroupTypeUsers](#GroupTypeUsers)
    * [.get(id, type)](#GroupTypeUsers.get)
    * [.inherited(id, type)](#GroupTypeUsers.inherited)

<a name="GroupTypeUsers.get"></a>

### GroupTypeUsers.get(id, type)
get - Gets all the users that belong to the group  of a particular type by its name or id.

##### Optional Query Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |

Path: api/v1/group/id/:id/type/:type/users

**Kind**: static method of [<code>GroupTypeUsers</code>](#GroupTypeUsers)  

| Param | Type |
| --- | --- |
| id | <code>any</code> | 
| type | <code>any</code> | 

<a name="GroupTypeUsers.inherited"></a>

### GroupTypeUsers.inherited(id, type)
inherited - Gets all the users that belong to the group  of a particular type by its name or id and all of its inherited groups.

##### Optional Query Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |

Path: api/v1/group/id/:id/type/:type/users/inherited

**Kind**: static method of [<code>GroupTypeUsers</code>](#GroupTypeUsers)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | (example: group4) |
| type | <code>any</code> | The type of the group (example: groups) |

<a name="GroupTypeUser"></a>

## GroupTypeUser
**Kind**: global class  

* [GroupTypeUser](#GroupTypeUser)
    * [.delete(type, id, authorization_bearer)](#GroupTypeUser.delete)
    * [.removeGroupInheritance(type, id, inheritgroupid, inheritgrouptype, authorization_bearer)](#GroupTypeUser.removeGroupInheritance)
    * [.addGroupInheritance(type, id, inheritgroupid, inheritgrouptype, authorization_bearer)](#GroupTypeUser.addGroupInheritance)
    * [.editPropertyValue(type, id, property, value, authorization_bearer)](#GroupTypeUser.editPropertyValue)
    * [.editProperty(body, type, id, property, authorization_bearer)](#GroupTypeUser.editProperty)
    * [.edit(body, type, id, authorization_bearer)](#GroupTypeUser.edit)
    * [.getProperty(type, id, property, authorization_bearer)](#GroupTypeUser.getProperty)
    * [.get(type, id, authorization_bearer)](#GroupTypeUser.get)

<a name="GroupTypeUser.delete"></a>

### GroupTypeUser.delete(type, id, authorization_bearer)
delete - Delete a user by it's id or username from group of a particular type.

Path: api/v1/group/type/:type/user/:id

**Kind**: static method of [<code>GroupTypeUser</code>](#GroupTypeUser)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | The type of the group (example: accounts) |
| id | <code>any</code> | id or name (example: user7) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupTypeUser.removeGroupInheritance"></a>

### GroupTypeUser.removeGroupInheritance(type, id, inheritgroupid, inheritgrouptype, authorization_bearer)
removeGroupInheritance - Remove a user to a group of a particular type of group.

Path: api/v1/group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype

**Kind**: static method of [<code>GroupTypeUser</code>](#GroupTypeUser)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | type of group (example: group) |
| id | <code>any</code> | id or name of the user (example: user5) |
| inheritgroupid | <code>any</code> | id or name of the  group to inherit (example: group2) |
| inheritgrouptype | <code>any</code> | type of the  group to inherit (example: group) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupTypeUser.addGroupInheritance"></a>

### GroupTypeUser.addGroupInheritance(type, id, inheritgroupid, inheritgrouptype, authorization_bearer)
addGroupInheritance - Add a user to a group of a particular type of group.

Path: api/v1/group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype

**Kind**: static method of [<code>GroupTypeUser</code>](#GroupTypeUser)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | type of group (example: group) |
| id | <code>any</code> | id or name of the user (example: user5) |
| inheritgroupid | <code>any</code> | id or name of the  group to inherit (example: group2) |
| inheritgrouptype | <code>any</code> | type of the  group to inherit (example: group) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupTypeUser.editPropertyValue"></a>

### GroupTypeUser.editPropertyValue(type, id, property, value, authorization_bearer)
editPropertyValue - Edit a current user's property data as a path param from a group of a particular type.

Path: api/v1/group/type/:type/user/:id/property/:property/:value

**Kind**: static method of [<code>GroupTypeUser</code>](#GroupTypeUser)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | The type of the group (example: group) |
| id | <code>any</code> | id or name (example: user5) |
| property | <code>any</code> | (example: email) |
| value | <code>any</code> | (example: swag@yolo.com) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupTypeUser.editProperty"></a>

### GroupTypeUser.editProperty(body, type, id, property, authorization_bearer)
editProperty - Edit a user's property by it's id or username from a group of a particular type.

Path: api/v1/group/type/:type/user/:id/property/:property

**Kind**: static method of [<code>GroupTypeUser</code>](#GroupTypeUser)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| type | <code>any</code> | The type of the group (example: accounts) |
| id | <code>any</code> | id or name (example: user6) |
| property | <code>any</code> | (example: email) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"locked": false
}
```
<a name="GroupTypeUser.edit"></a>

### GroupTypeUser.edit(body, type, id, authorization_bearer)
edit - Edit a user by it's id or username from group of a particular type.

Path: api/v1/group/type/:type/user/:id

**Kind**: static method of [<code>GroupTypeUser</code>](#GroupTypeUser)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| type | <code>any</code> | The type of the group (example: accounts) |
| id | <code>any</code> | id or name (example: user6) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"locked": false
}
```
<a name="GroupTypeUser.getProperty"></a>

### GroupTypeUser.getProperty(type, id, property, authorization_bearer)
getProperty - Get a user's property by it's id or username from group of a particular type.

Path: api/v1/group/type/:type/user/:id/property/:property

**Kind**: static method of [<code>GroupTypeUser</code>](#GroupTypeUser)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | The type of the group (example: accounts) |
| id | <code>any</code> | id or name (example: user6) |
| property | <code>any</code> | (example: email) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupTypeUser.get"></a>

### GroupTypeUser.get(type, id, authorization_bearer)
get - Get a user by it's id or username from group of a particular type.

Path: api/v1/group/type/:type/user/:id

**Kind**: static method of [<code>GroupTypeUser</code>](#GroupTypeUser)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | The type of the group (example: accounts) |
| id | <code>any</code> | id or name (example: user6) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupRequest"></a>

## GroupRequest
**Kind**: global class  
<a name="GroupRequestUser"></a>

## GroupRequestUser
**Kind**: global class  

* [GroupRequestUser](#GroupRequestUser)
    * [.delete(body, type, id, authorization_bearer)](#GroupRequestUser.delete)
    * [.addGroupInheritance(type, id, inheritgroupid, inheritgrouptype, authorization_bearer)](#GroupRequestUser.addGroupInheritance)
    * [.editProperty(body, type, id, property, authorization_bearer)](#GroupRequestUser.editProperty)
    * [.edit(body, type, id, authorization_bearer)](#GroupRequestUser.edit)

<a name="GroupRequestUser.delete"></a>

### GroupRequestUser.delete(body, type, id, authorization_bearer)
delete - Delete a user by it's id or username from the user's `group_request` of a particular type.

Path: api/v1/group/request/type/:type/user/:id

**Kind**: static method of [<code>GroupRequestUser</code>](#GroupRequestUser)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| type | <code>any</code> | (example: testgroup) |
| id | <code>any</code> | (example: user69) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"locked": false
}
```
<a name="GroupRequestUser.addGroupInheritance"></a>

### GroupRequestUser.addGroupInheritance(type, id, inheritgroupid, inheritgrouptype, authorization_bearer)
addGroupInheritance - Add a user to a group from the user's `group_request` of a particular type.

Path: api/v1/group/request/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype

**Kind**: static method of [<code>GroupRequestUser</code>](#GroupRequestUser)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | type of group (example: group) |
| id | <code>any</code> | id or name of the user (example: user5) |
| inheritgroupid | <code>any</code> | id or name of the  group to inherit (example: group2) |
| inheritgrouptype | <code>any</code> | type of the  group to inherit (example: group) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupRequestUser.editProperty"></a>

### GroupRequestUser.editProperty(body, type, id, property, authorization_bearer)
editProperty - Edit a user's property by it's id or username from the user's `group_request` of a particular type.

Path: api/v1/group/request/type/:type/user/:id/property/:property

**Kind**: static method of [<code>GroupRequestUser</code>](#GroupRequestUser)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| type | <code>any</code> | (example: accounts) |
| id | <code>any</code> | (example: user6) |
| property | <code>any</code> | (example: email) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
"chad@yolo.com"
```
<a name="GroupRequestUser.edit"></a>

### GroupRequestUser.edit(body, type, id, authorization_bearer)
edit - Edit a user by it's id or username from the user's `group_request` of a particular type.

Path: api/v1/group/request/type/:type/user/:id

**Kind**: static method of [<code>GroupRequestUser</code>](#GroupRequestUser)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| type | <code>any</code> | (example: accounts) |
| id | <code>any</code> | (example: user6) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"locked": false
}
```
<a name="Users"></a>

## Users
**Kind**: global class  

* [Users](#Users)
    * [.byGroupRequest(group_request, authorization_bearer)](#Users.byGroupRequest)
    * [.count(limit, skip, filter, authorization_bearer)](#Users.count)
    * [.get(sort, limit, skip, filter, sortdir, authorization_bearer)](#Users.get)

<a name="Users.byGroupRequest"></a>

### Users.byGroupRequest(group_request, authorization_bearer)
byGroupRequest - Gets all the users that have the specified group request

##### Optional Query Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |

Path: api/v1/users/group/request/:group_request

**Kind**: static method of [<code>Users</code>](#Users)  

| Param | Type | Description |
| --- | --- | --- |
| group_request | <code>any</code> | name of the group  (example: superadmin) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Users.count"></a>

### Users.count(limit, skip, filter, authorization_bearer)
count - Gets all the users

##### Optional Query Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |

Path: api/v1/users/count

**Kind**: static method of [<code>Users</code>](#Users)  

| Param | Type | Description |
| --- | --- | --- |
| limit | <code>any</code> | Number of maximum results. (example: 2) (example: 2) |
| skip | <code>any</code> | Number of db rows skipped. (example: 10) (example: 10) |
| filter | <code>any</code> | Filter parameters (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) (example: created_on>2021-06-06,created_on<2021-06-08) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Users.get"></a>

### Users.get(sort, limit, skip, filter, sortdir, authorization_bearer)
get - Gets all the users

##### Filter Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |

Path: api/v1/users

**Kind**: static method of [<code>Users</code>](#Users)  

| Param | Type | Description |
| --- | --- | --- |
| sort | <code>any</code> | Sort by any user object key (examples: id, domain, locked, etc.) (example: created_on) |
| limit | <code>any</code> | Number of maximum results. (example: 2) (example: 2) |
| skip | <code>any</code> | Number of db rows skipped. (example: 10) (example: 10) |
| filter | <code>any</code> | Filter parameters (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) |
| sortdir | <code>any</code> | Sort direction (example ascending order: ASC) (example: ASC) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UsersDomain"></a>

## UsersDomain
**Kind**: global class  

* [UsersDomain](#UsersDomain)
    * [.count(domain, limit, skip, filter, authorization_bearer)](#UsersDomain.count)
    * [.get(domain, sort, limit, skip, filter, sortdir, authorization_bearer)](#UsersDomain.get)

<a name="UsersDomain.count"></a>

### UsersDomain.count(domain, limit, skip, filter, authorization_bearer)
count - Gets all the users

##### Optional Query Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |

Path: api/v1/users/domain/:domain/count

**Kind**: static method of [<code>UsersDomain</code>](#UsersDomain)  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>any</code> | (example: test.com) |
| limit | <code>any</code> | Number of maximum results. (example: 2) (example: 5) |
| skip | <code>any</code> | Number of db rows skipped. (example: 10) (example: 10) |
| filter | <code>any</code> | Filter parameters (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) (example: created_on>2022-06-01,created_on<2022-06-08) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UsersDomain.get"></a>

### UsersDomain.get(domain, sort, limit, skip, filter, sortdir, authorization_bearer)
get - Gets all the users

##### Filter Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |

Path: api/v1/users/domain/:domain

**Kind**: static method of [<code>UsersDomain</code>](#UsersDomain)  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>any</code> | (example: test.com) |
| sort | <code>any</code> | Sort by any user object key (examples: id, domain, locked, etc.) (example: created_on) |
| limit | <code>any</code> | Number of maximum results. (example: 2) (example: 1) |
| skip | <code>any</code> | Number of db rows skipped. (example: 10) (example: 10) |
| filter | <code>any</code> | Filter parameters (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) (example: created_on>2021-06-01,created_on<2021-06-08) |
| sortdir | <code>any</code> | Sort direction (example ascending order: ASC) (example: ASC) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User"></a>

## User
**Kind**: global class  

* [User](#User)
    * [.delete(id, authorization_bearer)](#User.delete)
    * [.removeGroupInheritance(id, inheritgroupid, inheritgrouptype, authorization_bearer)](#User.removeGroupInheritance)
    * [.addGroupInheritance(id, inheritgroupid, inheritgrouptype, authorization_bearer)](#User.addGroupInheritance)
    * [.editPropertyValue(id, property, value, authorization_bearer)](#User.editPropertyValue)
    * [.editProperty(body, id, property, authorization_bearer)](#User.editProperty)
    * [.edit(body, id, authorization_bearer)](#User.edit)
    * [.getProperty(id, property, authorization_bearer)](#User.getProperty)
    * [.get(id, authorization_bearer)](#User.get)

<a name="User.delete"></a>

### User.delete(id, authorization_bearer)
delete - Delete a user by it's Id.

Path: api/v1/user/id/:id

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User.removeGroupInheritance"></a>

### User.removeGroupInheritance(id, inheritgroupid, inheritgrouptype, authorization_bearer)
removeGroupInheritance - Remove a user from a group.

Path: api/v1/user/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name of the user (example: user5) |
| inheritgroupid | <code>any</code> | id or name of the  group to inherit (example: group2) |
| inheritgrouptype | <code>any</code> | type of the  group to inherit (example: group) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User.addGroupInheritance"></a>

### User.addGroupInheritance(id, inheritgroupid, inheritgrouptype, authorization_bearer)
addGroupInheritance - Add a user to a group.

Path: api/v1/user/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name of the user (example: user5) |
| inheritgroupid | <code>any</code> | id or name of the  group to inherit (example: group2) |
| inheritgrouptype | <code>any</code> | type of the  group to inherit (example: group) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User.editPropertyValue"></a>

### User.editPropertyValue(id, property, value, authorization_bearer)
editPropertyValue - Edit a current user's property data as a path param.

Path: api/v1/user/id/:id/property/:property/:value

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Id or Username |
| property | <code>any</code> | (example: group_id) |
| value | <code>any</code> | (example: 595d3f9a-5383-4da9-a465-b975d8a5e28e) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User.editProperty"></a>

### User.editProperty(body, id, property, authorization_bearer)
editProperty - Edit a user's property by id.

Path: api/v1/user/id/:id/property/:property

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| id | <code>any</code> | Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA) |
| property | <code>any</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```text
user6
```
<a name="User.edit"></a>

### User.edit(body, id, authorization_bearer)
edit - Edit a user's by id.

Path: api/v1/user/id/:id

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| id | <code>any</code> | Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"username" : "user6",
	"password" : "Awickednewawesomepasword4242!@"
}
```
<a name="User.getProperty"></a>

### User.getProperty(id, property, authorization_bearer)
getProperty - Get a user's property by it's id.

Path: api/v1/user/id/:id/property/:property

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA) |
| property | <code>any</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User.get"></a>

### User.get(id, authorization_bearer)
get - Get a user by it's id.

Path: api/v1/user/id/:id

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserDomain"></a>

## UserDomain
**Kind**: global class  

* [UserDomain](#UserDomain)
    * [.delete(domain, id, authorization_bearer)](#UserDomain.delete)
    * [.removeGroupInheritance(domain, id, inheritgroupid, inheritgrouptype, authorization_bearer)](#UserDomain.removeGroupInheritance)
    * [.addGroupInheritance(domain, id, inheritgroupid, inheritgrouptype, authorization_bearer)](#UserDomain.addGroupInheritance)
    * [.editPropertyValue(domain, id, property, value, authorization_bearer)](#UserDomain.editPropertyValue)
    * [.editProperty(body, domain, id, property, authorization_bearer)](#UserDomain.editProperty)
    * [.edit(body, domain, id, authorization_bearer)](#UserDomain.edit)
    * [.getProperty(domain, id, property, authorization_bearer)](#UserDomain.getProperty)
    * [.get(domain, id, authorization_bearer)](#UserDomain.get)

<a name="UserDomain.delete"></a>

### UserDomain.delete(domain, id, authorization_bearer)
delete - Delete a user by it's Id.

Path: api/v1/user/domain/:domain/id/:id

**Kind**: static method of [<code>UserDomain</code>](#UserDomain)  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>any</code> | Domain (example: test.com) (example: test.com) |
| id | <code>any</code> | id, username or email. (example: 75d2ed5e-bc5b-4129-a1ec-657cf27e6294) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserDomain.removeGroupInheritance"></a>

### UserDomain.removeGroupInheritance(domain, id, inheritgroupid, inheritgrouptype, authorization_bearer)
removeGroupInheritance - Remove a user from a group.

Path: api/v1/user/domain/:domain/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype

**Kind**: static method of [<code>UserDomain</code>](#UserDomain)  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>any</code> | Domain (example: test.com) (example: test.com) |
| id | <code>any</code> | id, username or email. (example: d1bf9986-9938-4d47-b8aa-79184b37cc16) |
| inheritgroupid | <code>any</code> | id or name of the group to inherit (example: group1) |
| inheritgrouptype | <code>any</code> | type of the group to inherit (example: testgroup) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserDomain.addGroupInheritance"></a>

### UserDomain.addGroupInheritance(domain, id, inheritgroupid, inheritgrouptype, authorization_bearer)
addGroupInheritance - Add a user to a group.

Path: api/v1/user/domain/:domain/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype

**Kind**: static method of [<code>UserDomain</code>](#UserDomain)  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>any</code> | Domain (example: test.com) (example: test.com) |
| id | <code>any</code> | id, username or email. (example: user5) |
| inheritgroupid | <code>any</code> | id or name of the group to inherit (example: group2) |
| inheritgrouptype | <code>any</code> | type of the group to inherit (example: group) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserDomain.editPropertyValue"></a>

### UserDomain.editPropertyValue(domain, id, property, value, authorization_bearer)
editPropertyValue - Edit a current user's property data as a path param.

Path: api/v1/user/domain/:domain/id/:id/property/:property/:value

**Kind**: static method of [<code>UserDomain</code>](#UserDomain)  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>any</code> | Domain (example: test.com) (example: test.com) |
| id | <code>any</code> | id, username or email. (example: 75d2ed5e-bc5b-4129-a1ec-657cf27e6294) |
| property | <code>any</code> | Property to modify (example: locked) (example: locked) |
| value | <code>any</code> | Value to change property to. (example: true) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserDomain.editProperty"></a>

### UserDomain.editProperty(body, domain, id, property, authorization_bearer)
editProperty - Edit a user's property by id.

Path: api/v1/user/domain/:domain/id/:id/property/:property

**Kind**: static method of [<code>UserDomain</code>](#UserDomain)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| domain | <code>any</code> | Domain (example: test.com) (example: test.com) |
| id | <code>any</code> | id, username or email. (example: 75d2ed5e-bc5b-4129-a1ec-657cf27e6294) |
| property | <code>any</code> | Property to modify (example: locked) (example: locked) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```text
false
```
<a name="UserDomain.edit"></a>

### UserDomain.edit(body, domain, id, authorization_bearer)
edit - Edit a user's by id.

Path: api/v1/user/domain/:domain/id/:id

**Kind**: static method of [<code>UserDomain</code>](#UserDomain)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| domain | <code>any</code> | Domain (example: test.com) (example: test.com) |
| id | <code>any</code> | id, username or email. (example: 75d2ed5e-bc5b-4129-a1ec-657cf27e6294) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"username" : "user6",
	"password" : "Awickednewawesomepasword4242!@"
}
```
<a name="UserDomain.getProperty"></a>

### UserDomain.getProperty(domain, id, property, authorization_bearer)
getProperty - Get a user's property by it's id.

Path: api/v1/user/domain/:domain/id/:id/property/:property

**Kind**: static method of [<code>UserDomain</code>](#UserDomain)  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>any</code> | Domain (example: test.com) (example: test.com) |
| id | <code>any</code> | id, username or email. (example: 75d2ed5e-bc5b-4129-a1ec-657cf27e6294) |
| property | <code>any</code> | Property to get (example: locked) (example: locked) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserDomain.get"></a>

### UserDomain.get(domain, id, authorization_bearer)
get - Get a user by it's id.

Path: api/v1/user/domain/:domain/id/:id

**Kind**: static method of [<code>UserDomain</code>](#UserDomain)  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>any</code> | Domain (example: test.com) (example: test.com) |
| id | <code>any</code> | id, username or email. (example: d1bf9986-9938-4d47-b8aa-79184b37cc16) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserCurrent"></a>

## UserCurrent
**Kind**: global class  

* [UserCurrent](#UserCurrent)
    * [.registerToken(body, authorization_bearer)](#UserCurrent.registerToken)
    * [.removeGroupInheritance(inheritgroupid, inheritgrouptype, authorization_bearer)](#UserCurrent.removeGroupInheritance)
    * [.addGroupInheritance(inheritgroupid, inheritgrouptype, authorization_bearer)](#UserCurrent.addGroupInheritance)
    * [.editPropertyValue(property, value, authorization_bearer)](#UserCurrent.editPropertyValue)
    * [.editProperty(body, property, authorization_bearer)](#UserCurrent.editProperty)
    * [.deleteToken(id, authorization_bearer)](#UserCurrent.deleteToken)
    * [.edit(body, authorization_bearer)](#UserCurrent.edit)
    * [.getProperty(property, authorization_bearer)](#UserCurrent.getProperty)
    * [.routeCheck(method, route, authorization_bearer)](#UserCurrent.routeCheck)
    * [.permissionCheck(permission, authorization_bearer)](#UserCurrent.permissionCheck)
    * [.get(authorization_bearer)](#UserCurrent.get)

<a name="UserCurrent.registerToken"></a>

### UserCurrent.registerToken(body, authorization_bearer)
registerToken - Registers a new credentials service for client_credentials based access token auth.

Path: api/v1/user/me/token

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"name": "conversate"
}
```
<a name="UserCurrent.removeGroupInheritance"></a>

### UserCurrent.removeGroupInheritance(inheritgroupid, inheritgrouptype, authorization_bearer)
removeGroupInheritance - Remove a user from a group.

Path: api/v1/user/me/inheritance/group/:inheritgroupid/type/:inheritgrouptype

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| inheritgroupid | <code>any</code> | id or name of the  group to inherit (example: group2) |
| inheritgrouptype | <code>any</code> | type of the  group to inherit (example: group) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserCurrent.addGroupInheritance"></a>

### UserCurrent.addGroupInheritance(inheritgroupid, inheritgrouptype, authorization_bearer)
addGroupInheritance - Add a user to a group.

Path: api/v1/user/me/inheritance/group/:inheritgroupid/type/:inheritgrouptype

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| inheritgroupid | <code>any</code> | id or name of the  group to inherit (example: group2) |
| inheritgrouptype | <code>any</code> | type of the  group to inherit (example: group) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserCurrent.editPropertyValue"></a>

### UserCurrent.editPropertyValue(property, value, authorization_bearer)
editPropertyValue - Edit a current user's property data as a path param.

Path: api/v1/user/me/property/:property/:value

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>any</code> | (example: group_id) |
| value | <code>any</code> | (example: 595d3f9a-5383-4da9-a465-b975d8a5e28e) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserCurrent.editProperty"></a>

### UserCurrent.editProperty(body, property, authorization_bearer)
editProperty - Edit a current user's property data.

Path: api/v1/user/me/property/:property

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| property | <code>any</code> | (example: user_data) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"test": 123
}
```
<a name="UserCurrent.deleteToken"></a>

### UserCurrent.deleteToken(id, authorization_bearer)
deleteToken - Deletes a client_credentials based access token auth.

Path: api/v1/user/me/token/:id

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name of the token |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserCurrent.edit"></a>

### UserCurrent.edit(body, authorization_bearer)
edit - Updates the current logged in user.

Path: api/v1/user/me

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
    "username": "user6",
    "password": "Awickednewawesomepasword4242!@"
}
```
<a name="UserCurrent.getProperty"></a>

### UserCurrent.getProperty(property, authorization_bearer)
getProperty - Gets the currently logged in user's single property

Path: api/v1/user/me/property/:property

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>any</code> | (example: username) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserCurrent.routeCheck"></a>

### UserCurrent.routeCheck(method, route, authorization_bearer)
routeCheck - Checks if current logged in user can access the route with method.

Path: api/v1/user/me/route/allowed

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>any</code> | (example: get) |
| route | <code>any</code> | (example: /travelling/api/v1/group/request/type/anonymous/user/) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserCurrent.permissionCheck"></a>

### UserCurrent.permissionCheck(permission, authorization_bearer)
permissionCheck - Checks to see if the current user can access content based on permission.

Path: api/v1/user/me/permission/allowed/:permission

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| permission | <code>any</code> | name of the route/permission (example: get-travelling) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserCurrent.get"></a>

### UserCurrent.get(authorization_bearer)
get - Gets the currently logged in user

Path: api/v1/user/me

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Auth"></a>

## Auth
#### Auth endpoints

**Kind**: global class  

* [Auth](#Auth)
    * [.accessToken()](#Auth.accessToken)
    * [.authorize(client_id, response_type, state, redirect_uri, group_request)](#Auth.authorize)
    * [.activate(token)](#Auth.activate)
    * [.resetPasswordAutoLogin(body, token)](#Auth.resetPasswordAutoLogin)
    * [.resetPassword(body, token)](#Auth.resetPassword)
    * [.forgotPassword(body)](#Auth.forgotPassword)
    * [.logout()](#Auth.logout)
    * [.login(body)](#Auth.login)
    * [.register(body)](#Auth.register)

<a name="Auth.accessToken"></a>

### Auth.accessToken()
accessToken - Oauth2 `client_credentials` access token flow. Body must be `application/x-www-form-urlencoded` and must contain the `grant_type`. `client_id` & `client_secret` will be sent in a `Basic` Authorization header as `base64(client_id:client_secret)`

Path: api/v1/auth/token

**Kind**: static method of [<code>Auth</code>](#Auth)  
<a name="Auth.authorize"></a>

### Auth.authorize(client_id, response_type, state, redirect_uri, group_request)
authorize - Authorization Code Grant

Path: api/v1/auth/oauth/authorize

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type |
| --- | --- |
| client_id | <code>any</code> | 
| response_type | <code>any</code> | 
| state | <code>any</code> | 
| redirect_uri | <code>any</code> | 
| group_request | <code>any</code> | 

<a name="Auth.activate"></a>

### Auth.activate(token)
activate - Activates and unlocks user

Path: api/v1/auth/activate

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>any</code> | (example: activation_token) |

<a name="Auth.resetPasswordAutoLogin"></a>

### Auth.resetPasswordAutoLogin(body, token)
resetPasswordAutoLogin - Resets the password if the recovery token is valid of the user, then authenticates the user and returns cookies.

Path: api/v1/auth/password/reset/login

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| token | <code>any</code> | (example: [thegeneratedtoken]) |

**Example**  
body
```json
{
	"password":"asdf"
}
```
<a name="Auth.resetPassword"></a>

### Auth.resetPassword(body, token)
resetPassword - Resets the password if the recovery token is valid of the user.

Path: api/v1/auth/password/reset

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| token | <code>any</code> | (example: [thegeneratedtoken]) |

**Example**  
body
```json
{
	"password":"asdf"
}
```
<a name="Auth.forgotPassword"></a>

### Auth.forgotPassword(body)
forgotPassword - Generates a recovery token and sends a email to the attached user (if they exist)

Path: api/v1/auth/password/forgot

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type |
| --- | --- |
| body | <code>Object</code> | 

**Example**  
body
```json
{
	"email": "test@test.com"
}
```
<a name="Auth.logout"></a>

### Auth.logout()
logout -

Path: api/v1/auth/logout

**Kind**: static method of [<code>Auth</code>](#Auth)  
<a name="Auth.login"></a>

### Auth.login(body)
login - Login a user

##### Body Properties

| Prop | Description |
| --- | --- |
| email/username | *required* String (example:  test@test.com) |
| password | *required* String (example:  fakePassword123) |
| remember | *optional* Boolean if you would like to be logged in automatically (example:  true) |

Path: api/v1/auth/login

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type |
| --- | --- |
| body | <code>Object</code> | 

**Example**  
body
```json
{
	"id": "test@test.com",
	"password": "Pas5w0r!d",
    "domain": "default",
    "remember": true
}
```
<a name="Auth.register"></a>

### Auth.register(body)
register - Register a user

`group_request`	is optional.

Path: api/v1/auth/register

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type |
| --- | --- |
| body | <code>Object</code> | 

**Example**  
body
```json
{
	"username":"test",
	"password":"Pas5w0r!d",
	"email": "test@test.com",
    "domain": "default"
}
```
<a name="AuthToken"></a>

## AuthToken
**Kind**: global class  
<a name="AuthToken.forgotPassword"></a>

### AuthToken.forgotPassword(body)
forgotPassword - Generates a recovery token and returns the token to the attached user (if they exist) instead of sending an email.
*CAUTION SECURITY RISK: Would not expose this URL publicly or have it be allowed by anyone who is not a superadmin type level**

Path: api/v1/auth/password/forgot

**Kind**: static method of [<code>AuthToken</code>](#AuthToken)  

| Param | Type |
| --- | --- |
| body | <code>Object</code> | 

**Example**  
body
```json
{
	"email": "test@test.com"
}
```
<a name="AuthDomain"></a>

## AuthDomain
**Kind**: global class  

* [AuthDomain](#AuthDomain)
    * [.forgotPassword(body, domain)](#AuthDomain.forgotPassword)
    * [.login(body, domain)](#AuthDomain.login)
    * [.register(body, domain)](#AuthDomain.register)

<a name="AuthDomain.forgotPassword"></a>

### AuthDomain.forgotPassword(body, domain)
forgotPassword - Generates a recovery token and sends a email to the attached user (if they exist)

Path: api/v1/auth/password/forgot/domain/:domain

**Kind**: static method of [<code>AuthDomain</code>](#AuthDomain)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| domain | <code>any</code> | Domain name (example: test.com) (example: traziventures.com) |

**Example**  
body
```json
{
	"email": "kelvin@traziventures.com"
}
```
<a name="AuthDomain.login"></a>

### AuthDomain.login(body, domain)
login - Login a user

##### Body Properties

| Prop | Description |
| --- | --- |
| email/username | *required* String (example:  test@test.com) |
| password | *required* String (example:  fakePassword123) |
| domain | *required* String (example:  test.com) |
| remember | *optional* Boolean if you would like to be logged in automatically (example:  true) |

Path: api/v1/auth/login/domain/:domain

**Kind**: static method of [<code>AuthDomain</code>](#AuthDomain)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| domain | <code>any</code> | Domain name (example: test.com) (example: test.com) |

**Example**  
body
```json
{
	"email": "test@test.com",
	"password": "Pas5w0r!d",
    "domain": "test.com",
    "remember": true
}
```
<a name="AuthDomain.register"></a>

### AuthDomain.register(body, domain)
register - Register a user

`group_request`	is optional.

Path: api/v1/auth/register/domain/:domain

**Kind**: static method of [<code>AuthDomain</code>](#AuthDomain)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| domain | <code>any</code> | Domain name (example: test.com) (example: test.com) |

**Example**  
body
```json
{
	"password":"Pas5w0r!d",
	"email": "test@test.com"
}
```
<a name="AuthDomainToken"></a>

## AuthDomainToken
**Kind**: global class  
<a name="AuthDomainToken.forgotPassword"></a>

### AuthDomainToken.forgotPassword(body, domain)
forgotPassword - Generates a recovery token and returns the token to the attached user (if they exist) instead of sending an email.
*CAUTION SECURITY RISK: Would not expose this URL publicly or have it be allowed by anyone who is not a superadmin type level**

Path: api/v1/auth/token/password/forgot/domain/:domain

**Kind**: static method of [<code>AuthDomainToken</code>](#AuthDomainToken)  

| Param | Type |
| --- | --- |
| body | <code>Object</code> | 
| domain | <code>any</code> | 

**Example**  
body
```json
{
	"email": "test@test.com"
}
```
<a name="SDK"></a>

## SDK(host, opts)
SDK - importing the SDK for use

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| host | <code>string</code> | the hostname to the service (example: http://127.0.0.1) |
| opts | <code>object</code> | options that will be appened to every request. [Fasquest Lib Options](https://github.com/Phara0h/Fasquest) (example: {headers: {'API-KEY':'34098hodf'}}) |

**Example**  
init
```js
const { Travelling } = require('./sdk.js')('http://127.0.0.1');
```


## Changelog



#### [v2.6.5](https://github.com/Trazi-Ventures/travelling/compare/v2.6.4...v2.6.5)

- Update router.js [`3f6d413`](https://github.com/Trazi-Ventures/travelling/commit/3f6d41382c3fab3899a39ab62d65704f188cdd8e)

#### [v2.6.4](https://github.com/Trazi-Ventures/travelling/compare/v2.6.3...v2.6.4)

> 20 July 2021

- Update index.js [`fb0ac1a`](https://github.com/Trazi-Ventures/travelling/commit/fb0ac1a3ad986b1dbf3d85fed943dbd98457153c)

#### [v2.6.3](https://github.com/Trazi-Ventures/travelling/compare/v2.6.2...v2.6.3)

> 20 July 2021

- Fix for opentelemtry [`fd4a07e`](https://github.com/Trazi-Ventures/travelling/commit/fd4a07e580b8d8346d8a858fb22a4d82e8ff3bad)

#### [v2.6.2](https://github.com/Trazi-Ventures/travelling/compare/v2.6.1...v2.6.2)

> 20 July 2021

- Update helpers.js [`acd28f5`](https://github.com/Trazi-Ventures/travelling/commit/acd28f5dbf37cf50101a50f0170588e5b48ebaf6)

#### [v2.6.1](https://github.com/Trazi-Ventures/travelling/compare/v2.6.0...v2.6.1)

> 20 July 2021

- Fix for opentelemtry [`e41a671`](https://github.com/Trazi-Ventures/travelling/commit/e41a671674b8603823abf14fbfd236e98e440bcd)

#### [v2.6.0](https://github.com/Trazi-Ventures/travelling/compare/v2.5.2...v2.6.0)

> 20 July 2021

- Audits table model and added to db init. [`#9`](https://github.com/Trazi-Ventures/travelling/pull/9)
- Feature #21 clean up route functions [`#8`](https://github.com/Trazi-Ventures/travelling/pull/8)
- Added welcome email ability. [`#7`](https://github.com/Trazi-Ventures/travelling/pull/7)
- Feature #12 login disable auto remember me [`#6`](https://github.com/Trazi-Ventures/travelling/pull/6)
- Feature #20 add user domain operations [`#5`](https://github.com/Trazi-Ventures/travelling/pull/5)
- Feature #8 add skip param to users [`#4`](https://github.com/Trazi-Ventures/travelling/pull/4)
- Feature #13 create users and domain count [`#3`](https://github.com/Trazi-Ventures/travelling/pull/3)
- Feature #16 date range filter issues [`#2`](https://github.com/Trazi-Ventures/travelling/pull/2)
- Moved user and group route functions. [`4217059`](https://github.com/Trazi-Ventures/travelling/commit/42170590578066968adb3c260072d7f18584911f)
- Created and moved auth route functions. [`8c3437d`](https://github.com/Trazi-Ventures/travelling/commit/8c3437da8301f9c3d0a1b0c85562e349ee9bdb92)
- Buf fix [`0ac0da9`](https://github.com/Trazi-Ventures/travelling/commit/0ac0da93675d7fcc1e986dbfb2c86a72073d2854)
- Corrected register user response. [`cc93305`](https://github.com/Trazi-Ventures/travelling/commit/cc9330515734aca56a60314df48c0dd764ab968a)
- Added support for REST email services. [`a84d7ee`](https://github.com/Trazi-Ventures/travelling/commit/a84d7ee3bdd01727f99577780fff28c6857b5c32)
- Added test for sending a welcome email on signup. [`ea6bb9f`](https://github.com/Trazi-Ventures/travelling/commit/ea6bb9f301b629d776cbab386905907b95a38e26)
- Fixed logging issue. [`bf302de`](https://github.com/Trazi-Ventures/travelling/commit/bf302ded8b2a27f64632719955d607263334f54b)
- Register route consitency tweaks. [`f44f573`](https://github.com/Trazi-Ventures/travelling/commit/f44f573b1c29a32c8c31856fa70634f57bef0469)
- A litle reformatting. [`455e38b`](https://github.com/Trazi-Ventures/travelling/commit/455e38b2ea30a28c9917ca491ebf2239fbd0cefd)
- Updated README.md [`5c380b0`](https://github.com/Trazi-Ventures/travelling/commit/5c380b004fb70ac09bdfd856c128c515bed540cf)
- Added checks to verify that tok is undefined. [`30931eb`](https://github.com/Trazi-Ventures/travelling/commit/30931ebc4eef67b7c56c6bdd45c66812c8886145)
- Updated SDK. [`b8db4a8`](https://github.com/Trazi-Ventures/travelling/commit/b8db4a8f59d5b4f4468e34aaaf47d507674b0c12)
- Updated non-remember login test. [`d529e54`](https://github.com/Trazi-Ventures/travelling/commit/d529e54f1fae2272e36821683def5606c696bc8c)
- Modified remember param chacking. [`4d1d133`](https://github.com/Trazi-Ventures/travelling/commit/4d1d133cc3a40460f6e7a210f841b57c9097f6a6)
- Fixed typo. Cleaned up tests. [`a222614`](https://github.com/Trazi-Ventures/travelling/commit/a22261461db9cdc3a41466a2b8d34d44c8d36bff)
- Moved missing domain param error handling. [`a0cad10`](https://github.com/Trazi-Ventures/travelling/commit/a0cad1006d342fba15e4514d6a6dd5a0f77bfddf)
- Combined get, edit and delete function parameters. [`6fc399a`](https://github.com/Trazi-Ventures/travelling/commit/6fc399ad0e8a55751802edea94a22c963a166c73)
- Added tests for non-remember login. [`f8c30d2`](https://github.com/Trazi-Ventures/travelling/commit/f8c30d263a7577520785bf3725bc67de2ff607c9)
- Updated SDK with new additions to docs. [`cdab2fb`](https://github.com/Trazi-Ventures/travelling/commit/cdab2fb5e81a7277dd7b62012a4be32371cd4d2c)
- Added req prop to remember user or not. [`48af76b`](https://github.com/Trazi-Ventures/travelling/commit/48af76b71db8cba8838e456c05e39621dc7a1693)
- Updated docs and sdk. [`baffa0e`](https://github.com/Trazi-Ventures/travelling/commit/baffa0ea282ff57133b48503bcc588a974005e3e)
- Added user get domain tests. [`824e04f`](https://github.com/Trazi-Ventures/travelling/commit/824e04f184d8e2458a2cd844fc45062c5ed622e2)
- Added more user edit tests. [`c3614d3`](https://github.com/Trazi-Ventures/travelling/commit/c3614d3ecb01a62e1cc1035303c641fb35a1326a)
- Added user-edit domain tests. [`5c5e407`](https://github.com/Trazi-Ventures/travelling/commit/5c5e407664d064cb80d76d38141a7e482e16aea2)
- Updated SDK. [`c2f5c82`](https://github.com/Trazi-Ventures/travelling/commit/c2f5c8272a2c277dfb29e42cea67329f0ee0398f)
- Reformatted function calls for getUsers. [`9d1d3c9`](https://github.com/Trazi-Ventures/travelling/commit/9d1d3c92378b619f61019e9a70e0628bd2bae7ca)
- Added functionality to user domain routes. [`3ec1421`](https://github.com/Trazi-Ventures/travelling/commit/3ec1421f594c4e8a3541437efbb392de1c2f76a7)
- Fixed conditional statement for opts.limit. [`bf0bf2b`](https://github.com/Trazi-Ventures/travelling/commit/bf0bf2b12413da8c3c4a21a2b756db231f61e1a1)
- Modified users count tests. [`e774a42`](https://github.com/Trazi-Ventures/travelling/commit/e774a42de15c76cb2d44ffe3a35715c7bc982217)
- Added limit and skip to users count endpoints. [`31280ff`](https://github.com/Trazi-Ventures/travelling/commit/31280ff7965bc356f5773f4821d10489ad25f563)
- Updated SDK. [`7985e3e`](https://github.com/Trazi-Ventures/travelling/commit/7985e3eecc1d46bbee9c801bcf986bdfa33e69e6)
- Added curlies for your protection. [`5ea29cc`](https://github.com/Trazi-Ventures/travelling/commit/5ea29cc4fa5df16eaccba5fb5d94130994795c97)
- Added tests for endpoints with skip param. [`07e5d53`](https://github.com/Trazi-Ventures/travelling/commit/07e5d537d1454d2e565b23f435156a16d3bb618f)
- Added tests for endpoints with skip param. [`4902af2`](https://github.com/Trazi-Ventures/travelling/commit/4902af2359679ea4433877dd44aba9b282cdd9c6)
- Updated SDK. [`4984f7a`](https://github.com/Trazi-Ventures/travelling/commit/4984f7a0efb3ecf78a5c7a511c9019c8070bad47)
- Updated SDK. [`a87706d`](https://github.com/Trazi-Ventures/travelling/commit/a87706d15eea86b08c5167b335185b2c00a8202e)
- Added skip param to routes and db offset. [`7bfe7f6`](https://github.com/Trazi-Ventures/travelling/commit/7bfe7f69ae0ff20a9fe4b32482216274b9ef0c65)
- Added skip param to routes and db offset. [`6469009`](https://github.com/Trazi-Ventures/travelling/commit/646900920a44e5504c219678ffbfc210c2ab5422)
- Used raw query for count. [`88680f9`](https://github.com/Trazi-Ventures/travelling/commit/88680f9343378e630a8d261338066f6d7b723702)
- Removed duplicate routes. [`07e5517`](https://github.com/Trazi-Ventures/travelling/commit/07e5517c4d15b24cc0a8938fcaf421d45db0889a)
- Count users / users by domain enpoints. [`f70270a`](https://github.com/Trazi-Ventures/travelling/commit/f70270a50ad19a822dd71053c12344a5f060acb2)
- Removed logs. [`4070a44`](https://github.com/Trazi-Ventures/travelling/commit/4070a4413416d8c7bcae4c4992e505c82fe7b113)
- Regenerated SDK. Wrote tests for geting non-domain users. Added date validation. [`372015a`](https://github.com/Trazi-Ventures/travelling/commit/372015a09495c2ed6ca3c1ea818493017f6005d3)
- Removed console.logs. [`f1dd0fa`](https://github.com/Trazi-Ventures/travelling/commit/f1dd0fa98ea89cf8365535620a307e507785b0b4)
- Modified user model. [`2b4f6af`](https://github.com/Trazi-Ventures/travelling/commit/2b4f6af4456f86065b2870bda7be7a45f8e1ac0a)
- Modified user model. [`9b85a90`](https://github.com/Trazi-Ventures/travelling/commit/9b85a90be0cc339182ed20a7382d524801a1ed3e)
- Modified user model. [`cef3c9b`](https://github.com/Trazi-Ventures/travelling/commit/cef3c9b99ae40a6a119ce3a03ace874ac5af03d6)
- Modified user model. [`3f06342`](https://github.com/Trazi-Ventures/travelling/commit/3f0634238a8d3436e09e379aa7c9f022933f7525)
- Added more users by domain tests. [`67d3a38`](https://github.com/Trazi-Ventures/travelling/commit/67d3a389cc0116fcfc40cc2bd0d155750f24b623)
- Created base tests for users by domain. [`7849a4f`](https://github.com/Trazi-Ventures/travelling/commit/7849a4f9257a103a35188f587e213f3a6a78573a)
- Fixed groupmanager bug. [`32f9b2c`](https://github.com/Trazi-Ventures/travelling/commit/32f9b2c97b5580827bae674f2c7a1e0c537f35ba)
- Updated SDK [`a82c69c`](https://github.com/Trazi-Ventures/travelling/commit/a82c69c439dc2f4527649957732849e2856ec57b)
- Fixed created_on &lt;=/&gt;= filter bug. [`1940c87`](https://github.com/Trazi-Ventures/travelling/commit/1940c875b19977362f724b03bdfa2891a042d12a)
- Created endpoint routes. [`03ffe65`](https://github.com/Trazi-Ventures/travelling/commit/03ffe650df86d03227094caba6a42184ed05a4a3)
- Created endpoint routes. [`7a84357`](https://github.com/Trazi-Ventures/travelling/commit/7a84357de913de3f4117364020b16234d0352f29)
- Created endpoint routes. [`8328430`](https://github.com/Trazi-Ventures/travelling/commit/83284309627e225bfa9e08bfb2313976d1351ca7)
- Created endpoint routes. [`bcf6311`](https://github.com/Trazi-Ventures/travelling/commit/bcf6311e02ec3a1f2915d21c3da5b8113f5c1e0d)
- Created endpoint routes. [`506d0f9`](https://github.com/Trazi-Ventures/travelling/commit/506d0f917b5b36fbcbc17e1929fb499c4d5e465a)
- Created endpoint routes. [`6c033c4`](https://github.com/Trazi-Ventures/travelling/commit/6c033c4331df32058247a5aa5baec0ca9efb998c)
- Created endpoint routes. [`5dee46e`](https://github.com/Trazi-Ventures/travelling/commit/5dee46e258fac458d2ba48f9f643b78c2d65ac54)
- Created endpoint routes. [`1094848`](https://github.com/Trazi-Ventures/travelling/commit/1094848fbd9aed4900b8e210993bdc5b1bfcf17d)
- Update package.json [`6e4fa0f`](https://github.com/Trazi-Ventures/travelling/commit/6e4fa0f916d7a096f8d6dd4963d7ef84945172a7)
- Update package.json [`b117365`](https://github.com/Trazi-Ventures/travelling/commit/b117365dfdf219419e3c1a3a7c824f55e9769c28)
- Create LICENSE [`aa377de`](https://github.com/Trazi-Ventures/travelling/commit/aa377de9bda60c7e9d08c547c9da74374a6ba73b)

#### [v2.5.2](https://github.com/Trazi-Ventures/travelling/compare/v2.5.1...v2.5.2)

> 5 May 2021

- Updated to ignore /health and /metrics logs outs [`e530288`](https://github.com/Trazi-Ventures/travelling/commit/e5302887065b9c3c4aaa6bc6ac27f8e8a88b7420)
- Updated SDK [`d52feec`](https://github.com/Trazi-Ventures/travelling/commit/d52feec090bd96ccfdd16df1c8f318c7a66bd10f)
- Update Travelling.postman_collection.json [`1435319`](https://github.com/Trazi-Ventures/travelling/commit/1435319c14771389a15ed0d4b5939b9d9b7e7dea)

#### [v2.5.1](https://github.com/Trazi-Ventures/travelling/compare/v2.5.0...v2.5.1)

> 3 May 2021

- Update index.js [`12d527f`](https://github.com/Trazi-Ventures/travelling/commit/12d527f12609ea9cb90b7c526f0265c3e2fe84f1)

#### [v2.5.0](https://github.com/Trazi-Ventures/travelling/compare/v2.4.2...v2.5.0)

> 3 May 2021

- Update Travelling.postman_collection.json [`40e95d2`](https://github.com/Trazi-Ventures/travelling/commit/40e95d244ccaa3f66ce57aa0179f750833ea27b6)
- Started work on add traces throughout code [`dfe93dd`](https://github.com/Trazi-Ventures/travelling/commit/dfe93dd291233aa72989998d1053f05a03949295)

#### [v2.4.2](https://github.com/Trazi-Ventures/travelling/compare/v2.4.1...v2.4.2)

> 13 April 2021

- Added fix for when there is no default group it defaults to anonymous [`bd1abda`](https://github.com/Trazi-Ventures/travelling/commit/bd1abdae0763bef0a7d9b5d7e9c872498ef6ae27)

#### [v2.4.1](https://github.com/Trazi-Ventures/travelling/compare/v2.4.0...v2.4.1)

> 7 April 2021

- Fixed some bugs, removed /metrics and /health from logs [`7b98a92`](https://github.com/Trazi-Ventures/travelling/commit/7b98a92393b932ec0d062aa6a641cd2589f53a21)

#### [v2.4.0](https://github.com/Trazi-Ventures/travelling/compare/v2.3.1...v2.4.0)

> 7 April 2021

- added more unique req headers coming from travelling. [`a77da6e`](https://github.com/Trazi-Ventures/travelling/commit/a77da6e6cf21d86a037e29082c7701a8d966fde0)

#### [v2.3.1](https://github.com/Trazi-Ventures/travelling/compare/v2.3.0...v2.3.1)

> 31 March 2021

- Fixed a bug for cookie session expiration length [`ae6dd7c`](https://github.com/Trazi-Ventures/travelling/commit/ae6dd7c6e2c935d4976fcda944e0ce02b84d93de)

#### [v2.3.0](https://github.com/Trazi-Ventures/travelling/compare/v2.2.0...v2.3.0)

> 31 March 2021

#### [v2.2.0](https://github.com/Trazi-Ventures/travelling/compare/v2.1.0...v2.2.0)

> 31 March 2021

- Update SDK and added Resetpassword with autologin endpoint and forgot password token endpoints. [`9cb2d8e`](https://github.com/Trazi-Ventures/travelling/commit/9cb2d8e4cc2e4a2f14ee56dd04cbbd5ba32a39ab)

#### [v2.1.0](https://github.com/Trazi-Ventures/travelling/compare/v2.0.0...v2.1.0)

> 19 March 2021

- Added options to handle using external email validation service and updated docs [`b3279da`](https://github.com/Trazi-Ventures/travelling/commit/b3279dadab2d009356e36cd9f773d21a0140a0fd)

### [v2.0.0](https://github.com/Trazi-Ventures/travelling/compare/v1.3.3...v2.0.0)

> 19 March 2021

- Added a bunch of user related data to schemas, preparing for webauthn support, clean ups and some fixes [`c595104`](https://github.com/Trazi-Ventures/travelling/commit/c59510475bb6e792271a0ffae8f8bba7596a6728)

#### [v1.3.3](https://github.com/Trazi-Ventures/travelling/compare/v1.3.2...v1.3.3)

> 2 March 2021

- possible cloudflare headers fix [`3aaeab2`](https://github.com/Trazi-Ventures/travelling/commit/3aaeab24ca79d5fd12b852942b4097de8ff37abf)

#### [v1.3.2](https://github.com/Trazi-Ventures/travelling/compare/v1.3.1...v1.3.2)

> 2 March 2021

- Fixed bug of proxying urls that start with the serviceName and have a host [`c6b70b4`](https://github.com/Trazi-Ventures/travelling/commit/c6b70b41ed70fe3888a5643d583b9689c555ee68)

#### [v1.3.1](https://github.com/Trazi-Ventures/travelling/compare/v1.3.0...v1.3.1)

> 2 March 2021

- typo [`3be0a65`](https://github.com/Trazi-Ventures/travelling/commit/3be0a6540aeb8b927b0b26f05cb6cdde2d7e2343)

#### [v1.3.0](https://github.com/Trazi-Ventures/travelling/compare/v1.2.1...v1.3.0)

> 25 February 2021

- Added REST email provider as an option, option to change locked message, users will now be unlocked when they reset their password and their locked reason was from password fails and fixed a few bugs [`958be20`](https://github.com/Trazi-Ventures/travelling/commit/958be2067dd5d90b57495989fcbe27a843ecf162)
- Added login by domain in postman / sdk [`04ab374`](https://github.com/Trazi-Ventures/travelling/commit/04ab374b629d09248c8280163ce989234ba24530)

#### [v1.2.1](https://github.com/Trazi-Ventures/travelling/compare/v1.2.1-0...v1.2.1)

> 17 February 2021

- Fixed bug with auth when usernames disabled [`00fe0bb`](https://github.com/Trazi-Ventures/travelling/commit/00fe0bb973d384d7fe8becb18d95e3989e87baef)

#### [v1.2.1-0](https://github.com/Trazi-Ventures/travelling/compare/v1.2.0...v1.2.1-0)

> 17 February 2021

- Updated logo in readme [`2079591`](https://github.com/Trazi-Ventures/travelling/commit/20795916dbbe00bd9f656b2834241b19abcf5b86)

#### [v1.2.0](https://github.com/Trazi-Ventures/travelling/compare/v1.1.1...v1.2.0)

> 17 February 2021

#### [v1.1.1](https://github.com/Trazi-Ventures/travelling/compare/v1.1.1-1...v1.1.1)

> 17 February 2021

#### [v1.1.1-1](https://github.com/Trazi-Ventures/travelling/compare/v1.1.0...v1.1.1-1)

> 17 February 2021

- Update npm-publish.yml [`b15cfbe`](https://github.com/Trazi-Ventures/travelling/commit/b15cfbe04a532b20346f2bef18af48596551ff00)
- Update .gitignore [`ddda22f`](https://github.com/Trazi-Ventures/travelling/commit/ddda22fd1dbead54dc17c7eb2d442ce23a08951f)
- Delete package-lock.json [`2c7afb9`](https://github.com/Trazi-Ventures/travelling/commit/2c7afb921f3e2e36e97ce648e9be082ca7dda271)
- Update npm-publish.yml [`1d5ba20`](https://github.com/Trazi-Ventures/travelling/commit/1d5ba202d5d87fe47a08948dd1e2f2bd15a52d8e)
- Update npm-publish.yml [`30f57ef`](https://github.com/Trazi-Ventures/travelling/commit/30f57ef5fec492533ae725080eb6e830da5a0846)
- Update npm-publish.yml [`8c1692f`](https://github.com/Trazi-Ventures/travelling/commit/8c1692f321ddaa4f0e4fc45bbda1cd7c6fde660e)
- Create npm-publish.yml [`7066bdf`](https://github.com/Trazi-Ventures/travelling/commit/7066bdf0f9b939e65a15f2e4301f57fe0de6b02f)
- Removed console logs from dev [`d88d0b6`](https://github.com/Trazi-Ventures/travelling/commit/d88d0b6daff83706b81ca507c8a95edf4e58c01e)

#### [v1.1.0](https://github.com/Trazi-Ventures/travelling/compare/v1.0.0...v1.1.0)

> 17 February 2021

- Fixed some auto doc stuff [`7bac291`](https://github.com/Trazi-Ventures/travelling/commit/7bac29170b71b8d005f2733c4ee830da34b0ae69)
- General cleanup, added posgres config settings, and doc reorg [`d84a3f8`](https://github.com/Trazi-Ventures/travelling/commit/d84a3f8131099f294ebb4f4112fd98752635fed0)
- Update user-get.js [`5e9ec0e`](https://github.com/Trazi-Ventures/travelling/commit/5e9ec0eab0701035b997a39609ec9003e70f0e72)

#### v1.0.0

> 12 February 2021

- Bump minimist from 1.2.0 to 1.2.5 in /client [`#4`](https://github.com/Trazi-Ventures/travelling/pull/4)
- Bump acorn from 7.0.0 to 7.1.1 in /client [`#5`](https://github.com/Trazi-Ventures/travelling/pull/5)
- Eng 1037 [`#3`](https://github.com/Trazi-Ventures/travelling/pull/3)
- Merg [`#2`](https://github.com/Trazi-Ventures/travelling/pull/2)
- a [`#1`](https://github.com/Trazi-Ventures/travelling/pull/1)
- Updated to latest fastify, fixed some bugs and added domain field to users [`74f9001`](https://github.com/Trazi-Ventures/travelling/commit/74f900114425ea264dde8e0585e4ffac86c62849)
- Fixed npm package vulnerabilities [`2ded3c7`](https://github.com/Trazi-Ventures/travelling/commit/2ded3c76aa3dccb97783fd3ad1ebff57e05370c9)
- Removed node-utils depends and fixed tests [`e8c8f60`](https://github.com/Trazi-Ventures/travelling/commit/e8c8f60521ad5c3b6492a70b609d7b1e1ce7a737)
- [ENG-1037] - removed logging and fixed an error message [`2717223`](https://github.com/Trazi-Ventures/travelling/commit/27172233316b58c08f82e76dd09628f2d8178ec1)
- [ENG-1037] - added redirect after logout [`324dc9d`](https://github.com/Trazi-Ventures/travelling/commit/324dc9de1735c48e17fff38e7a620a2c87274864)
- [ENG-1037] - some email reg and reset fixes/cleanup [`050f6af`](https://github.com/Trazi-Ventures/travelling/commit/050f6af47b8888d999d55915c274d17859f73160)
- [ENG-1037] - fixed some tests and added wider ranges. [`5a9e64c`](https://github.com/Trazi-Ventures/travelling/commit/5a9e64cd88377082be4d164bb63fbf3a771d8c0b)
- [ENG-1037] - Removed passwords from responses, added configs for web and misc fixes [`775ed7f`](https://github.com/Trazi-Ventures/travelling/commit/775ed7f9f37e9e41ef4fadc3fa62f2cd616b3f8e)
- [ENG-1037] - misc fixes. [`fa9d8f4`](https://github.com/Trazi-Ventures/travelling/commit/fa9d8f49d59470e291940ee3d6c33dc725004747)
- [ENG-1037] - regen [`4e08024`](https://github.com/Trazi-Ventures/travelling/commit/4e080247652b6c279ba465b5044dfa1fd65706e8)
- [ENG-1037] - added new function to sdk [`d705b97`](https://github.com/Trazi-Ventures/travelling/commit/d705b97c91a9568b015d627e2de2529916e0177b)
- [ENG-1037] - console logs removed [`84cc11e`](https://github.com/Trazi-Ventures/travelling/commit/84cc11e2b8b3d59c666294eeafdbb80928be90b0)
- [ENG-1037] - Lots of cleanup on routes and bug fixes [`474b788`](https://github.com/Trazi-Ventures/travelling/commit/474b78895d1cd8cd3328f20ee7cc6b4d84186f4b)
- [ENG-1037] - Users can have multi groups, more test & misc fixes [`cec0448`](https://github.com/Trazi-Ventures/travelling/commit/cec0448948a5080d000331240bb40caa17c5eba5)
- [ENG-1037] - Added edit property value  for path params [`d4ce2d8`](https://github.com/Trazi-Ventures/travelling/commit/d4ce2d86e90731c648322a959d7993d3eace5a2e)
- [ENG-1037] - Added logs in catches, fixes for node-utils crypto and misc [`2ff033c`](https://github.com/Trazi-Ventures/travelling/commit/2ff033cef57141cf46a30bfdce4ab395d1211505)
- [ENG-1037] - Added in recho as our test server [`87cccf8`](https://github.com/Trazi-Ventures/travelling/commit/87cccf88549f938fc8b129d8ffb9a8de643b0e24)
- [ENG-1037] - cleanup [`486d2ad`](https://github.com/Trazi-Ventures/travelling/commit/486d2ade896960f84fe408e10554ad44663bf33c)
- [ENG-1037] - changed removeFromPath to remove_from_path for consistency [`1f71307`](https://github.com/Trazi-Ventures/travelling/commit/1f71307716ac1d23f383b885236add27ddc317c0)
- [ENG-1037] - more clean up on exports [`c53401f`](https://github.com/Trazi-Ventures/travelling/commit/c53401f8459c216019b05f69cd841ba15ccf7b57)
- [ENG-1037] - added a few more routes, type scoped names, tests & clean ups [`20c1673`](https://github.com/Trazi-Ventures/travelling/commit/20c1673d81f1adb4503f3896d4dbf1ea581b2188)
- [ENG-1037] - Added *  urls for tokens [`191e709`](https://github.com/Trazi-Ventures/travelling/commit/191e7096e9f400f130b6d8ff08722f06edb4adef)
- [ENG-1037] - added /group/type/:type/user/:id/:property [`f4ba5fe`](https://github.com/Trazi-Ventures/travelling/commit/f4ba5fe16bbdcd650c6f29d10ac0d7fbe103d3b5)
- [ENG-1037] - cleanup [`d36cef2`](https://github.com/Trazi-Ventures/travelling/commit/d36cef26865d69d282d382d749d6a351e5e5ddc5)
- [ENG-1037] - Added more tests, fixed bugs test found and added 2 more routes. [`681dbcd`](https://github.com/Trazi-Ventures/travelling/commit/681dbcdbe03350070a84491f1e7041582f943fe8)
- [ENG-1037] - Updated travelling sdk [`195f971`](https://github.com/Trazi-Ventures/travelling/commit/195f971552312e4fc403e65f1c237e8972df0b84)
- [ENG-1037] - Fixed bug with groups and other stuff [`7ab46f9`](https://github.com/Trazi-Ventures/travelling/commit/7ab46f99a1400c68c88b897f097234682aac37a6)
- [ENG-1037] - Added import and export of groups. [`f6e18bc`](https://github.com/Trazi-Ventures/travelling/commit/f6e18bcd34f4299ac22f5c0a7eaedc9aff279e85)
- [ENG-1037] - More docs [`a5dbbc6`](https://github.com/Trazi-Ventures/travelling/commit/a5dbbc612a246e47b552b7321d8e2ef5ef69ac50)
- [ENG-1037] - More docs [`7a73d5c`](https://github.com/Trazi-Ventures/travelling/commit/7a73d5ca120cf83f4001a404a7f7e6fd0a1dd4b3)
- [ENG-1037] - fixes [`468851a`](https://github.com/Trazi-Ventures/travelling/commit/468851a32eca92ec313138fe56f98122964f0a33)
- [ENG-1037] - More docs [`eb4806a`](https://github.com/Trazi-Ventures/travelling/commit/eb4806a0abc3a9c4c798cfb218219ec6e52a9579)
- [ENG-1037] - More docs [`19d02a8`](https://github.com/Trazi-Ventures/travelling/commit/19d02a8e9bb674c32b31416304ae6f17e80a9e94)
- [ENG-1037] - More docs [`8489fad`](https://github.com/Trazi-Ventures/travelling/commit/8489fad09b436abff26af796f7deaf8f35478b88)
- [ENG-1037] - style changes [`83c2214`](https://github.com/Trazi-Ventures/travelling/commit/83c2214a17d9a79af1189216ebf4f2be1ab4c567)
- [ENG-1037] - Start of readme docs [`cf5b28c`](https://github.com/Trazi-Ventures/travelling/commit/cf5b28c705e5f9aa7dc672d9006f329430f8ad21)
- [ENG-1037] - Secured oauth code token flow `rfc6749#section-10.6` and some cleanup [`8f96cec`](https://github.com/Trazi-Ventures/travelling/commit/8f96cec18ff26290b6290409a508a8e04b6f7438)
- [ENG-1037] - Changed styling on the toasts [`0e41b3a`](https://github.com/Trazi-Ventures/travelling/commit/0e41b3ad7cf317208d62f2ae92d584a8fa9d1622)
- [ENG-1037] - Fixed auth code flow [`567ac30`](https://github.com/Trazi-Ventures/travelling/commit/567ac30213d072179a6cc7437c10092e67e4c4fc)
- [ENG-1037] - fixed memory token store [`ab100f0`](https://github.com/Trazi-Ventures/travelling/commit/ab100f04b7041184366a98d7b3407e9aa848f2a7)
- [ENG-1037] - added faicon in default anon group. [`efa3e13`](https://github.com/Trazi-Ventures/travelling/commit/efa3e132820323c781206fb2b76a6bf79fac0e74)
- [ENG-1037] - Misc bug fixes and onboarding page is done. [`47b7f2a`](https://github.com/Trazi-Ventures/travelling/commit/47b7f2afcf680f818e0bd866bc4eacfb95aedff2)
- [ENG-1037] - Massive cleanup and new login/reg page [`f1f0383`](https://github.com/Trazi-Ventures/travelling/commit/f1f0383f07cdecb72e40c77325365f00cd9647fe)
- [ENG-1037] - Improved Authorization Code Grant to be true SSO one-click [`ba84e61`](https://github.com/Trazi-Ventures/travelling/commit/ba84e6186d8c4789b1b02b8973717ff4d5a57332)
- [ENG-1037] - Added crappy login/reg page for Authorization Code Grant [`f6cf3a3`](https://github.com/Trazi-Ventures/travelling/commit/f6cf3a33899e4d4ef9e219a16d2f42beb63c4ef0)
- [ENG-1037] - Added redis support for multi service running. [`899609d`](https://github.com/Trazi-Ventures/travelling/commit/899609dd2092649caf5f98d2a8e6b57df16207c7)
- [ENG-1037] - Circular Group Inheritance protection and tests [`bcf6be0`](https://github.com/Trazi-Ventures/travelling/commit/bcf6be09d15da3e47fc6080802c0e839468d0fe9)
- [ENG-1037] - Updated log in email [`3e0a09d`](https://github.com/Trazi-Ventures/travelling/commit/3e0a09d23e10e477d5e781392faf168bef43aa60)
- [ENG-1037] - fastify logging settings [`e68ed82`](https://github.com/Trazi-Ventures/travelling/commit/e68ed828680a5a69fd125a3b7c759956b6180b78)
- [ENG-1037] - Fixed tests [`75baa97`](https://github.com/Trazi-Ventures/travelling/commit/75baa9766a09c0525d15ba5854dd89a1cd8cb766)
- [ENG-1037] - Added user methods by group type and name & cleaned up route paths [`da4ddd6`](https://github.com/Trazi-Ventures/travelling/commit/da4ddd6f23bacc7b1db5b4990c2c3547225ed450)
- [ENG-1037] - added get all users by group request endpoint [`b02b9d8`](https://github.com/Trazi-Ventures/travelling/commit/b02b9d8d1b744fcd7dfb544ebc0ef73447871a1a)
- [ENG-1037] - Added user query filtering to all routes dealing with users [`ec2e9a4`](https://github.com/Trazi-Ventures/travelling/commit/ec2e9a47b812ada3509aa1104d5a3c99108b8c55)
- [ENG-1037] - Added grouptype to dynamic route props [`c25b8a2`](https://github.com/Trazi-Ventures/travelling/commit/c25b8a2e44a5c33d8a2004b3d97306292be0ab46)
- [ENG-1037] - Added more group endpoints and cleaned up a bit [`761d12b`](https://github.com/Trazi-Ventures/travelling/commit/761d12b9f33a17079723a12d182ae2c5b8ffbaec)
- [ENG-1037] - Added group_request to registration and 'users' now has query search [`8c229d0`](https://github.com/Trazi-Ventures/travelling/commit/8c229d03b2228769e6c81a2f5870c5639ff37244)
- [ENG-1037] - removed console log [`4e91cba`](https://github.com/Trazi-Ventures/travelling/commit/4e91cba40b029650a97a80ddf6c2ad58bfc6adab)
- [ENG-1037] - ip hijacking option [`cd26e30`](https://github.com/Trazi-Ventures/travelling/commit/cd26e30a317dc9c7518d619f9447b9039f985774)
- [ENG-1037] - Docs push for real this time [`a2b2306`](https://github.com/Trazi-Ventures/travelling/commit/a2b23065a25426400fd7842dc6df4e13639a74e1)
- [ENG-1037] - Token tests added, sdk docs and misc [`037e7ec`](https://github.com/Trazi-Ventures/travelling/commit/037e7ece1f8c25a3da82a1927fbbfcc3183066f6)
- [ENG-1037] - Token fixes and client_id with custom name [`3188130`](https://github.com/Trazi-Ventures/travelling/commit/31881304941c9f0b64e2fd5b20652c4216efdfe1)
- [ENG-1037] - Added OAuth2 client_credentials flow & Other misc things [`91a1e6b`](https://github.com/Trazi-Ventures/travelling/commit/91a1e6bac5b0d04b167e9a74f21dfb5cbf70e0d8)
- [ENG-1037] - misc things [`c93330d`](https://github.com/Trazi-Ventures/travelling/commit/c93330d37f04f136c51ee326d05eb55de3cce085)
- [ENG-1037] - Added more test and fixed bugs found with them. [`415d2db`](https://github.com/Trazi-Ventures/travelling/commit/415d2dbcb85f6c17fbaa8621b925c1e1181b08c9)
- [ENG-1037] - Start of tests, logging and misc bug crushing [`bc3363a`](https://github.com/Trazi-Ventures/travelling/commit/bc3363a799ea0f848a1de89051d84f9e2df4f246)
- [ENG-1037] - Email activation, user updates routes, and lots of misc fixes [`1161b57`](https://github.com/Trazi-Ventures/travelling/commit/1161b57a1d4ee5444ce15626af2a87eb79d6f9c2)
- [ENG-1037] - Forgot password emailing working with smtp, SES and test [`eef0724`](https://github.com/Trazi-Ventures/travelling/commit/eef0724d919b93b34ea08ff195a6fd3546535511)
- [ENG-1037] - Fixed bugs with reset and forget password [`969aa85`](https://github.com/Trazi-Ventures/travelling/commit/969aa8507e405d7fb6486359a330da3c4dd94095)
- [ENG-1037] - Added forgot password logic [`f09403f`](https://github.com/Trazi-Ventures/travelling/commit/f09403faadb3a882f23681ed6019c330b846606f)
- [ENG-1037] - Added more user & group API endpoints [`5cfc766`](https://github.com/Trazi-Ventures/travelling/commit/5cfc7660ac620d5b15cd9217caf68cb00d6fa8ac)
- [ENG-1037] - Got routing and auth up to being ready and added some user routes [`83de3fd`](https://github.com/Trazi-Ventures/travelling/commit/83de3fd46bfe217dd0d46a468fa26c3bd93042e5)
- [ENG-1037] - added portal static file hosting [`565eb2d`](https://github.com/Trazi-Ventures/travelling/commit/565eb2d96f73eaf416ef73cfe4c7638b18c17699)
- [ENG-1037] - Added routing for reverse proxy, still WIP but seems to work. [`47a254f`](https://github.com/Trazi-Ventures/travelling/commit/47a254f0f139c34dc68c311845315de184540538)
- Auth sessions and tokens login, logout and register are done [`05eea6e`](https://github.com/Trazi-Ventures/travelling/commit/05eea6eb2b34bdceb6996998a89bd4e6e88bbd83)
- Token work done [`b3592c6`](https://github.com/Trazi-Ventures/travelling/commit/b3592c60cb11f4d77d3435077b0103169f1c3dd1)
- Start of code base [`2e1b949`](https://github.com/Trazi-Ventures/travelling/commit/2e1b9498199f39d3fa94d9b4952d5bc9e9b671a0)
- Initial commit [`e2f3b07`](https://github.com/Trazi-Ventures/travelling/commit/e2f3b07853066c9a825a01caa98f3dc5859db38a)


## License

                    GNU GENERAL PUBLIC LICENSE
                       Version 3, 29 June 2007

 Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.

                            Preamble

  The GNU General Public License is a free, copyleft license for
software and other kinds of works.

  The licenses for most software and other practical works are designed
to take away your freedom to share and change the works.  By contrast,
the GNU General Public License is intended to guarantee your freedom to
share and change all versions of a program--to make sure it remains free
software for all its users.  We, the Free Software Foundation, use the
GNU General Public License for most of our software; it applies also to
any other work released this way by its authors.  You can apply it to
your programs, too.

  When we speak of free software, we are referring to freedom, not
price.  Our General Public Licenses are designed to make sure that you
have the freedom to distribute copies of free software (and charge for
them if you wish), that you receive source code or can get it if you
want it, that you can change the software or use pieces of it in new
free programs, and that you know you can do these things.

  To protect your rights, we need to prevent others from denying you
these rights or asking you to surrender the rights.  Therefore, you have
certain responsibilities if you distribute copies of the software, or if
you modify it: responsibilities to respect the freedom of others.

  For example, if you distribute copies of such a program, whether
gratis or for a fee, you must pass on to the recipients the same
freedoms that you received.  You must make sure that they, too, receive
or can get the source code.  And you must show them these terms so they
know their rights.

  Developers that use the GNU GPL protect your rights with two steps:
(1) assert copyright on the software, and (2) offer you this License
giving you legal permission to copy, distribute and/or modify it.

  For the developers' and authors' protection, the GPL clearly explains
that there is no warranty for this free software.  For both users' and
authors' sake, the GPL requires that modified versions be marked as
changed, so that their problems will not be attributed erroneously to
authors of previous versions.

  Some devices are designed to deny users access to install or run
modified versions of the software inside them, although the manufacturer
can do so.  This is fundamentally incompatible with the aim of
protecting users' freedom to change the software.  The systematic
pattern of such abuse occurs in the area of products for individuals to
use, which is precisely where it is most unacceptable.  Therefore, we
have designed this version of the GPL to prohibit the practice for those
products.  If such problems arise substantially in other domains, we
stand ready to extend this provision to those domains in future versions
of the GPL, as needed to protect the freedom of users.

  Finally, every program is threatened constantly by software patents.
States should not allow patents to restrict development and use of
software on general-purpose computers, but in those that do, we wish to
avoid the special danger that patents applied to a free program could
make it effectively proprietary.  To prevent this, the GPL assures that
patents cannot be used to render the program non-free.

  The precise terms and conditions for copying, distribution and
modification follow.

                       TERMS AND CONDITIONS

  0. Definitions.

  "This License" refers to version 3 of the GNU General Public License.

  "Copyright" also means copyright-like laws that apply to other kinds of
works, such as semiconductor masks.

  "The Program" refers to any copyrightable work licensed under this
License.  Each licensee is addressed as "you".  "Licensees" and
"recipients" may be individuals or organizations.

  To "modify" a work means to copy from or adapt all or part of the work
in a fashion requiring copyright permission, other than the making of an
exact copy.  The resulting work is called a "modified version" of the
earlier work or a work "based on" the earlier work.

  A "covered work" means either the unmodified Program or a work based
on the Program.

  To "propagate" a work means to do anything with it that, without
permission, would make you directly or secondarily liable for
infringement under applicable copyright law, except executing it on a
computer or modifying a private copy.  Propagation includes copying,
distribution (with or without modification), making available to the
public, and in some countries other activities as well.

  To "convey" a work means any kind of propagation that enables other
parties to make or receive copies.  Mere interaction with a user through
a computer network, with no transfer of a copy, is not conveying.

  An interactive user interface displays "Appropriate Legal Notices"
to the extent that it includes a convenient and prominently visible
feature that (1) displays an appropriate copyright notice, and (2)
tells the user that there is no warranty for the work (except to the
extent that warranties are provided), that licensees may convey the
work under this License, and how to view a copy of this License.  If
the interface presents a list of user commands or options, such as a
menu, a prominent item in the list meets this criterion.

  1. Source Code.

  The "source code" for a work means the preferred form of the work
for making modifications to it.  "Object code" means any non-source
form of a work.

  A "Standard Interface" means an interface that either is an official
standard defined by a recognized standards body, or, in the case of
interfaces specified for a particular programming language, one that
is widely used among developers working in that language.

  The "System Libraries" of an executable work include anything, other
than the work as a whole, that (a) is included in the normal form of
packaging a Major Component, but which is not part of that Major
Component, and (b) serves only to enable use of the work with that
Major Component, or to implement a Standard Interface for which an
implementation is available to the public in source code form.  A
"Major Component", in this context, means a major essential component
(kernel, window system, and so on) of the specific operating system
(if any) on which the executable work runs, or a compiler used to
produce the work, or an object code interpreter used to run it.

  The "Corresponding Source" for a work in object code form means all
the source code needed to generate, install, and (for an executable
work) run the object code and to modify the work, including scripts to
control those activities.  However, it does not include the work's
System Libraries, or general-purpose tools or generally available free
programs which are used unmodified in performing those activities but
which are not part of the work.  For example, Corresponding Source
includes interface definition files associated with source files for
the work, and the source code for shared libraries and dynamically
linked subprograms that the work is specifically designed to require,
such as by intimate data communication or control flow between those
subprograms and other parts of the work.

  The Corresponding Source need not include anything that users
can regenerate automatically from other parts of the Corresponding
Source.

  The Corresponding Source for a work in source code form is that
same work.

  2. Basic Permissions.

  All rights granted under this License are granted for the term of
copyright on the Program, and are irrevocable provided the stated
conditions are met.  This License explicitly affirms your unlimited
permission to run the unmodified Program.  The output from running a
covered work is covered by this License only if the output, given its
content, constitutes a covered work.  This License acknowledges your
rights of fair use or other equivalent, as provided by copyright law.

  You may make, run and propagate covered works that you do not
convey, without conditions so long as your license otherwise remains
in force.  You may convey covered works to others for the sole purpose
of having them make modifications exclusively for you, or provide you
with facilities for running those works, provided that you comply with
the terms of this License in conveying all material for which you do
not control copyright.  Those thus making or running the covered works
for you must do so exclusively on your behalf, under your direction
and control, on terms that prohibit them from making any copies of
your copyrighted material outside their relationship with you.

  Conveying under any other circumstances is permitted solely under
the conditions stated below.  Sublicensing is not allowed; section 10
makes it unnecessary.

  3. Protecting Users' Legal Rights From Anti-Circumvention Law.

  No covered work shall be deemed part of an effective technological
measure under any applicable law fulfilling obligations under article
11 of the WIPO copyright treaty adopted on 20 December 1996, or
similar laws prohibiting or restricting circumvention of such
measures.

  When you convey a covered work, you waive any legal power to forbid
circumvention of technological measures to the extent such circumvention
is effected by exercising rights under this License with respect to
the covered work, and you disclaim any intention to limit operation or
modification of the work as a means of enforcing, against the work's
users, your or third parties' legal rights to forbid circumvention of
technological measures.

  4. Conveying Verbatim Copies.

  You may convey verbatim copies of the Program's source code as you
receive it, in any medium, provided that you conspicuously and
appropriately publish on each copy an appropriate copyright notice;
keep intact all notices stating that this License and any
non-permissive terms added in accord with section 7 apply to the code;
keep intact all notices of the absence of any warranty; and give all
recipients a copy of this License along with the Program.

  You may charge any price or no price for each copy that you convey,
and you may offer support or warranty protection for a fee.

  5. Conveying Modified Source Versions.

  You may convey a work based on the Program, or the modifications to
produce it from the Program, in the form of source code under the
terms of section 4, provided that you also meet all of these conditions:

    a) The work must carry prominent notices stating that you modified
    it, and giving a relevant date.

    b) The work must carry prominent notices stating that it is
    released under this License and any conditions added under section
    7.  This requirement modifies the requirement in section 4 to
    "keep intact all notices".

    c) You must license the entire work, as a whole, under this
    License to anyone who comes into possession of a copy.  This
    License will therefore apply, along with any applicable section 7
    additional terms, to the whole of the work, and all its parts,
    regardless of how they are packaged.  This License gives no
    permission to license the work in any other way, but it does not
    invalidate such permission if you have separately received it.

    d) If the work has interactive user interfaces, each must display
    Appropriate Legal Notices; however, if the Program has interactive
    interfaces that do not display Appropriate Legal Notices, your
    work need not make them do so.

  A compilation of a covered work with other separate and independent
works, which are not by their nature extensions of the covered work,
and which are not combined with it such as to form a larger program,
in or on a volume of a storage or distribution medium, is called an
"aggregate" if the compilation and its resulting copyright are not
used to limit the access or legal rights of the compilation's users
beyond what the individual works permit.  Inclusion of a covered work
in an aggregate does not cause this License to apply to the other
parts of the aggregate.

  6. Conveying Non-Source Forms.

  You may convey a covered work in object code form under the terms
of sections 4 and 5, provided that you also convey the
machine-readable Corresponding Source under the terms of this License,
in one of these ways:

    a) Convey the object code in, or embodied in, a physical product
    (including a physical distribution medium), accompanied by the
    Corresponding Source fixed on a durable physical medium
    customarily used for software interchange.

    b) Convey the object code in, or embodied in, a physical product
    (including a physical distribution medium), accompanied by a
    written offer, valid for at least three years and valid for as
    long as you offer spare parts or customer support for that product
    model, to give anyone who possesses the object code either (1) a
    copy of the Corresponding Source for all the software in the
    product that is covered by this License, on a durable physical
    medium customarily used for software interchange, for a price no
    more than your reasonable cost of physically performing this
    conveying of source, or (2) access to copy the
    Corresponding Source from a network server at no charge.

    c) Convey individual copies of the object code with a copy of the
    written offer to provide the Corresponding Source.  This
    alternative is allowed only occasionally and noncommercially, and
    only if you received the object code with such an offer, in accord
    with subsection 6b.

    d) Convey the object code by offering access from a designated
    place (gratis or for a charge), and offer equivalent access to the
    Corresponding Source in the same way through the same place at no
    further charge.  You need not require recipients to copy the
    Corresponding Source along with the object code.  If the place to
    copy the object code is a network server, the Corresponding Source
    may be on a different server (operated by you or a third party)
    that supports equivalent copying facilities, provided you maintain
    clear directions next to the object code saying where to find the
    Corresponding Source.  Regardless of what server hosts the
    Corresponding Source, you remain obligated to ensure that it is
    available for as long as needed to satisfy these requirements.

    e) Convey the object code using peer-to-peer transmission, provided
    you inform other peers where the object code and Corresponding
    Source of the work are being offered to the general public at no
    charge under subsection 6d.

  A separable portion of the object code, whose source code is excluded
from the Corresponding Source as a System Library, need not be
included in conveying the object code work.

  A "User Product" is either (1) a "consumer product", which means any
tangible personal property which is normally used for personal, family,
or household purposes, or (2) anything designed or sold for incorporation
into a dwelling.  In determining whether a product is a consumer product,
doubtful cases shall be resolved in favor of coverage.  For a particular
product received by a particular user, "normally used" refers to a
typical or common use of that class of product, regardless of the status
of the particular user or of the way in which the particular user
actually uses, or expects or is expected to use, the product.  A product
is a consumer product regardless of whether the product has substantial
commercial, industrial or non-consumer uses, unless such uses represent
the only significant mode of use of the product.

  "Installation Information" for a User Product means any methods,
procedures, authorization keys, or other information required to install
and execute modified versions of a covered work in that User Product from
a modified version of its Corresponding Source.  The information must
suffice to ensure that the continued functioning of the modified object
code is in no case prevented or interfered with solely because
modification has been made.

  If you convey an object code work under this section in, or with, or
specifically for use in, a User Product, and the conveying occurs as
part of a transaction in which the right of possession and use of the
User Product is transferred to the recipient in perpetuity or for a
fixed term (regardless of how the transaction is characterized), the
Corresponding Source conveyed under this section must be accompanied
by the Installation Information.  But this requirement does not apply
if neither you nor any third party retains the ability to install
modified object code on the User Product (for example, the work has
been installed in ROM).

  The requirement to provide Installation Information does not include a
requirement to continue to provide support service, warranty, or updates
for a work that has been modified or installed by the recipient, or for
the User Product in which it has been modified or installed.  Access to a
network may be denied when the modification itself materially and
adversely affects the operation of the network or violates the rules and
protocols for communication across the network.

  Corresponding Source conveyed, and Installation Information provided,
in accord with this section must be in a format that is publicly
documented (and with an implementation available to the public in
source code form), and must require no special password or key for
unpacking, reading or copying.

  7. Additional Terms.

  "Additional permissions" are terms that supplement the terms of this
License by making exceptions from one or more of its conditions.
Additional permissions that are applicable to the entire Program shall
be treated as though they were included in this License, to the extent
that they are valid under applicable law.  If additional permissions
apply only to part of the Program, that part may be used separately
under those permissions, but the entire Program remains governed by
this License without regard to the additional permissions.

  When you convey a copy of a covered work, you may at your option
remove any additional permissions from that copy, or from any part of
it.  (Additional permissions may be written to require their own
removal in certain cases when you modify the work.)  You may place
additional permissions on material, added by you to a covered work,
for which you have or can give appropriate copyright permission.

  Notwithstanding any other provision of this License, for material you
add to a covered work, you may (if authorized by the copyright holders of
that material) supplement the terms of this License with terms:

    a) Disclaiming warranty or limiting liability differently from the
    terms of sections 15 and 16 of this License; or

    b) Requiring preservation of specified reasonable legal notices or
    author attributions in that material or in the Appropriate Legal
    Notices displayed by works containing it; or

    c) Prohibiting misrepresentation of the origin of that material, or
    requiring that modified versions of such material be marked in
    reasonable ways as different from the original version; or

    d) Limiting the use for publicity purposes of names of licensors or
    authors of the material; or

    e) Declining to grant rights under trademark law for use of some
    trade names, trademarks, or service marks; or

    f) Requiring indemnification of licensors and authors of that
    material by anyone who conveys the material (or modified versions of
    it) with contractual assumptions of liability to the recipient, for
    any liability that these contractual assumptions directly impose on
    those licensors and authors.

  All other non-permissive additional terms are considered "further
restrictions" within the meaning of section 10.  If the Program as you
received it, or any part of it, contains a notice stating that it is
governed by this License along with a term that is a further
restriction, you may remove that term.  If a license document contains
a further restriction but permits relicensing or conveying under this
License, you may add to a covered work material governed by the terms
of that license document, provided that the further restriction does
not survive such relicensing or conveying.

  If you add terms to a covered work in accord with this section, you
must place, in the relevant source files, a statement of the
additional terms that apply to those files, or a notice indicating
where to find the applicable terms.

  Additional terms, permissive or non-permissive, may be stated in the
form of a separately written license, or stated as exceptions;
the above requirements apply either way.

  8. Termination.

  You may not propagate or modify a covered work except as expressly
provided under this License.  Any attempt otherwise to propagate or
modify it is void, and will automatically terminate your rights under
this License (including any patent licenses granted under the third
paragraph of section 11).

  However, if you cease all violation of this License, then your
license from a particular copyright holder is reinstated (a)
provisionally, unless and until the copyright holder explicitly and
finally terminates your license, and (b) permanently, if the copyright
holder fails to notify you of the violation by some reasonable means
prior to 60 days after the cessation.

  Moreover, your license from a particular copyright holder is
reinstated permanently if the copyright holder notifies you of the
violation by some reasonable means, this is the first time you have
received notice of violation of this License (for any work) from that
copyright holder, and you cure the violation prior to 30 days after
your receipt of the notice.

  Termination of your rights under this section does not terminate the
licenses of parties who have received copies or rights from you under
this License.  If your rights have been terminated and not permanently
reinstated, you do not qualify to receive new licenses for the same
material under section 10.

  9. Acceptance Not Required for Having Copies.

  You are not required to accept this License in order to receive or
run a copy of the Program.  Ancillary propagation of a covered work
occurring solely as a consequence of using peer-to-peer transmission
to receive a copy likewise does not require acceptance.  However,
nothing other than this License grants you permission to propagate or
modify any covered work.  These actions infringe copyright if you do
not accept this License.  Therefore, by modifying or propagating a
covered work, you indicate your acceptance of this License to do so.

  10. Automatic Licensing of Downstream Recipients.

  Each time you convey a covered work, the recipient automatically
receives a license from the original licensors, to run, modify and
propagate that work, subject to this License.  You are not responsible
for enforcing compliance by third parties with this License.

  An "entity transaction" is a transaction transferring control of an
organization, or substantially all assets of one, or subdividing an
organization, or merging organizations.  If propagation of a covered
work results from an entity transaction, each party to that
transaction who receives a copy of the work also receives whatever
licenses to the work the party's predecessor in interest had or could
give under the previous paragraph, plus a right to possession of the
Corresponding Source of the work from the predecessor in interest, if
the predecessor has it or can get it with reasonable efforts.

  You may not impose any further restrictions on the exercise of the
rights granted or affirmed under this License.  For example, you may
not impose a license fee, royalty, or other charge for exercise of
rights granted under this License, and you may not initiate litigation
(including a cross-claim or counterclaim in a lawsuit) alleging that
any patent claim is infringed by making, using, selling, offering for
sale, or importing the Program or any portion of it.

  11. Patents.

  A "contributor" is a copyright holder who authorizes use under this
License of the Program or a work on which the Program is based.  The
work thus licensed is called the contributor's "contributor version".

  A contributor's "essential patent claims" are all patent claims
owned or controlled by the contributor, whether already acquired or
hereafter acquired, that would be infringed by some manner, permitted
by this License, of making, using, or selling its contributor version,
but do not include claims that would be infringed only as a
consequence of further modification of the contributor version.  For
purposes of this definition, "control" includes the right to grant
patent sublicenses in a manner consistent with the requirements of
this License.

  Each contributor grants you a non-exclusive, worldwide, royalty-free
patent license under the contributor's essential patent claims, to
make, use, sell, offer for sale, import and otherwise run, modify and
propagate the contents of its contributor version.

  In the following three paragraphs, a "patent license" is any express
agreement or commitment, however denominated, not to enforce a patent
(such as an express permission to practice a patent or covenant not to
sue for patent infringement).  To "grant" such a patent license to a
party means to make such an agreement or commitment not to enforce a
patent against the party.

  If you convey a covered work, knowingly relying on a patent license,
and the Corresponding Source of the work is not available for anyone
to copy, free of charge and under the terms of this License, through a
publicly available network server or other readily accessible means,
then you must either (1) cause the Corresponding Source to be so
available, or (2) arrange to deprive yourself of the benefit of the
patent license for this particular work, or (3) arrange, in a manner
consistent with the requirements of this License, to extend the patent
license to downstream recipients.  "Knowingly relying" means you have
actual knowledge that, but for the patent license, your conveying the
covered work in a country, or your recipient's use of the covered work
in a country, would infringe one or more identifiable patents in that
country that you have reason to believe are valid.

  If, pursuant to or in connection with a single transaction or
arrangement, you convey, or propagate by procuring conveyance of, a
covered work, and grant a patent license to some of the parties
receiving the covered work authorizing them to use, propagate, modify
or convey a specific copy of the covered work, then the patent license
you grant is automatically extended to all recipients of the covered
work and works based on it.

  A patent license is "discriminatory" if it does not include within
the scope of its coverage, prohibits the exercise of, or is
conditioned on the non-exercise of one or more of the rights that are
specifically granted under this License.  You may not convey a covered
work if you are a party to an arrangement with a third party that is
in the business of distributing software, under which you make payment
to the third party based on the extent of your activity of conveying
the work, and under which the third party grants, to any of the
parties who would receive the covered work from you, a discriminatory
patent license (a) in connection with copies of the covered work
conveyed by you (or copies made from those copies), or (b) primarily
for and in connection with specific products or compilations that
contain the covered work, unless you entered into that arrangement,
or that patent license was granted, prior to 28 March 2007.

  Nothing in this License shall be construed as excluding or limiting
any implied license or other defenses to infringement that may
otherwise be available to you under applicable patent law.

  12. No Surrender of Others' Freedom.

  If conditions are imposed on you (whether by court order, agreement or
otherwise) that contradict the conditions of this License, they do not
excuse you from the conditions of this License.  If you cannot convey a
covered work so as to satisfy simultaneously your obligations under this
License and any other pertinent obligations, then as a consequence you may
not convey it at all.  For example, if you agree to terms that obligate you
to collect a royalty for further conveying from those to whom you convey
the Program, the only way you could satisfy both those terms and this
License would be to refrain entirely from conveying the Program.

  13. Use with the GNU Affero General Public License.

  Notwithstanding any other provision of this License, you have
permission to link or combine any covered work with a work licensed
under version 3 of the GNU Affero General Public License into a single
combined work, and to convey the resulting work.  The terms of this
License will continue to apply to the part which is the covered work,
but the special requirements of the GNU Affero General Public License,
section 13, concerning interaction through a network will apply to the
combination as such.

  14. Revised Versions of this License.

  The Free Software Foundation may publish revised and/or new versions of
the GNU General Public License from time to time.  Such new versions will
be similar in spirit to the present version, but may differ in detail to
address new problems or concerns.

  Each version is given a distinguishing version number.  If the
Program specifies that a certain numbered version of the GNU General
Public License "or any later version" applies to it, you have the
option of following the terms and conditions either of that numbered
version or of any later version published by the Free Software
Foundation.  If the Program does not specify a version number of the
GNU General Public License, you may choose any version ever published
by the Free Software Foundation.

  If the Program specifies that a proxy can decide which future
versions of the GNU General Public License can be used, that proxy's
public statement of acceptance of a version permanently authorizes you
to choose that version for the Program.

  Later license versions may give you additional or different
permissions.  However, no additional obligations are imposed on any
author or copyright holder as a result of your choosing to follow a
later version.

  15. Disclaimer of Warranty.

  THERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY
APPLICABLE LAW.  EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT
HOLDERS AND/OR OTHER PARTIES PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY
OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO,
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE.  THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE PROGRAM
IS WITH YOU.  SHOULD THE PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF
ALL NECESSARY SERVICING, REPAIR OR CORRECTION.

  16. Limitation of Liability.

  IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING
WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MODIFIES AND/OR CONVEYS
THE PROGRAM AS PERMITTED ABOVE, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY
GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE
USE OR INABILITY TO USE THE PROGRAM (INCLUDING BUT NOT LIMITED TO LOSS OF
DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD
PARTIES OR A FAILURE OF THE PROGRAM TO OPERATE WITH ANY OTHER PROGRAMS),
EVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF
SUCH DAMAGES.

  17. Interpretation of Sections 15 and 16.

  If the disclaimer of warranty and limitation of liability provided
above cannot be given local legal effect according to their terms,
reviewing courts shall apply local law that most closely approximates
an absolute waiver of all civil liability in connection with the
Program, unless a warranty or assumption of liability accompanies a
copy of the Program in return for a fee.

                     END OF TERMS AND CONDITIONS

            How to Apply These Terms to Your New Programs

  If you develop a new program, and you want it to be of the greatest
possible use to the public, the best way to achieve this is to make it
free software which everyone can redistribute and change under these terms.

  To do so, attach the following notices to the program.  It is safest
to attach them to the start of each source file to most effectively
state the exclusion of warranty; and each file should have at least
the "copyright" line and a pointer to where the full notice is found.

    <one line to give the program's name and a brief idea of what it does.>
    Copyright (C) <year>  <name of author>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

Also add information on how to contact you by electronic and paper mail.

  If the program does terminal interaction, make it output a short
notice like this when it starts in an interactive mode:

    <program>  Copyright (C) <year>  <name of author>
    This program comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
    This is free software, and you are welcome to redistribute it
    under certain conditions; type `show c' for details.

The hypothetical commands `show w' and `show c' should show the appropriate
parts of the General Public License.  Of course, your program's commands
might be different; for a GUI interface, you would use an "about box".

  You should also get your employer (if you work as a programmer) or school,
if any, to sign a "copyright disclaimer" for the program, if necessary.
For more information on this, and how to apply and follow the GNU GPL, see
<https://www.gnu.org/licenses/>.

  The GNU General Public License does not permit incorporating your program
into proprietary programs.  If your program is a subroutine library, you
may consider it more useful to permit linking proprietary applications with
the library.  If this is what you want to do, use the GNU Lesser General
Public License instead of this License.  But first, please read
<https://www.gnu.org/licenses/why-not-lgpl.html>.

