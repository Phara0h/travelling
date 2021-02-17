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
  - [SDK](#sdk)
  - [Changelog](#changelog)
  - [License](#license)
<!-- TOC END -->

## REST Docs

[REST Docs](https://documenter.getpostman.com/view/208035/TWDUqyFx?version=latest)

## API Docs

[API documentation](./sdk/README.md)

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

Configuration is done through environment variables. All variables have a default values except for what is stated in [Minimum New Setup](#MinimumNewSetup)

{{doc1}}

## SDK

{{doc2}}

## Changelog

{{doc3}}

## License

{{doc4}}
