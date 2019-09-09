'use strict';

/**
@ TODO: Change from memory to reddis
*/
class TokenStore {
    constructor() {
        this.tokens = {};
    }

    async set(user_id, type, token, expiration) {

        setTimeout(()=>{
          this.destroy(token);
        },expiration);

        this.tokens[token] = {user_id,type,expires: new Date(expiration)};

        return this.tokens[user_id];
    }

    async get(token, type) {

      return this.tokens[token];
    }

    async destroy(token, type) {
      try {
        delete this.tokens[token];
        return true;
      } catch(_){}
      return false;
    }
}

module.exports = TokenStore;
