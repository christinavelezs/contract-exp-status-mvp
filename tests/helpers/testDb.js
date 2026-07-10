const fs = require('fs');
const path = require('path');

function setupTestDb() {
  process.env.DATABASE_PATH = ':memory:';
  const db = require('../../src/models/db');
  const schemaSql = fs.readFileSync(
    path.join(__dirname, '../../migrations/001_create_schema.sql'),
    'utf8',
  );
  db.exec(schemaSql);
  return db;
}

module.exports = { setupTestDb };
