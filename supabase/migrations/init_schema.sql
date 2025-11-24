create table if not exists sessions (
  id uuid default gen_random_uuid() primary key,
  owner text not null,
  repo text not null,
  branch text not null default 'main',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_accessed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone not null,
  is_active boolean default true
);

create index if not exists idx_sessions_active on sessions(is_active, expires_at);