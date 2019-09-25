'use strict';

const colors = require('colors');
const config = require(__dirname + '/config');
const levels = {
    trace: 10,
    debug: 20,
    info: 30,
    warn: 40,
    error: 50,
    fatal: 60,
};

class Logger {
    constructor() {
        this.logger = console;
        config.log.level = levels[config.log.level];
    }

    log(level, ...msg) {
        if (level >= config.log.level) {
            if (config.log.enable && config.log.colors) {
                var color = 'magenta';

                switch (level.toLowerCase()) {
                    case 'info':
                        color = 'white';
                        break;
                    case 'warn':
                        color = 'yellow';
                        break;
                    case 'error':
                        color = 'red';
                        break;
                    case 'debug':
                        color = 'blue';
                        break;
                    case 'fatal':
                        color = 'red';
                        break;
                    case 'trace':
                        color = 'green';
                        break;
                    default:
                        break;
                }
                this.logger.log(colors.cyan('Travelling:') + ' [' + colors[color](level.toUpperCase()) + '] ', ...msg);
            } else if (config.log.enable) {
                this.logger.log('Travelling: [' + level.toUpperCase() + '] ', ...msg);
            }
        }
    }

    info(...msg) {
        this.log(levels.info, ...msg);
    }
    warn(...msg) {
        this.log(levels.warn, ...msg);
    }
    error(...msg) {
        this.log(levels.error, ...msg);
    }
    debug(...msg) {
        this.log(levels.debug, ...msg);
    }
    fatal(...msg) {
        this.log(levels.fatal, ...msg);
    }
    trace(...msg) {
        this.log(levels.trace, ...msg);
    }

}

var logger = new Logger();

module.exports = logger;
