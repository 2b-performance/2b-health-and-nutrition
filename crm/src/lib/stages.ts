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
