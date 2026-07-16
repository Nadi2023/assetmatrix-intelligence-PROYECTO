import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.status(200).send({ mensaje: 'AssetMatrix Intelligence API operativa' })
})

app.listen(PORT, () => {
  connectDB()
  console.log(`Servidor corriendo en el puerto ${PORT}`)
})