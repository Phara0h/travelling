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
            this.destroy(id, type);
        }, expiration);
        var nToken = {id, secret, expires: new Date(Date.now() + expiration), name};

        this.tokens[type + '_' + nToken.id] = nToken;

        return this.tokens[type + '_' + nToken.id];
    }

    async get(token, type) {

        return this.tokens[type + '_' + token];
    }

    async destroy(token, type) {
        try {
            delete this.tokens[type + '_' + token];
            return true;
        } catch (_) {}
        return false;
    }

    async destroyAllMatching(search) {
        search.replace(/\*/g, '');

        this.tokens.forEach((key)=> {
            if (key.indexOf(search) > -1) {
                delete this.tokens[key];
            }
        });
    }
}

module.exports = TokenStore;
