import { jest } from '@jest/globals'
import request from 'supertest'
import app from '../src/app.js'
import { Watchlist } from '../src/models/watchlist.model.js'

// Simulamos la funcion global fetch para no consumir la API real de Alpha Vantage
global.fetch = jest.fn()

// Respuesta simulada de Alpha Vantage para una cotizacion exitosa
const cotizacionSimulada = {
  'Global Quote': {
    '01. symbol': 'AAPL',
    '05. price': '210.5000',
    '06. volume': '52164400',
    '10. change percent': '1.25%'
  }
}

// Respuesta simulada del historico diario
const historicoSimulado = {
  'Time Series (Daily)': {
    '2026-07-15': { '4. close': '210.50', '5. volume': '52164400' },
    '2026-07-14': { '4. close': '208.30', '5. volume': '48120000' }
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('GET /stocks/:symbol', () => {
  test('retorna 200 con precio y volumen cuando el simbolo existe', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => cotizacionSimulada })

    const respuesta = await request(app).get('/stocks/AAPL')

    expect(respuesta.status).toBe(200)
    expect(respuesta.body.exito).toBe(true)
    expect(respuesta.body.datos.simbolo).toBe('AAPL')
    expect(respuesta.body.datos.precio).toBeDefined()
    expect(respuesta.body.datos.volumen).toBeDefined()
  })

  test('retorna 404 cuando el simbolo no existe', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ 'Global Quote': {} }) })

    const respuesta = await request(app).get('/stocks/NOEXISTE')

    expect(respuesta.status).toBe(404)
    expect(respuesta.body.exito).toBe(false)
  })
})

describe('GET /stocks/history', () => {
  test('retorna 200 con el historico cuando se indica el simbolo', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => historicoSimulado })

    const respuesta = await request(app).get('/stocks/history?symbol=AAPL')

    expect(respuesta.status).toBe(200)
    expect(respuesta.body.exito).toBe(true)
    expect(Array.isArray(respuesta.body.datos.historico)).toBe(true)
  })

  test('retorna 400 cuando no se envia el parametro symbol', async () => {
    const respuesta = await request(app).get('/stocks/history')

    expect(respuesta.status).toBe(400)
    expect(respuesta.body.exito).toBe(false)
  })
})

describe('POST /stocks/watch', () => {
  test('retorna 201 cuando se guarda un ticker valido', async () => {
    jest.spyOn(Watchlist.prototype, 'save').mockResolvedValue({
      _id: '64b64c9f2f9b2c001c8e4d1a',
      simbolo: 'AAPL',
      precioAlerta: 250
    })

    const respuesta = await request(app)
      .post('/stocks/watch')
      .send({ simbolo: 'AAPL', precioAlerta: 250 })

    expect(respuesta.status).toBe(201)
    expect(respuesta.body.exito).toBe(true)
  })

  test('retorna 400 cuando el body no tiene simbolo', async () => {
    const respuesta = await request(app)
      .post('/stocks/watch')
      .send({ precioAlerta: 250 })

    expect(respuesta.status).toBe(400)
    expect(respuesta.body.exito).toBe(false)
  })
})

describe('DELETE /stocks/:id', () => {
  test('retorna 200 cuando la alerta existe y se elimina', async () => {
    jest.spyOn(Watchlist, 'findByIdAndDelete').mockResolvedValue({
      _id: '64b64c9f2f9b2c001c8e4d1a',
      simbolo: 'AAPL'
    })

    const respuesta = await request(app).delete('/stocks/64b64c9f2f9b2c001c8e4d1a')

    expect(respuesta.status).toBe(200)
    expect(respuesta.body.exito).toBe(true)
  })

  test('retorna 404 cuando la alerta no existe', async () => {
    jest.spyOn(Watchlist, 'findByIdAndDelete').mockResolvedValue(null)

    const respuesta = await request(app).delete('/stocks/64b64c9f2f9b2c001c8e4d1a')

    expect(respuesta.status).toBe(404)
  })

  test('retorna 400 cuando el id no tiene formato valido de MongoDB', async () => {
    const respuesta = await request(app).delete('/stocks/id-invalido')

    expect(respuesta.status).toBe(400)
  })
})