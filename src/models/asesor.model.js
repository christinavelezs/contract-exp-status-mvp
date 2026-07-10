const db = require('./db');

function findAll() {
  return db.prepare('SELECT id, nombre, email FROM asesores ORDER BY nombre').all();
}

function findById(id) {
  return db.prepare('SELECT id, nombre, email FROM asesores WHERE id = ?').get(id);
}

module.exports = { findAll, findById };
