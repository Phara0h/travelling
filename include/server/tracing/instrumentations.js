const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');

module.exports = function (config) {
  return [
    new HttpInstrumentation({
      tags: [{ key: 'service.name', value: config.serviceName }],
      ignoreIncomingPaths: [`/${config.serviceName}/metrics`, `/${config.serviceName}/health`]
    })
  ];
};
