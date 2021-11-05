const { W3CTraceContextPropagator } = require('@opentelemetry/core');

module.exports = function (config) {
  return [new W3CTraceContextPropagator()];
};
