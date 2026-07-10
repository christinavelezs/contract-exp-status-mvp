const contratoService = require('../services/contrato.service');

function listar(req, res) {
  const { color, asesorId } = req.query;
  const contratos = contratoService.listarContratos({ color, asesorId });
  res.json({ data: contratos });
}

function listarPorAsesor(req, res) {
  const grupos = contratoService.listarContratosPorAsesor();
  res.json({ data: grupos });
}

function obtenerPorId(req, res) {
  const contrato = contratoService.obtenerContratoPorId(req.params.id);
  res.json({ data: contrato });
}

function crear(req, res) {
  const contrato = contratoService.crearContrato(req.body);
  res.status(201).json({ data: contrato });
}

function actualizar(req, res) {
  const contrato = contratoService.actualizarContrato(req.params.id, req.body);
  res.json({ data: contrato });
}

function eliminar(req, res) {
  contratoService.eliminarContrato(req.params.id);
  res.status(204).send();
}

module.exports = { listar, listarPorAsesor, obtenerPorId, crear, actualizar, eliminar };
