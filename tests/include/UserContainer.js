const cookie = require('cookie');
const config = require('../../include/utils/config');

class UserContainer {
  constructor() {
    this.user1 = {};
    this.user2 = {};
    this.user5 = {};
    this.userDomain = {};
    this.userDomain2 = {};
    this.userDomain3 = {};
    this.userDomain4 = {};
    this.userDomain6 = {};
  }

  parseUser1Cookie(carray) {
    this.user1 = this.parseCookie(carray, this.user1);
  }

  parseUser2Cookie(carray) {
    this.user2 = this.parseCookie(carray, this.user2);
  }

  parseUser5Cookie(carray) {
    this.user5 = this.parseCookie(carray, this.user5);
  }

  parseUserDomainCookie(carray) {
    this.userDomain = this.parseCookie(carray, this.userDomain);
  }

  parseUserDomain2Cookie(carray) {
    this.userDomain2 = this.parseCookie(carray, this.userDomain2);
  }

  parseUserDomain3Cookie(carray) {
    this.userDomain3 = this.parseCookie(carray, this.userDomain3);
  }

  parseUserDomain4Cookie(carray) {
    this.userDomain4 = this.parseCookie(carray, this.userDomain4);
  }

  parseUserDomain6Cookie(carray) {
    this.userDomain6 = this.parseCookie(carray, this.userDomain6);
  }

  user1Cookie() {
    return this.getCookie(this.user1);
  }

  user2Cookie() {
    return this.getCookie(this.user2);
  }

  user5Cookie() {
    return this.getCookie(this.user5);
  }

  userDomainCookie() {
    return this.getCookie(this.userDomain);
  }

  userDomain2Cookie() {
    return this.getCookie(this.userDomain2);
  }

  userDomain3Cookie() {
    return this.getCookie(this.userDomain3);
  }

  userDomain4Cookie() {
    return this.getCookie(this.userDomain4);
  }

  userDomain6Cookie() {
    return this.getCookie(this.userDomain6);
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

      if (config.cookie.token.checkable === true) {
        if (pc['trav:ls']) {
          user.ls = pc['trav:ls'];
        }
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

    if (config.cookie.token.checkable === true) {
      if (user.ls) {
        cookies += cookie.serialize('trav:ls', user.ls) + '; ';
      }
    }

    return cookies;
  }
}

var userContainer = new UserContainer();

module.exports = userContainer;
