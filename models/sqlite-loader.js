const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/**
 * This file contains the actual native dependency. 
 * It is only required dynamically in local environments.
 */
function initDatabase(dbPath) {
    const db = new sqlite3.Database(dbPath);
    return db;
}

module.exports = { initDatabase };
