-- ART//CODE 2026 — project showcase likes
-- One row per (project, liker). liker_id is 'user:<profile uuid>' for signed-in
-- participants or 'guest:<browser uuid>' for anonymous visitors, so the public
-- showcase can be liked without an account while still being deduped per person.

create table if not exists public.project_likes (
  submission_id uuid not null references public.submissions(id) on delete cascade,
  liker_id text not null,
  created_at timestamptz not null default now(),
  primary key (submission_id, liker_id)
);

create index if not exists idx_project_likes_submission
  on public.project_likes(submission_id);

alter table public.project_likes enable row level security;

-- Counts are public; writes only happen through the service-role API.
drop policy if exists "public read likes" on public.project_likes;
create policy "public read likes" on public.project_likes
  for select using (true);
