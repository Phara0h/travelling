const config = require('./config');
const nodemailer = require('nodemailer');
const fs = require('fs');
const Handlebars = require('handlebars');
const Fasquest = require('fasquest');

var transporter = null;
var templates = null;
const restTransporter = {
  name: 'minimal',
  version: '0.1.0',
  send: async (mail, callback) => {
    try {
      var uri = '';

      if (mail.data.type == 'password') {
        uri = config.email.rest.passwordRecoveryEndpoint;
      } else if (mail.data.type == 'activation') {
        uri = config.email.rest.activationEndpoint;
      } else if (mail.data.type == 'locked') {
        uri = config.email.rest.lockedEndpoint;
      }

      await Fasquest.request({
        method: 'POST',
        simple: false,
        uri,
        json: true,
        body: { user: mail.data.user, token: mail.data.token, clientip: mail.data.clientip }
      });
      callback(null, true);
    } catch (e) {
      config.log.logger.error(`Failed to send email using rest endpoint ${uri}`, mail.data.user);
      callback(null, false);
    }
  }
};

class Email {
  constructor() {}

  static async init() {
    if (config.email.test.enable) {
      var ta = await nodemailer.createTestAccount();

      config.log.logger.debug('Test Email Account:', ta);

      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: ta.user, // generated ethereal user
          pass: ta.pass // generated ethereal password
        }
      });
    } else if (config.email.smtp.enable) {
      transporter = nodemailer.createTransport(config.email.smtp);
    } else if (config.email.aws.enable) {
      var aws = require('aws-sdk');

      aws.config.loadFromPath(config.email.aws.config);
      transporter = nodemailer.createTransport({
        SES: new aws.SES({ apiVersion: '2010-12-01' })
      });
    } else if (config.email.rest.enable) {
      transporter = nodemailer.createTransport(restTransporter);
    }

    templates = {
      resetPasswordBody: Handlebars.compile(
        fs.readFileSync(require('path').resolve(config.email.template.passwordResetBody), 'utf-8')
      ),
      resetPasswordSubject: Handlebars.compile(
        fs.readFileSync(require('path').resolve(config.email.template.passwordResetSubject), 'utf-8')
      ),
      activationBody: Handlebars.compile(fs.readFileSync(require('path').resolve(config.email.template.activationBody), 'utf-8')),
      activationSubject: Handlebars.compile(
        fs.readFileSync(require('path').resolve(config.email.template.activationSubject), 'utf-8')
      )
    };
  }

  static async sendPasswordRecovery(user, hostname, clientip, email, token) {
    if (!transporter) {
      config.log.logger.debug(`Password Recovery For: ${email}, ${token}`);
      return;
    }
    var body;
    var subject;

    if (!config.email.rest.enable) {
      clientip = await Fasquest.request({
        uri: `http://ip-api.com/json/${clientip}?fields=status,country,regionName,city,isp,query`
      });
      body = templates.resetPasswordBody({ user, hostname: user.domain, clientip, config, token });
      subject = templates.resetPasswordSubject({ user });
    }

    var info = await transporter.sendMail({
      from: config.email.from,
      to: email,
      subject: subject,
      html: body,
      type: 'password',
      user,
      config,
      token,
      clientip
    });

    if (config.email.test.enable) {
      var testInfo = { info, url: await nodemailer.getTestMessageUrl(info) };

      config.log.logger.debug(testInfo);
      var tc = require('../../tests/include/TestContainer');

      tc.passwordEmail = testInfo;
      return testInfo;
    }
  }

  static async sendActivation(user, email, token, hostname) {
    if (!transporter) {
      config.log.logger.debug(`Activation Email For: ${email}, ${token}`);
      return;
    }
    var body;
    var subject;

    if (!config.email.rest.enable) {
      body = templates.activationBody({ user, config, token, hostname: user.domain });
      subject = templates.activationSubject({ user });
    }

    var info = await transporter.sendMail({
      from: config.email.from,
      to: email,
      subject: subject,
      html: body,
      type: 'activation',
      user,
      config,
      token
    });

    if (config.email.test.enable) {
      var testInfo = { info, url: await nodemailer.getTestMessageUrl(info) };

      config.log.logger.debug(testInfo);
      var tc = require('../../tests/include/TestContainer');

      tc.activationEmail = testInfo;
      return testInfo;
    }
  }
}

module.exports = Email;
