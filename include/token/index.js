'use strict';
const crypto = require('crypto');
const config = require('../utils/config');
const cryptoInterface = require('../utils/cryptointerface');
const regex = require('../utils/regex');

const User = require('../database/models/user');
const Token = require('../database/models/token');
const Email = require('../utils/email');
const CookieToken = require('../utils/cookietoken');
const TokenStore = new (require('./tokenstore'))();

class TokenHandler {
    constructor() {
    }


    static async checkTempToken(token, expiration) {
        try {
            var dToken = (await CookieToken.decrypt(token.replace(/-/g, '+').replace(/_/g, '\/'))).split('|');

            /**
            0 = secret
            1 = creationDate
            2 = type
            3 = userId
            */

            var t = await TokenStore.get( await this._hashToken(dToken[3],dToken[0]));

            if(t.user_id == dToken[3] && t.type == dToken[2] && Date.now() - Number(dToken[1]) < expiration) {
                  return dToken; // secret;
            }

            return false;
        } catch (e) {
            return false;
        }
    }

    static getTempToken(type, user_id, expiration) {
        return new Promise((resolve, reject)=>{
            crypto.randomBytes(32, async (err, secret) => {

                if (err) {
                    reject(err);
                }

                var storedSecret = await TokenStore.set(user_id, type, await this._hashToken(user_id, secret.toString('base64')), expiration)

                var secret = secret.toString('base64') + '|' + (new Date(Date.now())).getTime() + '|' + type + '|' + user_id;

                secret = secret.toString('base64');


                resolve({token: (await CookieToken.encrypt(secret)).replace(/\+/g, '-').replace(/\//g, '_'), secret});
            });
        });
    }

    static getOAuthToken(user_id, type = 'oauth', name = null) {
      return new Promise((resolve, reject)=>{
          crypto.randomBytes(64, async (err, secret) => {

              if (err) {
                  reject(err);
                  return;
              }

              if(regex.safeName.exec(name) == null) {
                reject(true);
                return;
              }
              if(name) {
                var fToken = await Token.findLimtedBy({user_id,name}, 'AND', 1);
                if(fToken && fToken.length > 0) {
                  reject(true);
                  return;
                }
              }
              var token = await Token.create({
                user_id,
                type,
                name,
                secret: secret.toString('hex')
              })
              token.secret = secret.toString('hex')
              resolve(token);
          });
      });
    }

    static getAccessToken(token) {
      return new Promise((resolve, reject)=>{
          crypto.randomBytes(16, async (err, secret) => {

              if (err) {
                  reject(err);
                  return;
              }

              var secretb64 = secret.toString('base64');
              var secret = await this._hashToken(secretb64,token.secret);
              var nToken = await TokenStore.set(token.user_id, 'access', secret, config.token.access.expiration * 60000, token.name) // min to ms
              resolve({access_token: secret, expires_in: config.token.access.expiration*60, token_type:"bearer"}); // min to seconds
          });
      });
    }

    static async checkAccessToken(token) {
        var token = await TokenStore.get(token);

        if(!token) {
          return false;
        }
        var user = await User.findLimtedBy({id:token.user_id}, 'AND', 1);

        return user[0];
    }

    static async checkOAuthToken(id, secret) {

        var hashedSecret = await cryptoInterface.hash(secret);
        //console.log("UUID CHECK : ",regex.uuidCheck(id) ? {id, hashedSecret} : {name:id, hashedSecret})
        var token = await Token.findLimtedBy(regex.uuidCheck(id) ? {id, secret:hashedSecret} : {name:id, secret:hashedSecret}, 'AND', 1);
        //console.log(token, secret)
        if(!token || token.length <= 0) {
          return false;
        }

        token[0].secret = secret;
        return token[0];
    }

    static async deleteOAuthToken(id, user_id) {
      var token = (await Token.deleteAllBy(regex.uuidCheck(id) ? {id, user_id} : {name:id, user_id}))[0];
      return token;
    }

    static async checkRecoveryToken(token) {
      return await this.checkTempToken(token, config.email.recovery.expiration * 1000)
    }

    static async checkActivationToken(token) {
      return await this.checkTempToken(token, config.email.activation.expiration * 1000)
    }

    static async getRecoveryToken(userId) {
      return await this.getTempToken('recovery', userId, config.email.recovery.expiration * 1000);
    }

    static async getActivationToken(userId) {
      return await this.getTempToken('activation', userId, config.email.activation.expiration * 1000);
    }


  static async _hashToken(token, salt) {

      return new Promise((resolve,reject)=>{
        try {
          const hmac = crypto.createHmac('sha256', salt);
          hmac.on('readable', () => {
            const data = hmac.read();
            if (data) {
              resolve(data.toString('hex'))
            }
          });
          hmac.write(token);
          hmac.end();
        } catch (e) {
          reject(e);
        }
      })
    }
}

module.exports = TokenHandler;
