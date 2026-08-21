"use client";

import { useState } from "react";
import Link from "next/link";

type Contact = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  _count?: { deals: number };
};

export default function ContactsView({
  initialContacts,
}: {
  initialContacts: Contact[];
}) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);

  const filtered = contacts.filter((c) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return [c.name, c.email, c.company, c.phone]
      .filter(Boolean)
      .some((v) => v!.toLowerCase().includes(q));
  });

  function openNew() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(c: Contact) {
    setEditing(c);
    setModalOpen(true);
  }
  function onSaved(c: Contact, isNew: boolean) {
    setContacts((prev) => {
      const next = isNew
        ? [...prev, c]
        : prev.map((x) => (x.id === c.id ? { ...x, ...c } : x));
      // Reordena sempre (nome pode ter mudado numa edição).
      return next.sort((a, b) => a.name.localeCompare(b.name));
    });
    setModalOpen(false);
  }
  function onDeleted(id: string) {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setModalOpen(false);
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Contatos</h1>
          <div className="muted">
            {contacts.length} contato{contacts.length === 1 ? "" : "s"}
          </div>
        </div>
        <div className="row" style={{ gap: 10, flex: "none" }}>
          <input
            className="input search"
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-primary" onClick={openNew}>
            + Novo contato
          </button>
        </div>
      </div>

      <div className="card-panel">
        {filtered.length === 0 ? (
          <div className="empty-state">
            {contacts.length === 0
              ? "Nenhum contato ainda. Cadastre o primeiro."
              : "Nenhum contato encontrado para a busca."}
          </div>
        ) : (
          <table className="list">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Empresa</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Negócios</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link href={`/contatos/${c.id}`} style={{ fontWeight: 600 }}>
                      {c.name}
                    </Link>
                  </td>
                  <td>{c.company ?? "—"}</td>
                  <td>{c.email ?? "—"}</td>
                  <td>{c.phone ?? "—"}</td>
                  <td>
                    {c._count?.deals ? (
                      <span className="tag">{c._count.deals}</span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn btn-sm" onClick={() => openEdit(c)}>
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <ContactModal
          contact={editing}
          onClose={() => setModalOpen(false)}
          onSaved={onSaved}
          onDeleted={onDeleted}
        />
      )}
    </>
  );
}

function ContactModal({
  contact,
  onClose,
  onSaved,
  onDeleted,
}: {
  contact: Contact | null;
  onClose: () => void;
  onSaved: (c: Contact, isNew: boolean) => void;
  onDeleted: (id: string) => void;
}) {
  const isNew = !contact;
  const [name, setName] = useState(contact?.name ?? "");
  const [email, setEmail] = useState(contact?.email ?? "");
  const [phone, setPhone] = useState(contact?.phone ?? "");
  const [company, setCompany] = useState(contact?.company ?? "");
  const [notes, setNotes] = useState(contact?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const payload = { name, email, phone, company, notes };
    try {
      const res = await fetch(
        isNew ? "/api/contacts" : `/api/contacts/${contact!.id}`,
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
      onSaved(data.contact, isNew);
    } catch {
      setError("Erro de conexão");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!contact) return;
    if (!confirm("Excluir este contato? Os negócios ligados ficam sem contato."))
      return;
    const res = await fetch(`/api/contacts/${contact.id}`, { method: "DELETE" });
    if (res.ok) onDeleted(contact.id);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isNew ? "Novo contato" : "Editar contato"}</h2>
        <form onSubmit={save}>
          {error && <div className="form-error">{error}</div>}
          <div className="field">
            <label>Nome</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="row">
            <div className="field">
              <label>Empresa</label>
              <input
                className="input"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Telefone</label>
              <input
                className="input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label>E-mail</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Anotações</label>
            <textarea
              className="textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
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
