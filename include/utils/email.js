const crypto = require('crypto');
const Token = require('./token');
const config = require('./config');

class Email {
    constructor() {
    }

    static async checkRecoveryToken(token) {
        try {
            var dToken = (await Token.decrypt(token)).split('|');

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

                resolve({token: await Token.encrypt(secret), secret});
            });
        });

    }

}

module.exports = Email;
