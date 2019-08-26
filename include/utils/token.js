const config = require('./config');
const crypto = require('crypto');
const encryptKey = crypto.scryptSync(config.token.secret, config.token.salt, 32);
const encryptIV = config.token.secret;

const User = require('../database/models/user');

class Token {
    constructor() {
    }

    static async checkToken(req, res, router) {
        try {
            var tok = req.cookies['trav:tok'];

            if (!tok) {
                return false;
            }

            var ip = req.ip;
            var dToken = await this.decrypt(tok.toString('ascii'));
            var cred = dToken.split(':');

            if (cred[3] == ip && Date.now() - Number(cred[2]) < config.token.expiration * 86400000) // 90 days in millls
            {
                var user = await User.findAllBy({username: cred[0], password: cred[1]});

                if (!user || user.length < 1) {
                    return false;
                } else {
                    return await user[0].resolveGroup(router);
                }
            } else {
                this.removeAuthCookie(res);
                return false;
            }
        } catch (e) {
          console.log(e)
            this.removeAuthCookie(res);
            return false;
        }
    }

    static setAuthCookie(tok, res, date) {
        res.setCookie('trav:tok', tok, {
            expires: new Date(date.getTime() + config.token.expiration * 86400000),
            secure: true,
            httpOnly: true,
            path: '/',
        });
        return res;
    }

    static removeAuthCookie(res) {
        res.setCookie('trav:tok', null, {
            expires: Date.now(),
            secure: true,
            httpOnly: true,
            path: '/',
        });
        return res;
    }

    // password are the hashed password only!
    static async getToken(username, password, ip, date) {
        return await this.encrypt(`${username}:${password}:${date.getTime()}:${ip}`);
    }

    // password are the hashed password only!
    static async newTokenInCookie(username, password, req, res) {
        var date = new Date(Date.now());
        var tok = await this.getToken(username, password, req.ip, date);

        return this.setAuthCookie(tok, res, date);
    }

    static encrypt(text, setEncryptKey) {
        return new Promise((resolve, reject)=>{
            crypto.randomBytes(16, (err, opIV) => {

                if (err) {
                    reject(err);
                }

                var cipher = crypto.createCipheriv('aes-256-cbc', setEncryptKey || encryptKey, opIV);

                var encrypted = '';

                cipher.on('readable', () => {
                    let chunk;

                    while (null !== (chunk = cipher.read())) {
                        encrypted += chunk.toString('base64');
                    }
                });

                cipher.on('end', () => {
                    resolve(encrypted + '|' + opIV.toString('base64'));
                });

                cipher.write(text);
                cipher.end();
            });
        });
    }

    static decrypt(text, setEncryptKey) {
        return new Promise((resolve, reject) => {
            text = text.split('|');

            var cipher = crypto.createDecipheriv('aes-256-cbc', setEncryptKey || encryptKey, Buffer.alloc(16, text[1], 'base64'));

            var decrypted = '';

            cipher.on('readable', () => {
                let chunk;

                while (null !== (chunk = cipher.read())) {
                    decrypted += chunk.toString('ascii');
                }
            });

            cipher.on('end', () => {
                resolve(decrypted);
            });

            cipher.write(text[0], 'base64');
            cipher.end();
        });
    }
}

module.exports = Token;
