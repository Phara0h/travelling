class RedisSessionStore {
  constructor(redis) {
    this.redis = redis;
  }

  async set(sessionId, session, callback) {
    this.redis.set(sessionId, JSON.stringify(session), 'PX', session.expires - Date.now());

    if (callback) {
      callback();
    }

    return session;
  }

  async get(sessionId, callback) {
    var session = await this.redis.get(sessionId);

    if (session) {
      session = JSON.parse(session);
      if (session._data) {
        session.data = session._data;
        delete session._data;
      }
    }

    if (callback) {
      callback(null, session);
    }

    return session;
  }

  async destroy(sessionId, callback) {
    await this.redis.del(sessionId);
    if (callback) {
      callback();
    }
  }
}

module.exports = RedisSessionStore;
