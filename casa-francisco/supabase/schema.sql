-- Casa Francisco · esquema de base de datos (Supabase / PostgreSQL)
-- Ejecutar en: Supabase → SQL Editor → New query → Run

create extension if not exists "pgcrypto";

create table if not exists public.reservations (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  status      text not null default 'pendiente' check (status in ('pendiente','confirmada','cancelada')),
  date        date not null,
  time        text not null,
  party       smallint not null check (party between 1 and 50),
  room        text not null default 'indiferente',
  name        text not null,
  email       text not null,
  phone       text not null,
  notes       text default ''
);
create index if not exists reservations_date_idx on public.reservations (date, time);

create table if not exists public.event_requests (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  status      text not null default 'pendiente' check (status in ('pendiente','confirmada','cancelada')),
  date        date not null,
  guests      smallint not null,
  event_type  text not null,
  budget      text default '',
  name        text not null,
  email       text not null,
  phone       text not null,
  message     text default ''
);

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  status      text not null default 'pendiente' check (status in ('pendiente','confirmada','cancelada')),
  name        text not null,
  email       text not null,
  subject     text not null,
  message     text not null
);

-- Seguridad: RLS activado y SIN políticas públicas.
-- Solo el servidor (service role key) puede leer y escribir. Los datos
-- personales nunca son accesibles con la anon key desde el navegador.
alter table public.reservations     enable row level security;
alter table public.event_requests   enable row level security;
alter table public.contact_messages enable row level security;
