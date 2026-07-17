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

/**
 * @swagger
 * /crypto/analytics:
 *   get:
 *     summary: Balance total de la cartera historica
 *     tags: [Crypto]
 *     responses:
 *       200:
 *         description: Balance neto y cantidad de transacciones registradas
 *       500:
 *         description: Error al consultar la base de datos
 */
router.get('/analytics', cryptoController.obtenerAnalytics)

/**
 * @swagger
 * /crypto/{coin}:
 *   get:
 *     summary: Market cap y fluctuacion 24h de una criptomoneda
 *     tags: [Crypto]
 *     parameters:
 *       - in: path
 *         name: coin
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la moneda en CoinGecko (ej. bitcoin, ethereum)
 *     responses:
 *       200:
 *         description: Precio en USD, market cap y variacion de 24 horas
 *       404:
 *         description: La moneda no existe en CoinGecko
 *       500:
 *         description: Error al consultar la fuente externa
 */
router.get('/:coin', cryptoController.obtenerCripto)

/**
 * @swagger
 * /crypto/portfolio:
 *   post:
 *     summary: Registra una transaccion de compra o venta
 *     tags: [Crypto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moneda
 *               - tipo
 *               - cantidad
 *               - precioUnitario
 *             properties:
 *               moneda:
 *                 type: string
 *                 example: bitcoin
 *               tipo:
 *                 type: string
 *                 enum: [compra, venta]
 *               cantidad:
 *                 type: number
 *                 example: 0.5
 *               precioUnitario:
 *                 type: number
 *                 example: 64000
 *     responses:
 *       201:
 *         description: Transaccion registrada en el portafolio
 *       400:
 *         description: El body no cumple con el esquema de validacion
 */
router.post('/portfolio', validarBody(esquemaPortfolio), cryptoController.registrarTransaccion)

/**
 * @swagger
 * /crypto/{tx_id}:
 *   delete:
 *     summary: Revierte un registro de transaccion
 *     tags: [Crypto]
 *     parameters:
 *       - in: path
 *         name: tx_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id de MongoDB de la transaccion
 *     responses:
 *       200:
 *         description: Transaccion revertida correctamente
 *       400:
 *         description: El id no tiene un formato valido
 *       404:
 *         description: No existe una transaccion con ese id
 */
router.delete('/:tx_id', cryptoController.revertirTransaccion)

export default router