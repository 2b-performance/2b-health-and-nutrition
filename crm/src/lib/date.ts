// Utilitários de data para as tarefas (client + server).

// Converte "YYYY-MM-DD" (ou ISO) em Date no horário local (meio-dia,
// para não escorregar de dia por fuso). Retorna null se vazio/ inválido.
export function parseDueDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const d = ymd
    ? new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]), 12, 0, 0)
    : new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

// Date -> "YYYY-MM-DD" para preencher <input type="date">.
export function toDateInput(value: Date | string | null | undefined): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Formata para exibição: "20/08/2026".
export function formatDateBR(value: Date | string | null | undefined): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR");
}

// Zera hora para comparar apenas o dia.
function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export type DueBucket = "atrasada" | "hoje" | "proxima" | "sem-data";

// Abreviações de mês (pt-BR), índice 0 = janeiro.
const MONTH_ABBR = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

// Chave de mês "YYYY-MM" no horário local (mesma base do bucketing e do eixo).
export function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// Rótulo compacto "ago/25".
export function monthLabel(d: Date): string {
  return `${MONTH_ABBR[d.getMonth()]}/${String(d.getFullYear()).slice(-2)}`;
}

// Últimos N meses (incluindo o atual), do mais antigo ao mais recente.
// Cada item: { key: "YYYY-MM", label: "ago/25" }.
export function lastNMonths(n: number): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({ key: monthKey(d), label: monthLabel(d) });
  }
  return out;
}

export function dueBucket(value: Date | string | null | undefined): DueBucket {
  if (!value) return "sem-data";
  const d = typeof value === "string" ? new Date(value) : value;
  if (isNaN(d.getTime())) return "sem-data";
  const today = startOfDay(new Date());
  const due = startOfDay(d);
  if (due < today) return "atrasada";
  if (due === today) return "hoje";
  return "proxima";
}
