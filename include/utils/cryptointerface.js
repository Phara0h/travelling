'use strict';
const config = require('./config')
const crypto = require('crypto');
const token = require('./token');

const encryptKey = crypto.scryptSync(config.pg.crypto.secret, config.pg.crypto.salt, 32)

class Crypto {
    constructor() {
    }

    static async isEncryptionEnabled() {
        return Promise.resolve(true);
    }

    static async checksum(field) {
      return new Promise((resolve,reject)=>{
          const checkHash = crypto.createHash('sha256');
          try {
            checkHash.on('readable', () => {
              const data = checkHash.read();
              if (data) {
                resolve(data.toString('hex'))
              }
            });

            checkHash.write(field);
            checkHash.end();
          } catch (e) {
            reject(e);
          }
      })
    }

    static async hash(field, salt) {
      return new Promise((resolve,reject)=>{
        try {
          const hmac = crypto.createHmac('sha256', salt || config.pg.crypto.salt);
          hmac.on('readable', () => {
            const data = hmac.read();
            if (data) {
              resolve(data.toString('hex'))
            }
          });
          hmac.write(field);
          hmac.end();
        } catch (e) {
          reject(e);
        }
      })
    }

    static async encrypt(text) {
      return await token.encrypt(text, encryptKey)
    }

    static async decrypt(text) {
      return await token.decrypt(text, encryptKey)
    }
}

module.exports = Crypto;
