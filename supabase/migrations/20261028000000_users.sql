-- Feature 1: our own users table (PLAN.md section 3).
--
-- Supabase Auth keeps logins (emails, hashed passwords) in its private
-- auth.users table. This adds our own public.users table, and a trigger that
-- copies every new sign-up into it, so every account is a row in our users table.
--
-- How to run: Supabase dashboard -> SQL Editor -> New query -> paste this file -> Run.

create table public.users (
  -- Same id as the Supabase Auth account. Deleting the account deletes this row.
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Row-level security: with it on, nobody can read any row unless a policy allows it.
alter table public.users enable row level security;

-- A logged-in user can read only their own row.
create policy "Users can read their own row"
  on public.users for select
  to authenticated
  using ((select auth.uid()) = id);

-- No insert/update/delete policies: only the trigger below writes to this table.

-- Runs once for every new sign-up and adds the matching row to public.users.
-- "security definer" lets it write past row-level security; the empty
-- search_path makes it use only the fully named table below.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
