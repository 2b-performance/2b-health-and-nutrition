// Etapas do funil de vendas (pipeline). Compartilhado entre server e client.
export const STAGES = [
  { key: "NOVO", label: "Novo" },
  { key: "CONTATO", label: "Em contato" },
  { key: "PROPOSTA", label: "Proposta" },
  { key: "GANHO", label: "Ganho" },
  { key: "PERDIDO", label: "Perdido" },
] as const;

export type StageKey = (typeof STAGES)[number]["key"];

export const STAGE_KEYS = STAGES.map((s) => s.key) as StageKey[];

export function isStage(value: string): value is StageKey {
  return (STAGE_KEYS as string[]).includes(value);
}

// Etapas que representam um negócio fechado.
export const CLOSED_STAGES: StageKey[] = ["GANHO", "PERDIDO"];
// Etapas de negócio em aberto (ainda no funil).
export const OPEN_STAGES: StageKey[] = ["NOVO", "CONTATO", "PROPOSTA"];

export function isClosedStage(stage: string): boolean {
  return (CLOSED_STAGES as string[]).includes(stage);
}
export function isOpenStage(stage: string): boolean {
  return (OPEN_STAGES as string[]).includes(stage);
}

// Decide o closedAt AO MUDAR de etapa (chamado apenas em transições reais):
// - entrou numa etapa fechada -> marca o momento da mudança (fechou/re-fechou agora);
// - voltou/segue em etapa aberta -> limpa a data.
export function closedAtForStage(stage: string): Date | null {
  return isClosedStage(stage) ? new Date() : null;
}

export function stageLabel(key: string): string {
  return STAGES.find((s) => s.key === key)?.label ?? key;
}

// Formata centavos em Real brasileiro: 150000 -> "R$ 1.500,00"
export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Interpreta um valor digitado em Real e devolve o número em reais.
// Aceita "45.000,00" (pt-BR), "45000,50", "1500.50" e "45000".
// Retorna null quando o texto não é um número válido (para exibir erro).
export function parseBRLInput(input: string): number | null {
  let s = input.trim().replace(/[R$\s]/g, "");
  if (s === "") return 0;
  if (s.includes(",")) {
    // vírgula = decimal; pontos = separador de milhar
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (!/^\d+\.\d{1,2}$/.test(s)) {
    // sem vírgula e não é ponto-decimal simples -> pontos são de milhar
    s = s.replace(/\./g, "");
  }
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

// Formato compacto para rótulos de gráfico:
// 120000 -> "R$ 1,2k" · 4500000 -> "R$ 45k" · 105000000 -> "R$ 1,05M"
export function formatBRLCompact(cents: number): string {
  const reais = cents / 100;
  if (reais >= 1_000_000) {
    const m = reais / 1_000_000;
    const s = (m >= 100 ? Math.round(m) : Number(m.toFixed(m >= 10 ? 1 : 2)))
      .toLocaleString("pt-BR");
    return `R$ ${s}M`;
  }
  if (reais >= 1000) {
    const k = reais / 1000;
    const s = (k >= 100 ? Math.round(k) : Number(k.toFixed(1)))
      .toLocaleString("pt-BR");
    return `R$ ${s}k`;
  }
  return `R$ ${Math.round(reais).toLocaleString("pt-BR")}`;
}
