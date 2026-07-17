# AssetMatrix Intelligence

API REST de alta fidelidad para el monitoreo global de activos bursátiles y criptográficos, construida con Node.js y Express bajo una arquitectura de capas (Service Layer), con persistencia en MongoDB y documentación interactiva en Swagger.

## Tecnologías utilizadas

- **Node.js 20+ / Express.js**: runtime y framework del servidor
- **MongoDB + Mongoose**: persistencia y modelado de esquemas financieros
- **Swagger (OpenAPI 3.0)**: documentación interactiva vía swagger-ui-express y swagger-jsdoc
- **Jest + Supertest**: pruebas unitarias bajo el flujo TDD
- **Joi**: middleware de validación de payloads
- **Docker + Docker Compose**: entorno de ejecución reproducible
- **APIs externas**: Alpha Vantage (mercados bursátiles) y CoinGecko (criptomonedas)

## Cómo correr el proyecto

1. Clonar el repositorio y entrar a la carpeta del proyecto.
2. Crear un archivo `.env` en la raíz, basado en `.env.example`:

MONGO_USERNAME=admin
MONGO_PASSWORD=admin_password
MONGO_PORT=27017
MONGO_DB=topicos
MONGO_HOSTNAME=mongo
PORT=3000
ALPHA_VANTAGE_API_KEY=<su_api_key_gratuita>

La API key de Alpha Vantage se obtiene gratis en https://www.alphavantage.co/support/#api-key (los endpoints de crypto no requieren key).

3. Levantar el proyecto con Docker:

docker-compose -f docker-compose.local.yml up --build

4. La API queda disponible en `http://localhost:3005` y la documentación interactiva en `http://localhost:3005/api-docs`.

## Cómo correr las pruebas

npm install
npm test

Se ejecutan 21 pruebas unitarias que cubren los casos de éxito y error de todos los endpoints. Las pruebas usan mocks de las APIs externas y de la base de datos para garantizar resultados determinísticos, sin consumir el límite de peticiones de Alpha Vantage ni requerir una base de datos activa.

## Endpoints

### Mercados bursátiles (Alpha Vantage)
| Método | Ruta | Acción |
|---|---|---|
| GET | /stocks/:symbol | Consulta precio y volumen real |
| GET | /stocks/history?symbol=X | Análisis de tendencias históricas |
| POST | /stocks/watch | Guarda ticker en lista de seguimiento |
| DELETE | /stocks/:id | Elimina alerta de precio |

### Activos criptográficos (CoinGecko)
| Método | Ruta | Acción |
|---|---|---|
| GET | /crypto/:coin | Market cap y fluctuación 24h |
| GET | /crypto/analytics | Balance total de cartera histórica |
| POST | /crypto/portfolio | Registra transacción de compra/venta |
| DELETE | /crypto/:tx_id | Revierte registro de transacción |

## Decisiones de diseño

- **Arquitectura por capas**: rutas → controladores → servicios → modelos. La lógica financiera (cálculo de balance) vive en los servicios, independiente del protocolo HTTP.
- **Formato único de respuesta**: `{ exito, datos | mensaje }` en todas las peticiones, buenas o erróneas.
- **Manejo centralizado de errores**: un middleware captura los errores y responde con el código HTTP semánticamente correcto (200, 201, 400, 404, 500).
- **TDD**: cada módulo se desarrolló escribiendo primero las pruebas (fase roja) y luego el código que las hace pasar (fase verde), como consta en el historial de commits.
- **Gestión de secretos**: credenciales y API keys viven exclusivamente en variables de entorno.

## Dificultades encontradas

- Configuración inicial del repositorio: el primer commit incluyó node_modules por un .gitignore mal creado, lo que obligó a rehacer el historial de Git desde cero.
- Compatibilidad de Jest con ES Modules: requirió el flag experimental de Node (--experimental-vm-modules) en el script de pruebas.
- El orden de declaración de rutas en Express: las rutas fijas (/history, /analytics) deben declararse antes que las rutas con parámetros (/:symbol, /:coin) para evitar colisiones.