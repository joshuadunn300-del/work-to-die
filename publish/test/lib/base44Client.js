// Base44 REST client for the exit test — real API-key auth per
// ~/nova/reference/nova-api-reference.md (agents call the API directly with
// an `api_key` header, no browser Bearer/session token needed).
//
// NEVER hardcode the key here — loaded from ~/nova/.env (gitignored) via
// Node's built-in process.loadEnvFile, same convention as the Google
// Places/Anthropic keys T1 already uses.
const path = require('path');

try {
  process.loadEnvFile(path.join(__dirname, '..', '..', '..', '.env'));
} catch {
  // already loaded, or file missing — fall through to whatever's in env
}

const BASE44_APP_ID = process.env.BASE44_APP_ID || '6a5e2a32604b8e5802285ce3'; // Nova app id
const BASE44_API_BASE = process.env.BASE44_API_BASE || 'https://icy-nova-growth-lab.base44.app/api';
const BASE44_API_KEY = process.env.BASE44_API_KEY;

function live() {
  return !!BASE44_API_KEY;
}

function headers() {
  return { 'Content-Type': 'application/json', api_key: BASE44_API_KEY };
}

async function callFunction(name, payload) {
  if (!live()) throw new Error(`base44Client.callFunction("${name}") called without BASE44_API_KEY set`);
  const res = await fetch(`${BASE44_API_BASE}/functions/${name}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`${name} failed: ${res.status} ${await res.text().catch(() => '')}`);
  return res.json();
}

async function listEntities(entity, query) {
  if (!live()) throw new Error(`base44Client.listEntities("${entity}") called without BASE44_API_KEY set`);
  const qs = query ? `?${new URLSearchParams(query).toString()}` : '';
  const res = await fetch(`${BASE44_API_BASE}/entities/${entity}${qs}`, { headers: headers() });
  if (!res.ok) throw new Error(`list ${entity} failed: ${res.status} ${await res.text().catch(() => '')}`);
  return res.json();
}

async function getEntity(entity, id) {
  if (!live()) throw new Error(`base44Client.getEntity("${entity}") called without BASE44_API_KEY set`);
  const res = await fetch(`${BASE44_API_BASE}/entities/${entity}/${id}`, { headers: headers() });
  if (!res.ok) throw new Error(`get ${entity}/${id} failed: ${res.status} ${await res.text().catch(() => '')}`);
  return res.json();
}

async function updateEntity(entity, id, patch) {
  if (!live()) throw new Error(`base44Client.updateEntity("${entity}") called without BASE44_API_KEY set`);
  const res = await fetch(`${BASE44_API_BASE}/entities/${entity}/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`update ${entity}/${id} failed: ${res.status} ${await res.text().catch(() => '')}`);
  return res.json();
}

async function createEntity(entity, payload) {
  if (!live()) throw new Error(`base44Client.createEntity("${entity}") called without BASE44_API_KEY set`);
  const res = await fetch(`${BASE44_API_BASE}/entities/${entity}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`create ${entity} failed: ${res.status} ${await res.text().catch(() => '')}`);
  return res.json();
}

async function deleteEntity(entity, id) {
  if (!live()) throw new Error(`base44Client.deleteEntity("${entity}") called without BASE44_API_KEY set`);
  const res = await fetch(`${BASE44_API_BASE}/entities/${entity}/${id}`, { method: 'DELETE', headers: headers() });
  if (!res.ok) throw new Error(`delete ${entity}/${id} failed: ${res.status} ${await res.text().catch(() => '')}`);
}

module.exports = { live, callFunction, listEntities, getEntity, updateEntity, createEntity, deleteEntity, BASE44_APP_ID };
