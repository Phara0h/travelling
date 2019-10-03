'use strict';

function server(options = {}) {
    const path = require('path');
    const url= require('url');
    const URL= require('url').URL;
    options = Object.assign({
        disableRequestLogging: true,
        logger: false,
        https: false,
        ip: '0.0.0.0',
        port: 4270,
    }, options);

    const app = require('fastify')(options);

    function response(req, res) {
      var urlParsed = new URL( `${options.https ? 'https' : 'http'}://${options.ip}:${options.port}${req.raw.url}`)

        res.code(200).send({
                body: req.body,
                query: req.query,
                params: req.params,
                  url:req.req.url,
                method: req.raw.method,
                headers: req.headers,
                //raw: req.raw,
                id: req.id,
                ip: req.ip,
                ips: req.ips,
                hostname: req.hostname,
            });
    }

    app.all(['/:param1'], response);
    app.all(['/:param1/:param2'], response);
    app.all(['/:param1/:param2/:param3'], response);
    app.all(['/:param1/:param2/:param3/:param4'], response);
    app.listen(options.port, options.ip);
}

module.exports = server;
