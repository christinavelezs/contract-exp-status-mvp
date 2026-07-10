const {
  calcularSemaforo,
  calcularDiasRestantes,
  obtenerEstadoContrato,
} = require('../../src/services/semaforo.service');

describe('calcularSemaforo', () => {
  test.each([
    [25, 'ROJO_CRITICO'],
    [45, 'ROJO'],
    [75, 'NARANJA'],
    [95, 'AMARILLO'],
    [200, 'VERDE'],
    [-1, 'VENCIDO'],
    [-10, 'VENCIDO'],
  ])('%i días restantes -> %s', (dias, esperado) => {
    expect(calcularSemaforo(dias)).toBe(esperado);
  });

  test.each([
    [120, 'VERDE'],
    [90, 'AMARILLO'],
    [60, 'NARANJA'],
    [30, 'ROJO'],
    [0, 'ROJO_CRITICO'],
  ])('límite exacto: %i días -> %s', (dias, esperado) => {
    expect(calcularSemaforo(dias)).toBe(esperado);
  });
});

describe('calcularDiasRestantes', () => {
  test('calcula la diferencia en días respecto a una fecha de referencia fija', () => {
    const referencia = new Date(Date.UTC(2026, 0, 1));
    expect(calcularDiasRestantes('2026-01-26', referencia)).toBe(25);
  });

  test('funciona correctamente cruzando fin de mes/año', () => {
    const referencia = new Date(Date.UTC(2025, 11, 20));
    expect(calcularDiasRestantes('2026-01-05', referencia)).toBe(16);
  });

  test('devuelve negativo para fechas ya vencidas', () => {
    const referencia = new Date(Date.UTC(2026, 5, 15));
    expect(calcularDiasRestantes('2026-06-05', referencia)).toBe(-10);
  });
});

describe('obtenerEstadoContrato', () => {
  test('combina días restantes y semáforo', () => {
    const referencia = new Date(Date.UTC(2026, 0, 1));
    expect(obtenerEstadoContrato('2026-01-26', referencia)).toEqual({
      diasRestantes: 25,
      semaforo: 'ROJO_CRITICO',
    });
  });
});
