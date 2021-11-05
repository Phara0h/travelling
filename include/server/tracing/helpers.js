const { context, trace } = require('@opentelemetry/api');
var helpers;

module.exports = (tracez = null) => {
  if (helpers) {
    return helpers;
  }

  helpers = {};
  helpers.trace = tracez;
  helpers.startSpan = (name, oldspan) => {
    return helpers.trace.tracer.startSpan(
      name,
      undefined,
      oldspan ? trace.setSpan(context.active(), oldspan) : undefined
    );
  };

  helpers.text = (msg, span) => {
    if (!helpers.trace) {
      return msg;
    }

    return {
      message: msg,
      traceId: span ? span.spanContext().traceId : "unknown",
      wog_type: "string_message",
    };
  };

  helpers.wrap = function (func, span) {
    return context.with(trace.setSpan(context.active(), span), func);
  };

  helpers.err = (span, err, end = true) => {
    try {
      span.setStatus({ code: 2, message: err.message });
      err.traceId = span.spanContext().traceId;
      span.recordException(err);
      if (end) {
        span.end();
      }
    } catch (e) {}
  };

  return helpers;
};
