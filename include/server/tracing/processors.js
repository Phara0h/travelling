const { SimpleSpanProcessor, ConsoleSpanExporter } = require('@opentelemetry/tracing');

module.exports = function (config) {
  var tags = [];

  tags.push({ key: 'service.name', value: app });
  if (config.log.appendFields.app.enable) {
    tags.push({ key: 'app', value: config.log.appendFields.app.label });
  }
  if (config.log.appendFields.version.enable) {
    tags.push({ key: 'version', value: config.log.appendFields.version.label });
  }
  if (config.log.appendFields.environment.enable) {
    tags.push({ key: 'environment', value: config.log.appendFields.environment.label });
  }
  if (config.log.appendFields.host.enable) {
    tags.push({ key: 'host', value: config.log.appendFields.host.label });
  }
  if (config.log.appendFields.branch.enable) {
    tags.push({ key: 'branch', value: config.log.appendFields.branch.label });
  }

  return [
    new SimpleSpanProcessor(
      new ConsoleSpanExporter({
        tags
      })
    )
  ];
};
