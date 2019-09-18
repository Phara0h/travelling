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
        var nToken = {id:type+':'+id, secret, expires: new Date(expiration), name}
        await this.redis.set(nToken.id, JSON.stringify(nToken), 'PX', expiration);
        return nToken;
    }

    async get(token, type) {
      var fToken = await this.redis.get(type+':'+token);
      if(fToken) {
        fToken = JSON.parse(fToken);
      }
      return fToken;
    }

    async destroy(token, type) {
        await this.redis.del(type+':'+token);
    }
}

module.exports = RedisTokenStore;
