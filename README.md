# Escala de Oficiais — 4º GBM

Escala de Serviço de **Oficial de Dia** e **Sobreaviso** do 4º GBM.

A interface (HTML/CSS/JS de página única) é a mesma de sempre. O que mudou foi **apenas a camada de dados**: saiu a API proprietária do ambiente de Artifacts do Claude (`window.claude.use("db")`) e entrou um **backend REST próprio com SQLite**, que roda em qualquer lugar e não exige login em conta nenhuma.

- **Backend:** Node.js + Express
- **Banco:** SQLite (arquivo local, sem infraestrutura externa) via `better-sqlite3`
- **Sincronização entre dispositivos:** *polling* a cada 4 s (`fetch`), sem WebSocket
- **Identificação:** declaratória — o oficial escolhe quem é na primeira vez e o aparelho lembra via `localStorage` (sem usuário/senha)

Tudo o que já existia foi preservado: ordem de antiguidade, feriados fixos e móveis (Carnaval, Sexta-feira Santa, Corpus Christi via cálculo da Páscoa), categorias **P/S/V**, cotas por categoria, tema claro/escuro, modal em *bottom sheet* no celular, impressão em lista e edição/remoção de oficiais.

---

## Rodar localmente

Pré-requisito: **Node.js 18 ou superior**.

```bash
npm install
npm run dev
```

Abra **http://localhost:3000**. O banco é criado automaticamente em `data/escala.db` e, no primeiro acesso, os **14 oficiais** da relação são semeados (na ordem de antiguidade). Para usar outra porta ou outro arquivo de banco:

```bash
PORT=8080 DB_PATH=/caminho/escala.db npm run dev
```

Para testar a sincronização, abra a mesma URL em duas abas/aparelhos: uma marcação feita em um aparece no outro em poucos segundos.

---

## API REST (referência)

Substitui exatamente o modelo de dados anterior. Todos os corpos são JSON.

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/officers` | Todos os oficiais, no formato `{ id: {…} }` |
| `PUT` | `/api/officers/:id` | Cria/atualiza o cadastro completo do oficial |
| `PATCH` | `/api/officers/:id` | Mescla campos no cadastro existente |
| `DELETE` | `/api/officers/:id` | Remove o oficial e limpa seus lançamentos |
| `GET` | `/api/months/:ym/entries` | Lançamentos do mês `:ym` (`AAAA-MM`): `{ officerId: { expediente[], servico[], sobreaviso[] } }` |
| `PUT` | `/api/months/:ym/entries/:oid` | Grava o lançamento do oficial no mês |
| `GET` | `/api/months/:ym/meta/config` | `{ obs, feriado, meta }` do mês |
| `PUT` | `/api/months/:ym/meta/config` | Grava observações, feriados e cotas do mês |
| `POST` | `/api/seed` | Semeia os 14 oficiais (idempotente — roda uma vez só) |

**Regra reforçada no servidor:** ao gravar um lançamento, a data de **Oficial de Dia** e a de **Sobreaviso** são removidas automaticamente dos demais oficiais — garante *um só OD e um só Sobreaviso por dia*, mesmo com dois oficiais marcando ao mesmo tempo. O expediente é livre. As demais regras (categoria P/S/V por data e feriado, cotas bloqueando novas atribuições) continuam sendo calculadas no front, exatamente como antes.

---

## Publicar (link público fixo)

O SQLite precisa de um **disco persistente**, senão os dados somem a cada novo deploy. Por isso a recomendação é **Fly.io** ou **Railway**, que oferecem volume no plano gratuito/barato. Já vêm prontos no projeto: `Dockerfile`, `.dockerignore` e `fly.toml`.

### Opção A — Fly.io (recomendada)

1. Instale o CLI e faça login:
   ```bash
   curl -L https://fly.io/install.sh | sh
   fly auth signup   # ou: fly auth login
   ```
2. Na pasta do projeto, crie o app (o `fly.toml` já está pronto — pode aceitar os padrões e **não** deixar criar banco gerenciado):
   ```bash
   fly launch --no-deploy
   ```
   Se ele reclamar do nome do app, escolha um único (ex.: `escala-4gbm-suaunidade`) — ele atualiza o `fly.toml`.
3. Crie o volume do banco (na mesma região do `fly.toml`, `gru` = São Paulo):
   ```bash
   fly volumes create escala_data --size 1 --region gru
   ```
4. Faça o deploy:
   ```bash
   fly deploy
   ```
5. Pegue o link público:
   ```bash
   fly open        # abre https://SEU-APP.fly.dev
   ```

Esse endereço `https://SEU-APP.fly.dev` é fixo e pode ser repassado a qualquer oficial — funciona em qualquer celular/navegador, sem login.

> O `fly.toml` já aponta `DB_PATH=/data/escala.db` para o volume, então os dados sobrevivem a novos deploys. Para não perder nada, evite destruir o volume `escala_data`.

### Opção B — Railway

1. Crie conta em [railway.app](https://railway.app) e um projeto **Deploy from GitHub repo** (aponte para este repositório) ou use o CLI `railway up`.
2. O Railway detecta o `Dockerfile` e builda sozinho.
3. Em **Variables**, defina `DB_PATH=/data/escala.db`.
4. Em **Volumes**, crie um volume e monte em **`/data`**.
5. Em **Settings → Networking**, clique em **Generate Domain** para obter o link público fixo (`https://….up.railway.app`).

### Sobre Render / Vercel

- **Render (plano free):** o disco é efêmero e zera a cada deploy/reinício — **não use** para o SQLite. Só serviria com o *Persistent Disk* pago; nesse caso é igual ao Fly, apontando `DB_PATH` para o disco montado.
- **Vercel:** é serverless e não mantém arquivo local — só serviria trocando o SQLite por um banco externo (ex.: Supabase/Postgres). Como a proposta era “sem infra externa”, Fly/Railway são o caminho mais simples.

---

## Estrutura

```
.
├── server.js          # backend Express + SQLite (API /api + serve o front)
├── public/
│   └── index.html     # a aplicação (UI/CSS/JS originais, só a camada de dados trocada)
├── package.json
├── Dockerfile         # build para deploy (compila o better-sqlite3)
├── fly.toml           # configuração Fly.io (com volume persistente)
└── data/              # banco SQLite (criado em runtime; ignorado no git)
```
