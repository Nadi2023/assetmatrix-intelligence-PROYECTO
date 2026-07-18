/**
 * Tema visual personalizado para Swagger UI.
 * Estilo terminal financiera: fondo azul profundo con lluvia binaria
 * animada (estilo Matrix), acentos neon con glow y bloques tipo
 * pildora redondeada.
 * Se inyecta via customCss de swagger-ui-express sin alterar la funcionalidad.
 */
export const temaOscuro = `
  /* ===== Fondo: lluvia binaria estilo Matrix sobre azul profundo ===== */
  html, body {
    background:
      radial-gradient(ellipse at 50% 35%, #0a1e3a 0%, #061224 45%, #030a14 100%) !important;
    background-attachment: fixed !important;
    position: relative;
    overflow-x: hidden;
  }
  body::before, body::after {
    content: '1 0 1 1 0 0 1 0 1 1 0 1 0 0 1 1 0 1 0 1 1 0 0 1 0 1 1 0 1 0 0 1 1 0 1 0 1 1 0 0 1 0 1 1 0 1 0 0 1 1 0 1 0 1 1 0 0 1 0 1 1 0 1 0 0 1 1 0 1 0 1 1 0 0 1 0 1 1 0 1 0 0 1 1 0 1 0 1 1 0 0 1 0 1 1 0 1 0 0 1 1 0 1 0 1 1 0 0 1 0 1 1 0 1 0 0 1 1 0 1';
    position: absolute;
    top: 0;
    height: 200%;
    width: 4%;
    font-family: 'Consolas', monospace;
    font-size: 15px;
    line-height: 2.4;
    word-spacing: 100vw;
    text-align: center;
    color: rgba(96,165,250,0.45);
    text-shadow: 0 0 10px rgba(96,165,250,0.5);
    pointer-events: none;
    z-index: 0;
    animation: lluviaBinaria 22s linear infinite;
  }
  body::before { left: 5%; }
  body::after {
    left: 80%;
    animation-duration: 30s;
    animation-delay: -10s;
    color: rgba(52,211,153,0.4);
    text-shadow: 0 0 10px rgba(52,211,153,0.5);
  }
  @keyframes lluviaBinaria {
    from { transform: translateY(-50%); }
    to { transform: translateY(0%); }
  }
  .swagger-ui { position: relative; z-index: 1; color: #e6edea; }
  
  /* Hacemos transparente TODA la cadena de contenedores de Swagger
     para que el fondo del body (con la lluvia binaria) sea visible */
  #swagger-ui,
  .swagger-container,
  .swagger-ui,
  .swagger-ui .wrapper,
  .swagger-ui .information-container,
  .swagger-ui .information-container.wrapper,
  .swagger-ui section.block,
  .swagger-ui .block.col-12,
  .swagger-ui div[class*="wrapper"] {
    background: transparent !important;
    background-color: transparent !important;
  }
  .swagger-ui .wrapper { max-width: 1100px; }

  /* ===== Fuera la barra superior de Swagger ===== */
  .swagger-ui .topbar { display: none; }

  /* ===== Titulo con neon ===== */
  .swagger-ui .info { margin: 44px 0 26px 0; }
  .swagger-ui .info .title {
    color: #ffffff;
    font-size: 52px;
    font-weight: 800;
    text-align: center;
    letter-spacing: 1px;
    text-shadow: 0 0 18px rgba(29,185,84,0.55), 0 0 60px rgba(29,185,84,0.25);
  }
  .swagger-ui .info .title small { display: none; }
  .swagger-ui .info p, .swagger-ui .info li {
    color: #8fd6b1;
    text-align: center;
    font-size: 15px;
  }

  /* ===== Secciones (STOCKS / CRYPTO) ===== */
  .swagger-ui .opblock-tag {
    color: #ffffff;
    border-bottom: 1px solid rgba(29,185,84,0.25);
    font-size: 22px;
    letter-spacing: 3px;
    text-transform: uppercase;
    text-shadow: 0 0 12px rgba(29,185,84,0.35);
  }
  .swagger-ui .opblock-tag:hover { background: rgba(29,185,84,0.05); }

  /* ===== Bloques de endpoints: pildoras con glow ===== */
  .swagger-ui .opblock {
    background: rgba(10,18,26,0.88);
    border-radius: 16px;
    margin-bottom: 18px;
    transition: box-shadow .2s ease, transform .2s ease;
  }
  .swagger-ui .opblock:hover { transform: translateY(-2px); }
  .swagger-ui .opblock .opblock-summary { border: none; padding: 14px 16px; }
  .swagger-ui .opblock .opblock-summary-method {
    border-radius: 999px;
    min-width: 110px;
    padding: 12px 0;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 1.5px;
  }
  .swagger-ui .opblock .opblock-summary-path,
  .swagger-ui .opblock .opblock-summary-path__deprecated {
    color: #e6edea;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 16px;
  }
  .swagger-ui .opblock .opblock-summary-description { color: #8aa899; font-size: 14px; }

  /* GET: verde neon */
  .swagger-ui .opblock.opblock-get {
    border: 1px solid rgba(29,185,84,0.6);
    box-shadow: 0 0 14px rgba(29,185,84,0.18), inset 0 0 22px rgba(29,185,84,0.05);
  }
  .swagger-ui .opblock.opblock-get:hover { box-shadow: 0 0 22px rgba(29,185,84,0.4); }
  .swagger-ui .opblock.opblock-get .opblock-summary-method {
    background: #1db954;
    box-shadow: 0 0 12px rgba(29,185,84,0.6);
  }

  /* POST: azul neon */
  .swagger-ui .opblock.opblock-post {
    border: 1px solid rgba(59,130,246,0.6);
    box-shadow: 0 0 14px rgba(59,130,246,0.18), inset 0 0 22px rgba(59,130,246,0.05);
  }
  .swagger-ui .opblock.opblock-post:hover { box-shadow: 0 0 22px rgba(59,130,246,0.4); }
  .swagger-ui .opblock.opblock-post .opblock-summary-method {
    background: #3b82f6;
    box-shadow: 0 0 12px rgba(59,130,246,0.6);
  }

  /* DELETE: rojo neon */
  .swagger-ui .opblock.opblock-delete {
    border: 1px solid rgba(239,68,68,0.6);
    box-shadow: 0 0 14px rgba(239,68,68,0.18), inset 0 0 22px rgba(239,68,68,0.05);
  }
  .swagger-ui .opblock.opblock-delete:hover { box-shadow: 0 0 22px rgba(239,68,68,0.4); }
  .swagger-ui .opblock.opblock-delete .opblock-summary-method {
    background: #ef4444;
    box-shadow: 0 0 12px rgba(239,68,68,0.6);
  }

  /* ===== Interior de bloques desplegados ===== */
  .swagger-ui .opblock .opblock-section-header {
    background: rgba(4,9,15,0.9);
    box-shadow: none;
    border-radius: 8px;
  }
  .swagger-ui .opblock .opblock-section-header h4,
  .swagger-ui .opblock-description-wrapper p,
  .swagger-ui .opblock-title_normal,
  .swagger-ui .parameter__name,
  .swagger-ui .parameter__type,
  .swagger-ui table thead tr th,
  .swagger-ui .response-col_status,
  .swagger-ui .response-col_description,
  .swagger-ui .responses-inner h4,
  .swagger-ui .responses-inner h5,
  .swagger-ui .tab li,
  .swagger-ui label {
    color: #e6edea;
  }
  .swagger-ui .parameter__name.required::after { color: #ef4444; }

  /* ===== Botones: Try it out (borde neon) y Execute (relleno con glow) ===== */
  .swagger-ui .btn {
    color: #1db954;
    border: 1px solid #1db954;
    background: transparent;
    border-radius: 999px;
    font-weight: 700;
    font-size: 15px;
    padding: 10px 28px;
    transition: box-shadow .2s ease;
  }
  .swagger-ui .btn:hover { box-shadow: 0 0 14px rgba(29,185,84,0.45); }
  .swagger-ui .btn.execute {
    background: #1db954;
    color: #04170c;
    border-color: #1db954;
    box-shadow: 0 0 16px rgba(29,185,84,0.55);
  }
  .swagger-ui .btn.execute:hover { box-shadow: 0 0 26px rgba(29,185,84,0.8); }
  .swagger-ui .btn.cancel { color: #ef4444; border-color: #ef4444; }

  /* ===== Inputs ===== */
  .swagger-ui input[type=text], .swagger-ui textarea, .swagger-ui select {
    background: #06101a;
    color: #e6edea;
    border: 1px solid rgba(29,185,84,0.35);
    border-radius: 8px;
  }
  .swagger-ui input[type=text]:focus, .swagger-ui textarea:focus {
    border-color: #1db954;
    box-shadow: 0 0 10px rgba(29,185,84,0.35);
    outline: none;
  }

  /* ===== Respuestas JSON: pantalla de terminal ===== */
  .swagger-ui .highlight-code, .swagger-ui .microlight,
  .swagger-ui .opblock-body pre {
    background: #020609 !important;
    color: #7ee2a8 !important;
    border-radius: 10px;
    border: 1px solid rgba(29,185,84,0.25);
    text-shadow: 0 0 6px rgba(126,226,168,0.35);
  }
  .swagger-ui .responses-inner { background: transparent; }

  /* ===== Limpieza ===== */
  .swagger-ui section.models { display: none; }
  .swagger-ui .scheme-container { background: transparent; box-shadow: none; }
`