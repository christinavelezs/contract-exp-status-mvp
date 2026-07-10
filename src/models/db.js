const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DATABASE_PATH = process.env.DATABASE_PATH || './data/dev.sqlite3';

if (DATABASE_PATH !== ':memory:') {
  fs.mkdirSync(path.dirname(DATABASE_PATH), { recursive: true });
}

const db = new Database(DATABASE_PATH);
db.pragma('foreign_keys = ON');

module.exports = db;
