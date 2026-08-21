import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { STAGES, OPEN_STAGES, formatBRL, formatBRLCompact } from "@/lib/stages";
import { lastNMonths, monthKey } from "@/lib/date";

export const dynamic = "force-dynamic";

export default async function PainelPage({
  searchParams,
}: {
  searchParams: { meses?: string };
}) {
  const user = await getCurrentUser();
  if (!user) return null;

  // Período da série temporal: 6 (padrão) ou 12 meses.
  const months = searchParams.meses === "12" ? 12 : 6;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  const periodStart = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

  const [byStage, wonThisMonth, dueCount, contactsCount, wonDeals] = await Promise.all([
    prisma.deal.groupBy({
      by: ["stage"],
      where: { ownerId: user.id },
      _sum: { valueCents: true },
      _count: { _all: true },
    }),
    prisma.deal.aggregate({
      where: { ownerId: user.id, stage: "GANHO", closedAt: { gte: startOfMonth } },
      _sum: { valueCents: true },
      _count: { _all: true },
    }),
    prisma.task.count({
      where: { ownerId: user.id, done: false, dueDate: { not: null, lte: endOfToday } },
    }),
    prisma.contact.count({ where: { ownerId: user.id } }),
    prisma.deal.findMany({
      where: { ownerId: user.id, stage: "GANHO", closedAt: { gte: periodStart } },
      select: { closedAt: true, valueCents: true },
    }),
  ]);

  // Agrupa os ganhos por mês em JS, usando a MESMA chave (monthKey/horário local)
  // do eixo — evita divergência entre o bucketing do banco e o dos rótulos.
  const wonMap = new Map<string, { value: number; count: number }>();
  for (const d of wonDeals) {
    if (!d.closedAt) continue;
    const k = monthKey(d.closedAt);
    const cur = wonMap.get(k) ?? { value: 0, count: 0 };
    cur.value += d.valueCents;
    cur.count += 1;
    wonMap.set(k, cur);
  }
  const series = lastNMonths(months).map((m) => {
    const row = wonMap.get(m.key);
    return { key: m.key, label: m.label, value: row?.value ?? 0, count: row?.count ?? 0 };
  });
  const seriesMax = Math.max(1, ...series.map((s) => s.value));
  const seriesTotal = series.reduce((acc, s) => acc + s.value, 0);
  const maxIdx = series.reduce((mi, s, i, arr) => (s.value > arr[mi].value ? i : mi), 0);

  // Mapa etapa -> { value, count }
  const stageMap = new Map(
    byStage.map((r) => [r.stage, { value: r._sum.valueCents ?? 0, count: r._count._all }]),
  );
  const get = (s: string) => stageMap.get(s) ?? { value: 0, count: 0 };

  const openValue = OPEN_STAGES.reduce((acc, s) => acc + get(s).value, 0);
  const openCount = OPEN_STAGES.reduce((acc, s) => acc + get(s).count, 0);
  const won = get("GANHO");
  const lost = get("PERDIDO");
  const closedCount = won.count + lost.count;
  const conversion = closedCount > 0 ? Math.round((won.count / closedCount) * 100) : null;
  const avgTicket = won.count > 0 ? Math.round(won.value / won.count) : 0;

  const funnel = STAGES.map((s) => ({ ...s, ...get(s.key) }));
  const maxValue = Math.max(1, ...funnel.map((f) => f.value));

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Painel</h1>
          <div className="muted">Visão geral do seu funil de vendas</div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-tile">
          <div className="stat-label">Em aberto</div>
          <div className="stat-value">{formatBRL(openValue)}</div>
          <div className="stat-sub">
            {openCount} negócio{openCount === 1 ? "" : "s"} no funil
          </div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Ganhos no mês</div>
          <div className="stat-value pos">{formatBRL(wonThisMonth._sum.valueCents ?? 0)}</div>
          <div className="stat-sub">
            {wonThisMonth._count._all} fechado{wonThisMonth._count._all === 1 ? "" : "s"} este mês
          </div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Taxa de conversão</div>
          <div className="stat-value">{conversion === null ? "—" : `${conversion}%`}</div>
          <div className="stat-sub">
            {closedCount === 0
              ? "Sem negócios fechados ainda"
              : `${won.count} ganho${won.count === 1 ? "" : "s"} · ${lost.count} perdido${lost.count === 1 ? "" : "s"}`}
          </div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Ticket médio (ganho)</div>
          <div className="stat-value">{won.count > 0 ? formatBRL(avgTicket) : "—"}</div>
          <div className="stat-sub">Média por negócio ganho</div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Tarefas hoje/atrasadas</div>
          <div className={`stat-value${dueCount > 0 ? " alert" : ""}`}>{dueCount}</div>
          <div className="stat-sub">
            <Link href="/tarefas" style={{ color: "var(--primary)" }}>
              Ver tarefas →
            </Link>
          </div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Contatos</div>
          <div className="stat-value">{contactsCount}</div>
          <div className="stat-sub">
            <Link href="/contatos" style={{ color: "var(--primary)" }}>
              Ver contatos →
            </Link>
          </div>
        </div>
      </div>

      <div className="panel">
        <h2>Funil por etapa</h2>
        <div className="panel-sub">Valor total e quantidade de negócios em cada etapa.</div>
        {funnel.every((f) => f.count === 0) ? (
          <div className="muted" style={{ padding: "10px 0" }}>
            Nenhum negócio cadastrado ainda.{" "}
            <Link href="/pipeline" style={{ color: "var(--primary)" }}>
              Ir para o pipeline →
            </Link>
          </div>
        ) : (
          <div className="funnel">
            {funnel.map((f) => {
              const cls =
                f.key === "GANHO" ? "win" : f.key === "PERDIDO" ? "loss" : "";
              const width = f.value > 0 ? Math.max(3, (f.value / maxValue) * 100) : 0;
              return (
                <div className="funnel-row" key={f.key}>
                  <div className="funnel-name">{f.label}</div>
                  <div
                    className="funnel-track"
                    title={`${f.label}: ${formatBRL(f.value)} · ${f.count} negócio(s)`}
                  >
                    <div className={`funnel-bar ${cls}`} style={{ width: `${width}%` }} />
                  </div>
                  <div className="funnel-meta">
                    {formatBRL(f.value)}
                    <br />
                    <span className="count">
                      {f.count} negócio{f.count === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="panel">
        <div className="ts-head">
          <div>
            <h2>Ganhos por mês</h2>
            <div className="panel-sub" style={{ marginBottom: 0 }}>
              {formatBRL(seriesTotal)} ganhos nos últimos {months} meses.
            </div>
          </div>
          <div className="ts-filter">
            <Link href="/painel?meses=6" className={months === 6 ? "active" : ""}>
              6 meses
            </Link>
            <Link href="/painel?meses=12" className={months === 12 ? "active" : ""}>
              12 meses
            </Link>
          </div>
        </div>

        {seriesTotal === 0 ? (
          <div className="muted" style={{ padding: "16px 0" }}>
            Sem negócios ganhos no período. Mova um negócio para <strong>Ganho</strong>{" "}
            no pipeline para começar a acompanhar o histórico.
          </div>
        ) : (
          <>
            <div className="ts-chart">
              {series.map((s, i) => {
                const h = s.value > 0 ? Math.max(3, (s.value / seriesMax) * 85) : 0;
                return (
                  <div
                    className="ts-col"
                    key={s.key}
                    title={`${s.label}: ${formatBRL(s.value)} · ${s.count} ganho(s)`}
                  >
                    {i === maxIdx && s.value > 0 && (
                      <div className="ts-val">{formatBRLCompact(s.value)}</div>
                    )}
                    <div
                      className={`ts-bar${s.value === 0 ? " empty" : ""}`}
                      style={{ height: s.value > 0 ? `${h}%` : "2px" }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="ts-labels">
              {series.map((s) => (
                <span key={s.key}>{s.label}</span>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
