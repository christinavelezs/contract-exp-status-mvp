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

function contarContratos() {
  return db.prepare('SELECT COUNT(*) AS total FROM contratos').get().total;
}

describe('POST /api/contratos', () => {
  test('crea un contrato válido', async () => {
    const asesorId = crearAsesor('Asesora Test Uno');

    const res = await request(app).post('/api/contratos').send({
      clienteNombre: 'Cliente Test',
      asesorId,
      fechaVencimiento: fechaEnDias(45),
      condicionesActuales: 'Tarifa estándar',
    });

    expect(res.status).toBe(201);
    expect(res.body.data.semaforo).toBe('ROJO');

    const getRes = await request(app).get(`/api/contratos/${res.body.data.id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.data.clienteNombre).toBe('Cliente Test');
  });

  test('rechaza payload sin fechaVencimiento y no inserta fila', async () => {
    const asesorId = crearAsesor('Asesora Test Dos');
    const antes = contarContratos();

    const res = await request(app).post('/api/contratos').send({
      clienteNombre: 'Cliente Sin Fecha',
      asesorId,
    });

    expect(res.status).toBe(400);
    expect(contarContratos()).toBe(antes);
  });

  test('rechaza asesorId inexistente', async () => {
    const res = await request(app).post('/api/contratos').send({
      clienteNombre: 'Cliente Test',
      asesorId: 999999,
      fechaVencimiento: fechaEnDias(45),
    });

    expect(res.status).toBe(404);
  });
});

describe('GET /api/contratos', () => {
  test('devuelve los contratos ordenados por urgencia (vencidos primero)', async () => {
    const asesorId = crearAsesor('Asesora Orden');
    await request(app).post('/api/contratos').send({ clienteNombre: 'A', asesorId, fechaVencimiento: fechaEnDias(200) });
    await request(app).post('/api/contratos').send({ clienteNombre: 'B', asesorId, fechaVencimiento: fechaEnDias(10) });
    await request(app).post('/api/contratos').send({ clienteNombre: 'C', asesorId, fechaVencimiento: fechaEnDias(-5) });

    const res = await request(app).get('/api/contratos').query({ asesorId });

    expect(res.body.data.map((c) => c.clienteNombre)).toEqual(['C', 'B', 'A']);
  });

  test('filtra por color de semáforo', async () => {
    const asesorId = crearAsesor('Asesora Filtro');
    await request(app).post('/api/contratos').send({ clienteNombre: 'Rojo Uno', asesorId, fechaVencimiento: fechaEnDias(45) });
    await request(app).post('/api/contratos').send({ clienteNombre: 'Verde Uno', asesorId, fechaVencimiento: fechaEnDias(200) });

    const res = await request(app).get('/api/contratos').query({ color: 'ROJO', asesorId });

    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data.every((c) => c.semaforo === 'ROJO')).toBe(true);
  });
});

describe('GET /api/contratos/:id', () => {
  test('contrato inexistente devuelve 404', async () => {
    const res = await request(app).get('/api/contratos/999999');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/contratos/por-asesor', () => {
  test('incluye asesor sin contratos con lista vacía', async () => {
    const asesorSinContratosId = crearAsesor('Asesor Vacio Test');

    const res = await request(app).get('/api/contratos/por-asesor');

    expect(res.status).toBe(200);
    const grupo = res.body.data.find((g) => g.asesor.id === asesorSinContratosId);
    expect(grupo).toBeDefined();
    expect(grupo.contratos).toEqual([]);
  });
});

describe('PUT /api/contratos/:id', () => {
  test('actualiza un contrato existente', async () => {
    const asesorId = crearAsesor('Asesora Put');
    const creado = await request(app).post('/api/contratos').send({
      clienteNombre: 'Cliente Put',
      asesorId,
      fechaVencimiento: fechaEnDias(45),
    });

    const res = await request(app)
      .put(`/api/contratos/${creado.body.data.id}`)
      .send({ condicionesActuales: 'Nuevas condiciones' });

    expect(res.status).toBe(200);
    expect(res.body.data.condicionesActuales).toBe('Nuevas condiciones');
  });

  test('payload inválido (vacío) no muta la fila y responde 400', async () => {
    const asesorId = crearAsesor('Asesora Put Invalido');
    const creado = await request(app).post('/api/contratos').send({
      clienteNombre: 'Cliente Put Invalido',
      asesorId,
      fechaVencimiento: fechaEnDias(45),
    });

    const res = await request(app).put(`/api/contratos/${creado.body.data.id}`).send({});
    expect(res.status).toBe(400);

    const getRes = await request(app).get(`/api/contratos/${creado.body.data.id}`);
    expect(getRes.body.data.clienteNombre).toBe('Cliente Put Invalido');
  });

  test('id inexistente devuelve 404', async () => {
    const res = await request(app).put('/api/contratos/999999').send({ condicionesActuales: 'x' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/contratos/:id', () => {
  test('elimina un contrato existente', async () => {
    const asesorId = crearAsesor('Asesora Delete');
    const creado = await request(app).post('/api/contratos').send({
      clienteNombre: 'Cliente Delete',
      asesorId,
      fechaVencimiento: fechaEnDias(45),
    });

    const res = await request(app).delete(`/api/contratos/${creado.body.data.id}`);
    expect(res.status).toBe(204);

    const getRes = await request(app).get(`/api/contratos/${creado.body.data.id}`);
    expect(getRes.status).toBe(404);
  });

  test('id inexistente devuelve 404', async () => {
    const res = await request(app).delete('/api/contratos/999999');
    expect(res.status).toBe(404);
  });
});
