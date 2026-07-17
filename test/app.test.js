import request from 'supertest'
import app from '../src/app.js'

describe('Servidor base', () => {
  test('GET / retorna 200 y el mensaje de bienvenida', async () => {
    const respuesta = await request(app).get('/')
    expect(respuesta.status).toBe(200)
    expect(respuesta.body.exito).toBe(true)
    expect(respuesta.body.mensaje).toBe('AssetMatrix Intelligence API operativa')
  })

  test('GET a una ruta inexistente retorna 404', async () => {
    const respuesta = await request(app).get('/ruta-que-no-existe')
    expect(respuesta.status).toBe(404)
    expect(respuesta.body.exito).toBe(false)
  })
})