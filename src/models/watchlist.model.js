import mongoose from 'mongoose'

/**
 * Esquema de la lista de seguimiento de acciones (watchlist).
 * Cada registro representa un ticker que el usuario monitorea,
 * con un precio de alerta opcional.
 */
const watchlistSchema = new mongoose.Schema(
  {
    simbolo: { type: String, required: true, uppercase: true, trim: true },
    precioAlerta: { type: Number }
  },
  { timestamps: true, versionKey: false }
)

export const Watchlist = mongoose.model('Watchlist', watchlistSchema)