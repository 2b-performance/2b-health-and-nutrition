# Imagem para deploy (Fly.io / Railway / Render). Compila o better-sqlite3.
FROM node:20-slim

# Ferramentas de build para o módulo nativo better-sqlite3.
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY . .

# Banco em volume persistente montado em /data (ver fly.toml).
ENV DB_PATH=/data/escala.db
ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]
