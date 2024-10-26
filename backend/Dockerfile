# Usa una imagen oficial de Node.js
FROM node:18

# Crea un directorio de trabajo para la app
WORKDIR /usr/src/app

# Copia los archivos de package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install --production

# Copia el resto del código
COPY . .

# Asegúrate de que tu archivo .env esté copiado al contenedor
COPY .env ./

# Exponer el puerto que usa la API
EXPOSE 3000

# Comando para correr la API
CMD ["npm", "start"]
