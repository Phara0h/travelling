const cookie = require('cookie');

class UserContainer {
  constructor() {
    this.user1 = {};
    this.user2 = {};
    this.userDomain = {};
  }

  parseUser1Cookie(carray) {
    this.user1 = this.parseCookie(carray, this.user1);
  }

  parseUser2Cookie(carray) {
    this.user2 = this.parseCookie(carray, this.user2);
  }

  parseUserDomainCookie(carray) {
    this.userDomain = this.parseCookie(carray, this.userDomain);
  }

  user1Cookie() {
    return this.getCookie(this.user1);
  }

  user2Cookie() {
    return this.getCookie(this.user2);
  }

  userDomainCookie() {
    return this.getCookie(this.userDomain);
  }

  parseCookie(carray, user) {
    if (!carray) {
      return user;
    }

    for (var i = 0; i < carray.length; i++) {
      var pc = cookie.parse(carray[i]);

      if (pc['trav:ssid']) {
        user.ssid = pc['trav:ssid'];
      }

      if (pc['trav:tok']) {
        user.tok = pc['trav:tok'];
      }
    }
    return user;
  }

  getCookie(user) {
    var cookies = '';

    if (user.ssid) {
      cookies += cookie.serialize('trav:ssid', user.ssid) + '; ';
    }

    if (user.tok) {
      cookies += cookie.serialize('trav:tok', user.tok) + '; ';
    }
    return cookies;
  }
}

var userContainer = new UserContainer();

module.exports = userContainer;
