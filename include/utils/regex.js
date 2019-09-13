'use strict';

const config = require('./config');
const regex =  {
    email: new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
    username: new RegExp(`^[A-Za-z0-9_@\..]{${config.username.minchar},}$`),
    password: new RegExp('^' + (config.password.consecutive ? '' : '(?!.*(.)\\1{1})')
        + '(?=(.*[\\d]){' + config.password.number + ',})(?=(.*[a-z]){'
        + config.password.lowercase
        + ',})(?=(.*[A-Z]){'
        + config.password.uppercase
        + ',})(?=(.*[@#$%!]){'
        + config.password.special
        + ',})(?:[\\da-zA-Z@#$%!\\^\\&\\*\\(\\)]){'
        + config.password.minchar
        + ','
        + config.password.maxchar
        + '}$'),
    //safeName: new RegExp(/^[A-Za-z0-9_\/\?\-\@\#\$\%\!\^\&\*\.]{1,350}$/g)
    safeName: new RegExp(/^[A-Za-z0-9_@\.]{1,350}$/),
    base64Image: new RegExp('^(data:\\w+\\/[a-zA-Z\\+\\-\\.]+;base64,)(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+\/]{3}=)?$','gi'),
    uuidv4: new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/),
    uuidCheck: (uuid)=>{
      if(typeof uuid != 'string') {
        return false;
      }

      var id = uuid.toLowerCase();
      if(regex.uuidv4.exec(id) == null) {
        return false;
      }

      return ['8', '9', 'a', 'b'].indexOf(id.charAt(19)) !== -1;
    }
};
module.exports = regex
