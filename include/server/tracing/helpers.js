var helpers;

module.exports = (trace = null) => {
  if (helpers) {
    return helpers;
  }
  helpers = {};
  helpers.trace = trace;
  helpers.startSpan = (name, oldspan) => {
    return helpers.trace.tracer.startSpan(
      name,
      undefined,
      oldspan ? helpers.trace.opentelemetry.setSpan(helpers.trace.opentelemetry.context.active(), oldspan) : undefined
    );
  };
  helpers.text = (msg, span) => {
    if (!helpers.trace || !span) {
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
