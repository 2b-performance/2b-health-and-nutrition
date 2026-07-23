# MINIMUS — Design System & Linguagem Visual

**Documento:** Design System v1.0 — "Quiet OS"
**Autor:** Principal UI Architect / Design System Lead
**Escopo:** Fundações visuais, tokens, componentes e padrões de interface. Complementa `UX-ARCHITECTURE.md` (que define comportamento e fluxo — este documento define aparência e sensação).

---

## O Teste do Sistema Operacional

Antes de qualquer decisão visual entrar neste documento, ela passou por três perguntas, nesta ordem:

1. **"Isso parece um sistema operacional moderno?"** — Se parece painel administrativo com sidebar azul-corporativo e tabelas zebradas, refaz.
2. **"Isso transmite calma?"** — Se grita, pisca ou compete por atenção, refaz.
3. **"Um empresário sem afinidade com tecnologia se sente respeitado por isso?"** — Premium para o nosso usuário não é "denso e técnico"; é **claro, silencioso e confiante**. Apple, não Bloomberg Terminal.

### O nome da linguagem: **Quiet OS**

A identidade visual do MINIMUS é a de um sistema operacional silencioso: superfícies claras e limpas, uma única cor de marca usada com extrema parcimônia, profundidade sutil em vez de bordas pesadas, e movimento que responde em vez de decorar. O software não aparece — **o negócio do usuário aparece**.

### Reconciliação com a arquitetura de UX (leia antes de aplicar a terminologia)

O documento de UX estabeleceu: *"o menu precisa ser entendido pela família do dono"*. A terminologia de OS (Central de Comando, Inteligência, Sistema) **não conflita com isso — desde que aplicada com uma regra**:

> **Nomes de OS para os espaços; verbos humanos para as ações.**

"Central de Comando" é compreensível e eleva a percepção ("meu negócio tem uma central de comando"). Mas o botão dentro dela nunca diz "executar rotina" — diz "Responder agora". O substantivo pode ser aspiracional; **o verbo é sempre do vocabulário do dono**. Onde um termo de OS confundir o usuário-alvo, o termo perde. Essa regra resolve a tensão e está refletida no glossário da seção 14.

---

# PARTE I — FUNDAÇÕES

## 1. Grid e Layout

A sensação de "OS" nasce do layout antes de qualquer componente: **superfícies flutuando sobre um fundo**, como janelas — nunca uma página única dividida por linhas.

### Estrutura base (desktop)
- **Grid de 12 colunas**, gutter de `24px`, margens laterais de `32px`.
- **Largura máxima de conteúdo: `1200px`**, centralizada. Telas ultrawide ganham respiro, não conteúdo esticado — dashboards que se esticam infinitamente parecem admin genérico.
- **Anatomia da tela:** fundo (canvas) `gray-50` → superfícies (cards/painéis) brancas elevadas sobre ele. O canvas nunca recebe texto diretamente, exceto títulos de página. Isso cria a leitura de "janelas sobre mesa" — a assinatura visual de OS.
- **Sidebar fixa: `240px`** (colapsável a `64px` só-ícones). Área de conteúdo fluida.
- **Densidade:** confortável por padrão. Nada de modo compacto na v1 — densidade é ansiedade para o nosso usuário.

### Mobile
- Coluna única, margens laterais de `16px`, gutter `16px`.
- Barra inferior de navegação (conforme UX doc), altura `64px` + safe area.
- Cards ocupam a largura total menos margens; nunca cards lado a lado em telas < 640px.

### Breakpoints
| Token | Valor | Uso |
|---|---|---|
| `sm` | 640px | celular grande / dobra de cards |
| `md` | 768px | tablet retrato — sidebar vira barra inferior |
| `lg` | 1024px | sidebar completa aparece |
| `xl` | 1280px | largura máxima de conteúdo atingida |

## 2. Espaçamento e Margens

**Escala única de base 4** — nenhum valor fora dela, nunca:

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`

### Regras de aplicação (o que faz a tela "respirar")
- **Padding interno de cards: `24px`** (mobile: `16px`). Card apertado = admin barato.
- **Entre cards: `16px`**. Entre seções de página: `48px`. Entre título de página e conteúdo: `32px`.
- **Regra do dobro:** o espaço **entre** grupos é sempre ≥ 2× o espaço **dentro** do grupo. É isso que cria hierarquia sem precisar de linhas divisórias.
- **Proibido usar bordas/divisores para separar o que o espaço já separa.** Divisor (`gray-100`, 1px) só dentro de listas densas (tabelas, filas). O MINIMUS separa com ar, não com linhas.

## 3. Raios de Borda

Raios generosos são metade da sensação "2026". Escala:

| Token | Valor | Uso |
|---|---|---|
| `radius-sm` | 6px | badges, tags, checkboxes |
| `radius-md` | 10px | botões, inputs, dropdowns |
| `radius-lg` | 16px | **cards, painéis, modais** — o raio-assinatura do produto |
| `radius-xl` | 24px | superfícies grandes (painel do Assistente IA, sheets mobile) |
| `radius-full` | 9999px | avatares, pills de estado, botões de ícone |

Regra: elementos **dentro** de uma superfície usam raio menor que a superfície. Nunca um botão `16px` dentro de um card `16px` — o aninhamento de raios (contêiner maior, conteúdo menor) é o que dá o acabamento de OS.

## 4. Sombras e Elevação

Profundidade no MINIMUS é **sutil e fria** — sombras largas, difusas e quase invisíveis (Stripe/Linear), nunca sombras duras de Material Design.

| Token | Valor | Uso |
|---|---|---|
| `shadow-xs` | `0 1px 2px rgb(16 24 40 / 0.04)` | cards em repouso |
| `shadow-sm` | `0 2px 8px rgb(16 24 40 / 0.06)` | cards em hover, dropdowns |
| `shadow-md` | `0 8px 24px rgb(16 24 40 / 0.08)` | popovers, painéis flutuantes |
| `shadow-lg` | `0 16px 48px rgb(16 24 40 / 0.12)` | modais, Assistente IA |

### Regras de elevação
- **Cards em repouso quase não têm sombra** — eles se definem pelo contraste branco-sobre-`gray-50` + borda `1px` `gray-100`. A sombra cresce **apenas em resposta ao usuário** (hover, drag). Elevação é feedback, não decoração.
- Máximo **3 níveis de elevação simultâneos** numa tela: canvas → superfície → flutuante. Mais que isso vira bagunça de camadas.
- Nada de sombras coloridas, exceto o glow do Assistente IA (seção 20).

## 5. Tipografia

### Família
- **UI e títulos: Inter** (variável). Neutra, tecnológica, excelente em corpo pequeno — a língua franca dos produtos que somos comparados (Linear, Vercel, Notion).
- **Números de dados: Inter com `tabular-nums`** — obrigatório em métricas, tabelas e placares. Números que dançam de largura quebram a sensação de precisão.
- Sem fonte display separada na v1. Uma família, muitos pesos = coesão.

### Escala tipográfica (base 16, razão ~1.25)

| Token | Tamanho / Altura | Peso | Uso |
|---|---|---|---|
| `display` | 32 / 40 | 650 | número-herói do Painel de Estado, telas de boas-vindas |
| `h1` | 24 / 32 | 650 | título de página (1 por tela, sempre) |
| `h2` | 18 / 28 | 600 | título de seção/card |
| `h3` | 15 / 24 | 600 | subtítulo, cabeçalho de grupo |
| `body` | 15 / 24 | 450 | texto padrão de interface |
| `body-sm` | 13 / 20 | 450 | metadados, células secundárias |
| `caption` | 12 / 16 | 500 | labels, timestamps, badges |
| `metric` | 28 / 34 | 650, tabular | números de indicadores |

### Regras
- **Tracking levemente negativo em títulos** (`-0.5%` a `-1.5%` conforme o tamanho sobe) — o detalhe que separa "2026" de "Bootstrap".
- Corpo em peso 450 (não 400): Inter em 400 sobre fundo claro parece frágil; 450 dá a solidez premium sem pesar.
- **Hierarquia por peso e cor antes de tamanho.** Título de card + metadado se diferenciam por `600/gray-900` vs `450/gray-500` — não por saltos de tamanho. Poucos tamanhos, muita disciplina.
- Texto de interface nunca em preto puro nem cinza-claro-demais: mínimo `gray-500` para texto informativo (acessibilidade AA sempre).

## 6. Cores

### Neutros (o corpo do produto — 90% de qualquer tela)

Neutros **frios com um sopro de azul** — é o que faz branco parecer "tecnologia" e não "papel de formulário":

| Token | Hex | Uso |
|---|---|---|
| `white` | `#FFFFFF` | superfícies (cards, painéis, modais) |
| `gray-50` | `#F7F8FA` | **canvas — o fundo do OS** |
| `gray-100` | `#EEF0F3` | bordas de cards, divisores |
| `gray-200` | `#E2E5EA` | bordas de inputs, estados hover de neutros |
| `gray-400` | `#9AA1AC` | placeholders, ícones inativos |
| `gray-500` | `#6B7280` | texto secundário, metadados |
| `gray-700` | `#3A4150` | texto de apoio forte, ícones ativos |
| `gray-900` | `#12141A` | **preto suave** — texto primário, títulos |

### Marca (usada com extrema parcimônia)

| Token | Hex | Uso |
|---|---|---|
| `blue-700` | `#1D3FBF` | **azul profundo — a cor do MINIMUS.** Ação primária, foco, item de navegação ativo |
| `blue-600` | `#2B52E0` | hover/estado ativo do primário |
| `blue-100` | `#E4EAFD` | **azul claro** — fundos de seleção, highlights, badge informativo |
| `blue-50` | `#F1F5FE` | fundo de linha selecionada, hover de item ativo |

**A regra dos 5%:** em qualquer tela, o azul ocupa no máximo ~5% dos pixels — um botão primário, o item ativo do menu, um ou dois acentos. É a escassez que torna o azul significativo: quando algo é azul, **é ali que se age**. Telas encharcadas de cor de marca são a assinatura do admin genérico que estamos evitando.

### Semânticas (apenas nos seus papéis, nunca decorativas)

| Papel | Base | Fundo suave | Uso exclusivo |
|---|---|---|---|
| Sucesso | `green-600 #17825D` | `green-50 #EAF7F1` | confirmações, vitórias, estado "Ativo" |
| Atenção | `amber-600 #B7791F` | `amber-50 #FDF6E7` | avisos, estado "Esfriando" |
| Erro | `red-600 #D13438` | `red-50 #FCEDED` | falhas, ações destrutivas, estado "Sumido" |

Regras invioláveis: verde **só** para sucesso (nunca para "dinheiro" ou botões de WhatsApp — o módulo Comunicação usa os neutros e o azul da marca, como qualquer outro); amarelo **só** atenção; vermelho **só** erro/destrutivo. Gráficos usam a rampa de azuis + neutros (seção 19), não o arco-íris.

### Modo escuro
Fora da v1, mas os tokens já nascem semânticos (`surface`, `canvas`, `text-primary`...) para que o dark mode seja uma troca de mapa, não um redesign. Não prometê-lo; não bloqueá-lo.

## 7. Estados Interativos (regra global)

Todos os componentes interativos obedecem à mesma gramática — é essa previsibilidade que faz o produto parecer um sistema, não uma coleção de telas:

| Estado | Tratamento |
|---|---|
| Repouso | definição por borda/cor de fundo, sombra mínima |
| Hover | fundo 1 passo mais escuro **ou** `shadow-sm`; transição 120ms; cursor pointer |
| Pressed | escala `0.98` + fundo 2 passos; resposta tátil instantânea |
| Foco (teclado) | anel `2px blue-700` com offset `2px` — sempre visível, nunca removido |
| Selecionado | fundo `blue-50` + detalhe `blue-700` (barra lateral de 2px ou ícone) |
| Desabilitado | opacidade `0.45`, sem hover. **Raro:** conforme o UX doc, o que não se aplica ao usuário não aparece — desabilitado é exceção, não padrão |
| Carregando | conteúdo → spinner de 16px no lugar do label, largura preservada (botão nunca "pula") |

---

# PARTE II — COMPONENTES

## 8. Botões

| Variante | Aparência | Uso |
|---|---|---|
| **Primário** | fundo `blue-700`, texto branco, `radius-md`, altura 40px | **1 por tela/contexto.** A ação que ganha dinheiro |
| Secundário | fundo branco, borda `gray-200`, texto `gray-700` | ações de apoio |
| Ghost | sem fundo, texto `gray-700`; hover `gray-50` | ações terciárias, barras de ferramenta |
| Destrutivo | ghost com texto `red-600`; confirmação por **desfazer**, não modal | excluir, remover |
| Ícone | 36×36, `radius-full`, ghost | ações compactas em cards e filas |

- Altura padrão 40px (toque mobile: mínimo 44px de área). Padding horizontal 16px. Label sempre **verbo do dono**: "Responder", "Enviar", "Publicar" — nunca "Submeter", "OK", "Confirmar".
- Nunca dois primários lado a lado. Nunca botão em caixa alta.

## 9. Inputs e Formulários

- Altura 40px, `radius-md`, fundo branco, borda `gray-200`; foco: borda `blue-700` + anel suave `blue-100`. Erro: borda `red-600` + mensagem `caption` abaixo, em linguagem humana ("Esse número parece incompleto"), nunca "campo inválido".
- **Label sempre acima do campo** (nunca placeholder-como-label — some quando o usuário digita, e nosso usuário esquece o que estava preenchendo). Placeholder só para exemplo de formato ("(11) 99999-0000").
- Máximo 4 campos visíveis por tela (regra herdada do UX doc). Campos largos demais parecem formulário de banco: largura máxima de input `480px` mesmo em telas grandes.
- Selects e campos de data seguem exatamente a anatomia do input + dropdown (seção 10) — zero variação de estilo entre tipos de campo.

## 10. Dropdown / Menus

- Superfície branca, `radius-lg`, `shadow-md`, padding `6px`; itens de 36px com `radius-sm` no hover (`gray-50`) — o padrão Raycast/Linear de "itens flutuando dentro da superfície", não linhas de lista coladas.
- Item: ícone 16px (opcional) + label + atalho/metadado à direita em `gray-400`.
- Máximo 7 itens visíveis; mais que isso, o menu ganha busca no topo.
- Abertura: 120ms, fade + deslocamento de 4px a partir da origem. Fechamento: 80ms. Menus que "pulam" de lugares errados quebram a ilusão de sistema físico.

## 11. Cards

O card é **a molécula do MINIMUS** — tudo vive em cards sobre o canvas.

- Anatomia: fundo branco, borda 1px `gray-100`, `radius-lg`, `shadow-xs`, padding 24px.
- Estrutura interna fixa: **título (`h2`) + metadado opcional (`body-sm gray-500`) no topo → conteúdo → ação no rodapé.** A ação fica sempre no mesmo lugar (rodapé à esquerda, ou seta discreta no canto superior direito para "abrir"). Previsibilidade > criatividade.
- Card clicável inteiro: hover eleva para `shadow-sm` + borda `gray-200`, 120ms. Nada de "saltar" ou escalar — OS é sóbrio.
- **Proibido card dentro de card.** Se um card precisa de subdivisões, usa espaçamento e `h3`, não superfícies aninhadas.

## 12. Badges e Pills de Estado

- Formato: `radius-full`, `caption 500`, padding 2px 10px, fundo suave + texto na cor base (nunca fundo saturado com texto branco — muito peso visual).
- Os três estados de cliente (UX doc) têm tratamento canônico: **Ativo** `green-50/green-600` · **Esfriando** `amber-50/amber-600` · **Sumido** `red-50/red-600`, sempre com ponto de 6px antes do texto (legível também para daltônicos pela posição + texto, nunca só pela cor).
- Badge numérico (só em Comunicação, por regra de UX): círculo `blue-700`, texto branco, máximo "9+".
- Etiquetas livres do usuário ("VIP", "Atacado"): sempre neutras (`gray-100/gray-700`) — cor semântica é reservada ao sistema.

## 13. Sidebar (desktop)

- 240px, fundo `gray-50` **(mesmo tom do canvas — sidebar e fundo são um só plano; apenas o conteúdo flutua)**. Sem borda direita; a transição se dá pelo alinhamento dos cards. Esse é o truque visual nº 1 anti-admin: a sidebar tradicional é uma coluna escura separada; a nossa é parte da mesa.
- Item: 36px de altura, `radius-md`, ícone 18px + label `body`. Ativo: fundo branco + `shadow-xs` + texto `gray-900` + ícone `blue-700` (o item ativo parece uma tecla pressionada do sistema). Inativo: `gray-500`, hover `gray-100`.
- Topo: marca MINIMUS pequena e silenciosa. Rodapé: avatar do usuário + acesso a **Sistema** (configurações).
- 5 itens no máximo (regra de UX). Colapsa a 64px mantendo só ícones + tooltips.

## 14. Navbar / Topbar e Terminologia

A topbar do MINIMUS é **mínima**: título da página (`h1`), busca global (atalho `/`), e o sino de notificações. Sem breadcrumb decorativo, sem menus horizontais duplicando a sidebar.

### Glossário oficial (aplicando a regra "espaços de OS, verbos humanos")

| Conceito | Nome no produto | Notas |
|---|---|---|
| Dashboard | **Central de Comando** | na navegação, encurtado para **"Hoje"** — o nome do espaço completo aparece no `h1` da página: "Central de Comando" |
| Métricas/Analytics/Relatórios | **Inteligência** | |
| CRM | **Clientes** | |
| WhatsApp/Inbox | **Comunicação** | a fila em si chama-se "Conversas" no dia a dia |
| Marketing/Conteúdo/Página | **Crescimento** | substitui "Divulgar" do UX doc — mais OS, igualmente compreensível |
| Configurações | **Sistema** | |
| Automações/IA | **Assistente** | |

Proibidos em qualquer texto do produto: lead, pipeline (como palavra), funil, template, workflow, dashboard, ticket, campanha. O copy segue o UX doc: um dono de padaria entende cada palavra.

## 15. Tabs e Breadcrumb

- **Tabs:** estilo "segmented control" (pílula deslizante sobre trilho `gray-100`, ativa em branco + `shadow-xs`) para alternar visões de um mesmo dado; máximo 4 segmentos. Tabs sublinhadas tradicionais só em páginas de detalhe (ficha do cliente). Nunca tabs para navegação principal.
- **Breadcrumb:** quase inexistente por design — a navegação tem 2 níveis (regra de UX). No 2º nível, em vez de breadcrumb, um **botão de voltar com o nome da origem** ("← Clientes"). Breadcrumb de 3+ níveis é sintoma de arquitetura errada, não componente a estilizar.

## 16. Modal, Sheets e Camadas

- **Modal (desktop):** superfície `radius-xl`, `shadow-lg`, largura 480px (confirmações) ou 640px (formulários), overlay `gray-900` a 40% com blur sutil de 4px — o blur é o toque macOS que separa "janela do sistema" de "popup de site".
- Entrada: fade + escala de 0.97→1 em 160ms. Saída: 120ms. Fecha por Esc, clique fora e botão explícito.
- **Mobile: nunca modal centrado — sempre bottom sheet** (`radius-xl` no topo, alça de arrastar), o gesto que o usuário já conhece do próprio WhatsApp.
- Regra de uso: modal só para **decisão focada de um passo**. Fluxos de 2+ passos acontecem em página, não em modal empilhado. Modal sobre modal é proibido.

## 17. Alertas, Notificações e Toasts

- **Toast (feedback de ação):** canto inferior esquerdo (desktop) / acima da barra (mobile), superfície `gray-900` com texto branco, `radius-md`, 4s, com **"Desfazer"** quando aplicável — o par ação+desfazer definido no UX doc. Um por vez; o novo substitui o anterior.
- **Alerta inline (contexto):** faixa com fundo semântico suave + ícone + texto + ação. Sempre dentro do card/tela a que se refere, nunca banner global genérico.
- **Banner de sistema (raro):** apenas para o estado crítico definido no UX doc — "WhatsApp desconectado" — fixo no topo, `amber-50`, com botão de reconectar. É o único aviso que pode interromper qualquer tela, porque é o único que para o negócio do usuário.
- **Central de notificações (sino):** painel flutuante estilo dropdown; apenas eventos acionáveis (regra de UX), cada item com sua ação inline. Sem "marcar tudo como lido" cerimonial — resolver é o que limpa.

## 18. Tabelas, Filas e Listas

O MINIMUS quase não tem tabelas — tem **filas e listas de cards** (a linguagem do UX doc). Onde a densidade exigir tabela (Inteligência, listas grandes de clientes):

- Sem zebra. Linhas de 52px separadas por divisor `gray-100` de 1px; hover `gray-50`; cabeçalho `caption 500 gray-500` em caixa normal (nunca ALL CAPS pesado).
- Números à direita e tabulares; texto à esquerda; a primeira coluna é sempre **quem** (avatar + nome).
- Linha inteira clicável → abre a ficha. Ações em massa: barra flutuante que surge ao selecionar ("3 selecionados · Enviar mensagem"), em vez de coluna de checkboxes permanente.
- Paginação por "carregar mais" / rolagem — nunca numeração de páginas estilo admin.

### Fila de Comunicação (o componente mais usado do produto)
- Item de conversa: avatar do WhatsApp (40px, `radius-full`) + nome (`body 600`) + prévia da mensagem (`body-sm gray-500`, 1 linha) + tempo relativo + badge se aguardando.
- Os três estados da caixa (Aguardando você / Aguardando cliente / Resolvidas) são o segmented control do topo.
- Item selecionado: fundo `blue-50` + barra lateral `blue-700` de 2px.
- **A conversa aberta replica a familiaridade do WhatsApp** (balões, áudio, timestamps) mas na pele Quiet OS: balões neutros (`gray-100` recebidos, `blue-100` enviados), sem o verde do WhatsApp — reforçando que aqui é o sistema do dono, com superpoderes ao lado (painel de contexto do cliente).

## 19. Dados: Gráficos, Indicadores e o Painel de Estado

### Indicadores (stat tiles)
- Card padrão com: label `caption gray-500` → valor `metric` → variação (`caption` com seta, verde/vermelho **apenas aqui**, por serem sucesso/alerta reais) → microtendência opcional (sparkline `blue-700` de traço 1.5px).
- Sempre em linguagem de dono: "Tempo de resposta · 12 min · ↓ de 3h". O número é o herói; o gráfico é sussurro.

### Gráficos
- Paleta: `blue-700` como série principal, `blue-100`/neutros para comparação. **Máximo 2 séries por gráfico** — o nosso usuário não lê gráficos de 5 linhas, e o objetivo (UX doc) é uma verdade por vez.
- Linhas de 2px suavizadas, área com gradiente `blue-100`→transparente, grid horizontal apenas (`gray-100`, tracejado fino), sem bordas de eixo, sem legendas quando o título já diz o que é.
- Tooltip: superfície `gray-900`, texto branco, seguindo o cursor com suavização.
- Gráfico é sempre **ilustração de uma frase**, nunca objeto de análise: o insight em linguagem humana vem acima ("Terça é seu dia mais movimentado"), o gráfico embaixo apenas confirma.

### Painel de Estado (componente-assinatura da Central de Comando)
A faixa superior da Central de Comando — o "vital signs" do negócio:
- Uma linha horizontal com os 3 números do Pulso (UX doc) como indicadores compactos + a **insight-frase do dia** com o tratamento do Assistente (seção 20).
- Visualmente calmo: números grandes, muito espaço, zero caixas coloridas. O usuário deve conseguir ler o estado do negócio em 3 segundos, como olha a barra de menu do macOS.

## 20. Assistente IA (tratamento visual da inteligência)

A "inteligência" do MINIMUS precisa de uma assinatura visual própria — sutil, nunca gimmick:

- **Marcador único:** um glifo de spark (✦ estilizado, do set de ícones) + um **gradiente exclusivo** `blue-700 → #6E56CF` (o único gradiente e o único roxo permitidos no produto). Onde esse marcador aparece, foi a IA que trabalhou.
- Aplicações: borda-gradiente de 1px em sugestões de resposta, o glifo antes de toda insight-frase, botão "Criar com o Assistente".
- Superfície do Assistente (geração de conteúdo): painel `radius-xl`, `shadow-lg`, com o texto **surgindo em streaming** (regra anti-fricção nº 12 do UX doc — progresso vivo, nunca spinner mudo).
- **Proibido:** robôzinhos, avatares de IA, chat flutuante onipresente, brilhos animados constantes. A IA do MINIMUS é um mordomo, não um mascote.

## 21. Cards Inteligentes, Recomendações e Alertas de Negócio

O cartão de ação da Central de Comando (UX doc: "problema + botão que resolve"):

- Anatomia canônica: **ícone do contexto → frase-problema (`h3`, linguagem humana) → consequência/benefício (`body-sm gray-500`) → botão da ação (primário ou secundário conforme prioridade)**.
- No máximo 3 na tela, empilhados verticalmente; o primeiro (maior impacto) pode ganhar o marcador do Assistente se a recomendação for gerada por IA.
- Ao resolver: o card colapsa com fade + slide de 200ms e um check verde de 400ms — a micro-recompensa que constrói o ritual de "zerar a fila".
- Recomendações e alertas de negócio usam a mesma anatomia, mudando apenas o acento semântico (atenção = detalhe âmbar). **Um formato para tudo que pede ação**: aprendido uma vez, entendido para sempre.

## 22. Checklist Diário e Timeline

- **Checklist Diário (o ritual dos 10 minutos):** lista de itens de 48px com checkbox circular; ao concluir, o item risca suavemente e desce; ao zerar, o estado de celebração ("Tudo em dia! 6 clientes em 9 minutos") — tipografia `display`, sem confete, sem badges de gamificação. A recompensa premium é a calma, não a festa.
- **Timeline (ficha do cliente):** linha vertical única `gray-100` com nós de 8px codificados por tipo (conversa, compra, anotação — diferenciados por ícone, não por cor); cada evento é uma linha `body-sm` com timestamp relativo. Densa, silenciosa, cronológica — a "memória do negócio" (UX doc) tratada como um log elegante de sistema.

## 23. Kanban e Calendário

- **Kanban:** herdando a decisão do UX doc (fora da v1), o design system apenas **reserva** o padrão: colunas como áreas do canvas (fundo `gray-50`, título `h3` + contagem), cards padrão `radius-lg` arrastáveis com `shadow-md` durante o drag e rotação de 2°. Sem cores por coluna. Não construir antes da demanda validada.
- **Calendário (Área do Cliente/agendamentos):** grade mínima — dias `body`, hoje marcado com círculo `blue-700`, eventos como pills `blue-100` de 24px. Semana como visão padrão (dono de pequena empresa pensa em semanas, não meses). Zero grades pesadas de linhas pretas.

## 24. Estados de Sistema (Skeleton, Loading, Empty, Error)

### Skeleton Loading
- Blocos `gray-100` com shimmer sutil (gradiente animado, 1.4s), `radius` idêntico ao componente que substituem, **na mesma quantidade e posição do conteúdo real** — a tela não pode "pular" quando o dado chega.
- Skeleton apenas em cargas > 300ms; abaixo disso, nada (flash de skeleton é pior que espera).

### Loading States
- Ações locais: spinner de 16px no próprio elemento (botão, card). **Nunca overlay de tela inteira com spinner gigante** — isso é admin de 2015. O sistema permanece vivo enquanto trabalha.
- Otimismo por padrão: mensagens enviadas, checks marcados e etiquetas aplicadas aparecem imediatamente e reconciliam depois (com toast de erro + desfazer se falhar).

### Empty States
- Raros por arquitetura (a implantação pré-popula tudo — UX doc), mas onde existirem: ilustração mínima em traço `gray-200` (do mesmo peso da iconografia, nunca ilustração fofa 3D) + uma frase + **a ação que preenche o vazio** como botão primário. Empty state é um convite, não um pedido de desculpas.
- Estados de "tudo resolvido" (fila zerada) não são empty states — são **estados de vitória**, com a celebração calma da seção 22.

### Error States
- Sempre a tríade do UX doc: o que houve (português de gente) + o que fazer + acesso a humano. Ícone semântico, sem ilustrações de "robô quebrado".
- Erros de campo: inline no campo. Erros de ação: toast. Erros de sistema: alerta inline na área afetada. **Nunca página inteira de erro para falha parcial** — o resto do OS continua funcionando.

---

# PARTE III — LINGUAGEM TRANSVERSAL

## 25. Iconografia

- **Set único: Lucide** — traço 1.5px, cantos arredondados, geometria consistente. Proibido misturar sets, pesos ou estilos (um ícone preenchido no meio de outlines denuncia produto-colcha-de-retalhos imediatamente).
- Tamanhos: **16px** (inline, dropdowns), **18px** (navegação), **20px** (cards de ação). Três tamanhos, nunca escalas arbitrárias.
- Cor: herdam o estado do texto (`gray-500` → `gray-700` no hover → `blue-700` quando ativos). Ícone nunca é a cor sozinho: sempre acompanhado de label, exceto ações universais (fechar, buscar) — regra de acessibilidade e de respeito ao usuário leigo.
- Ícones ilustrativos grandes (empty states): mesmo set ampliado com traço proporcional, `gray-200`.

## 26. Movimento e Animações

### Princípio: o movimento explica, nunca performa

| Token | Duração | Curva | Uso |
|---|---|---|---|
| `instant` | 80ms | ease-out | hover, pressed, fechamentos |
| `fast` | 120–160ms | ease-out | dropdowns, tabs, seleções, modais |
| `smooth` | 200–240ms | cubic-bezier(0.32, 0.72, 0, 1) | cards resolvendo, sheets, painéis |
| `entrance` | 300ms | idem, com stagger de 30ms | carga inicial da Central de Comando |

- **Nada acima de 300ms, nunca.** Velocidade percebida é uma feature (UX doc: "Hoje" em < 2s).
- Movimento sempre com origem física: dropdown nasce da âncora, sheet sobe de baixo, card resolvido sai na direção do "feito". Elementos não se teletransportam.
- Um stagger sutil na primeira carga do dia (cards da Central entrando em cascata de 30ms) é a única "cena" do produto — o momento de "o sistema acordou para você". Depois disso, silêncio.
- Respeitar `prefers-reduced-motion` integralmente (fades apenas).

## 27. Voz e Microcopy (a pele verbal do OS)

- **Tom:** um gerente competente e calmo. Direto, caloroso, zero exclamações em série, zero "Ops!" infantilizado.
- Sempre segunda pessoa e verbos do dono: "Responda a Maria", "Seu post está no ar".
- Números sempre contextualizados em valor (UX doc, seção 12): nunca "23 mensagens processadas", sempre "23 clientes atendidos".
- O Assistente fala como consultor, não como ferramenta: "A Maria costuma comprar toda primeira semana — quer lembrá-la?" e nunca "Alerta de inatividade de contato detectado".

## 28. Governança do Design System

- **Tokens antes de pixels:** toda decisão deste documento vira token nomeado semanticamente (`surface`, `canvas`, `action-primary`, `radius-card`...). Nenhum valor cru em nenhuma tela.
- **Regra do componente único:** se uma tela precisa de um componente que não está aqui, primeiro tenta-se compor com os existentes; se for realmente novo, entra no sistema **antes** de entrar na tela. Não existem componentes locais.
- **O teste final de toda tela nova (checklist de revisão):**
  1. Parece uma janela de OS sobre a mesa, ou uma página de admin?
  2. Existe exatamente 1 ação primária azul?
  3. A tela respira (regra do dobro respeitada, zero divisores desnecessários)?
  4. Todos os textos passam no teste da família do dono?
  5. Algum elemento existe só por decoração? → remove.

---

## Síntese: as 10 leis visuais do Quiet OS

1. **Superfícies brancas flutuando sobre `gray-50`** — janelas sobre mesa, nunca página dividida por linhas.
2. **Azul em no máximo 5% da tela.** Onde há azul, há a ação.
3. **Verde = sucesso, âmbar = atenção, vermelho = erro. Sempre e somente.**
4. **Separar com espaço, não com bordas.** A regra do dobro cria a hierarquia.
5. **Uma família tipográfica, hierarquia por peso e cor, números tabulares.**
6. **Raios generosos e aninhados; sombras que só crescem em resposta ao usuário.**
7. **Um set de ícones, um traço, três tamanhos.**
8. **Movimento ≤ 300ms, com origem física, explicando — nunca performando.**
9. **A IA tem uma assinatura (spark + único gradiente) e a discrição de um mordomo.**
10. **Espaços com nomes de OS, ações com verbos do dono.** Se a família do dono não entende, refaz.
