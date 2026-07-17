import { Router } from 'express'
import Joi from 'joi'
import * as stocksController from '../controllers/stocks.controller.js'
import { validarBody } from '../middlewares/validation.middleware.js'

const router = Router()

// Esquema de validacion para agregar un ticker a la watchlist
const esquemaWatchlist = Joi.object({
  simbolo: Joi.string().min(1).max(10).required(),
  precioAlerta: Joi.number().positive()
})

// IMPORTANTE: /history se declara ANTES de /:symbol para que Express
// no interprete la palabra "history" como si fuera un simbolo de accion
router.get('/history', stocksController.obtenerHistorico)
router.get('/:symbol', stocksController.obtenerCotizacion)
router.post('/watch', validarBody(esquemaWatchlist), stocksController.guardarEnWatchlist)
router.delete('/:id', stocksController.eliminarAlerta)

export default router