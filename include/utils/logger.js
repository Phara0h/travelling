const colors = require('colors');
const config = require(__dirname+'/config');
class Logger
{
  constructor() {
    this.logger = console;
   }

  log(level,...msg)
  {
    //console.log(config)
    if(config.log.enable && config.log.colors)
    {
      var color = 'magenta';
      switch (level.toLowerCase()) {
        case 'info':
          color = "white";
          break;
        case 'warn':
          color = "yellow";
          break;
        case 'error':
          color = "red";
          break;
        case 'debug':
          color = "blue";
          break;
        case 'fatal':
          color = "red";
          break;
        case 'trace':
          color = "green";
          break;
        default:
          break;
        }
        this.logger.log(colors.cyan('Travelling:')+' ['+colors[color](level.toUpperCase())+'] ',...msg);
      }
      else if(config.log.enable)
      {
        this.logger.log('Travelling: ['+level.toUpperCase()+'] ',...msg);
      }
    }

  info(...msg)
  {
    this.log('info',...msg);
  }
  warn(...msg)
  {
    this.log('warn',...msg);
  }
  error(...msg)
  {
    this.log('error',...msg);
  }
  debug(...msg)
  {
    this.log('debug',...msg);
  }
  fatal(...msg)
  {
    this.log('fatal',...msg);
  }
  trace(...msg)
  {
    this.log('trace',...msg);
  }

}

var logger = new Logger();

module.exports = logger;
