const ESTADO_VENCIDO = 'VENCIDO';
const COLOR_VERDE = 'VERDE';

const UMBRALES = Object.freeze([
  { color: 'ROJO_CRITICO', limiteDias: 30 },
  { color: 'ROJO', limiteDias: 60 },
  { color: 'NARANJA', limiteDias: 90 },
  { color: 'AMARILLO', limiteDias: 120 },
]);

function calcularDiasRestantes(fechaVencimientoISO, fechaReferencia = new Date()) {
  const [y, m, d] = fechaVencimientoISO.split('-').map(Number);
  const venc = Date.UTC(y, m - 1, d);
  const hoy = Date.UTC(
    fechaReferencia.getUTCFullYear(),
    fechaReferencia.getUTCMonth(),
    fechaReferencia.getUTCDate(),
  );
  return Math.round((venc - hoy) / 86_400_000);
}

function calcularSemaforo(diasRestantes) {
  if (diasRestantes < 0) return ESTADO_VENCIDO;
  const umbral = UMBRALES.find((u) => diasRestantes < u.limiteDias);
  return umbral ? umbral.color : COLOR_VERDE;
}

function obtenerEstadoContrato(fechaVencimientoISO, fechaReferencia = new Date()) {
  const diasRestantes = calcularDiasRestantes(fechaVencimientoISO, fechaReferencia);
  return { diasRestantes, semaforo: calcularSemaforo(diasRestantes) };
}

// Única fuente de verdad de los colores válidos (más urgente a menos urgente).
const COLORES_SEMAFORO = Object.freeze([
  ESTADO_VENCIDO,
  ...UMBRALES.map((u) => u.color),
  COLOR_VERDE,
]);

module.exports = {
  ESTADO_VENCIDO,
  COLOR_VERDE,
  UMBRALES,
  COLORES_SEMAFORO,
  calcularDiasRestantes,
  calcularSemaforo,
  obtenerEstadoContrato,
};
