# ===========================
# Base para desarrollo
# ===========================
FROM node:20-alpine

WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el código (aunque con volúmenes luego no se usará)
COPY . .

# Exponemos puerto
EXPOSE 3000

# Comando de desarrollo
CMD ["npm", "run", "dev"]
