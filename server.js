'use strict';

/*
 * Escala de Oficiais — 4º GBM
 * Backend REST + SQLite que substitui a antiga API window.claude.use("db").
 * Serve o próprio front (public/index.html) e a API em /api.
 *
 * Modelo de dados (mesmo do front):
 *   officers/{id}                          -> cadastro do oficial
 *   months/{YYYY-MM}/entries/{officerId}   -> { expediente[], servico[], sobreaviso[] }
 *   months/{YYYY-MM}/meta/config           -> { obs, feriado{}, meta{} }
 *   meta/roster                            -> trava de semeadura (uma vez só)
 */

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const Database = require('better-sqlite3');

const PORT = process.env.PORT || 3000;

// Caminho do banco: em produção aponte DB_PATH para um volume persistente (ex.: /data/escala.db).
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'escala.db');
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS officers (
    id   TEXT PRIMARY KEY,
    data TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS entries (
    month      TEXT NOT NULL,
    officer_id TEXT NOT NULL,
    data       TEXT NOT NULL,
    PRIMARY KEY (month, officer_id)
  );
  CREATE TABLE IF NOT EXISTS configs (
    month TEXT PRIMARY KEY,
    data  TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS meta (
    key  TEXT PRIMARY KEY,
    data TEXT NOT NULL
  );
`);

// ---- Relação da planilha (antiguidade, de cima para baixo) — usada só na semeadura inicial.
const SEED = [
  { ordem: 1,  posto: 'Cap',    nomeGuerra: 'Oliva',            rg: '49156' },
  { ordem: 2,  posto: 'Cap',    nomeGuerra: 'Leonardo Ramos',   rg: '49944' },
  { ordem: 3,  posto: 'Cap',    nomeGuerra: 'Lucas Freitas',    rg: '53388' },
  { ordem: 4,  posto: 'Cap',    nomeGuerra: 'Jonathan Barbosa', rg: '53340' },
  { ordem: 5,  posto: '1º Ten', nomeGuerra: 'Mello',            rg: '53449' },
  { ordem: 6,  posto: '1º Ten', nomeGuerra: 'Cruz',             rg: '53466' },
  { ordem: 7,  posto: '1º Ten', nomeGuerra: 'Kevin',            rg: '53477' },
  { ordem: 8,  posto: '1º Ten', nomeGuerra: 'Elizabete Araujo', rg: '18654' },
  { ordem: 9,  posto: '1º Ten', nomeGuerra: 'Agatha',           rg: '53497' },
  { ordem: 10, posto: '1º Ten', nomeGuerra: 'B. Baptista',      rg: '53508' },
  { ordem: 11, posto: '2º Ten', nomeGuerra: 'Tinoco',           rg: '19928' },
  { ordem: 12, posto: '2º Ten', nomeGuerra: 'Keven Santos',     rg: '53730' },
  { ordem: 13, posto: '2º Ten', nomeGuerra: 'Evani',            rg: '30463' },
  { ordem: 14, posto: '2º Ten', nomeGuerra: 'Antônio',          rg: '25959' }
];
const PALETTE = ['#c0392b','#d97706','#b45309','#ca8a04','#4d7c0f','#15803d','#0f766e','#0e7490','#2f6f8f','#3b5b95','#4338ca','#6d28d9','#a21caf','#be185d','#9f1239','#57606a'];

function genId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return 'o-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}
function isMonth(m) { return typeof m === 'string' && /^\d{4}-\d{2}$/.test(m); }
function uniq(arr) {
  const out = [], seen = {};
  (Array.isArray(arr) ? arr : []).forEach(function (v) {
    const k = String(v);
    if (!seen[k]) { seen[k] = 1; out.push(v); }
  });
  return out;
}

// ---- statements
const stmtOfficersAll   = db.prepare('SELECT id, data FROM officers');
const stmtOfficerSet    = db.prepare('INSERT INTO officers (id, data) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data');
const stmtOfficerGet    = db.prepare('SELECT data FROM officers WHERE id = ?');
const stmtOfficerDel    = db.prepare('DELETE FROM officers WHERE id = ?');
const stmtEntriesMonth  = db.prepare('SELECT officer_id, data FROM entries WHERE month = ?');
const stmtEntrySet      = db.prepare('INSERT INTO entries (month, officer_id, data) VALUES (?, ?, ?) ON CONFLICT(month, officer_id) DO UPDATE SET data = excluded.data');
const stmtEntryDelOff   = db.prepare('DELETE FROM entries WHERE officer_id = ?');
const stmtConfigGet     = db.prepare('SELECT data FROM configs WHERE month = ?');
const stmtConfigSet     = db.prepare('INSERT INTO configs (month, data) VALUES (?, ?) ON CONFLICT(month) DO UPDATE SET data = excluded.data');
const stmtMetaGet       = db.prepare('SELECT data FROM meta WHERE key = ?');
const stmtMetaSet       = db.prepare('INSERT INTO meta (key, data) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET data = excluded.data');

const app = express();
app.use(express.json({ limit: '1mb' }));

// ---------- OFICIAIS ----------

// GET /api/officers -> { id: {..cadastro..} }
app.get('/api/officers', function (req, res) {
  const out = {};
  for (const row of stmtOfficersAll.all()) out[row.id] = JSON.parse(row.data);
  res.json(out);
});

// PUT /api/officers/:id -> grava o cadastro completo
app.put('/api/officers/:id', function (req, res) {
  const rec = req.body && typeof req.body === 'object' ? req.body : {};
  stmtOfficerSet.run(req.params.id, JSON.stringify(rec));
  res.json({ ok: true });
});

// PATCH /api/officers/:id -> mescla campos no cadastro existente
app.patch('/api/officers/:id', function (req, res) {
  const row = stmtOfficerGet.get(req.params.id);
  const cur = row ? JSON.parse(row.data) : {};
  Object.assign(cur, req.body && typeof req.body === 'object' ? req.body : {});
  stmtOfficerSet.run(req.params.id, JSON.stringify(cur));
  res.json({ ok: true });
});

// DELETE /api/officers/:id -> remove o oficial e limpa seus lançamentos em todos os meses
const delOfficer = db.transaction(function (id) {
  stmtOfficerDel.run(id);
  stmtEntryDelOff.run(id);
});
app.delete('/api/officers/:id', function (req, res) {
  delOfficer(req.params.id);
  res.json({ ok: true });
});

// ---------- LANÇAMENTOS DO MÊS ----------

// GET /api/months/:ym/entries -> { officerId: { expediente[], servico[], sobreaviso[] } }
app.get('/api/months/:ym/entries', function (req, res) {
  if (!isMonth(req.params.ym)) return res.status(400).json({ error: 'mês inválido' });
  const out = {};
  for (const row of stmtEntriesMonth.all(req.params.ym)) {
    const d = JSON.parse(row.data);
    out[row.officer_id] = {
      expediente: d.expediente || [],
      servico: d.servico || [],
      sobreaviso: d.sobreaviso || []
    };
  }
  res.json(out);
});

// PUT /api/months/:ym/entries/:oid
// Grava o lançamento do oficial e reforça no servidor: 1 só Oficial de Dia e 1 só
// Sobreaviso por data (remove a data dos demais oficiais). Expediente é livre.
const putEntry = db.transaction(function (month, oid, body) {
  const exped = uniq(body.expediente);
  let serv = uniq(body.servico);
  let sob = uniq(body.sobreaviso);
  // Uma data não pode ser serviço e sobreaviso do mesmo oficial: serviço prevalece.
  const servSet = {};
  serv.forEach(function (dk) { servSet[dk] = 1; });
  sob = sob.filter(function (dk) { return !servSet[dk]; });

  stmtEntrySet.run(month, oid, JSON.stringify({
    expediente: exped, servico: serv, sobreaviso: sob,
    atualizadoEm: body.atualizadoEm || new Date().toISOString()
  }));

  if (serv.length || sob.length) {
    const sobSet = {};
    sob.forEach(function (dk) { sobSet[dk] = 1; });
    for (const row of stmtEntriesMonth.all(month)) {
      if (row.officer_id === oid) continue;
      const d = JSON.parse(row.data);
      const beforeS = (d.servico || []).length, beforeA = (d.sobreaviso || []).length;
      d.servico = (d.servico || []).filter(function (dk) { return !servSet[dk]; });
      d.sobreaviso = (d.sobreaviso || []).filter(function (dk) { return !sobSet[dk]; });
      if (d.servico.length !== beforeS || d.sobreaviso.length !== beforeA) {
        stmtEntrySet.run(month, row.officer_id, JSON.stringify(d));
      }
    }
  }
});
app.put('/api/months/:ym/entries/:oid', function (req, res) {
  if (!isMonth(req.params.ym)) return res.status(400).json({ error: 'mês inválido' });
  const b = req.body && typeof req.body === 'object' ? req.body : {};
  putEntry(req.params.ym, req.params.oid, b);
  res.json({ ok: true });
});

// ---------- CONFIG DO MÊS (obs / feriado / meta) ----------

// GET /api/months/:ym/meta/config -> { obs, feriado, meta }
app.get('/api/months/:ym/meta/config', function (req, res) {
  if (!isMonth(req.params.ym)) return res.status(400).json({ error: 'mês inválido' });
  const row = stmtConfigGet.get(req.params.ym);
  if (!row) return res.json({ obs: '', feriado: {}, meta: {} });
  const d = JSON.parse(row.data);
  res.json({ obs: d.obs || '', feriado: d.feriado || {}, meta: d.meta || {} });
});

// PUT /api/months/:ym/meta/config
app.put('/api/months/:ym/meta/config', function (req, res) {
  if (!isMonth(req.params.ym)) return res.status(400).json({ error: 'mês inválido' });
  const b = req.body && typeof req.body === 'object' ? req.body : {};
  stmtConfigSet.run(req.params.ym, JSON.stringify({
    obs: b.obs || '', feriado: b.feriado || {}, meta: b.meta || {}
  }));
  res.json({ ok: true });
});

// ---------- SEED (semeadura idempotente dos 14 oficiais) ----------

const seedRoster = db.transaction(function () {
  const guard = stmtMetaGet.get('roster');
  if (guard && JSON.parse(guard.data).seeded) return { seeded: true, already: true };

  const byRg = {};
  for (const row of stmtOfficersAll.all()) {
    const o = JSON.parse(row.data);
    if (o.rg) byRg[String(o.rg)] = { id: row.id, o: o };
  }
  SEED.forEach(function (s, i) {
    const ex = byRg[String(s.rg)];
    if (ex) {
      ex.o.ordem = s.ordem;
      stmtOfficerSet.run(ex.id, JSON.stringify(ex.o));
      return;
    }
    const id = genId();
    stmtOfficerSet.run(id, JSON.stringify({
      nomeGuerra: s.nomeGuerra, posto: s.posto, rg: s.rg, funcao: '',
      cor: PALETTE[i % PALETTE.length], ferias: [], ordem: s.ordem,
      criadoEm: new Date().toISOString()
    }));
  });
  stmtMetaSet.run('roster', JSON.stringify({ seeded: true, at: new Date().toISOString() }));
  return { seeded: true };
});
app.post('/api/seed', function (req, res) {
  res.json(seedRoster());
});

// ---------- estáticos + fallback ----------
app.get('/favicon.ico', function (req, res) { res.status(204).end(); });
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, function () {
  console.log('Escala 4º GBM rodando em http://localhost:' + PORT + '  (banco: ' + DB_PATH + ')');
});
