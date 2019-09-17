'use strict';

/**
@ TODO: Change from memory to reddis
*/
class RedisTokenStore {
    constructor(redis) {
        this.tokens = {};
        this.redis = redis;
    }

    async set(user_id, type, token, expiration, name = '') {
        var nToken = {user_id,type,expires: new Date(expiration), name};
        await this.redis.set(token, JSON.stringify(nToken), 'PX', expiration);
        return token;
    }

    async get(token, type) {
      var fToken = await this.redis.get(token);
      if(fToken) {
        fToken = JSON.parse(fToken);
      }
      return fToken;
    }

    async destroy(token, type) {
        await this.redis.del(token);
    }
}

module.exports = RedisTokenStore;
