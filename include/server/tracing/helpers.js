const { context, trace } = require('@opentelemetry/api');
var helpers;

module.exports = (tracez = null) => {
  if (helpers) {
    return helpers;
  }
  helpers = {};
  helpers.trace = tracez;
  helpers.startSpan = (name, oldspan) => {
    return helpers.trace.tracer.startSpan(name, undefined, oldspan ? trace.setSpan(context.active(), oldspan) : undefined);
  };
  helpers.text = (msg, span) => {
    if (!helpers.trace) {
      return msg;
    }

    return {
      message: msg,
      traceId: span ? span.context().traceId : 'unknown',
      wog_type: 'string_message'
    };
  };

  return helpers;
};
