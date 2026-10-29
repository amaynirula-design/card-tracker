-- Feature 5: stars (PLAN.md section 3).
-- A junction table between users and purchases: one row means "this user
-- starred this purchase". Unstarring deletes the row.

create table public.stars (
  id bigint generated always as identity primary key,
  -- Filled in automatically with the logged-in user's id.
  user_id uuid not null default auth.uid() references public.users (id) on delete cascade,
  -- Deleting a purchase removes its star too.
  purchase_id bigint not null references public.purchases (id) on delete cascade,
  created_at timestamptz not null default now(),
  -- A user can star a purchase only once.
  unique (user_id, purchase_id)
);

create index stars_purchase_id_idx on public.stars (purchase_id);

-- Row-level security: each user only sees their own stars, and can only star
-- their own purchases. There's nothing to edit on a star, so no update rule.
alter table public.stars enable row level security;

create policy "Users can read their own stars"
  on public.stars for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can star their own purchases"
  on public.stars for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.purchases
      where purchases.id = stars.purchase_id and purchases.user_id = (select auth.uid())
    )
  );

create policy "Users can remove their own stars"
  on public.stars for delete to authenticated
  using ((select auth.uid()) = user_id);
