"use client";

import { useMemo, useState } from "react";
import { STAGES, formatBRL, isOpenStage, parseBRLInput, type StageKey } from "@/lib/stages";

type Deal = {
  id: string;
  title: string;
  valueCents: number;
  stage: string;
  position: number;
  contact: { id: string; name: string } | null;
};
type ContactOpt = { id: string; name: string };

export default function Board({
  initialDeals,
  contacts,
}: {
  initialDeals: Deal[];
  contacts: ContactOpt[];
}) {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [dropBeforeId, setDropBeforeId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Deal | null>(null);
  const [defaultStage, setDefaultStage] = useState<StageKey>("NOVO");

  const byStage = useMemo(() => {
    const map: Record<string, Deal[]> = {};
    for (const s of STAGES) map[s.key] = [];
    for (const d of deals) (map[d.stage] ??= []).push(d);
    for (const k of Object.keys(map))
      map[k].sort((a, b) => a.position - b.position);
    return map;
  }, [deals]);

  async function onDrop(stage: StageKey) {
    const dragId = draggingId;
    const beforeId = dropBeforeId;
    setDragOverStage(null);
    setDropBeforeId(null);
    setDraggingId(null);
    if (!dragId) return;

    // Soltar no espaço vazio da própria coluna (sem card-alvo) não deve
    // reordenar o card — só cross-coluna ou soltar sobre um card move.
    const dragged = deals.find((d) => d.id === dragId);
    if (dragged && dragged.stage === stage && !beforeId) return;

    const targetList = deals
      .filter((d) => d.stage === stage && d.id !== dragId)
      .sort((a, b) => a.position - b.position);
    let insertIndex = targetList.length;
    if (beforeId) {
      const i = targetList.findIndex((d) => d.id === beforeId);
      if (i >= 0) insertIndex = i;
    }
    const orderedIds = targetList.map((d) => d.id);
    orderedIds.splice(insertIndex, 0, dragId);

    setDeals((prev) =>
      prev.map((d) => {
        const idx = orderedIds.indexOf(d.id);
        if (d.id === dragId) return { ...d, stage, position: idx };
        if (d.stage === stage && idx >= 0) return { ...d, position: idx };
        return d;
      }),
    );

    await fetch("/api/deals/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage, orderedIds }),
    }).catch(() => {});
  }

  function openNew(stage: StageKey) {
    setEditing(null);
    setDefaultStage(stage);
    setModalOpen(true);
  }
  function openEdit(deal: Deal) {
    setEditing(deal);
    setModalOpen(true);
  }

  function onSaved(deal: Deal, isNew: boolean) {
    setDeals((prev) =>
      isNew ? [...prev, deal] : prev.map((d) => (d.id === deal.id ? deal : d)),
    );
    setModalOpen(false);
  }
  function onDeleted(id: string) {
    setDeals((prev) => prev.filter((d) => d.id !== id));
    setModalOpen(false);
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Pipeline</h1>
          <div className="muted">
            {deals.length} negócio{deals.length === 1 ? "" : "s"} ·{" "}
            {formatBRL(
              deals
                .filter((d) => isOpenStage(d.stage))
                .reduce((s, d) => s + d.valueCents, 0),
            )}{" "}
            em aberto
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => openNew("NOVO")}>
          + Novo negócio
        </button>
      </div>

      <div className="board">
        {STAGES.map((s) => {
          const list = byStage[s.key] ?? [];
          const sum = list.reduce((acc, d) => acc + d.valueCents, 0);
          return (
            <div
              key={s.key}
              className={`column${dragOverStage === s.key ? " drag-over" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverStage(s.key);
              }}
              onDragLeave={(e) => {
                if (e.currentTarget === e.target) setDragOverStage(null);
              }}
              onDrop={() => onDrop(s.key)}
            >
              <div className="column-head">
                <span className="column-title">{s.label}</span>
                <span className="column-count">{list.length}</span>
              </div>
              <div className="column-sum">{formatBRL(sum)}</div>
              <div className="column-body">
                {list.map((d) => (
                  <div
                    key={d.id}
                    className={`card${draggingId === d.id ? " dragging" : ""}`}
                    draggable
                    onDragStart={() => setDraggingId(d.id)}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setDragOverStage(null);
                      setDropBeforeId(null);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragOverStage(s.key);
                      setDropBeforeId(d.id);
                    }}
                    onClick={() => openEdit(d)}
                  >
                    <div className="card-title">{d.title}</div>
                    {d.valueCents > 0 && (
                      <div className="card-value">{formatBRL(d.valueCents)}</div>
                    )}
                    {d.contact && (
                      <div className="card-contact">👤 {d.contact.name}</div>
                    )}
                  </div>
                ))}
                {list.length === 0 && (
                  <div className="card-empty">Sem negócios</div>
                )}
                <button
                  className="btn btn-sm"
                  style={{ marginTop: 4 }}
                  onClick={() => openNew(s.key)}
                >
                  + Adicionar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <DealModal
          deal={editing}
          defaultStage={defaultStage}
          contacts={contacts}
          onClose={() => setModalOpen(false)}
          onSaved={onSaved}
          onDeleted={onDeleted}
        />
      )}
    </>
  );
}

function DealModal({
  deal,
  defaultStage,
  contacts,
  onClose,
  onSaved,
  onDeleted,
}: {
  deal: Deal | null;
  defaultStage: StageKey;
  contacts: ContactOpt[];
  onClose: () => void;
  onSaved: (deal: Deal, isNew: boolean) => void;
  onDeleted: (id: string) => void;
}) {
  const isNew = !deal;
  const [title, setTitle] = useState(deal?.title ?? "");
  const [value, setValue] = useState(
    deal ? (deal.valueCents / 100).toString() : "",
  );
  const [stage, setStage] = useState<string>(deal?.stage ?? defaultStage);
  const [contactId, setContactId] = useState<string>(deal?.contact?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const valueReais = parseBRLInput(value);
    if (valueReais === null) {
      setError("Valor inválido. Use o formato 1.500,00");
      return;
    }
    setSaving(true);
    const payload = { title, valueReais, stage, contactId: contactId || "" };
    try {
      const res = await fetch(
        isNew ? "/api/deals" : `/api/deals/${deal!.id}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao salvar");
        return;
      }
      onSaved(data.deal, isNew);
    } catch {
      setError("Erro de conexão");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!deal) return;
    if (!confirm("Excluir este negócio?")) return;
    const res = await fetch(`/api/deals/${deal.id}`, { method: "DELETE" });
    if (res.ok) onDeleted(deal.id);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isNew ? "Novo negócio" : "Editar negócio"}</h2>
        <form onSubmit={save}>
          {error && <div className="form-error">{error}</div>}
          <div className="field">
            <label>Título</label>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Reforma apto 1102"
              required
            />
          </div>
          <div className="row">
            <div className="field">
              <label>Valor (R$)</label>
              <input
                className="input"
                inputMode="decimal"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0,00"
              />
            </div>
            <div className="field">
              <label>Etapa</label>
              <select
                className="select"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
              >
                {STAGES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label>Contato</label>
            <select
              className="select"
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
            >
              <option value="">— Sem contato —</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-actions">
            {!isNew ? (
              <button type="button" className="btn btn-danger" onClick={remove}>
                Excluir
              </button>
            ) : (
              <span />
            )}
            <div className="row" style={{ gap: 8 }}>
              <button type="button" className="btn" onClick={onClose}>
                Cancelar
              </button>
              <button className="btn btn-primary" disabled={saving}>
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
