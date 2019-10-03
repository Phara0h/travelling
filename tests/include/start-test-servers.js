const path = require('path');
const fs = require('fs');
const https = require('./test-server.js')({
    https: {
      allowHTTP1: true, // fallback support for HTTP1
      key: fs.readFileSync(path.join(__dirname, './localhost.key')),
      cert: fs.readFileSync(path.join(__dirname, './localhost.csr'))
    },
    disableRequestLogging: true,
    logger: false,
    ip: '0.0.0.0',
    port: 4268
});

const http = require('./test-server.js')({ip: '0.0.0.0',
port: 4267});
