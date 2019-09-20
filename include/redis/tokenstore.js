'use strict';

/**
@ TODO: Change from memory to reddis
*/
class RedisTokenStore {
    constructor(redis) {
        this.tokens = {};
        this.redis = redis;
    }

    async set(secret, type, id, expiration, name = '') {
        var nToken = {id, secret, expires: new Date(Date.now() + expiration), name}
        await this.redis.set(type+'_'+nToken.id, JSON.stringify(nToken), 'PX', expiration);
        return nToken;
    }

    async get(token, type) {
      var fToken = await this.redis.get(type+'_'+token);
      if(fToken) {
        fToken = JSON.parse(fToken);
      }
      return fToken;
    }

    async destroy(token, type) {
        await this.redis.del(type+'_'+token);
    }
}

module.exports = RedisTokenStore;
