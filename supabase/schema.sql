-- ART//CODE 2026 Virtual Hackathon Platform
-- Database schema for Supabase PostgreSQL
-- Organiser: DELTA - Data Science Department Association
-- Institution: Christ College of Engineering (Autonomous), Irinjalakuda
--
-- Apply with: psql <schema.sql>  (or paste into the Supabase SQL editor)

-- 1. Profiles -------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text unique not null,
  phone text,
  institution text not null default 'Christ College of Engineering (Autonomous), Irinjalakuda',
  department text,
  year_of_study text,
  role text not null check (role in ('participant', 'admin')) default 'participant',
  avatar_url text,
  provider text not null default 'email',
  team_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Problem statements ---------------------------------------------------
create table if not exists public.problem_statements (
  id text primary key,
  slug text unique not null,
  code text unique not null,
  title text not null,
  category text not null,
  domain text not null default '',
  difficulty text not null default 'Beginner–Intermediate',
  motif text not null default 'Heritage & AI',
  accent_color text not null default 'vermilion',
  short_description text not null,
  background text not null,
  problem_description text not null,
  objectives jsonb not null default '[]'::jsonb,
  expected_outcomes jsonb not null default '[]'::jsonb,
  mvp text not null default '',
  success_criteria text not null default '',
  constraints jsonb not null default '[]'::jsonb,
  research_connection text not null default '',
  submission_guidance text not null default '',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Teams (strict 2-member limit, enforced by trigger) -------------------
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  leader_id uuid not null references public.profiles(id) on delete restrict,
  invitation_code text unique not null,
  selected_challenge_id text references public.problem_statements(id) on delete set null,
  status text not null check (status in ('incomplete', 'complete')) default 'incomplete',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  drop constraint if exists fk_profiles_team,
  add constraint fk_profiles_team foreign key (team_id) references public.teams(id) on delete set null;

-- 4. Team members (one team per participant + max 2 members) ---------------
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  role text not null check (role in ('leader', 'member')),
  joined_at timestamptz not null default now()
);

create index if not exists idx_team_members_team on public.team_members(team_id);

create or replace function public.enforce_team_size()
returns trigger
language plpgsql
as $$
declare
  current_count integer;
  max_size integer;
begin
  select count(*) into current_count from public.team_members where team_id = new.team_id;
  select team_size into max_size from public.event_settings where id = 1;
  if max_size is null then max_size := 2; end if;
  if current_count >= max_size then
    raise exception 'Team is already full (max % members)', max_size;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_enforce_team_size on public.team_members;
create trigger trg_enforce_team_size
  before insert on public.team_members
  for each row execute function public.enforce_team_size();

-- Keep teams.status in sync with member count
create or replace function public.sync_team_status()
returns trigger
language plpgsql
as $$
declare
  cnt integer;
  max_size integer;
  tid uuid;
begin
  tid := coalesce(new.team_id, old.team_id);
  select count(*) into cnt from public.team_members where team_id = tid;
  select team_size into max_size from public.event_settings where id = 1;
  if max_size is null then max_size := 2; end if;
  update public.teams
    set status = case when cnt >= max_size then 'complete' else 'incomplete' end,
        updated_at = now()
    where id = tid;
  return null;
end;
$$;

drop trigger if exists trg_sync_team_status_ins on public.team_members;
create trigger trg_sync_team_status_ins
  after insert on public.team_members
  for each row execute function public.sync_team_status();

drop trigger if exists trg_sync_team_status_del on public.team_members;
create trigger trg_sync_team_status_del
  after delete on public.team_members
  for each row execute function public.sync_team_status();

-- 5. Submissions ----------------------------------------------------------
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null unique references public.teams(id) on delete cascade,
  challenge_id text not null references public.problem_statements(id) on delete restrict,
  project_title text not null,
  short_description text not null,
  problem_description text not null,
  proposed_solution text not null,
  key_features jsonb not null default '[]'::jsonb,
  tech_stack jsonb not null default '[]'::jsonb,
  innovation_and_impact text not null,
  github_url text not null,
  live_url text,
  google_drive_url text not null,
  additional_comments text,
  status text not null default 'draft'
    check (status in ('draft', 'submitted', 'under_evaluation', 'evaluated')),
  reference_id text unique,
  acknowledged boolean not null default false,
  submitted_at timestamptz,
  submitted_by uuid references public.profiles(id) on delete set null,
  is_locked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_submissions_status on public.submissions(status);

-- 6. Notifications --------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  priority text not null default 'normal' check (priority in ('normal', 'important', 'urgent')),
  target_audience text not null default 'all'
    check (target_audience in ('all', 'complete_teams', 'incomplete_teams', 'not_submitted', 'specific_team')),
  target_team_id uuid references public.teams(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.notification_reads (
  notification_id uuid not null references public.notifications(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (notification_id, user_id)
);

-- 7. Audit logs -----------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  timestamp timestamptz not null default now(),
  actor_name text not null,
  actor_email text not null,
  action text not null,
  details text not null
);

create index if not exists idx_audit_logs_time on public.audit_logs(timestamp desc);

-- 8. Event settings (single row) ------------------------------------------
create table if not exists public.event_settings (
  id integer primary key check (id = 1),
  event_name text not null default 'ART//CODE 2026',
  tagline text not null default 'Where Creativity Meets Technology.',
  organiser text not null default 'DELTA - Data Oriented Thinkers'' Association',
  institution text not null default 'Christ College of Engineering (Autonomous), Irinjalakuda',
  department text not null default 'Department of Computer Science and Engineering (Data Science)',
  theme text not null default 'Art, Culture, Heritage & Creative Technology',
  registration_opens timestamptz not null default '2026-10-31T00:00:00+05:30',
  submission_opens timestamptz not null default '2026-11-01T00:00:00+05:30',
  submission_deadline timestamptz not null default '2026-11-08T23:59:59+05:30',
  winner_announcement timestamptz not null default '2026-11-14T18:00:00+05:30',
  team_size integer not null default 2,
  first_prize text not null default '₹1,500',
  second_prize text not null default '₹1,000',
  third_prize text not null default '₹500',
  total_prize_pool text not null default '₹3,000',
  faculty_coordinators text not null default 'Dr. Savitha K K · Ms. Noufala T S',
  student_coordinators text not null default 'Alan Jaison (S3 CSDS) · Henet Biju (S3 CSDS)',
  contact_email text not null default 'delta@cce.edu.in',
  results_published boolean not null default false,
  updated_at timestamptz not null default now()
);

-- 9. Winners --------------------------------------------------------------
create table if not exists public.winners (
  id uuid primary key default gen_random_uuid(),
  rank integer unique not null check (rank between 1 and 3),
  prize_amount text not null,
  team_name text not null,
  project_title text not null,
  challenge_title text not null default '',
  members jsonb not null default '[]'::jsonb,
  institution text not null default '',
  score numeric not null default 0,
  created_at timestamptz not null default now()
);

-- 10. New auth user → profile --------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, avatar_url, provider)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'name', ''),
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      split_part(new.email, '@', 1)
    ),
    new.email,
    nullif(new.raw_user_meta_data ->> 'avatar_url', ''),
    coalesce(new.raw_app_meta_data ->> 'provider', 'email')
  )
  on conflict (id) do update
    set name = excluded.name,
        avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 11. updated_at maintenance ----------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array['profiles', 'problem_statements', 'teams', 'submissions']
  loop
    execute format('drop trigger if exists trg_touch_%I on public.%I', t, t);
    execute format('create trigger trg_touch_%I before update on public.%I for each row execute function public.touch_updated_at()', t, t);
  end loop;
end;
$$;

-- 12. Row Level Security --------------------------------------------------
-- The Next.js API layer uses the secret (service-role) key, which bypasses RLS.
-- Only intentionally public tables are readable with the publishable key.
alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.problem_statements enable row level security;
alter table public.submissions enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_reads enable row level security;
alter table public.audit_logs enable row level security;
alter table public.event_settings enable row level security;
alter table public.winners enable row level security;

drop policy if exists "Public read of published problem statements" on public.problem_statements;
create policy "Public read of published problem statements"
  on public.problem_statements for select
  to anon, authenticated
  using (is_published = true);

drop policy if exists "Public read of event settings" on public.event_settings;
create policy "Public read of event settings"
  on public.event_settings for select
  to anon, authenticated
  using (true);

-- 13. Initial settings row ------------------------------------------------
insert into public.event_settings (id) values (1)
on conflict (id) do nothing;
