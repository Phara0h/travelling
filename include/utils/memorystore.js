'use strict';

class MemoryStore {
    constructor() {
        this.sessions = {};
    }

    set(sessionId, session, callback) {
        this.sessions[sessionId] = session;
        callback();
    }

    get(sessionId, callback) {
        callback(null, this.sessions[sessionId]);
    }

    destroy(sessionId, callback) {
        delete this.sessions[sessionId];
        callback();
    }
}

module.exports = MemoryStore;
