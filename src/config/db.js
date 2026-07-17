import mongoose from 'mongoose'

/**
 * Establece la conexion con MongoDB usando las variables de entorno.
 * La URL se construye dentro de la funcion para garantizar que las
 * variables de entorno ya esten cargadas al momento de conectar.
 * NUNCA se escribe el string de conexion completo (fallo de seguridad).
 */
export const connectDB = async () => {
  const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOSTNAME, MONGO_PORT, MONGO_DB } = process.env
  const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`

  try {
    await mongoose.connect(url)
    console.log('Conexion exitosa a MongoDB')
  } catch (error) {
    console.log('Error al conectar a MongoDB:', error)
  }
}