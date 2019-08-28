const crypto = require('crypto');
const Token = require('./token');
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
            var testAccount = await nodemailer.createTestAccount();

            config.log.logger.debug('Test Email Account:',testAccount);

            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: testAccount.user, // generated ethereal user
                    pass: testAccount.pass, // generated ethereal password
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

    static async checkRecoveryToken(token) {
        try {
            var dToken = (await Token.decrypt(token.replace(/-/g, '+').replace(/_/g, '\/'))).split('|');

            if (Date.now() - Number(dToken[1]) < config.email.recovery.expiration * 1000) {
                return dToken.join('|'); // secret;
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    static getRecoveryToken() {
        return new Promise((resolve, reject)=>{
            crypto.randomBytes(32, async (err, secret) => {

                if (err) {
                    reject(err);
                }

                var secret = secret.toString('base64') + '|' + (new Date(Date.now())).getTime();

                secret = secret.toString('base64');

                resolve({token: (await Token.encrypt(secret)).replace(/\+/g, '-').replace(/\//g, '_'), secret});
            });
        });
    }


    static async checkActivationToken(token) {
        try {
            var dToken = (await Token.decrypt(token.replace(/-/g, '+').replace(/_/g, '\/'))).split('|');
            console.log(Date.now() - Number(dToken[1]), config.email.activation.expiration * 1000 )
            if (Date.now() - Number(dToken[1]) < config.email.activation.expiration * 1000) {
                return dToken.join('|'); // secret;
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    static async getActivationToken() {
        return await this.getRecoveryToken();
    }

    static async sendPasswordRecovery(user, ip, email, token) {
        if(!transporter) {
          config.log.logger.debug('Password Recovery For: ', email, token);
          return;
        }

        ip = await Fasquest.request({
            uri: `http://ip-api.com/json/${ip}?fields=status,country,regionName,city,isp,query`,
        });
        var body = templates.resetPasswordBody({user, ip, config, token});
        var subject = templates.resetPasswordSubject({user});

        transporter.sendMail({
            from: config.email.from,
            to: email,
            subject: subject,
            html: body,
        }, (e, r)=>{
            if (e) {
                config.log.logger.error(e);
            }
        });

    }

    static async sendActivation(user, email, token) {

      if(!transporter) {
        config.log.logger.debug('Activation Email For: ', email, token);
        return;
      }

      var body = templates.activationBody({user, config, token});
      var subject = templates.activationSubject({user});

      transporter.sendMail({
          from: config.email.from,
          to: email,
          subject: subject,
          html: body,
      }, (e, r)=>{
          if (e) {
              config.log.logger.error(e);
          }
      });
    }
}

module.exports = Email;
