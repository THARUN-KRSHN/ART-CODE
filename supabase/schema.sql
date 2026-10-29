-- ART//CODE 2026 Virtual Hackathon Platform
-- Database Schema for Supabase PostgreSQL
-- Organiser: DELTA — Data Science Department Association
-- Institution: Christ College of Engineering (Autonomous), Irinjalakuda

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text unique not null,
  phone text,
  institution text not null default 'Christ College of Engineering (Autonomous), Irinjalakuda',
  department text,
  year_of_study text,
  role text not null check (role in ('visitor', 'participant', 'leader', 'admin')) default 'participant',
  avatar_url text,
  provider text not null default 'google',
  team_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Teams Table (Strict 2-member limit)
create table if not exists public.teams (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  leader_id uuid references public.profiles(id) on delete restrict not null,
  invitation_code text unique not null,
  selected_challenge_id text,
  status text not null check (status in ('incomplete', 'complete')) default 'incomplete',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Foreign key back to profiles
alter table public.profiles
  drop constraint if exists fk_profiles_team,
  add constraint fk_profiles_team foreign key (team_id) references public.teams(id) on delete set null;

-- 3. Team Members Table (Ensures exact roles and max 2 members)
create table if not exists public.team_members (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null unique, -- Participant can only be in one team
  role text not null check (role in ('leader', 'member')),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Problem Statements Table
create table if not exists public.problem_statements (
  id text primary key,
  slug text unique not null,
  code text unique not null,
  title text not null,
  category text not null,
  short_description text not null,
  background text not null,
  problem_description text not null,
  objectives jsonb not null default '[]'::jsonb,
  expected_outcomes jsonb not null default '[]'::jsonb,
  constraints jsonb default '[]'::jsonb,
  submission_guidance text not null,
  accent_color text not null default 'terracotta',
  is_published boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Submissions Table (Drafts & Final Locking)
create table if not exists public.submissions (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade not null unique,
  challenge_id text references public.problem_statements(id) on delete restrict not null,
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
  status text not null check (status in ('draft', 'submitted', 'under_evaluation', 'evaluated')) default 'draft',
  reference_id text unique,
  acknowledged boolean not null default false,
  submitted_at timestamp with time zone,
  submitted_by uuid references public.profiles(id),
  is_locked boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Notifications Table
create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  message text not null,
  priority text not null check (priority in ('normal', 'important', 'urgent')) default 'normal',
  target_audience text not null check (target_audience in ('all', 'complete_teams', 'incomplete_teams', 'not_submitted', 'specific_team')) default 'all',
  target_team_id uuid references public.teams(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Notification Reads Table
create table if not exists public.notification_reads (
  id uuid default uuid_generate_v4() primary key,
  notification_id uuid references public.notifications(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  read_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (notification_id, user_id)
);

-- 8. Audit Logs Table
create table if not exists public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  actor_name text not null,
  actor_email text not null,
  action text not null,
  details text not null
);

-- Row Level Security (RLS) Policies
alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.submissions enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles: Anyone authenticated can read profiles; user can update own profile
create policy "Public profiles are viewable by authenticated users" 
  on public.profiles for select using (true);
create policy "Users can update own profile" 
  on public.profiles for update using (auth.uid() = id);

-- Teams: Publicly viewable or team member viewable
create policy "Teams are viewable by all users" 
  on public.teams for select using (true);
create policy "Team leaders can update team info" 
  on public.teams for update using (auth.uid() = leader_id);

-- Submissions: Team members can view and update their own submission if not locked
create policy "Team members can view own submission" 
  on public.submissions for select using (
    exists (
      select 1 from public.team_members
      where team_members.team_id = submissions.team_id
      and team_members.user_id = auth.uid()
    )
  );

create policy "Team leaders can update unlocked drafts" 
  on public.submissions for update using (
    is_locked = false and
    exists (
      select 1 from public.teams
      where teams.id = submissions.team_id
      and teams.leader_id = auth.uid()
    )
  );

