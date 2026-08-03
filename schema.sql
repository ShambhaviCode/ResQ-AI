create table if not exists users (
  id uuid primary key,
  name text not null,
  email text unique not null,
  role text not null,
  created_at timestamptz default now()
);

create table if not exists incidents (
  id uuid primary key,
  title text not null,
  description text not null,
  location text not null,
  severity text not null,
  status text not null default 'Reported',
  created_at timestamptz default now(),
  volunteer_id uuid references users(id),
  ai_summary text,
  ai_priority integer,
  ai_resources text[]
);

create table if not exists incident_media (
  id uuid primary key,
  incident_id uuid references incidents(id) on delete cascade,
  url text not null,
  created_at timestamptz default now()
);

create table if not exists assignments (
  id uuid primary key,
  incident_id uuid references incidents(id) on delete cascade,
  volunteer_id uuid references users(id) on delete cascade,
  status text not null default 'assigned',
  created_at timestamptz default now()
);

create table if not exists notifications (
  id uuid primary key,
  recipient_id uuid references users(id) on delete cascade,
  message text not null,
  created_at timestamptz default now()
);

create index if not exists incidents_status_idx on incidents(status);
create index if not exists incidents_created_at_idx on incidents(created_at desc);
create index if not exists assignments_incident_idx on assignments(incident_id);
