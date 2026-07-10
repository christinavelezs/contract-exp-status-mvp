const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DATABASE_PATH = process.env.DATABASE_PATH || './data/dev.sqlite3';

if (DATABASE_PATH !== ':memory:') {
  fs.mkdirSync(path.dirname(DATABASE_PATH), { recursive: true });
}

const db = new Database(DATABASE_PATH);
const schemaSql = fs.readFileSync(path.join(__dirname, '001_create_schema.sql'), 'utf8');

db.exec(schemaSql);
db.close();

console.log(`Esquema aplicado en ${DATABASE_PATH}`);
