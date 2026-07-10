const {
  enriquecerContrato,
  ordenarPorUrgencia,
  agruparPorAsesor,
} = require('../../src/services/contrato.service');

const REFERENCIA = new Date(Date.UTC(2026, 0, 1));

function contratoCrudo(overrides) {
  return {
    id: 1,
    clienteNombre: 'Cliente Ficticio',
    asesorId: 1,
    asesorNombre: 'Asesor Ficticio',
    fechaVencimiento: '2026-01-26',
    condicionesActuales: 'Tarifa estándar',
    ...overrides,
  };
}

describe('enriquecerContrato', () => {
  test('agrega diasRestantes y semaforo, y anida el asesor', () => {
    const resultado = enriquecerContrato(contratoCrudo({}), REFERENCIA);
    expect(resultado).toEqual({
      id: 1,
      clienteNombre: 'Cliente Ficticio',
      asesor: { id: 1, nombre: 'Asesor Ficticio' },
      fechaVencimiento: '2026-01-26',
      condicionesActuales: 'Tarifa estándar',
      diasRestantes: 25,
      semaforo: 'ROJO_CRITICO',
    });
  });
});

describe('ordenarPorUrgencia', () => {
  test('ordena ascendente por diasRestantes (vencidos primero)', () => {
    const contratos = [
      { id: 1, diasRestantes: 90 },
      { id: 2, diasRestantes: -5 },
      { id: 3, diasRestantes: 10 },
    ];
    expect(ordenarPorUrgencia(contratos).map((c) => c.id)).toEqual([2, 3, 1]);
  });

  test('no muta el array original', () => {
    const contratos = [{ id: 1, diasRestantes: 5 }, { id: 2, diasRestantes: 1 }];
    const original = [...contratos];
    ordenarPorUrgencia(contratos);
    expect(contratos).toEqual(original);
  });
});

describe('agruparPorAsesor', () => {
  test('incluye asesores sin contratos con lista vacía', () => {
    const asesores = [
      { id: 1, nombre: 'Asesora Uno' },
      { id: 2, nombre: 'Asesor Sin Contratos' },
    ];
    const contratos = [
      enriquecerContrato(contratoCrudo({ id: 10, asesorId: 1, asesorNombre: 'Asesora Uno', fechaVencimiento: '2026-01-26' }), REFERENCIA),
    ];

    const resultado = agruparPorAsesor(asesores, contratos);

    expect(resultado).toEqual([
      {
        asesor: { id: 1, nombre: 'Asesora Uno' },
        contratos: [expect.objectContaining({ id: 10 })],
      },
      {
        asesor: { id: 2, nombre: 'Asesor Sin Contratos' },
        contratos: [],
      },
    ]);
  });

  test('ordena los contratos de cada asesor por urgencia', () => {
    const asesores = [{ id: 1, nombre: 'Asesora Uno' }];
    const contratos = [
      { id: 1, asesor: { id: 1 }, diasRestantes: 90 },
      { id: 2, asesor: { id: 1 }, diasRestantes: 10 },
    ];

    const [grupo] = agruparPorAsesor(asesores, contratos);
    expect(grupo.contratos.map((c) => c.id)).toEqual([2, 1]);
  });
});
