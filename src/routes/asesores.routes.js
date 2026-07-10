const express = require('express');
const controller = require('../controllers/asesores.controller');
const validate = require('../middlewares/validate');
const { idParamSchema } = require('../schemas/common.schema');

const router = express.Router();

router.get('/', controller.listar);
router.get('/:id', validate(idParamSchema, 'params'), controller.obtenerDetalle);

module.exports = router;
