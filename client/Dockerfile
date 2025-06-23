FROM node:lts-alpine

RUN apk --no-cache add curl python3 make g++

WORKDIR /app

# Copiez d'abord les fichiers de config
COPY package.json package-lock.json* ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY vite.config.ts ./
COPY tsconfig*.json ./

RUN npm install

# Puis copiez le reste
COPY public public
COPY src src
COPY index.html index.html

CMD npm run dev