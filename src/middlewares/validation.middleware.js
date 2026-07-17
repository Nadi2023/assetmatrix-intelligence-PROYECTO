/**
 * Middleware generico de validacion de body usando Joi.
 * Recibe un esquema y retorna un middleware que valida req.body.
 * Si la validacion falla, corta la peticion con un 400.
 */
export const validarBody = (esquema) => (req, res, next) => {
  const { error } = esquema.validate(req.body)
  if (error) {
    return res.status(400).send({ exito: false, mensaje: error.details[0].message })
  }
  next()
}