import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatBRL, stageLabel } from "@/lib/stages";

export const dynamic = "force-dynamic";

export default async function ContactDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) return null;

  const contact = await prisma.contact.findFirst({
    where: { id: params.id, ownerId: user.id },
    include: { deals: { orderBy: { updatedAt: "desc" } } },
  });
  if (!contact) notFound();

  const total = contact.deals.reduce((s, d) => s + d.valueCents, 0);

  return (
    <>
      <div className="page-head">
        <div>
          <div className="muted" style={{ marginBottom: 4 }}>
            <Link href="/contatos">← Contatos</Link>
          </div>
          <h1>{contact.name}</h1>
          <div className="muted">{contact.company ?? "—"}</div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
        <div className="card-panel" style={{ padding: 18 }}>
          <h3 style={{ marginBottom: 12, fontSize: 15 }}>Dados</h3>
          <Field label="E-mail" value={contact.email} />
          <Field label="Telefone" value={contact.phone} />
          <Field label="Empresa" value={contact.company} />
          <Field label="Anotações" value={contact.notes} />
        </div>

        <div className="card-panel" style={{ padding: 18 }}>
          <h3 style={{ marginBottom: 12, fontSize: 15 }}>
            Negócios ({contact.deals.length}) · {formatBRL(total)}
          </h3>
          {contact.deals.length === 0 ? (
            <div className="muted">Nenhum negócio ligado a este contato.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {contact.deals.map((d) => (
                <div
                  key={d.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{d.title}</div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {stageLabel(d.stage)}
                    </div>
                  </div>
                  <div className="card-value">{formatBRL(d.valueCents)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div className="muted" style={{ fontSize: 12 }}>
        {label}
      </div>
      <div style={{ whiteSpace: "pre-wrap" }}>{value || "—"}</div>
    </div>
  );
}
