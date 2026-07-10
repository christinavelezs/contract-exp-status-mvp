const db = require('./db');

const SELECT_CONTRATO_CON_ASESOR = `
  SELECT
    c.id AS id,
    c.cliente_nombre AS clienteNombre,
    c.asesor_id AS asesorId,
    a.nombre AS asesorNombre,
    c.fecha_vencimiento AS fechaVencimiento,
    c.condiciones_actuales AS condicionesActuales,
    c.created_at AS createdAt,
    c.updated_at AS updatedAt
  FROM contratos c
  JOIN asesores a ON a.id = c.asesor_id
`;

function create({ clienteNombre, asesorId, fechaVencimiento, condicionesActuales }) {
  const result = db
    .prepare(`
      INSERT INTO contratos (cliente_nombre, asesor_id, fecha_vencimiento, condiciones_actuales)
      VALUES (?, ?, ?, ?)
    `)
    .run(clienteNombre, asesorId, fechaVencimiento, condicionesActuales ?? null);
  return findById(result.lastInsertRowid);
}

function findAll({ asesorId } = {}) {
  let sql = SELECT_CONTRATO_CON_ASESOR;
  const params = [];
  if (asesorId !== undefined) {
    sql += ' WHERE c.asesor_id = ?';
    params.push(asesorId);
  }
  sql += ' ORDER BY c.fecha_vencimiento ASC';
  return db.prepare(sql).all(...params);
}

function findById(id) {
  return db.prepare(`${SELECT_CONTRATO_CON_ASESOR} WHERE c.id = ?`).get(id);
}

const CAMPO_A_COLUMNA = {
  clienteNombre: 'cliente_nombre',
  asesorId: 'asesor_id',
  fechaVencimiento: 'fecha_vencimiento',
  condicionesActuales: 'condiciones_actuales',
};

function update(id, cambios) {
  const asignaciones = [];
  const params = [];

  for (const [campo, valor] of Object.entries(cambios)) {
    const columna = CAMPO_A_COLUMNA[campo];
    if (!columna) continue;
    asignaciones.push(`${columna} = ?`);
    params.push(valor);
  }

  if (asignaciones.length === 0) return findById(id);

  asignaciones.push("updated_at = datetime('now')");
  params.push(id);

  db.prepare(`UPDATE contratos SET ${asignaciones.join(', ')} WHERE id = ?`).run(...params);
  return findById(id);
}

function remove(id) {
  const result = db.prepare('DELETE FROM contratos WHERE id = ?').run(id);
  return result.changes > 0;
}

module.exports = { create, findAll, findById, update, remove };
