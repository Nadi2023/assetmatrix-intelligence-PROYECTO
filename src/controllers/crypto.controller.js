import * as cryptoService from '../services/crypto.service.js'

/** GET /crypto/:coin - Market cap y fluctuacion 24h de una cripto */
export const obtenerCripto = async (req, res, next) => {
  try {
    const { coin } = req.params
    const datos = await cryptoService.consultarCripto(coin)
    res.status(200).send({ exito: true, datos })
  } catch (error) {
    next(error)
  }
}

/** POST /crypto/portfolio - Registra transaccion de compra o venta */
export const registrarTransaccion = async (req, res, next) => {
  try {
    const datos = await cryptoService.registrarTransaccion(req.body)
    res.status(201).send({ exito: true, datos })
  } catch (error) {
    next(error)
  }
}

/** GET /crypto/analytics - Balance total de la cartera historica */
export const obtenerAnalytics = async (req, res, next) => {
  try {
    const datos = await cryptoService.calcularAnalytics()
    res.status(200).send({ exito: true, datos })
  } catch (error) {
    next(error)
  }
}

/** DELETE /crypto/:tx_id - Revierte un registro de transaccion */
export const revertirTransaccion = async (req, res, next) => {
  try {
    const { tx_id } = req.params
    const datos = await cryptoService.revertirTransaccion(tx_id)
    res.status(200).send({ exito: true, datos })
  } catch (error) {
    next(error)
  }
}