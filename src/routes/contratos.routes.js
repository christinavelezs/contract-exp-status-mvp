const express = require('express');
const controller = require('../controllers/contratos.controller');
const validate = require('../middlewares/validate');
const {
  crearContratoSchema,
  actualizarContratoSchema,
  listarContratosQuerySchema,
} = require('../schemas/contrato.schema');
const { idParamSchema } = require('../schemas/common.schema');

const router = express.Router();

router.get('/por-asesor', controller.listarPorAsesor);
router.get('/', validate(listarContratosQuerySchema, 'query'), controller.listar);
router.get('/:id', validate(idParamSchema, 'params'), controller.obtenerPorId);
router.post('/', validate(crearContratoSchema, 'body'), controller.crear);
router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(actualizarContratoSchema, 'body'),
  controller.actualizar,
);
router.delete('/:id', validate(idParamSchema, 'params'), controller.eliminar);

module.exports = router;
