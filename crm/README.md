# CRM Vendas

CRM standalone de **Contatos** e **Pipeline de negócios** (funil Kanban), com login simples.
App único em Next.js (React + rotas de API) sobre PostgreSQL via Prisma.

> Projeto independente. **Não** faz parte do MINIMUS.

## Stack

- **Next.js 14** (App Router, TypeScript, saída `standalone`)
- **Prisma + PostgreSQL**
- **Auth**: e-mail + senha, sessão em cookie JWT (`jose`), senha com `bcryptjs`
- Validação com `zod`

## Escopo

- **Contatos**: cadastro, busca, edição, exclusão e ficha com os negócios ligados.
- **Pipeline**: funil Kanban com 5 etapas (Novo → Em contato → Proposta → Ganho / Perdido),
  arrastar-e-soltar entre colunas, valor total por etapa e no funil.
- **Tarefas**: follow-ups com vencimento, agrupados em Atrasadas / Hoje / Próximas / Sem data,
  concluir com um toque, e vínculo opcional a contato e/ou negócio.
- **Login**: cadastro e entrada. Cada usuário vê apenas seus próprios dados.

## Como rodar

Precisa de um PostgreSQL. Suba um rápido com o Compose do repo (`docker compose up -d db`)
ou use um Postgres local/gerenciado. Depois:

```bash
cd crm
cp .env.example .env         # ajuste DATABASE_URL e gere AUTH_SECRET (openssl rand -hex 32)
npm install                  # instala deps e gera o Prisma Client
npx prisma migrate deploy    # aplica as migrations no Postgres
npm run db:seed              # (opcional) dados de exemplo — login demo@crm.local / demo1234
npm run dev                  # http://localhost:3000
```

`DATABASE_URL` aponta para o Postgres (ex.: `postgresql://crm:crm@localhost:5432/crm?schema=public`)
e `AUTH_SECRET` é o segredo da sessão. Veja `.env.example`. **Não** versione o `.env` real.

## Estrutura

```
src/
  app/
    (app)/                  # área autenticada (sidebar + telas)
      pipeline/             # funil Kanban
      contatos/             # lista + ficha do contato
      tarefas/              # follow-ups com vencimento
    api/                    # rotas: auth, contacts, deals, deals/reorder, tasks
    login/  register/       # telas públicas
  components/               # Sidebar, Board (Kanban), ContactsView, TasksView
  lib/                      # db (Prisma), auth, session (JWT), stages, date
  middleware.ts             # protege páginas e APIs
prisma/schema.prisma        # User, Contact, Deal, Task
```

## Deploy / produção

PostgreSQL em dev e produção. Veja **[DEPLOY.md](./DEPLOY.md)** (Vercel + Postgres,
ou Docker/Compose). O repo traz `Dockerfile`, `.dockerignore` e `docker-compose.yml`
(app + Postgres); o entrypoint roda `prisma migrate deploy` no start.

Validado de verdade em Postgres 16: `migrate deploy` aplica as migrations numa base
limpa, seed popula os dados, e o app serve com cadastro/login e CRUD isolado por usuário.

## Próximos passos

- **Dashboard** de métricas (funil, valor em aberto, ganhos no mês, conversão).
- Papéis de usuário (admin/vendedor) e múltiplos workspaces.
- Histórico/atividades no contato e importar/exportar contatos.
