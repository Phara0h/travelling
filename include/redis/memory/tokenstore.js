'use strict';

/**
@ TODO: Change from memory to reddis
*/
class TokenStore {
    constructor() {
        this.tokens = {};
    }

    async set(secret, type, id, expiration, name = '') {

        setTimeout(()=>{
          this.destroy(id);
        },expiration);

        this.tokens[type+':'+id] = {id:type+':'+id, expires: new Date(expiration), name};

        return this.tokens[type+':'+id];
    }

    async get(token, type) {

      return this.tokens[type+':'+token];
    }

    async destroy(token, type) {
      try {
        delete this.tokens[type+':'+token];
        return true;
      } catch(_){}
      return false;
    }
}

module.exports = TokenStore;
