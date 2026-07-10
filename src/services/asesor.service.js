const asesorModel = require('../models/asesor.model');
const contratoModel = require('../models/contrato.model');
const { enriquecerContrato } = require('./contrato.service');
const { COLORES_SEMAFORO } = require('./semaforo.service');
const AppError = require('../errors/AppError');

function contarPorSemaforo(contratosEnriquecidos) {
  const conteo = COLORES_SEMAFORO.reduce((acc, color) => {
    acc[color] = 0;
    return acc;
  }, {});

  for (const contrato of contratosEnriquecidos) {
    conteo[contrato.semaforo] += 1;
  }

  return conteo;
}

function obtenerDetalleAsesor(id) {
  const asesor = asesorModel.findById(id);
  if (!asesor) throw new AppError('Asesor no encontrado', 404);

  const contratos = contratoModel.findAll({ asesorId: id }).map((c) => enriquecerContrato(c));

  return {
    asesor: { id: asesor.id, nombre: asesor.nombre, email: asesor.email },
    totalContratos: contratos.length,
    conteoPorSemaforo: contarPorSemaforo(contratos),
  };
}

module.exports = { contarPorSemaforo, obtenerDetalleAsesor };
