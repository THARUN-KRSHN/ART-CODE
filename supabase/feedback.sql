-- ART//CODE 2026 — participant feedback
-- One row per participant. Answers are keyed by question id (see
-- src/lib/feedback-questions.ts), so the schema never changes when the
-- official question set is swapped in later.

create table if not exists public.event_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  answers jsonb not null default '{}'::jsonb,
  question_set_version text not null default 'placeholder-v1',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_event_feedback_team on public.event_feedback(team_id);
create index if not exists idx_event_feedback_created on public.event_feedback(created_at desc);

alter table public.event_feedback enable row level security;

drop policy if exists "read own feedback" on public.event_feedback;
create policy "read own feedback" on public.event_feedback
  for select using (auth.uid() = user_id);

drop policy if exists "insert own feedback" on public.event_feedback;
create policy "insert own feedback" on public.event_feedback
  for insert with check (auth.uid() = user_id);

drop policy if exists "update own feedback" on public.event_feedback;
create policy "update own feedback" on public.event_feedback
  for update using (auth.uid() = user_id);
