const asesorModel = require('../models/asesor.model');
const asesorService = require('../services/asesor.service');

function listar(req, res) {
  res.json({ data: asesorModel.findAll() });
}

function obtenerDetalle(req, res) {
  const detalle = asesorService.obtenerDetalleAsesor(req.params.id);
  res.json({ data: detalle });
}

module.exports = { listar, obtenerDetalle };
