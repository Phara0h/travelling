const { HttpTraceContext } = require('@opentelemetry/core');

module.exports = function (config) {
  return [new HttpTraceContext()];
};
