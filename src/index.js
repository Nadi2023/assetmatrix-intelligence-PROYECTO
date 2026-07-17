import app from './app.js'
import { connectDB } from './config/db.js'

const PORT = process.env.PORT || 3000

// Levantamos el servidor y establecemos la conexion a la base de datos
app.listen(PORT, () => {
  connectDB()
  console.log(`Servidor corriendo en el puerto ${PORT}`)
})