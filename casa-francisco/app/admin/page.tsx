import type { Metadata } from "next";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { listRecords, storageMode, type StoredRecord, type Table } from "@/lib/storage";
import { emailConfigured } from "@/lib/email";
import { roomLabels, eventTypeLabels } from "@/lib/validation";
import { formatLongDate, nowInRestaurant } from "@/lib/schedule";
import { Monogram } from "@/components/Monogram";
import { LoginForm } from "./LoginForm";
import { logout, setStatus } from "./actions";

export const metadata: Metadata = { title: "Panel de reservas", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const tabs: { id: Table; label: string }[] = [
  { id: "reservations", label: "Reservas" },
  { id: "event_requests", label: "Eventos" },
  { id: "contact_messages", label: "Mensajes" },
];

const statusStyle: Record<string, string> = {
  pendiente: "border-laton/60 text-laton-claro",
  confirmada: "border-emerald-400/50 text-emerald-300",
  cancelada: "border-marfil/20 text-arena line-through",
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminPage({ searchParams }: { searchParams: SP }) {
  if (!adminConfigured) {
    return (
      <Shell>
        <h1 className="font-serif text-4xl text-marfil">Panel no configurado</h1>
        <p className="mt-4 text-arena">
          Define <code className="text-laton-claro">ADMIN_PASSWORD</code> y <code className="text-laton-claro">ADMIN_SESSION_SECRET</code> (mínimo 32 caracteres) en las variables de entorno.
        </p>
      </Shell>
    );
  }

  if (!(await isAdmin())) {
    return (
      <Shell narrow>
        <Monogram className="h-14 w-auto text-laton" />
        <h1 className="mt-6 font-serif text-4xl text-marfil">Panel de reservas</h1>
        <LoginForm />
      </Shell>
    );
  }

  const sp = await searchParams;
  const tab = (tabs.find((t) => t.id === sp.tab)?.id ?? "reservations") as Table;
  const filter = sp.ver === "todas" ? "todas" : "proximas";

  let rows: StoredRecord[] = [];
  let loadError = "";
  try {
    rows = await listRecords(tab);
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Error al cargar";
  }

  const today = nowInRestaurant().date;
  if (tab === "reservations") {
    if (filter === "proximas") rows = rows.filter((r) => String(r.date) >= today);
    rows.sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`) * (filter === "proximas" ? 1 : -1));
  }

  const pendingCount = rows.filter((r) => r.status === "pendiente").length;

  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="etiqueta text-laton">Panel interno</p>
          <h1 className="mt-2 font-serif text-5xl text-marfil">Reservas y solicitudes</h1>
        </div>
        <form action={logout}>
          <button className="inline-flex min-h-11 items-center gap-2 border border-marfil/20 px-4 text-xs font-semibold uppercase tracking-[0.16em] hover:border-laton">
            <LogOut size={14} aria-hidden /> Salir
          </button>
        </form>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 text-xs text-arena">
        <span className="border border-marfil/15 px-2.5 py-1">Datos: {storageMode === "supabase" ? "Supabase" : storageMode === "local" ? "archivo local (.data/)" : "sin configurar"}</span>
        <span className="border border-marfil/15 px-2.5 py-1">Emails: {emailConfigured ? "Resend activo" : "no configurados"}</span>
      </div>

      <nav aria-label="Tipo de solicitud" className="mt-10 flex gap-1 border-b border-marfil/10">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`/admin?tab=${t.id}`}
            aria-current={tab === t.id ? "page" : undefined}
            className={`-mb-px border-b-2 px-4 py-3 text-sm ${tab === t.id ? "border-laton text-marfil" : "border-transparent text-arena hover:text-marfil"}`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {tab === "reservations" && (
        <div className="mt-6 flex items-center gap-4 text-sm">
          <Link href="/admin?tab=reservations" className={filter === "proximas" ? "text-laton" : "text-arena hover:text-marfil"}>Próximas</Link>
          <Link href="/admin?tab=reservations&ver=todas" className={filter === "todas" ? "text-laton" : "text-arena hover:text-marfil"}>Todas</Link>
          <span className="ml-auto text-arena">{pendingCount} pendientes</span>
        </div>
      )}

      {loadError && <p role="alert" className="mt-8 text-[#e0908a]">{loadError}</p>}

      {!loadError && rows.length === 0 && <p className="mt-12 text-arena">No hay registros.</p>}

      <ul className="mt-6 space-y-3">
        {rows.map((r) => (
          <li key={r.id} className="grid gap-4 border border-marfil/10 bg-nogal/40 p-5 md:grid-cols-[1fr_auto] md:items-center">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] ${statusStyle[r.status] ?? ""}`}>{r.status}</span>
                <p className="font-serif text-2xl text-marfil">{String(r.name)}</p>
              </div>
              <Summary table={tab} r={r} />
            </div>
            <div className="flex flex-wrap gap-2">
              {(["confirmada", "cancelada", "pendiente"] as const)
                .filter((s) => s !== r.status)
                .map((s) => (
                  <form key={s} action={setStatus}>
                    <input type="hidden" name="table" value={tab} />
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="status" value={s} />
                    <button
                      className={`min-h-10 px-3.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] ${
                        s === "confirmada" ? "bg-laton text-ebano hover:bg-laton-claro" : "border border-marfil/20 hover:border-laton"
                      }`}
                    >
                      {s === "confirmada" ? "Confirmar" : s === "cancelada" ? "Cancelar" : "Pendiente"}
                    </button>
                  </form>
                ))}
            </div>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

function Summary({ table, r }: { table: Table; r: StoredRecord }) {
  const line = "mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-arena";
  const contact = (
    <>
      <a className="enlace hover:text-marfil" href={`mailto:${r.email}`}>{String(r.email)}</a>
      {r.phone ? <a className="enlace hover:text-marfil" href={`tel:${r.phone}`}>{String(r.phone)}</a> : null}
    </>
  );
  if (table === "reservations") {
    return (
      <>
        <p className="mt-2 text-marfil/90">
          <span className="capitalize">{formatLongDate(String(r.date))}</span> · <strong className="text-laton-claro">{String(r.time)}</strong> · {String(r.party)} pax ·{" "}
          {roomLabels[r.room as keyof typeof roomLabels] ?? String(r.room)}
        </p>
        <p className={line}>{contact}</p>
        {r.notes ? <p className="mt-2 text-sm italic text-marfil/70">“{String(r.notes)}”</p> : null}
      </>
    );
  }
  if (table === "event_requests") {
    return (
      <>
        <p className="mt-2 text-marfil/90">
          {eventTypeLabels[r.event_type as keyof typeof eventTypeLabels] ?? String(r.event_type)} · <span className="capitalize">{formatLongDate(String(r.date))}</span> · {String(r.guests)} invitados
          {r.budget ? ` · ${r.budget}` : ""}
        </p>
        <p className={line}>{contact}</p>
        {r.message ? <p className="mt-2 text-sm italic text-marfil/70">“{String(r.message)}”</p> : null}
      </>
    );
  }
  return (
    <>
      <p className="mt-2 text-marfil/90">{String(r.subject)}</p>
      <p className={line}>{contact}</p>
      <p className="mt-2 text-sm text-marfil/70">{String(r.message)}</p>
    </>
  );
}

function Shell({ children, narrow }: { children: React.ReactNode; narrow?: boolean }) {
  return <div className={`contenedor pb-24 pt-32 ${narrow ? "max-w-md" : "max-w-5xl"}`}>{children}</div>;
}
