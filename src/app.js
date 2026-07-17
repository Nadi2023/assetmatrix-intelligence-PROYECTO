import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { manejadorErrores } from './middlewares/error.middleware.js'
import stocksRoutes from './routes/stocks.routes.js'

// Habilitamos las variables de entorno para todo el proyecto
dotenv.config()

const app = express()

// Middlewares base: cors permite peticiones externas y express.json permite leer el body
app.use(cors())
app.use(express.json())

// Endpoint de bienvenida para verificar que la API esta operativa
app.get('/', (req, res) => {
  res.status(200).send({ exito: true, mensaje: 'AssetMatrix Intelligence API operativa' })
})

// Rutas de los modulos
app.use('/stocks', stocksRoutes)

// Manejo de rutas no existentes (404)
app.use((req, res) => {
  res.status(404).send({ exito: false, mensaje: 'Recurso no encontrado' })
})

// Middleware centralizado de errores (siempre va de ultimo)
app.use(manejadorErrores)

export default app