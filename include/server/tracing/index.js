const opentelemetry = require('@opentelemetry/api');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { CompositePropagator } = require('@opentelemetry/core');
const { resolve } = require('path');

module.exports = function (config) {
  // Create and configure NodeTracerProvider
  const provider = new NodeTracerProvider();

  const propagators = require(resolve(process.cwd(), config.tracing.propagators))(config);

  try {
    const instrumentations = require(resolve(process.cwd(), config.tracing.instrumentations))(config);

    registerInstrumentations({
      tracerProvider: provider,
      instrumentations
    });
  } catch (error) {
    config.log.logger.warn('Error registering instrumentations for tracing', error);
  }

  try {
    const processors = require(resolve(process.cwd(), config.tracing.processors))(config);

    for (let i = 0; i < processors.length; i++) {
      provider.addSpanProcessor(processors[i]);
    }
  } catch (error) {
    config.log.logger.warn('Error registering processors for tracing', error);
  }

  try {
    provider.register({
      propagator: new CompositePropagator({
        propagators
      })
    });
    opentelemetry.propagation.setGlobalPropagator(propagators[0]);
  } catch (error) {
    config.log.logger.warn('Error registering propagators for tracing', error);
  }

  var trace = {
    tracer: opentelemetry.trace.getTracer('travelling', config.log.appendFields.version.label),
    opentelemetry
  };

  require('./helpers.js')(trace);
  return trace;
};
