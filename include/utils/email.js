const crypto = require('crypto');
const config = require('./config');
const nodemailer = require('nodemailer');
const fs = require('fs');
const Handlebars = require('handlebars');
const Fasquest = require('fasquest');

var transporter = null;
var templates = null;

class Email {
    constructor() {
    }

    static async init() {
        if (config.email.test.enable) {

          var ta = await nodemailer.createTestAccount();
              config.log.logger.debug('Test Email Account:',ta);

              transporter = nodemailer.createTransport({
                  host: 'smtp.ethereal.email',
                  port: 587,
                  secure: false, // true for 465, false for other ports
                  auth: {
                      user: ta.user, // generated ethereal user
                      pass: ta.pass, // generated ethereal password
                  },
              });

        } else if (config.email.smtp.enable) {
            transporter = nodemailer.createTransport(config.email.smtp);
        } else if (config.email.aws.enable) {
            var aws = require('aws-sdk');

            aws.config.loadFromPath(config.email.aws.config);
            transporter = nodemailer.createTransport({
                SES: new aws.SES({apiVersion: '2010-12-01'}),
            });
        }
        templates = {
            resetPasswordBody: Handlebars.compile(fs.readFileSync(require('path').resolve(config.email.template.passwordResetBody), 'utf-8')),
            resetPasswordSubject: Handlebars.compile(fs.readFileSync(require('path').resolve(config.email.template.passwordResetSubject), 'utf-8')),
            activationBody: Handlebars.compile(fs.readFileSync(require('path').resolve(config.email.template.activationBody), 'utf-8')),
            activationSubject: Handlebars.compile(fs.readFileSync(require('path').resolve(config.email.template.activationSubject), 'utf-8')),
        };
    }



    static async sendPasswordRecovery(user, ip, email, token) {
        if(!transporter) {
          config.log.logger.debug(`Password Recovery For: ${email}, ${token}`);
          return;
        }

        ip = await Fasquest.request({
            uri: `http://ip-api.com/json/${ip}?fields=status,country,regionName,city,isp,query`,
        });
        var body = templates.resetPasswordBody({user, ip, config, token});
        var subject = templates.resetPasswordSubject({user});

          var info = await transporter.sendMail({
            from: config.email.from,
            to: email,
            subject: subject,
            html: body,
        });
        if(config.email.test.enable) {
          var testInfo = {info, url: await nodemailer.getTestMessageUrl(info)};
          config.log.logger.debug(testInfo)
          var tc = require('../../tests/include/TestContainer');
          tc.passwordEmail = testInfo;
          return testInfo;
        }
    }

    static async sendActivation(user, email, token) {

      if(!transporter) {
        config.log.logger.debug(`Activation Email For: ${email}, ${token}`);
        return;
      }

      var body = templates.activationBody({user, config, token});
      var subject = templates.activationSubject({user});

      var info = await transporter.sendMail({
          from: config.email.from,
          to: email,
          subject: subject,
          html: body,
      });
      if(config.email.test.enable) {
        var testInfo = {info, url: await nodemailer.getTestMessageUrl(info)};
        config.log.logger.debug(testInfo)
        var tc = require('../../tests/include/TestContainer');
        tc.activationEmail = testInfo;
        return testInfo;
      }
    }

}

module.exports = Email;
