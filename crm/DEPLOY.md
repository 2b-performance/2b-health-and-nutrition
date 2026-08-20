# Deploy — CRM Vendas

O código é **agnóstico de banco** (nenhum SQL específico de SQLite). Para
desenvolvimento local o projeto usa **SQLite** (zero configuração). Para
**produção**, use **PostgreSQL** — SQLite não funciona bem em ambientes
serverless/efêmeros (Vercel) nem escala com múltiplas instâncias.

> ⚠️ **Importante:** as migrations versionadas em `prisma/migrations/` foram
> geradas para **SQLite** (uso local). Antes do primeiro deploy em Postgres,
> gere as migrations do Postgres uma única vez (passo 1 abaixo). É rápido.

---

## Passo 1 — Trocar para PostgreSQL (uma vez)

1. Em `prisma/schema.prisma`, mude o provider:

   ```prisma
   datasource db {
     provider = "postgresql"   // era "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. Aponte `DATABASE_URL` para um Postgres (local via Docker, Neon, Supabase,
   RDS, etc.). Ex.: `postgresql://user:senha@host:5432/crm?schema=public`.

3. Regenere as migrations para Postgres:

   ```bash
   rm -rf prisma/migrations           # remove as migrations de SQLite
   npx prisma migrate dev --name init # cria as migrations de Postgres
   ```

4. Comite `prisma/schema.prisma` e a nova pasta `prisma/migrations/`.

Pronto — o app agora está em Postgres. Em produção as migrations são aplicadas
com `npx prisma migrate deploy` (o `Dockerfile` já faz isso no start).

---

## Variáveis de ambiente (produção)

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | String de conexão do Postgres. |
| `AUTH_SECRET` | Segredo do JWT de sessão. Gere com `openssl rand -hex 32`. |

Nunca versione os valores reais. Configure-os no painel do provedor.

---

## Opção A — Vercel + Postgres gerenciado (recomendado)

1. Faça o **Passo 1** e comite as migrations de Postgres.
2. Crie um Postgres gerenciado (Neon, Supabase, Vercel Postgres).
3. No projeto Vercel, defina `DATABASE_URL` e `AUTH_SECRET`.
4. O `build` do projeto (`package.json`) já roda
   `prisma generate && prisma migrate deploy && next build` — as migrations
   são aplicadas no deploy. Se preferir aplicar fora do build, remova o
   `migrate deploy` do script `build` e rode-o num passo de release.

## Opção B — Docker / Docker Compose

O repositório traz `Dockerfile`, `.dockerignore` e `docker-compose.yml`
(app + Postgres). Depois do **Passo 1**:

```bash
export AUTH_SECRET="$(openssl rand -hex 32)"
docker compose up --build
# app em http://localhost:3000, Postgres no serviço "db"
```

O `docker-entrypoint.sh` roda `prisma migrate deploy` antes de subir o
servidor, então o banco é migrado automaticamente a cada start.

Para buildar só a imagem do app (Postgres externo):

```bash
docker build -t crm-vendas .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:senha@host:5432/crm?schema=public" \
  -e AUTH_SECRET="$(openssl rand -hex 32)" \
  crm-vendas
```

---

## Continuar em SQLite (protótipo/local)

Se ainda **não** for para produção, não faça o Passo 1: `npm install` +
`npx prisma migrate dev` + `npm run dev` já funciona com SQLite. A troca para
Postgres continua trivial depois — só o Passo 1.

---

## Checklist de produção

- [ ] Provider do Prisma em `postgresql` e migrations de Postgres comitadas.
- [ ] `DATABASE_URL` e `AUTH_SECRET` definidos no provedor (nunca no git).
- [ ] `AUTH_SECRET` forte e único por ambiente.
- [ ] Backup/rotina de snapshot do Postgres.
- [ ] HTTPS na frente do app (o cookie de sessão usa `secure` em produção).
