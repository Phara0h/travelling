const path = require('path');
const fs = require('fs');

require('@abeai/recho')({
  https: {
    allowHTTP1: true, // fallback support for HTTP1
    key: fs.readFileSync(path.join(__dirname, './localhost.key')),
    cert: fs.readFileSync(path.join(__dirname, './localhost.csr'))
  },
  disableRequestLogging: true,
  logger: false,
  log: false,
  ip: '0.0.0.0',
  port: 4268
});

require('@abeai/recho')({
  disableRequestLogging: true,
  ip: '0.0.0.0',
  port: 4267,
  logger: false,
  log: false
});
