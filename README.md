<h1 style="display:flex;">
  <span style="background-color: black; filter: invert(100%); margin-right:10px">
    <img src="/client/assets/logo.svg" data-canonical-src="/client/assets/logo.svg" width="42" height="42"/>
  </span>
  Travelling
</h1>

A blazing fast dynamic route level groups/permissions api gateway.

- [Travelling](#travelling)
  - [REST Docs found at](#rest-docs-found-at)
  - [API Docs](#api-docs)
  * [Install](#install)
    + [Minimum New Setup](#minimum-new-setup)
  * [Configuration](#configuration)
    + [Basic](#basic)
        * [TRAVELLING_PORT](#travelling-port)
        * [TRAVELLING_IP](#travelling-ip)
        * [TRAVELLING_KEY](#travelling-key)
        * [TRAVELLING_CERT](#travelling-cert)
        * [TRAVELLING_HTTPS](#travelling-https)
    + [Cors](#cors)
        * [TRAVELLING_CORS_ENABLE](#travelling-cors-enable)
        * [TRAVELLING_CORS_HEADER_ORIGIN](#travelling-cors-header-origin)
        * [TRAVELLING_CORS_HEADER_METHODS](#travelling-cors-header-methods)
        * [TRAVELLING_CORS_HEADER_CREDENTIALS](#travelling-cors-header-credentials)
        * [TRAVELLING_CORS_HEADER_MAX_AGE](#travelling-cors-header-max-age)
    + [Logging](#logging)
        * [TRAVELLING_LOG_ENABLE](#travelling-log-enable)
        * [TRAVELLING_LOG_LOGGER](#travelling-log-logger)
        * [TRAVELLING_LOG_COLORS](#travelling-log-colors)
        * [TRAVELLING_LOG_LEVEL](#travelling-log-level)
        * [TRAVELLING_LOG_REQUESTS](#travelling-log-requests)
        * [TRAVELLING_LOG_UNAUTHORIZED_ACCESS](#travelling-log-unauthorized-access)
    + [Fastify Logger](#fastify-logger)
        * [TRAVELLING_LOG_FASTIFY_LOGGER](#travelling-log-fastify-logger)
        * [TRAVELLING_LOG_FASTIFY_LOGGER_REQUEST](#travelling-log-fastify-logger-request)
        * [TRAVELLING_LOG_FASTIFY_LOGGER_REQ_ID_HEADER](#travelling-log-fastify-logger-req-id-header)
        * [TRAVELLING_LOG_FASTIFY_LOGGER_REQ_ID_LOG_LABEL](#travelling-log-fastify-logger-req-id-log-label)
    + [Portal](#portal)
        * [TRAVELLING_PORTAL_ENABLE](#travelling-portal-enable)
        * [TRAVELLING_PORTAL_PATH](#travelling-portal-path)
        * [TRAVELLING_PORTAL_HOST](#travelling-portal-host)
        * [TRAVELLING_PORTAL_FILE_PATH](#travelling-portal-file-path)
        * [TRAVELLING_PORTAL_LOGO](#travelling-portal-logo)
  * [Security](#security)


#### REST Docs found at
https://documenter.getpostman.com/view/7072151/SVfJUrSZ?version=latest

#### API Docs
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


## Configuration

Configuration is done through environment variables. All variables have a default values except for what is stated in [Minimum New Setup](#MinimumNewSetup)




___

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
**Example**: `*.domain.com`

##### TRAVELLING_CORS_HEADER_METHODS
*`access-control-allow-methods` header that is returned back with all requests.* </br>
> **Default**: Rewrites it's self to the `access-control-request-method` header request or sets to `*` if there is no request.  </br>
**Example**: `GET,DELETE`

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
**Example**: js file setting pino settings.
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


## Security
