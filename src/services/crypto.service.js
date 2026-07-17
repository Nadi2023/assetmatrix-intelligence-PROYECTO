import mongoose from 'mongoose'
import { Portfolio } from '../models/portfolio.model.js'

const BASE_URL = 'https://api.coingecko.com/api/v3'

/** Crea un error con codigo HTTP para el middleware de errores */
const crearError = (mensaje, status) => {
  const error = new Error(mensaje)
  error.status = status
  return error
}

/**
 * Consulta precio, market cap y fluctuacion 24h de una cripto en CoinGecko.
 */
export const consultarCripto = async (moneda) => {
  const nombre = moneda.toLowerCase()
  const url = `${BASE_URL}/simple/price?ids=${nombre}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`
  const respuesta = await fetch(url)

  if (!respuesta.ok) throw crearError('Error al consultar CoinGecko', 500)

  const datos = await respuesta.json()
  const info = datos[nombre]

  if (!info) throw crearError(`No se encontro informacion para la moneda ${moneda}`, 404)

  return {
    moneda: nombre,
    precioUsd: info.usd,
    marketCap: info.usd_market_cap,
    variacion24h: info.usd_24h_change
  }
}

/**
 * Registra una transaccion de compra o venta en el portafolio (DB local).
 */
export const registrarTransaccion = async ({ moneda, tipo, cantidad, precioUnitario }) => {
  const transaccion = new Portfolio({ moneda, tipo, cantidad, precioUnitario })
  return await transaccion.save()
}

/**
 * Calcula el balance total historico de la cartera.
 * Logica financiera: las compras suman capital invertido y las
 * ventas lo restan (cantidad * precio unitario de cada transaccion).
 * Esta logica vive en el servicio, independiente del protocolo HTTP
 * (Service Layer Architecture).
 */
export const calcularAnalytics = async () => {
  const transacciones = await Portfolio.find()

  let balanceTotal = 0
  for (const tx of transacciones) {
    const monto = tx.cantidad * tx.precioUnitario
    balanceTotal += tx.tipo === 'compra' ? monto : -monto
  }

  return {
    totalTransacciones: transacciones.length,
    balanceTotal
  }
}

/**
 * Revierte (elimina) una transaccion del portafolio por su id.
 */
export const revertirTransaccion = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw crearError('El id proporcionado no es valido', 400)
  }

  const eliminada = await Portfolio.findByIdAndDelete(id)
  if (!eliminada) throw crearError(`No existe una transaccion con el id ${id}`, 404)

  return eliminada
}