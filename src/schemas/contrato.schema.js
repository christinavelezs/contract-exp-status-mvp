const { z } = require('zod');
const { COLORES_SEMAFORO } = require('../services/semaforo.service');

const fechaIsoRegex = /^\d{4}-\d{2}-\d{2}$/;

const crearContratoSchema = z.object({
  clienteNombre: z.string().min(1, 'clienteNombre es requerido'),
  asesorId: z.coerce.number().int().positive(),
  fechaVencimiento: z.string().regex(fechaIsoRegex, 'Formato esperado YYYY-MM-DD'),
  condicionesActuales: z.string().optional(),
});

const actualizarContratoSchema = crearContratoSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debe incluir al menos un campo a actualizar',
  });

const listarContratosQuerySchema = z.object({
  color: z.enum(COLORES_SEMAFORO).optional(),
  asesorId: z.coerce.number().int().positive().optional(),
});

module.exports = { crearContratoSchema, actualizarContratoSchema, listarContratosQuerySchema };
