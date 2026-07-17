import { Router } from 'express'
import Joi from 'joi'
import * as cryptoController from '../controllers/crypto.controller.js'
import { validarBody } from '../middlewares/validation.middleware.js'

const router = Router()

// Esquema de validacion para registrar una transaccion en el portafolio
const esquemaPortfolio = Joi.object({
  moneda: Joi.string().min(1).max(30).required(),
  tipo: Joi.string().valid('compra', 'venta').required(),
  cantidad: Joi.number().positive().required(),
  precioUnitario: Joi.number().positive().required()
})

// IMPORTANTE: /analytics va ANTES de /:coin para que Express no
// interprete la palabra "analytics" como el nombre de una moneda
router.get('/analytics', cryptoController.obtenerAnalytics)
router.get('/:coin', cryptoController.obtenerCripto)
router.post('/portfolio', validarBody(esquemaPortfolio), cryptoController.registrarTransaccion)
router.delete('/:tx_id', cryptoController.revertirTransaccion)

export default router