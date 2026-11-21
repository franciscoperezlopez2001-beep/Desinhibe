import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Almacenamiento de reservas y solicitudes.
 * - Producción: Supabase (PostgREST) con la service role key, solo en servidor.
 * - Desarrollo: archivo JSON local en .data/ (para probar sin configurar nada).
 */

export type Table = "reservations" | "event_requests" | "contact_messages";
export type Status = "pendiente" | "confirmada" | "cancelada";

export interface StoredRecord {
  id: string;
  created_at: string;
  status: Status;
  [key: string]: unknown;
}

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const useSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);
const allowLocal = process.env.NODE_ENV !== "production" || process.env.ALLOW_LOCAL_STORAGE === "true";

export const storageMode: "supabase" | "local" | "none" = useSupabase ? "supabase" : allowLocal ? "local" : "none";

export class StorageNotConfiguredError extends Error {
  constructor() {
    super("Storage not configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  }
}

/* ───────────── Supabase (REST) ───────────── */

async function sb(pathAndQuery: string, init: RequestInit = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathAndQuery}`, {
    ...init,
    headers: {
      apikey: SUPABASE_KEY!,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...init.headers,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Supabase ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.status === 204 ? null : res.json();
}

/* ───────────── Archivo local ───────────── */

const DATA_DIR = path.join(process.cwd(), ".data");

async function readLocal(table: Table): Promise<StoredRecord[]> {
  try {
    return JSON.parse(await readFile(path.join(DATA_DIR, `${table}.json`), "utf8"));
  } catch {
    return [];
  }
}

async function writeLocal(table: Table, rows: StoredRecord[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(path.join(DATA_DIR, `${table}.json`), JSON.stringify(rows, null, 2));
}

/* ───────────── API pública ───────────── */

export async function insertRecord(table: Table, data: Record<string, unknown>): Promise<StoredRecord> {
  if (storageMode === "none") throw new StorageNotConfiguredError();

  if (storageMode === "supabase") {
    const rows = (await sb(table, { method: "POST", body: JSON.stringify({ ...data, status: "pendiente" }) })) as StoredRecord[];
    return rows[0];
  }

  const record: StoredRecord = { id: randomUUID(), created_at: new Date().toISOString(), status: "pendiente", ...data };
  const rows = await readLocal(table);
  rows.unshift(record);
  await writeLocal(table, rows);
  return record;
}

export async function listRecords(table: Table, limit = 200): Promise<StoredRecord[]> {
  if (storageMode === "none") throw new StorageNotConfiguredError();
  if (storageMode === "supabase") {
    return (await sb(`${table}?select=*&order=created_at.desc&limit=${limit}`)) as StoredRecord[];
  }
  return (await readLocal(table)).slice(0, limit);
}

export async function updateStatus(table: Table, id: string, status: Status): Promise<StoredRecord | null> {
  if (storageMode === "none") throw new StorageNotConfiguredError();
  if (storageMode === "supabase") {
    const rows = (await sb(`${table}?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })) as StoredRecord[];
    return rows[0] ?? null;
  }
  const rows = await readLocal(table);
  const row = rows.find((r) => r.id === id);
  if (!row) return null;
  row.status = status;
  await writeLocal(table, rows);
  return row;
}
