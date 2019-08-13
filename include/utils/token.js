const config = require('./config');
const crypto = require('crypto');
const encryptKey = crypto.scryptSync(config.token.secret, config.token.salt, 128).toString('hex');
const encryptIV = config.token.secret;

const User = require('../models/user');

class Token
{
  constructor()
  {
  }

  static async checkToken(req,res)
  {
    return new Promise((resolve,reject)=>{
      try
      {
        var tok = req.cookies['trav:tok'];

        if (!tok)
        {
          this.removeAuthCookie(res);
          reject(false)
        }

        var ip = req.connection.remoteAddress
        var dToken = this.decrypt(tok);
        var cred = dToken.split(":");

          if (cred[3] == ip && Date.now() - cred[2] < config.tokenExpiration * 86400000) // 90 days in millls
          {
            var user = await User.findAllBy({username:cred[0],password:cred[1]});

              if(!user || user.length < 1)
              {
                reject(false)
              }
              else
              {
                resolve(user[0])
              }
          }
          else
          {
            this.removeAuthCookie(res);
            reject(false)
          }
      }
      catch (e)
      {
        this.removeAuthCookie(res);
        reject(false)
      }
    })
  }

  static setAuthCookie(tok, res, date)
  {
    res.cookie('trav:tok', tok,
    {
      expires: new Date(date.getTime()+(config.tokenExpiration * 86400000)),
      secure: true,
      httpOnly: true
    })
    return res;
  }

  static removeAuthCookie(res)
  {
    res.clearCookie('trav:tok');
    return res;
  }

  //password are the hashed password only!
  static async getToken(username, password, ip, date)
  {
      return await this.encrypt(`${username}:${password}:${date.getTime()}:${ip}`);
  }

  //password are the hashed password only!
  static async newTokenInCookie(username, password, req, res)
  {
    var date = new Date(Date.now());
    var tok = await this.getToken(username,password,req.connection.remoteAddress,date);
    this.setAuthCookie(tok, res, date);
  }

  static encrypt(text)
  {
    return new Promise((resolve,reject)=>{
      var opIV = crypto.randomBytes(16,(err, buf) => {

      if (err){
        reject(err)
      };

      var opIV = buf.toString('hex')
      var cipher = crypto.createCipheriv('aes-256-cbc', encryptKey, opIV);

      var encrypted = '';
      cipher.on('readable', () => {
        let chunk;
        while (null !== (chunk = cipher.read())) {
          encrypted += chunk.toString('hex');
        }
      });

      cipher.on('end', () => {
        resolve(encrypted + '/' + opIV);
      });

      cipher.write(text);
      cipher.end();
      });
    })
  }

  static decrypt(text)
  {
    return new Promise((resolve,reject)=>{
      text = text.split('/');

      var opIV = buf.toString('hex')
      var cipher = crypto.createDecipheriv('aes-256-cbc',encryptKey,text[1]);

      var decrypted = '';
      cipher.on('readable', () => {
        let chunk;
        while (null !== (chunk = cipher.read())) {
          decrypted += chunk.toString('utf8');
        }
      });

      cipher.on('end', () => {
        resolve(decrypted);
      });

      cipher.write(text[0]);
      cipher.end();
    })
  }
}

module.exports = Token;
