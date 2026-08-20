# CRM Vendas

CRM standalone de **Contatos** e **Pipeline de negócios** (funil Kanban), com login simples.
App único em Next.js (React + rotas de API) sobre SQLite via Prisma. Sem serviço externo.

> Projeto independente. **Não** faz parte do MINIMUS.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Prisma + SQLite** (banco em arquivo, `prisma/dev.db`)
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

```bash
cd crm
npm install                 # instala deps e gera o Prisma Client
npx prisma migrate dev      # cria o banco SQLite e as tabelas
npm run db:seed             # (opcional) dados de exemplo — login demo@crm.local / demo1234
npm run dev                 # http://localhost:3000
```

O arquivo `.env` já traz `DATABASE_URL` (SQLite local) e um `AUTH_SECRET` gerado.
Veja `.env.example` para os valores esperados. **Não** versione o `.env` real.

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

Local usa **SQLite** (zero config). Para produção, use **PostgreSQL** — veja
**[DEPLOY.md](./DEPLOY.md)** (Vercel + Postgres, ou Docker/Compose). O repo já
traz `Dockerfile`, `.dockerignore` e `docker-compose.yml` (app + Postgres).

## Próximos passos

- **Dashboard** de métricas (funil, valor em aberto, ganhos no mês, conversão).
- Papéis de usuário (admin/vendedor) e múltiplos workspaces.
- Histórico/atividades no contato e importar/exportar contatos.
