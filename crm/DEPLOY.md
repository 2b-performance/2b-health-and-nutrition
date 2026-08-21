# Deploy — CRM Vendas

O app roda em **PostgreSQL** (dev e produção). O provider do Prisma já está em
`postgresql` e as migrations versionadas em `prisma/migrations/` são de Postgres —
não há passo de conversão. Em produção as migrations são aplicadas com
`npx prisma migrate deploy` (o `Dockerfile` já faz isso no start).

> ✅ **Validado em Postgres 16:** `migrate deploy` aplica as migrations numa base
> limpa, o seed popula os dados, e o app serve cadastro/login e CRUD isolado por
> usuário. Ver a seção "Validação" no fim.

---

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | String de conexão do Postgres. |
| `AUTH_SECRET` | Segredo do JWT de sessão. Gere com `openssl rand -hex 32`. |
| `TZ` | Fuso do negócio (padrão `America/Sao_Paulo` na imagem). Alinha as datas do servidor (ex.: "tarefas de hoje") com o navegador do usuário. Na Vercel, defina `TZ` nas variáveis do projeto (o runtime é UTC por padrão). |

Nunca versione os valores reais. Configure-os no painel do provedor.

---

## Opção A — Vercel + Postgres gerenciado (recomendado)

1. Crie um Postgres gerenciado (Neon, Supabase, Vercel Postgres).
2. No projeto Vercel, defina `DATABASE_URL` e `AUTH_SECRET`.
3. O `build` do projeto (`package.json`) já roda
   `prisma generate && prisma migrate deploy && next build` — as migrations
   são aplicadas no deploy. Se preferir aplicar fora do build, remova o
   `migrate deploy` do script `build` e rode-o num passo de release.

## Opção B — Docker / Docker Compose

O repositório traz `Dockerfile`, `.dockerignore` e `docker-compose.yml`
(app + Postgres):

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

## Checklist de produção

- [x] Provider do Prisma em `postgresql` e migrations de Postgres comitadas.
- [ ] `DATABASE_URL` e `AUTH_SECRET` definidos no provedor (nunca no git).
- [ ] `AUTH_SECRET` forte e único por ambiente.
- [ ] Backup/rotina de snapshot do Postgres.
- [ ] HTTPS na frente do app (o cookie de sessão usa `secure` em produção).

---

## Validação (o que já foi testado)

Testado contra **PostgreSQL 16** localmente:

1. `prisma migrate deploy` numa base limpa → cria `User`, `Contact`, `Deal`,
   `Task` (+ `_prisma_migrations`).
2. `npm run db:seed` → 1 usuário demo, 3 contatos, 4 negócios, 5 tarefas.
3. App em produção (`next start`, saída standalone) apontando para o Postgres:
   - login com o usuário do seed;
   - cadastro de novo usuário (escrita);
   - criar contato + negócio, mover etapa no funil;
   - **isolamento por usuário** confirmado (cada conta só vê os próprios dados);
   - valores persistidos em centavos (ex.: `R$ 1.234,56` → `123456`).

> Observação: o **build/pull das imagens Docker** (Postgres e Node do Hub) pode
> ser bloqueado por política de rede em ambientes restritos. O caminho de
> aplicação em Postgres acima foi validado diretamente; num ambiente com acesso
> ao Docker Hub, `docker compose up --build` reproduz o mesmo resultado em
> container.
