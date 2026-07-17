import mongoose from 'mongoose'
import { Watchlist } from '../models/watchlist.model.js'

const BASE_URL = 'https://www.alphavantage.co/query'

/** Crea un error con codigo HTTP para que lo capture el middleware de errores */
const crearError = (mensaje, status) => {
  const error = new Error(mensaje)
  error.status = status
  return error
}

/**
 * Consulta el precio y volumen actual de una accion en Alpha Vantage.
 */
export const consultarCotizacion = async (simbolo) => {
  const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${simbolo}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
  const respuesta = await fetch(url)

  if (!respuesta.ok) throw crearError('Error al consultar Alpha Vantage', 500)

  const datos = await respuesta.json()

  // Alpha Vantage responde 200 con una "Note" cuando se supera el limite de peticiones
  if (datos['Note']) throw crearError('Se supero el limite de peticiones de Alpha Vantage', 500)

  const cotizacion = datos['Global Quote']
  if (!cotizacion || Object.keys(cotizacion).length === 0) {
    throw crearError(`No se encontro informacion para el simbolo ${simbolo}`, 404)
  }

  return {
    simbolo: cotizacion['01. symbol'],
    precio: cotizacion['05. price'],
    volumen: cotizacion['06. volume'],
    variacionPorcentual: cotizacion['10. change percent']
  }
}

/**
 * Consulta el historico diario de una accion (ultimos 30 dias).
 */
export const consultarHistorico = async (simbolo) => {
  const url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${simbolo}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
  const respuesta = await fetch(url)

  if (!respuesta.ok) throw crearError('Error al consultar Alpha Vantage', 500)

  const datos = await respuesta.json()

  if (datos['Note']) throw crearError('Se supero el limite de peticiones de Alpha Vantage', 500)

  const serie = datos['Time Series (Daily)']
  if (!serie) throw crearError(`No se encontro historico para el simbolo ${simbolo}`, 404)

  // Transformamos el objeto de la API en un arreglo mas simple de leer
  const historico = Object.entries(serie)
    .slice(0, 30)
    .map(([fecha, valores]) => ({
      fecha,
      cierre: valores['4. close'],
      volumen: valores['5. volume']
    }))

  return { simbolo: simbolo.toUpperCase(), historico }
}

/**
 * Guarda un ticker en la lista de seguimiento (base de datos local).
 */
export const agregarAWatchlist = async ({ simbolo, precioAlerta }) => {
  const registro = new Watchlist({ simbolo, precioAlerta })
  return await registro.save()
}

/**
 * Elimina una alerta de precio por su id de MongoDB.
 */
export const eliminarAlerta = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw crearError('El id proporcionado no es valido', 400)
  }

  const eliminado = await Watchlist.findByIdAndDelete(id)
  if (!eliminado) throw crearError(`No existe una alerta con el id ${id}`, 404)

  return eliminado
}