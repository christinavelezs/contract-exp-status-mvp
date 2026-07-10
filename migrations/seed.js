const Database = require('better-sqlite3');

const DATABASE_PATH = process.env.DATABASE_PATH || './data/dev.sqlite3';

function fechaIsoEnDias(dias, referencia = new Date()) {
  const fecha = new Date(Date.UTC(
    referencia.getUTCFullYear(),
    referencia.getUTCMonth(),
    referencia.getUTCDate() + dias,
  ));
  return fecha.toISOString().slice(0, 10);
}

const db = new Database(DATABASE_PATH);

const insertAsesor = db.prepare('INSERT INTO asesores (nombre, email) VALUES (?, ?)');
const insertContrato = db.prepare(`
  INSERT INTO contratos (cliente_nombre, asesor_id, fecha_vencimiento, condiciones_actuales)
  VALUES (?, ?, ?, ?)
`);

const seedTransaction = db.transaction(() => {
  const asesor1 = insertAsesor.run('Asesora Demo Uno', 'asesora.uno@ficticio.test').lastInsertRowid;
  const asesor2 = insertAsesor.run('Asesor Demo Dos', 'asesor.dos@ficticio.test').lastInsertRowid;
  insertAsesor.run('Asesor Sin Contratos', 'asesor.sincontratos@ficticio.test');

  const contratosFicticios = [
    { cliente: 'Viñedos Ficticios SAC', asesor: asesor1, dias: 25, condiciones: 'Descuento 10%' },
    { cliente: 'Bodega Imaginaria EIRL', asesor: asesor1, dias: 45, condiciones: 'Tarifa estándar' },
    { cliente: 'Distribuidora Ejemplo SAC', asesor: asesor2, dias: 75, condiciones: 'Descuento 5%' },
    { cliente: 'Importadora Ficticia SA', asesor: asesor2, dias: 95, condiciones: 'Tarifa estándar' },
    { cliente: 'Comercial Prueba SAC', asesor: asesor2, dias: 200, condiciones: 'Tarifa preferencial' },
    { cliente: 'Retail Ficticio SAC', asesor: asesor1, dias: -10, condiciones: 'Pendiente renegociación' },
  ];

  for (const c of contratosFicticios) {
    insertContrato.run(c.cliente, c.asesor, fechaIsoEnDias(c.dias), c.condiciones);
  }
});

seedTransaction();
db.close();

console.log(`Datos ficticios sembrados en ${DATABASE_PATH}`);
