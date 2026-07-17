import { jest } from '@jest/globals'
import request from 'supertest'
import app from '../src/app.js'
import { Portfolio } from '../src/models/portfolio.model.js'

// Simulamos fetch para no consumir la API real de CoinGecko
global.fetch = jest.fn()

// Respuesta simulada de CoinGecko para bitcoin
const precioSimulado = {
  bitcoin: {
    usd: 65000,
    usd_market_cap: 1280000000000,
    usd_24h_change: 2.35
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('GET /crypto/:coin', () => {
  test('retorna 200 con precio, market cap y variacion 24h', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => precioSimulado })

    const respuesta = await request(app).get('/crypto/bitcoin')

    expect(respuesta.status).toBe(200)
    expect(respuesta.body.exito).toBe(true)
    expect(respuesta.body.datos.moneda).toBe('bitcoin')
    expect(respuesta.body.datos.marketCap).toBeDefined()
    expect(respuesta.body.datos.variacion24h).toBeDefined()
  })

  test('retorna 404 cuando la moneda no existe', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) })

    const respuesta = await request(app).get('/crypto/monedafalsa')

    expect(respuesta.status).toBe(404)
    expect(respuesta.body.exito).toBe(false)
  })
})

describe('POST /crypto/portfolio', () => {
  test('retorna 201 cuando se registra una transaccion valida', async () => {
    jest.spyOn(Portfolio.prototype, 'save').mockResolvedValue({
      _id: '64b64c9f2f9b2c001c8e4d1b',
      moneda: 'bitcoin',
      tipo: 'compra',
      cantidad: 0.5,
      precioUnitario: 64000
    })

    const respuesta = await request(app)
      .post('/crypto/portfolio')
      .send({ moneda: 'bitcoin', tipo: 'compra', cantidad: 0.5, precioUnitario: 64000 })

    expect(respuesta.status).toBe(201)
    expect(respuesta.body.exito).toBe(true)
  })

  test('retorna 400 cuando falta un campo requerido', async () => {
    const respuesta = await request(app)
      .post('/crypto/portfolio')
      .send({ moneda: 'bitcoin', cantidad: 0.5 })

    expect(respuesta.status).toBe(400)
    expect(respuesta.body.exito).toBe(false)
  })

  test('retorna 400 cuando el tipo no es compra ni venta', async () => {
    const respuesta = await request(app)
      .post('/crypto/portfolio')
      .send({ moneda: 'bitcoin', tipo: 'regalo', cantidad: 0.5, precioUnitario: 64000 })

    expect(respuesta.status).toBe(400)
  })
})

describe('GET /crypto/analytics', () => {
  test('retorna 200 con el balance calculado de las transacciones', async () => {
    jest.spyOn(Portfolio, 'find').mockResolvedValue([
      { moneda: 'bitcoin', tipo: 'compra', cantidad: 1, precioUnitario: 60000 },
      { moneda: 'bitcoin', tipo: 'venta', cantidad: 0.5, precioUnitario: 65000 }
    ])

    const respuesta = await request(app).get('/crypto/analytics')

    expect(respuesta.status).toBe(200)
    expect(respuesta.body.exito).toBe(true)
    // compra 60000 - venta 32500 = 27500 de capital neto invertido
    expect(respuesta.body.datos.balanceTotal).toBe(27500)
    expect(respuesta.body.datos.totalTransacciones).toBe(2)
  })

  test('retorna 200 con balance en cero cuando no hay transacciones', async () => {
    jest.spyOn(Portfolio, 'find').mockResolvedValue([])

    const respuesta = await request(app).get('/crypto/analytics')

    expect(respuesta.status).toBe(200)
    expect(respuesta.body.datos.balanceTotal).toBe(0)
    expect(respuesta.body.datos.totalTransacciones).toBe(0)
  })
})

describe('DELETE /crypto/:tx_id', () => {
  test('retorna 200 cuando la transaccion existe y se revierte', async () => {
    jest.spyOn(Portfolio, 'findByIdAndDelete').mockResolvedValue({
      _id: '64b64c9f2f9b2c001c8e4d1b',
      moneda: 'bitcoin'
    })

    const respuesta = await request(app).delete('/crypto/64b64c9f2f9b2c001c8e4d1b')

    expect(respuesta.status).toBe(200)
    expect(respuesta.body.exito).toBe(true)
  })

  test('retorna 404 cuando la transaccion no existe', async () => {
    jest.spyOn(Portfolio, 'findByIdAndDelete').mockResolvedValue(null)

    const respuesta = await request(app).delete('/crypto/64b64c9f2f9b2c001c8e4d1b')

    expect(respuesta.status).toBe(404)
  })

  test('retorna 400 cuando el id no es valido', async () => {
    const respuesta = await request(app).delete('/crypto/id-invalido')

    expect(respuesta.status).toBe(400)
  })
})