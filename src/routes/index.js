const express = require('express');
const contratosRoutes = require('./contratos.routes');
const asesoresRoutes = require('./asesores.routes');

const router = express.Router();

router.use('/contratos', contratosRoutes);
router.use('/asesores', asesoresRoutes);

module.exports = router;
