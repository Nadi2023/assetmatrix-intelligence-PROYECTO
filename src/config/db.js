import mongoose from 'mongoose'

const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOSTNAME, MONGO_PORT, MONGO_DB } = process.env

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`

export const connectDB = async () => {
  try {
    await mongoose.connect(url)
    console.log('Conexión exitosa a MongoDB')
  } catch (error) {
    console.log('Error al conectar a MongoDB:', error)
  }
}