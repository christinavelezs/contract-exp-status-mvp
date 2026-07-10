PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS asesores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  email TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contratos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_nombre TEXT NOT NULL,
  asesor_id INTEGER NOT NULL REFERENCES asesores(id) ON DELETE RESTRICT,
  fecha_vencimiento TEXT NOT NULL,
  condiciones_actuales TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_contratos_asesor_id ON contratos(asesor_id);
CREATE INDEX IF NOT EXISTS idx_contratos_fecha_vencimiento ON contratos(fecha_vencimiento);
