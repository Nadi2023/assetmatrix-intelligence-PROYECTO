/**
 * Middleware centralizado de manejo de errores.
 * Captura cualquier error lanzado en servicios o controladores y
 * responde con el formato unico de la API y el codigo HTTP correcto
 * (400, 404 o 500 segun corresponda).
 */
export const manejadorErrores = (err, req, res, next) => {
  const codigo = err.status || 500
  const mensaje = err.message || 'Error interno del servidor'
  res.status(codigo).send({ exito: false, mensaje })
}