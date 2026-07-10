const request = require('supertest');
const { setupTestDb } = require('../helpers/testDb');
const { fechaEnDias } = require('../fixtures/contratos.fixtures');

let db;
let app;

beforeAll(() => {
  db = setupTestDb();
  app = require('../../src/app');
});

function crearAsesor(nombre) {
  return db.prepare('INSERT INTO asesores (nombre) VALUES (?)').run(nombre).lastInsertRowid;
}

describe('GET /api/asesores/:id', () => {
  test('devuelve el detalle del asesor con el conteo de contratos por color', async () => {
    const asesorId = crearAsesor('Asesora Detalle Test');
    await request(app).post('/api/contratos').send({
      clienteNombre: 'Cliente Rojo Critico',
      asesorId,
      fechaVencimiento: fechaEnDias(25),
    });
    await request(app).post('/api/contratos').send({
      clienteNombre: 'Cliente Rojo',
      asesorId,
      fechaVencimiento: fechaEnDias(45),
    });
    await request(app).post('/api/contratos').send({
      clienteNombre: 'Cliente Verde',
      asesorId,
      fechaVencimiento: fechaEnDias(200),
    });

    const res = await request(app).get(`/api/asesores/${asesorId}`);

    expect(res.status).toBe(200);
    expect(res.body.data.asesor.id).toBe(asesorId);
    expect(res.body.data.totalContratos).toBe(3);
    expect(res.body.data.conteoPorSemaforo).toEqual({
      VENCIDO: 0,
      ROJO_CRITICO: 1,
      ROJO: 1,
      NARANJA: 0,
      AMARILLO: 0,
      VERDE: 1,
    });
  });

  test('asesor sin contratos devuelve conteo en cero', async () => {
    const asesorId = crearAsesor('Asesora Sin Contratos Detalle');

    const res = await request(app).get(`/api/asesores/${asesorId}`);

    expect(res.status).toBe(200);
    expect(res.body.data.totalContratos).toBe(0);
    expect(Object.values(res.body.data.conteoPorSemaforo).every((n) => n === 0)).toBe(true);
  });

  test('asesor inexistente devuelve 404', async () => {
    const res = await request(app).get('/api/asesores/999999');
    expect(res.status).toBe(404);
  });
});
