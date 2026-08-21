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

export function isClosedStage(stage: string): boolean {
  return (CLOSED_STAGES as string[]).includes(stage);
}

// Decide o closedAt ao mover para uma etapa:
// - entrou numa etapa fechada -> mantém a data existente ou marca agora;
// - voltou para etapa aberta   -> limpa a data.
export function closedAtForStage(
  stage: string,
  currentClosedAt: Date | null,
): Date | null {
  if (isClosedStage(stage)) return currentClosedAt ?? new Date();
  return null;
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

// Formato compacto para rótulos de gráfico: 4500000 -> "R$ 45k", 120000 -> "R$ 1,2k"
export function formatBRLCompact(cents: number): string {
  const reais = cents / 100;
  if (reais >= 1000) {
    const k = reais / 1000;
    const s = (k >= 100 ? Math.round(k) : Number(k.toFixed(1)))
      .toLocaleString("pt-BR");
    return `R$ ${s}k`;
  }
  return `R$ ${Math.round(reais).toLocaleString("pt-BR")}`;
}
