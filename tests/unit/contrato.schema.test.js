const {
  crearContratoSchema,
  actualizarContratoSchema,
} = require('../../src/schemas/contrato.schema');

describe('crearContratoSchema', () => {
  test('rechaza payload sin fechaVencimiento', () => {
    const resultado = crearContratoSchema.safeParse({
      clienteNombre: 'Cliente Ficticio',
      asesorId: 1,
    });
    expect(resultado.success).toBe(false);
  });

  test('rechaza fechaVencimiento con formato no ISO', () => {
    const resultado = crearContratoSchema.safeParse({
      clienteNombre: 'Cliente Ficticio',
      asesorId: 1,
      fechaVencimiento: '01/01/2026',
    });
    expect(resultado.success).toBe(false);
  });

  test('rechaza asesorId inválido', () => {
    const resultado = crearContratoSchema.safeParse({
      clienteNombre: 'Cliente Ficticio',
      asesorId: -1,
      fechaVencimiento: '2026-01-01',
    });
    expect(resultado.success).toBe(false);
  });

  test('acepta payload válido completo', () => {
    const resultado = crearContratoSchema.safeParse({
      clienteNombre: 'Cliente Ficticio',
      asesorId: 1,
      fechaVencimiento: '2026-01-01',
      condicionesActuales: 'Tarifa estándar',
    });
    expect(resultado.success).toBe(true);
  });

  test('acepta payload válido sin condicionesActuales (opcional)', () => {
    const resultado = crearContratoSchema.safeParse({
      clienteNombre: 'Cliente Ficticio',
      asesorId: 1,
      fechaVencimiento: '2026-01-01',
    });
    expect(resultado.success).toBe(true);
  });
});

describe('actualizarContratoSchema', () => {
  test('rechaza objeto vacío', () => {
    const resultado = actualizarContratoSchema.safeParse({});
    expect(resultado.success).toBe(false);
  });

  test('acepta actualización parcial de un solo campo', () => {
    const resultado = actualizarContratoSchema.safeParse({
      condicionesActuales: 'Nuevo descuento 15%',
    });
    expect(resultado.success).toBe(true);
  });
});
