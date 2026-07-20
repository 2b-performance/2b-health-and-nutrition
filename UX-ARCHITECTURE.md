# MINIMUS — Arquitetura de Experiência do Usuário

**Documento:** UX Architecture v1.0
**Autor:** Principal UX Architect
**Escopo:** Experiência completa do usuário — da landing page ao uso diário. Sem telas, sem componentes, sem cores. Apenas experiência.

---

## O Princípio Zero (leia antes de tudo)

O usuário do MINIMUS não compra software. Ele compra **tempo de volta** e **dinheiro entrando**.

Cada decisão deste documento foi testada contra uma única pergunta:

> **"Isso ajuda o empresário a vender mais ou economizar tempo nos próximos 60 segundos?"**

Se a resposta é "não", a funcionalidade sai do caminho principal — vira secundária, automática ou é eliminada.

Três verdades que governam tudo:

1. **O usuário nunca vai ler um tutorial.** A interface é o tutorial.
2. **O usuário abandona no primeiro momento de confusão.** Não existe "ele vai descobrir depois".
3. **A implantação assistida é nossa maior vantagem de UX.** O sistema já chega funcionando. O onboarding não é "configuração" — é **revelação de valor**.

---

## 1. Jornada Completa

A jornada é dividida em 5 momentos emocionais. Cada momento tem um objetivo emocional, não funcional.

| Momento | Quando | Emoção-alvo | O que o usuário deve pensar |
|---|---|---|---|
| **Descoberta** | Landing page | Identificação | "Isso é exatamente o meu problema." |
| **Compromisso** | Cadastro | Segurança | "Foi mais fácil do que eu esperava." |
| **Revelação** | Onboarding + implantação | Surpresa | "Já está funcionando? Sério?" |
| **Prova** | Primeira semana | Convicção | "Isso me fez ganhar dinheiro/tempo." |
| **Hábito** | Uso diário | Dependência positiva | "Eu abro o MINIMUS antes do WhatsApp." |

### O mapa da jornada, em detalhe

**Dia 0 — Descoberta e cadastro (menos de 3 minutos)**
O empresário chega pela landing, entende a proposta em uma frase, e se cadastra com o mínimo absoluto de dados. Sem cartão de crédito para começar (o serviço de implantação já é o compromisso comercial — não precisamos de fricção dupla).

**Dia 0 — Onboarding (menos de 5 minutos)**
Quatro perguntas de negócio (não de tecnologia). Ao final, o sistema já mostra algo **vivo e personalizado** — não um estado vazio.

**Dia 0 a 2 — Implantação assistida (invisível para o usuário)**
Enquanto nosso time conecta WhatsApp, importa contatos e configura o negócio, o usuário vê uma **linha do tempo de progresso** dentro do produto: "✓ Seus contatos foram importados (247 clientes)". Cada item concluído é uma notificação de valor, não uma tarefa dele.

**Dia 1 a 7 — Prova de valor**
O sistema empurra ativamente 3 vitórias rápidas (detalhadas na seção 12): responder um cliente mais rápido, reativar um cliente sumido, publicar um conteúdo. Uma vitória por dia é suficiente. Três vitórias na primeira semana = retenção.

**Dia 8 em diante — Uso diário**
O produto vira rotina matinal: abrir, ver "o que precisa da minha atenção hoje", resolver em 10 minutos, fechar. O MINIMUS não quer o usuário dentro dele o dia todo — quer ser **o primeiro app aberto de manhã e o mais confiável**.

### Decisão questionada #1
> "Deveríamos ter um trial self-service completo?"

**Não nos primeiros meses.** O produto é vendido com implantação. Um trial vazio (sem WhatsApp conectado, sem contatos) mostra o produto no seu pior estado. A jornada correta é: cadastro → onboarding curto → implantação assistida → produto já cheio de dados do próprio negócio. O primeiro contato real do usuário com o sistema deve ser com **os dados dele dentro**, nunca com telas vazias.

---

## 2. Fluxo do Usuário

```
Landing
  ↓  (1 clique — CTA único)
Cadastro
  ↓  (nome, WhatsApp, e-mail, senha — 4 campos, 60 segundos)
Onboarding
  ↓  (4 perguntas de negócio — 3 minutos)
Dashboard "Dia Zero"
  ↓  (já personalizado + linha do tempo da implantação)
Primeira ação
  ↓  (guiada: responder 1 mensagem OU gerar 1 conteúdo — < 2 min)
Primeira percepção de valor
  ↓  (resultado concreto e mensurável, mostrado explicitamente)
Uso recorrente
     (rotina diária de 10 minutos ancorada em "Hoje")
```

### Regras do fluxo

- **Nenhuma etapa pode ter mais de um objetivo.** O cadastro cadastra. O onboarding personaliza. O dashboard orienta. Misturar objetivos numa etapa é a origem de 80% da confusão em SaaS.
- **Toda etapa mostra progresso.** "Passo 2 de 4" sempre visível. Cérebro ocupado precisa saber quanto falta.
- **Toda etapa pode ser retomada.** Se o usuário fechar o navegador no meio do onboarding, ao voltar ele continua exatamente de onde parou — nunca do zero.
- **A "primeira ação" não é escolhida pelo usuário — é sugerida pelo sistema** com base na resposta do onboarding sobre a maior dor dele. Usuário ocupado diante de um menu aberto não age; diante de um botão único, age.

### Decisão questionada #2
> "O fluxo original coloca 'Primeira ação' depois do Dashboard. O usuário vai encontrar essa ação sozinho?"

**Não vai.** Dashboard genérico + usuário ocupado = abandono. Por isso o Dashboard do Dia Zero **é** o convite para a primeira ação: um único cartão em destaque dizendo, por exemplo, *"Você tem 3 clientes esperando resposta. Responda o primeiro em 30 segundos →"*. O dashboard dos primeiros dias é um **guia**, não um painel. Ele só vira painel quando o usuário já formou o hábito.

---

## 3. Onboarding

### Filosofia
O onboarding **não configura o sistema** — quem configura é o time de implantação. O onboarding tem três objetivos, nessa ordem:

1. **Personalizar a experiência** (o que o usuário vê primeiro).
2. **Capturar a dor principal** (para escolher a primeira vitória).
3. **Criar expectativa positiva** (mostrar que o sistema entendeu o negócio dele).

### As 4 perguntas (e por que só 4)

Cada pergunta a mais custa conversão. Só perguntamos o que **muda a experiência imediatamente**. Tudo que não muda a experiência agora, o time de implantação coleta depois, por WhatsApp, com conversa humana.

**Pergunta 1 — "Qual é o seu negócio?"**
Segmento + nome da empresa. Opções visuais por categoria (loja, serviço, saúde, beleza, alimentação, outro).
*Por que:* define vocabulário ("clientes" vs "pacientes" vs "alunos"), modelos de conteúdo IA e exemplos em todo o produto. Um dentista que vê "pacientes" em vez de "leads" sente que o produto foi feito para ele.

**Pergunta 2 — "O que mais te toma tempo hoje?"**
Opções: responder clientes no WhatsApp / lembrar de dar retorno / criar posts e divulgação / organizar cadastro de clientes.
*Por que:* define a **primeira ação** e a ordem dos módulos no menu. A maior dor vira o primeiro botão.

**Pergunta 3 — "Quantas pessoas atendem clientes com você?"**
Só eu / 2 a 5 / mais de 5.
*Por que:* define se mostramos recursos de equipe ou os escondemos completamente. Mostrar "atribuir conversa para colaborador" a quem trabalha sozinho é ruído puro.

**Pergunta 4 — "Como seus clientes chegam até você hoje?"**
WhatsApp / Instagram / indicação / loja física / anúncios.
*Por que:* prioriza integrações na implantação e calibra as sugestões de conteúdo e captação.

### Formato
- Uma pergunta por vez, tela cheia, resposta por toque (nunca digitação livre, exceto o nome da empresa).
- Barra de progresso visível.
- Botão "pular" existe, mas discreto — quem pula recebe a experiência padrão do segmento "outro".
- **Tempo total: menos de 3 minutos.**

### O momento mágico do fim do onboarding
Ao responder a 4ª pergunta, o sistema não mostra "Cadastro concluído". Ele mostra o **Dashboard Dia Zero já personalizado**: o nome da empresa no topo, o vocabulário do segmento aplicado, um exemplo de conteúdo IA já gerado para o negócio dele ("Veja um post que criamos para a [Padaria do João]"), e a linha do tempo da implantação. O usuário precisa sentir que **o sistema trabalhou enquanto ele respondia**.

### Como evitar abandono
- **Sem cartão de crédito no fluxo.**
- **Sem convite de equipe no onboarding** (isso é fricção — fica para depois da primeira vitória).
- **Sem conexão de WhatsApp feita pelo usuário** — quem conecta é a implantação. Pedir para um leigo escanear QR code e configurar API no primeiro dia é o maior ponto de abandono possível; nós o eliminamos por completo.
- **Retomada automática** de onde parou.
- Se o usuário abandonar mesmo assim, o time de implantação recebe alerta e faz contato humano por WhatsApp em até 1 hora. Nos primeiros meses, **gente resgata onboarding, não e-mail automático**.

---

## 4. Dashboard

### Filosofia
O dashboard responde **uma única pergunta**: *"O que precisa da minha atenção agora?"*

Não é um painel de BI. Não é um relatório. É a **mesa de trabalho arrumada** do empresário. Métricas históricas existem, mas moram em "Relatórios" — não na primeira tela.

### Hierarquia visual (do topo para baixo)

**Nível 1 — "Hoje" (o que exige ação)**
A área nobre da tela. No máximo 3 cartões de ação, ordenados por impacto em dinheiro:
1. *"5 clientes aguardando resposta"* → um toque abre a primeira conversa.
2. *"2 clientes sumidos há 30+ dias que compravam todo mês"* → um toque abre mensagem de reativação pronta.
3. *"Você não publica há 4 dias"* → um toque gera o conteúdo.

Cada cartão tem **o problema + o botão que resolve**. Nunca um número sem ação ao lado.

**Nível 2 — "Pulso do negócio" (3 números, não mais)**
- Conversas respondidas hoje (e tempo médio de resposta).
- Novos contatos da semana.
- Clientes reativados no mês.

Três números escolhidos porque são os três que o MINIMUS **melhora diretamente** — cada olhada no dashboard reforça que o produto está funcionando.

**Nível 3 — "Vitórias" (reforço emocional)**
Uma linha discreta de conquistas acumuladas: *"Com o MINIMUS: 34 clientes respondidos, 6 reativados, 12 conteúdos publicados este mês."* É o argumento de renovação da assinatura, apresentado todos os dias, sem parecer propaganda.

### Como gerar o efeito "Uau"

O "uau" não vem de gráficos bonitos. Vem de **o sistema saber coisas que o usuário não sabia sobre o próprio negócio**:

- *"A Maria compra toda primeira semana do mês e ainda não comprou este mês."*
- *"Seu tempo médio de resposta caiu de 3 horas para 12 minutos."*
- *"Terça é seu dia mais movimentado no WhatsApp."*

Uma **insight-frase por dia**, em linguagem humana, no topo do dashboard. Uma, não cinco. Insight raro é valioso; insight em pilha é ignorado.

### Decisão questionada #3
> "Não deveríamos mostrar faturamento no dashboard?"

**Não no início.** Faturamento depende de dado que o usuário precisa alimentar (vendas registradas). Dashboard que depende de disciplina do usuário mostra zero — e zero destrói a percepção de valor. Os três números do Pulso são gerados **automaticamente** pelo uso do WhatsApp e do CRM. Regra de ouro: *no dashboard, só entra número que o sistema consegue produzir sozinho.*

---

## 5. CRM

### Filosofia
O empresário não sabe o que é CRM e não deve precisar saber. Para ele, o módulo se chama **"Clientes"**. E a promessa é uma: **nunca mais esquecer um cliente**.

### Princípio central: o CRM se alimenta sozinho
A causa nº 1 de morte de CRM em pequena empresa é o cadastro manual. Então:

- **Todo contato que manda mensagem no WhatsApp vira cliente automaticamente.** Nome e telefone capturados da conversa. Zero digitação.
- A implantação importa a base histórica (agenda do celular, planilha, sistema antigo).
- O usuário só complementa o que quiser, quando quiser — e o sistema pede **um dado por vez, no contexto certo** ("Essa conversa parece uma venda. Quer registrar o valor? [R$ ___] [Agora não]").

### A ficha do cliente responde 3 perguntas em 5 segundos
1. **Quem é?** — nome, foto do WhatsApp, desde quando é cliente.
2. **O que já aconteceu?** — linha do tempo única: conversas, compras, anotações. Uma linha do tempo, não abas.
3. **O que fazer agora?** — próxima ação sugerida ("faz 40 dias que não compra — enviar mensagem?").

### Organização: etiquetas simples, não pipeline
Funis de vendas com estágios arrastáveis são mentais demais para este usuário. Em vez disso, **3 estados automáticos** que o sistema atribui sozinho:

- 🟢 **Ativo** — comprou/interagiu recentemente.
- 🟡 **Esfriando** — sem interação há X dias (X calibrado por segmento na implantação).
- 🔴 **Sumido** — inativo há muito tempo.

Mais etiquetas livres opcionais ("VIP", "Atacado") para quem quiser. O valor está nos estados automáticos: eles alimentam os cartões de ação do dashboard (*"2 clientes esfriando"*) sem o usuário mover nada.

### Ações em massa com um toque
- "Enviar mensagem para todos os Sumidos" → abre o gerador de mensagem IA já com o contexto → revisão → envio (com intervalo automático anti-bloqueio).
- Este é provavelmente **o recurso que mais gera dinheiro visível** no produto inteiro. Ele merece destaque permanente.

### Decisão questionada #4
> "E funil de vendas / kanban de oportunidades?"

**Fora da v1.** O usuário-alvo não gerencia pipeline; ele gerencia relacionamentos. Se um segmento específico pedir (ex.: imobiliárias), entra depois como visão opcional. Construir kanban agora é construir para o usuário errado.

---

## 6. WhatsApp

### Filosofia
O WhatsApp **é** o negócio deste usuário. Portanto o MINIMUS não "integra com WhatsApp" — o MINIMUS é **o WhatsApp dele, com superpoderes**. Este é o módulo que define se o produto vive ou morre.

### Princípios de integração

**1. Paridade primeiro, poder depois.**
A caixa de entrada do MINIMUS precisa fazer tudo que o WhatsApp Web faz (áudio, foto, resposta rápida) com a mesma fluidez, **antes** de adicionar qualquer superpoder. Se responder pelo MINIMUS for 10% pior que pelo WhatsApp Web, o usuário volta para o WhatsApp Web e o produto inteiro desmorona — porque é a caixa de entrada que alimenta o CRM, o dashboard e os insights.

**2. Contexto colado na conversa.**
Ao abrir uma conversa, um painel lateral discreto mostra a ficha do cliente: quem é, última compra, etiquetas, anotações. **O CRM aparece dentro do WhatsApp, não o contrário.** O usuário nunca "vai até o CRM" — o CRM vem até ele, no momento em que atende.

**3. Superpoderes no ponto de uso:**
- **Respostas prontas** personalizadas por segmento (implantação já as cria).
- **IA sugere resposta** com base na conversa — o usuário toca para usar, edita se quiser. Sempre revisável, nunca enviada sozinha (confiança primeiro; automação total é opcional e vem depois).
- **Lembrete de retorno:** um toque em "me lembre de responder amanhã" → vira cartão no "Hoje" do dashboard. Simples assim, e resolve a dor nº 1: esquecer cliente.
- **Caixa organizada:** conversas separadas em "Aguardando você" / "Aguardando cliente" / "Resolvidas". A pilha caótica do WhatsApp vira fila de trabalho com fim visível — e a sensação de "fila zerada" é um gatilho poderoso de recompensa diária.

**4. O celular continua funcionando.**
O usuário pode continuar respondendo pelo app nativo do WhatsApp quando quiser — o MINIMUS captura tudo mesmo assim (conexão via API mantém o histórico sincronizado). Nunca competimos com o hábito; nós o envolvemos. O uso migra para o MINIMUS naturalmente, porque lá tem contexto e organização.

### Decisão questionada #5
> "Chatbot com fluxos de automação no lançamento?"

**Não.** Construtores de fluxo são a coisa mais complexa que existe em UX de atendimento, e nosso usuário não vai montar fluxo nenhum. O que entra na v1: **mensagem automática de ausência** e **saudação inicial** — configuradas pela implantação, com texto que o usuário pode editar. Automação conversacional completa só quando houver templates prontos por segmento que a implantação instala sem o usuário tocar em nada.

---

## 7. Conteúdo IA

### Meta explícita: da intenção ao conteúdo pronto em menos de 60 segundos

O usuário não quer "usar IA". Ele quer **o post pronto**. Todo o design parte do fim.

### O fluxo de 3 toques

**Toque 1 — "Criar conteúdo"** (botão sempre acessível).
O sistema **não abre um campo de texto vazio** — prompt em branco é a maior fricção de IA que existe. Ele abre **sugestões prontas baseadas no negócio e no calendário**: *"Post sobre o Dia dos Pais (é em 3 semanas)"*, *"Promoção de meio de semana"*, *"Dica para seus clientes"*, *"Datas especiais do seu ramo"*. E, discreta, a opção "quero outra coisa" com campo livre.

**Toque 2 — Escolher a sugestão.**
A IA gera **3 variações completas** (não uma — escolher entre prontos é mais fácil que avaliar um só). Legenda + hashtags + sugestão de imagem. Tom de voz já calibrado pelo segmento definido no onboarding.

**Toque 3 — "Usar este".**
Copiar pronto para colar no Instagram/WhatsApp, ou enviar direto para o Status/lista de transmissão do WhatsApp (que já está conectado — sinergia entre módulos).

Edição é possível a qualquer momento, mas **nunca obrigatória**. Regeneração é um toque ("me dê outras opções").

### Multiplicadores de valor
- **Calendário de datas do segmento**, carregado na implantação: o sistema lembra o usuário *antes* das datas que vendem ("Dia do Cliente é semana que vem — quer preparar algo?"). O usuário sente que tem um profissional de marketing de plantão.
- **Reaproveitamento:** todo conteúdo gerado fica salvo; "gerar parecido com este que funcionou" é um toque.

### Decisão questionada #6
> "Geração de imagem por IA no lançamento?"

**Ainda não como promessa central.** Imagem de IA genérica em negócio local soa falsa e pode constranger. V1: legendas excelentes + sugestão do que fotografar ("tire uma foto do prato em fundo claro"). A foto real do negócio com legenda profissional performa melhor que arte genérica — e é isso que a gente diz ao usuário, virando limitação em conselho de especialista.

---

## 8. Landing Pages

### Reenquadrando o problema
O empresário não quer "criar uma landing page". Ele quer **um lugar para mandar o cliente clicar**. Chamamos o módulo de **"Minha Página"** — no singular, porque a v1 entrega **uma página por negócio**, não um construtor de páginas.

### Como simplificar a criação: eliminando-a
- A implantação monta a primeira versão da página usando os dados do onboarding + WhatsApp: nome, ramo, fotos, serviços, botão gigante de "Chamar no WhatsApp".
- O usuário recebe a página **pronta**: *"Sua página está no ar: minimus.app/padariadojoao"*. Primeiro contato dele com o módulo já é uma vitória, não uma tarefa.

### Edição sem construtor
Nada de arrastar blocos, colunas, espaçamentos. A edição é **preencher, não desenhar**:
- Seções fixas e ordenadas (capa, sobre, serviços/produtos, depoimentos, contato).
- Cada seção liga/desliga e tem seus campos ("troque a foto", "edite o texto").
- A IA reescreve qualquer texto a um toque ("melhorar este texto").
- **Pré-visualização sempre em formato de celular**, porque 95% dos visitantes virão de lá.

### A página existe para gerar conversa
Todo clique no botão do WhatsApp da página cai na caixa de entrada do MINIMUS **etiquetado com a origem** ("veio da sua página"). O dashboard mostra: *"Sua página gerou 8 conversas esta semana."* A página deixa de ser um cartão de visita estático e vira uma **máquina mensurável de gerar cliente** — valor que o usuário vê em número.

### Decisão questionada #7
> "Templates variados? Múltiplas páginas? Domínio próprio?"

Templates: **um por segmento**, escolhido pela implantação — escolha de template é paralisia, não liberdade. Múltiplas páginas (promoções, eventos): v2, quando a primeira página já provou valor. Domínio próprio: oferecido na implantação para quem já tem; nunca exigido.

---

## 9. Área do Cliente

*(Interpretação: portal onde o cliente final do empresário interage com o negócio. Também cobre a "área da conta" do próprio empresário ao final.)*

### O que realmente importa (e o que não)

O cliente final não quer "portal". Ele quer resolver **uma coisa específica** no menor tempo possível. A área do cliente da v1 é **minimalista e sem login com senha** — acesso por link mágico enviado no WhatsApp (o cliente já está lá; criar senha para portal de padaria é absurdo).

**Entra na v1 (por segmento, conforme fizer sentido):**
1. **Agendamento/reagendamento** — para segmentos de serviço, a killer feature. Cliente marca sozinho, empresário para de fazer ping-pong de horário no WhatsApp.
2. **Status do pedido/serviço** — "seu pedido está pronto", "seu orçamento foi aprovado". Reduz a pergunta que mais entope o WhatsApp: "e aí, já ficou pronto?".
3. **Histórico e recompra** — "pedir de novo" em um toque.

**Fica fora:** boletos e faturas complexas, tickets de suporte, base de conhecimento, feed de notícias. Tudo isso é projeção de SaaS enterprise num boteco — ruído.

### Princípio de design
Cada recurso da área do cliente existe para **remover mensagens repetitivas do WhatsApp do empresário**. Esse é o critério de entrada: se o recurso não elimina uma pergunta frequente, não entra. E cada uso é contabilizado para o empresário: *"Sua área do cliente respondeu 23 perguntas por você este mês."* — mais uma linha de valor mensurável.

### A conta do próprio empresário
Mínima e honesta: dados da empresa, usuários da equipe, assinatura e fatura em linguagem clara, e o botão de suporte humano **sempre visível** (nos primeiros meses, suporte via WhatsApp com o time de implantação — usamos o canal que ele já ama).

---

## 10. Navegação

### Estrutura: sidebar mínima no desktop, barra inferior no mobile

**Por quê sidebar (desktop):** o produto tem módulos de trabalho contínuo (caixa de entrada, clientes) que exigem troca rápida e persistente de contexto. Topbar esconde, sidebar ancora. Mas a sidebar é **curta** — se precisar rolar, falhou.

### Os 5 itens (e nada mais)

1. **Hoje** *(o dashboard — renomeado)* — "o que precisa de mim agora".
2. **Conversas** — a caixa de entrada do WhatsApp.
3. **Clientes** — o CRM.
4. **Divulgar** — Conteúdo IA + Minha Página, unificados.
5. **Mais** — área do cliente (config.), relatórios, equipe, conta, ajuda.

### Decisões de nomenclatura
Nenhum nome de menu usa jargão de software. Não existe "CRM", "Dashboard", "Campanhas", "Templates", "Integrações" na navegação. Os nomes são **verbos e substantivos da vida do empresário**: Hoje, Conversas, Clientes, Divulgar. O teste: *a esposa ou o filho do dono precisam entender o menu sem explicação.*

### Agrupamento "Divulgar"
Conteúdo IA e Minha Página são o mesmo trabalho na cabeça do usuário: *"fazer o negócio aparecer"*. Separá-los em dois itens de menu cria uma decisão desnecessária ("onde fica aquilo de post?"). Juntos, formam um hub com duas ações grandes: "Criar conteúdo" e "Minha página".

### Regras de navegação
- **Ordem calibrada pelo onboarding:** a dor principal declarada (pergunta 2) define qual item vem logo após "Hoje".
- **Badge numérico apenas em Conversas** (mensagens aguardando). Badges em todo lugar viram ruído e ansiedade.
- **Ação primária global:** um botão de criação rápida sempre acessível (nova conversa, novo cliente, novo conteúdo) — três opções, não dez.
- **Profundidade máxima: 2 níveis.** Menu → tela → detalhe. Se algo precisa de um terceiro nível, o design está errado.
- Recursos não habilitados para o perfil (ex.: equipe para quem trabalha sozinho) **não aparecem desabilitados — não aparecem**.

---

## 11. Retenção

### O motor do hábito: gatilho → ação → recompensa → investimento

**Gatilho (por que abrir o MINIMUS hoje?)**
- **O resumo da manhã:** todo dia às 8h (horário calibrável), uma única mensagem no WhatsApp do dono: *"Bom dia, João! Você tem 4 conversas aguardando e a Maria (cliente VIP) está há 35 dias sem comprar. Resolver agora →"*. Um link, direto para a fila. Usamos o app que ele já abre 50 vezes por dia como porta de entrada do nosso.
- **Notificação apenas do que exige ação.** Nunca notificamos "novidades do produto" ou métricas vazias. Cada notificação irrelevante compra desativação — e notificação desativada é churn iniciado.

**Ação (o ritual dos 10 minutos)**
A tela "Hoje" é projetada para ser **completável**: fila finita, cartões que somem quando resolvidos. Produto com "fim" diário cria ritual; produto infinito cria culpa e evitação.

**Recompensa (a sensação de dia ganho)**
Ao zerar a fila: *"Tudo em dia! Você respondeu 6 clientes em 9 minutos."* Reconhecimento imediato, concreto, em minutos e clientes — as moedas do nosso usuário.

**Investimento (cada dia usado torna o produto mais valioso)**
Cada conversa respondida enriquece o CRM. Cada conteúdo gerado alimenta o histórico. Cada etiqueta melhora os insights. O usuário não percebe, mas está construindo um ativo — e a régua de insights devolve isso: quanto mais usa, mais inteligente o sistema fica sobre o negócio dele. **Trocar de ferramenta passa a significar perder a memória do próprio negócio.**

### Ritmos semanais e mensais
- **Retrospectiva de sexta:** *"Sua semana: 43 clientes atendidos, tempo de resposta 15 min, 2 clientes reativados."* Compartilhável — dono de pequena empresa adora mostrar que está organizado.
- **Fechamento do mês:** a versão mensal, conectada ao valor da assinatura (ver seção 12).

### Anti-churn ativo
- Sinal de risco: 3 dias sem abrir o produto → alerta interno → contato humano do time de implantação ("Oi João, vi que a semana tá corrida — quer que eu deixe os clientes sumidos já com mensagem pronta pra você só apertar enviar?"). Nos primeiros meses, **retenção é gente + produto**, não só produto.

---

## 12. Percepção de Valor

### O princípio: valor não percebido é valor que não existe
O MINIMUS pode reativar clientes e economizar horas — mas se o usuário não **ver** isso escrito em números, na primeira semana, ele cancela no primeiro aperto de caixa. Percepção de valor é uma feature, e é desenhada como tal.

### O plano das 3 vitórias da primeira semana

**Vitória 1 (dia 1) — Velocidade.** Primeira mensagem respondida pelo MINIMUS com resposta pronta/IA. O sistema registra e mostra: *"Respondido em 40 segundos."*

**Vitória 2 (dia 2–3) — Dinheiro recuperado.** O sistema identifica clientes sumidos na base importada e propõe a mensagem de reativação pronta. Quando um cliente responde: *"🎉 A Maria voltou a conversar com você — ela estava sumida há 47 dias."* **Esta é a vitória mais importante da jornada inteira**: dinheiro que não existiria sem o MINIMUS.

**Vitória 3 (dia 4–7) — Presença.** Primeiro conteúdo gerado e publicado. *"Seu post está no ar. Criado em 50 segundos."*

O time de implantação acompanha as três vitórias como **checklist interno de ativação** — cliente implantado sem as 3 vitórias na primeira semana é cliente em risco, e o time age.

### O placar de valor permanente
Uma linha sempre presente (dashboard + resumo mensal), acumulando em linguagem de dono:

> *"Este mês o MINIMUS: respondeu com você 214 conversas · reativou 5 clientes · economizou ~6 horas · publicou 9 conteúdos."*

E no fechamento do mês, a conta explícita: *"5 clientes reativados. Se cada um vale R$ 80/mês, o MINIMUS se pagou 4 vezes."* — o argumento de renovação entregue pronto, todo mês, sem o usuário pedir.

### Regra para todo o produto
**Toda ação relevante devolve um número de impacto.** Enviou mensagens em massa → "23 enviadas, 7 responderam". Página no ar → "8 conversas geradas". Nada acontece silenciosamente. O produto narra o próprio valor, sempre em clientes, reais e minutos — nunca em métricas de software.

---

## 13. UX Anti-Fricção

Inventário dos pontos de confusão previsíveis e sua eliminação:

| # | Fonte de confusão | Como eliminamos |
|---|---|---|
| 1 | **Estados vazios** (CRM sem clientes, inbox sem conversas) | Implantação garante dados reais antes do primeiro uso significativo. Onde um vazio for inevitável, ele mostra **a ação que o preenche** ("Importar contatos") — nunca uma tela em branco. |
| 2 | **Jargão de software** ("lead", "pipeline", "template", "workflow", "integração") | Banido do produto. Glossário de substituição mantido pelo time: lead→interessado, disparo→enviar para vários, template→modelo pronto. |
| 3 | **Conexão do WhatsApp** (QR code, sessão caindo) | Conexão feita pela implantação. Se a sessão cair: aviso em linguagem humana ("Seu WhatsApp desconectou — toque para reconectar em 30 segundos") + alerta automático ao nosso suporte, que age proativamente. Falha silenciosa aqui é o pior bug possível do produto. |
| 4 | **Medo de errar** ("se eu tocar aqui, estraga?") | Toda ação destrutiva tem desfazer (não confirmação — confirmações são ignoradas; desfazer é confiança). Mensagens em massa têm prévia obrigatória com contagem ("Enviar para 43 clientes?"). Nada irreversível a um toque. |
| 5 | **Excesso de opções na primeira semana** | Revelação progressiva: o produto começa com o essencial do perfil do usuário; recursos avançados aparecem contextualmente depois de dominado o básico ("Você já usa respostas prontas — quer que eu sugira respostas automaticamente?"). |
| 6 | **Configurações** | Quase não existem para o usuário. Padrões inteligentes por segmento, definidos na implantação. Cada configuração exposta é uma decisão que empurramos para o usuário — empurramos o mínimo. |
| 7 | **Erros técnicos** ("Erro 500", "falha na requisição") | Toda mensagem de erro diz: o que houve, em português de gente + o que fazer + botão de falar com humano. Erro sem saída é abandono. |
| 8 | **Onde estou / onde clico?** | Uma ação primária por tela, sempre óbvia. Se numa tela houver duas ações gritando, o design volta para a prancheta. |
| 9 | **Sincronização celular × sistema** ("respondi pelo celular, e agora?") | Paridade total e transparente: tudo que acontece no app nativo aparece no MINIMUS em segundos, e vice-versa. O usuário nunca precisa pensar "onde" respondeu. |
| 10 | **Cobrança e planos** | Fatura em linguagem clara, sem tabela de features com asteriscos. Um plano nos primeiros meses. Upsell por conversa humana, não por paywall surpresa no meio de uma tarefa. |
| 11 | **Formulários** | Regra global: máx. 4 campos por tela; tudo que puder ser pré-preenchido, será; digitação livre só quando inevitável. |
| 12 | **Tempo de espera da IA** | Geração mostra progresso vivo (o texto aparecendo) — nunca spinner mudo. Espera com movimento parece metade do tempo. |

---

## 14. Mobile

### Premissa: mobile não é adaptação — é o cenário principal
O empresário vive no balcão, no carro, no corredor. **O desktop é a exceção** (fechamento do dia, edição da página). Toda experiência é desenhada mobile-primeiro e expandida para desktop, nunca o contrário.

### Estratégia por contexto de uso

**No celular (uso reativo e rápido — 80% das sessões):**
- **Barra inferior com 4 destinos:** Hoje, Conversas, Clientes, Divulgar (o "Mais" mora dentro de Hoje/perfil). Polegar alcança tudo; nada de menu hambúrguer escondendo o produto.
- **Conversas em tela cheia**, com o contexto do cliente acessível por um toque no nome (painel que sobe, padrão que o usuário já conhece do próprio WhatsApp — pegamos emprestados os gestos que ele já tem no músculo).
- **Ações de um polegar:** responder com sugestão IA, marcar "me lembre amanhã", etiquetar — tudo alcançável com uma mão, porque a outra está ocupada com o negócio.
- **Criação de conteúdo 100% confortável no celular** (é onde ele vai postar, afinal).
- **Resumo da manhã → link → fila → zerou → fechou.** O ritual diário inteiro precisa ser possível na fila do banco.

**No desktop (uso de gestão — 20% das sessões):**
- Mesmo produto, mais espaço: conversas com painel de contexto fixo, edição da Minha Página, relatórios, ações em massa maiores.
- Nenhum recurso é exclusivo do desktop na jornada crítica. **Se algo essencial só funciona bem no desktop, está quebrado.**

### Decisões mobile específicas
- **Entrada por WhatsApp, não por app store (v1):** o produto mobile é um web app excelente e instalável (ícone na tela inicial, aberto pelo link do resumo da manhã). App nativo nas lojas fica para quando houver tração — loja é fricção de download/atualização que não precisamos agora, e o link diário do WhatsApp resolve o "como eu volto pro sistema?" melhor que um ícone que ele esquece.
- **Notificações:** exclusivamente acionáveis (mensagem de cliente, lembrete que ele mesmo pediu, resumo da manhã). Nunca marketing.
- **Offline/conexão ruim:** o rascunho nunca se perde; ações em fila são enviadas quando a conexão volta, com aviso honesto ("enviando quando a internet voltar"). Empresário em área de sinal ruim não pode perder uma resposta digitada.
- **Performance como feature de UX:** abrir → ver "Hoje" em menos de 2 segundos. Cada segundo de carregamento no celular é um convite para voltar ao WhatsApp nativo.

---

## Síntese: as 10 leis do MINIMUS

1. **O sistema chega pronto.** Implantação entrega o produto cheio; o usuário nunca vê o estado vazio.
2. **Uma pergunta por tela, uma ação por tela, uma dor por vez.**
3. **O dashboard é uma fila de ações, não um relatório.** E a fila tem fim.
4. **O CRM se alimenta sozinho.** Dado que depende de disciplina do usuário não sustenta feature.
5. **O WhatsApp é o centro de gravidade.** Tudo entra, sai e notifica por ele.
6. **IA nunca começa do zero.** Sempre sugestões prontas; prompt em branco é proibido.
7. **Sem jargão.** O menu precisa ser entendido pela família do dono.
8. **Todo valor gerado é narrado em números de dono:** clientes, reais, minutos.
9. **Desfazer em vez de confirmar. Padrões em vez de configurações. Humano em vez de FAQ.**
10. **Mobile primeiro, ritual diário de 10 minutos, fila zerada como recompensa.**

---

### Próximos passos recomendados

1. Validar o roteiro de implantação junto ao time de serviço (as "3 vitórias" viram o checklist de ativação deles).
2. Prototipar e testar com 5 empresários reais apenas dois fluxos: **onboarding → Dia Zero** e **resumo da manhã → fila zerada**. São os dois momentos que decidem retenção.
3. Definir as métricas de ativação: % de contas com 3 vitórias na semana 1; tempo até a primeira resposta enviada; % de resumos da manhã clicados.
