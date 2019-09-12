'use strict';

class MemoryStore {
    constructor() {
        this.sessions = {};
    }

    async set(sessionId, session, callback) {
        this.sessions[sessionId] = session;
  //console.log('Set: ', this.sessions[sessionId])
        if(callback) {
          callback();
        }

        return this.sessions[sessionId];

    }

    async get(sessionId, callback) {
            //console.trace('Get: ', this.sessions[sessionId])
      if(callback) {
        callback(null, this.sessions[sessionId]);
      }

      return this.sessions[sessionId];
    }

    async destroy(sessionId, callback) {
  //console.trace('Destory: ', this.sessions[sessionId])
        delete this.sessions[sessionId];
        if(callback) {
          callback();
        }

    }
}

module.exports = MemoryStore;
