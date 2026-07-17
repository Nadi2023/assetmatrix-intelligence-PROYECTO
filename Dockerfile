# Imagen base de Node.js version 20 (LTS exigida por el proyecto)
FROM node:20

# Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos primero los package para aprovechar la cache de Docker
COPY package*.json ./

# Instalamos las dependencias dentro del contenedor
RUN npm install

# Copiamos el resto del codigo fuente
COPY . .

# Puerto interno en el que escucha la API
EXPOSE 3000

# Comando de arranque: ejecuta node src/index.js via npm start
CMD ["npm", "start"]