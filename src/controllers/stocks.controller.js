import * as stocksService from '../services/stocks.service.js'

/** GET /stocks/:symbol - Consulta precio y volumen real de una accion */
export const obtenerCotizacion = async (req, res, next) => {
  try {
    const { symbol } = req.params
    const datos = await stocksService.consultarCotizacion(symbol)
    res.status(200).send({ exito: true, datos })
  } catch (error) {
    next(error)
  }
}

/** GET /stocks/history?symbol=XXX - Analisis de tendencias historicas */
export const obtenerHistorico = async (req, res, next) => {
  try {
    const { symbol } = req.query
    if (!symbol) {
      return res.status(400).send({ exito: false, mensaje: 'Debe indicar el parametro symbol' })
    }
    const datos = await stocksService.consultarHistorico(symbol)
    res.status(200).send({ exito: true, datos })
  } catch (error) {
    next(error)
  }
}

/** POST /stocks/watch - Guarda un ticker en la lista de seguimiento */
export const guardarEnWatchlist = async (req, res, next) => {
  try {
    const datos = await stocksService.agregarAWatchlist(req.body)
    res.status(201).send({ exito: true, datos })
  } catch (error) {
    next(error)
  }
}

/** DELETE /stocks/:id - Elimina una alerta de precio por su id */
export const eliminarAlerta = async (req, res, next) => {
  try {
    const { id } = req.params
    const datos = await stocksService.eliminarAlerta(id)
    res.status(200).send({ exito: true, datos })
  } catch (error) {
    next(error)
  }
}