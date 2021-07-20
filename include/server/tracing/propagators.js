const { HttpTraceContextPropagator } = require('@opentelemetry/core');

module.exports = function (config) {
  return [new HttpTraceContextPropagator()];
};
