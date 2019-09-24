# Travelling
A blazing fast dynamic route level groups/permissions api gateway.

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
**Default**: `443`

##### TRAVELLING_IP
*Travelling's serving IP.* </br>
**Default**: `0.0.0.0`

##### TRAVELLING_KEY
*The path to the SSL key that is used for [https](#TRAVELLING_HTTPS)* </br>
**Default**: `travelling/localhost.key`

##### TRAVELLING_CERT
*The path to the SSL cert that is used for [https](#TRAVELLING_HTTPS)* </br>
**Default**: `travelling/localhost.csr`

##### TRAVELLING_HTTPS
*Enables https serving.* </br>
**Default**: `travelling/localhost.csr`

___

### Cors

##### TRAVELLING_CORS_ENABLE
*Allows external services to make api calls to Travelling.* </br>
**Default**: `false`

##### TRAVELLING_CORS_HEADER_ORIGIN
*Full host path or wildstar * host pathed subdomains to allow.* </br>
**Default**: Rewrites the origin to whatever external host is making the call. This allows all external calls allowed and is not recommended.  </br>
**Example**: `*.domain.com`


## Security
