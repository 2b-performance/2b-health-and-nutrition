#!/bin/sh
set -e

# Aplica as migrations pendentes antes de subir o servidor.
# Requer DATABASE_URL e AUTH_SECRET no ambiente do container.
echo "→ Aplicando migrations (prisma migrate deploy)..."
npx prisma migrate deploy

echo "→ Iniciando servidor..."
exec "$@"
