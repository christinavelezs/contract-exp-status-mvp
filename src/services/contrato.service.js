const contratoModel = require('../models/contrato.model');
const asesorModel = require('../models/asesor.model');
const semaforoService = require('./semaforo.service');
const AppError = require('../errors/AppError');

function enriquecerContrato(contratoRaw, fechaReferencia = new Date()) {
  const { diasRestantes, semaforo } = semaforoService.obtenerEstadoContrato(
    contratoRaw.fechaVencimiento,
    fechaReferencia,
  );
  return {
    id: contratoRaw.id,
    clienteNombre: contratoRaw.clienteNombre,
    asesor: { id: contratoRaw.asesorId, nombre: contratoRaw.asesorNombre },
    fechaVencimiento: contratoRaw.fechaVencimiento,
    condicionesActuales: contratoRaw.condicionesActuales,
    diasRestantes,
    semaforo,
  };
}

function ordenarPorUrgencia(contratos) {
  return [...contratos].sort((a, b) => a.diasRestantes - b.diasRestantes);
}

function agruparPorAsesor(asesores, contratosEnriquecidos) {
  return asesores.map((asesor) => ({
    asesor: { id: asesor.id, nombre: asesor.nombre },
    contratos: ordenarPorUrgencia(
      contratosEnriquecidos.filter((c) => c.asesor.id === asesor.id),
    ),
  }));
}

function listarContratos({ color, asesorId } = {}) {
  const crudos = contratoModel.findAll({ asesorId });
  let enriquecidos = crudos.map((c) => enriquecerContrato(c));
  if (color) {
    enriquecidos = enriquecidos.filter((c) => c.semaforo === color);
  }
  return ordenarPorUrgencia(enriquecidos);
}

function listarContratosPorAsesor() {
  const asesores = asesorModel.findAll();
  const contratos = listarContratos();
  return agruparPorAsesor(asesores, contratos);
}

function obtenerContratoPorId(id) {
  const contrato = contratoModel.findById(id);
  if (!contrato) throw new AppError('Contrato no encontrado', 404);
  return enriquecerContrato(contrato);
}

function crearContrato(datos) {
  const asesor = asesorModel.findById(datos.asesorId);
  if (!asesor) throw new AppError('Asesor no encontrado', 404);
  const creado = contratoModel.create(datos);
  return enriquecerContrato(creado);
}

function actualizarContrato(id, cambios) {
  const existente = contratoModel.findById(id);
  if (!existente) throw new AppError('Contrato no encontrado', 404);

  if (cambios.asesorId !== undefined) {
    const asesor = asesorModel.findById(cambios.asesorId);
    if (!asesor) throw new AppError('Asesor no encontrado', 404);
  }

  const actualizado = contratoModel.update(id, cambios);
  return enriquecerContrato(actualizado);
}

function eliminarContrato(id) {
  const existente = contratoModel.findById(id);
  if (!existente) throw new AppError('Contrato no encontrado', 404);
  contratoModel.remove(id);
}

module.exports = {
  enriquecerContrato,
  ordenarPorUrgencia,
  agruparPorAsesor,
  listarContratos,
  listarContratosPorAsesor,
  obtenerContratoPorId,
  crearContrato,
  actualizarContrato,
  eliminarContrato,
};
