"use client";

import { useMemo, useState } from "react";
import { dueBucket, formatDateBR, toDateInput } from "@/lib/date";

type Task = {
  id: string;
  title: string;
  done: boolean;
  dueDate: string | null;
  contact: { id: string; name: string } | null;
  deal: { id: string; title: string } | null;
};
type Opt = { id: string; name: string };

const GROUPS: { key: string; label: string }[] = [
  { key: "atrasada", label: "Atrasadas" },
  { key: "hoje", label: "Hoje" },
  { key: "proxima", label: "Próximas" },
  { key: "sem-data", label: "Sem data" },
];

export default function TasksView({
  initialTasks,
  contacts,
  deals,
}: {
  initialTasks: Task[];
  contacts: Opt[];
  deals: Opt[];
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [showDone, setShowDone] = useState(false);

  const active = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  const grouped = useMemo(() => {
    const map: Record<string, Task[]> = {
      atrasada: [],
      hoje: [],
      proxima: [],
      "sem-data": [],
    };
    for (const t of active) map[dueBucket(t.dueDate)].push(t);
    return map;
  }, [active]);

  async function toggle(task: Task) {
    const done = !task.done;
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, done } : t)),
    );
    await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done }),
    }).catch(() => {});
  }

  function onSaved(task: Task, isNew: boolean) {
    setTasks((prev) =>
      isNew ? [...prev, task] : prev.map((t) => (t.id === task.id ? task : t)),
    );
    setModalOpen(false);
  }
  function onDeleted(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setModalOpen(false);
  }

  const overdueToday = grouped.atrasada.length + grouped.hoje.length;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Tarefas</h1>
          <div className="muted">
            {active.length} aberta{active.length === 1 ? "" : "s"}
            {overdueToday > 0 && (
              <>
                {" · "}
                <strong style={{ color: "var(--danger)" }}>
                  {overdueToday} para hoje/atrasada
                  {overdueToday === 1 ? "" : "s"}
                </strong>
              </>
            )}
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          + Nova tarefa
        </button>
      </div>

      {active.length === 0 && (
        <div className="card-panel">
          <div className="empty-state">
            Nenhuma tarefa aberta. Tudo em dia! 🎉
          </div>
        </div>
      )}

      {GROUPS.map((g) => {
        const list = grouped[g.key];
        if (list.length === 0) return null;
        return (
          <div key={g.key} style={{ marginBottom: 18 }}>
            <h3
              style={{
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
                color:
                  g.key === "atrasada" ? "var(--danger)" : "var(--text-muted)",
                marginBottom: 8,
              }}
            >
              {g.label} · {list.length}
            </h3>
            <div className="card-panel">
              {list.map((t) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  onToggle={() => toggle(t)}
                  onEdit={() => {
                    setEditing(t);
                    setModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}

      {done.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <button className="btn btn-sm" onClick={() => setShowDone((s) => !s)}>
            {showDone ? "Ocultar" : "Mostrar"} concluídas ({done.length})
          </button>
          {showDone && (
            <div className="card-panel" style={{ marginTop: 10 }}>
              {done.map((t) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  onToggle={() => toggle(t)}
                  onEdit={() => {
                    setEditing(t);
                    setModalOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {modalOpen && (
        <TaskModal
          task={editing}
          contacts={contacts}
          deals={deals}
          onClose={() => setModalOpen(false)}
          onSaved={onSaved}
          onDeleted={onDeleted}
        />
      )}
    </>
  );
}

function TaskRow({
  task,
  onToggle,
  onEdit,
}: {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
}) {
  const bucket = dueBucket(task.dueDate);
  const dateColor =
    !task.done && bucket === "atrasada"
      ? "var(--danger)"
      : !task.done && bucket === "hoje"
        ? "var(--warning)"
        : "var(--text-muted)";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "11px 16px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <input
        type="checkbox"
        checked={task.done}
        onChange={onToggle}
        style={{ width: 17, height: 17, cursor: "pointer", flex: "none" }}
        aria-label="Concluir tarefa"
      />
      <div style={{ flex: 1, minWidth: 0 }} onClick={onEdit}>
        <div
          style={{
            fontWeight: 550,
            textDecoration: task.done ? "line-through" : "none",
            color: task.done ? "var(--text-muted)" : "var(--text)",
            cursor: "pointer",
          }}
        >
          {task.title}
        </div>
        <div
          className="muted"
          style={{ fontSize: 12.5, display: "flex", gap: 10, marginTop: 2 }}
        >
          {task.dueDate && (
            <span style={{ color: dateColor, fontWeight: 550 }}>
              📅 {formatDateBR(task.dueDate)}
            </span>
          )}
          {task.contact && <span>👤 {task.contact.name}</span>}
          {task.deal && <span>💼 {task.deal.title}</span>}
        </div>
      </div>
      <button className="btn btn-sm" onClick={onEdit}>
        Editar
      </button>
    </div>
  );
}

function TaskModal({
  task,
  contacts,
  deals,
  onClose,
  onSaved,
  onDeleted,
}: {
  task: Task | null;
  contacts: Opt[];
  deals: Opt[];
  onClose: () => void;
  onSaved: (t: Task, isNew: boolean) => void;
  onDeleted: (id: string) => void;
}) {
  const isNew = !task;
  const [title, setTitle] = useState(task?.title ?? "");
  const [dueDate, setDueDate] = useState(toDateInput(task?.dueDate));
  const [contactId, setContactId] = useState(task?.contact?.id ?? "");
  const [dealId, setDealId] = useState(task?.deal?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const payload = {
      title,
      dueDate: dueDate || null,
      contactId: contactId || null,
      dealId: dealId || null,
    };
    try {
      const res = await fetch(
        isNew ? "/api/tasks" : `/api/tasks/${task!.id}`,
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
      onSaved(data.task, isNew);
    } catch {
      setError("Erro de conexão");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!task) return;
    if (!confirm("Excluir esta tarefa?")) return;
    const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
    if (res.ok) onDeleted(task.id);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isNew ? "Nova tarefa" : "Editar tarefa"}</h2>
        <form onSubmit={save}>
          {error && <div className="form-error">{error}</div>}
          <div className="field">
            <label>Tarefa</label>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Ligar para o cliente"
              required
            />
          </div>
          <div className="field">
            <label>Vencimento</label>
            <input
              className="input"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="row">
            <div className="field">
              <label>Contato</label>
              <select
                className="select"
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
              >
                <option value="">— Nenhum —</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Negócio</label>
              <select
                className="select"
                value={dealId}
                onChange={(e) => setDealId(e.target.value)}
              >
                <option value="">— Nenhum —</option>
                {deals.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
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
