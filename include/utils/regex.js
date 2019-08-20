'use strict';

const config = require('./config');

module.exports =  {
    email: new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
    username: new RegExp(`^[A-Za-z0-9_.]{${config.username.minchar},}$`),
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
    safeName: new RegExp(`^[A-Za-z0-9_\/\?\-\@\#\$\%\!\^\&\*\.]{1,350}$`)
}
