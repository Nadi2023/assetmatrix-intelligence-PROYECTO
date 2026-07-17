import mongoose from 'mongoose'

/**
 * Esquema del portafolio de criptomonedas.
 * Cada registro es una transaccion de compra o venta,
 * con la cantidad de monedas y el precio unitario al momento.
 */
const portfolioSchema = new mongoose.Schema(
  {
    moneda: { type: String, required: true, lowercase: true, trim: true },
    tipo: { type: String, required: true, enum: ['compra', 'venta'] },
    cantidad: { type: Number, required: true, min: 0 },
    precioUnitario: { type: Number, required: true, min: 0 }
  },
  { timestamps: true, versionKey: false }
)

export const Portfolio = mongoose.model('Portfolio', portfolioSchema)