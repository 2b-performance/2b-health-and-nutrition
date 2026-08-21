import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { STAGES, formatBRL } from "@/lib/stages";

export const dynamic = "force-dynamic";

const OPEN_STAGES = ["NOVO", "CONTATO", "PROPOSTA"];

export default async function PainelPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const [byStage, wonThisMonth, dueCount, contactsCount] = await Promise.all([
    prisma.deal.groupBy({
      by: ["stage"],
      where: { ownerId: user.id },
      _sum: { valueCents: true },
      _count: { _all: true },
    }),
    prisma.deal.aggregate({
      where: { ownerId: user.id, stage: "GANHO", updatedAt: { gte: startOfMonth } },
      _sum: { valueCents: true },
      _count: { _all: true },
    }),
    prisma.task.count({
      where: { ownerId: user.id, done: false, dueDate: { not: null, lte: endOfToday } },
    }),
    prisma.contact.count({ where: { ownerId: user.id } }),
  ]);

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
    </>
  );
}
