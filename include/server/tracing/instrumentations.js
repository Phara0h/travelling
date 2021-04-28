const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');

module.exports = function (config) {
  return [
    new HttpInstrumentation({
      serviceName: config.serviceName,
      ignoreIncomingPaths: [`/${config.serviceName}/metrics`, `/${config.serviceName}/health`]
    })
  ];
};
