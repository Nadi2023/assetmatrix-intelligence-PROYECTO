import swaggerJsdoc from 'swagger-jsdoc'

/**
 * Configuracion de Swagger (OpenAPI 3.0) para AssetMatrix.
 * swagger-jsdoc lee las anotaciones JSDoc de los archivos de rutas
 * y genera automaticamente el objeto JSON de la especificacion.
 * De esta forma la documentacion vive en el codigo (Single Source of Truth).
 */
const opciones = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AssetMatrix Intelligence API',
      version: '1.0.0',
      description:
        'API REST para el monitoreo global de activos bursatiles y criptograficos. ' +
        'Integra Alpha Vantage para mercados tradicionales y CoinGecko para activos digitales, ' +
        'con persistencia de carteras en MongoDB.'
    }
  },
  // Rutas donde swagger-jsdoc buscara las anotaciones JSDoc
  apis: ['./src/routes/*.js']
}

export const especificacionSwagger = swaggerJsdoc(opciones)