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

/**
 * @swagger
 * /stocks/history:
 *   get:
 *     summary: Analisis de tendencias historicas de una accion
 *     tags: [Stocks]
 *     parameters:
 *       - in: query
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: Simbolo de la accion (ej. AAPL)
 *     responses:
 *       200:
 *         description: Historico de cierres y volumenes de los ultimos 30 dias
 *       400:
 *         description: No se envio el parametro symbol
 *       404:
 *         description: No existe historico para el simbolo indicado
 *       500:
 *         description: Error al consultar la fuente externa
 */
router.get('/history', stocksController.obtenerHistorico)

/**
 * @swagger
 * /stocks/{symbol}:
 *   get:
 *     summary: Consulta el precio y volumen real de una accion
 *     tags: [Stocks]
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: Simbolo de la accion (ej. AAPL, MSFT)
 *     responses:
 *       200:
 *         description: Cotizacion actual con precio, volumen y variacion
 *       404:
 *         description: El simbolo no existe en Alpha Vantage
 *       500:
 *         description: Error al consultar la fuente externa
 */
router.get('/:symbol', stocksController.obtenerCotizacion)

/**
 * @swagger
 * /stocks/watch:
 *   post:
 *     summary: Guarda un ticker en la lista de seguimiento
 *     tags: [Stocks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - simbolo
 *             properties:
 *               simbolo:
 *                 type: string
 *                 example: AAPL
 *               precioAlerta:
 *                 type: number
 *                 example: 250
 *     responses:
 *       201:
 *         description: Ticker guardado en la watchlist
 *       400:
 *         description: El body no cumple con el esquema de validacion
 */
router.post('/watch', validarBody(esquemaWatchlist), stocksController.guardarEnWatchlist)

/**
 * @swagger
 * /stocks/{id}:
 *   delete:
 *     summary: Elimina una alerta de precio por su id
 *     tags: [Stocks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id de MongoDB de la alerta
 *     responses:
 *       200:
 *         description: Alerta eliminada correctamente
 *       400:
 *         description: El id no tiene un formato valido
 *       404:
 *         description: No existe una alerta con ese id
 */
router.delete('/:id', stocksController.eliminarAlerta)

export default router