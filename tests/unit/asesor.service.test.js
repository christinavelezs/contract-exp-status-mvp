const { contarPorSemaforo } = require('../../src/services/asesor.service');

describe('contarPorSemaforo', () => {
  test('cuenta los contratos por color, incluyendo colores en 0', () => {
    const contratos = [
      { semaforo: 'ROJO_CRITICO' },
      { semaforo: 'ROJO' },
      { semaforo: 'ROJO' },
      { semaforo: 'VERDE' },
    ];

    expect(contarPorSemaforo(contratos)).toEqual({
      VENCIDO: 0,
      ROJO_CRITICO: 1,
      ROJO: 2,
      NARANJA: 0,
      AMARILLO: 0,
      VERDE: 1,
    });
  });

  test('devuelve todos los colores en 0 cuando no hay contratos', () => {
    expect(contarPorSemaforo([])).toEqual({
      VENCIDO: 0,
      ROJO_CRITICO: 0,
      ROJO: 0,
      NARANJA: 0,
      AMARILLO: 0,
      VERDE: 0,
    });
  });
});
