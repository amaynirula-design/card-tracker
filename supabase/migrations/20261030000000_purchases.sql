-- Feature 3: purchases, the main item (PLAN.md section 3).
-- A user has many purchases; each purchase was made with one of their cards.

create table public.purchases (
  id bigint generated always as identity primary key,
  -- Filled in automatically with the logged-in user's id.
  user_id uuid not null default auth.uid() references public.users (id) on delete cascade,
  -- A card that has purchases can't be deleted (close it instead).
  card_id bigint not null references public.cards (id),
  merchant text not null check (length(trim(merchant)) > 0),
  amount numeric(10, 2) not null check (amount > 0),
  category text not null check (category in (
    'Dining', 'Groceries', 'Gas', 'Travel', 'Online Shopping',
    'Streaming', 'Drug Stores', 'Transit', 'Everything Else'
  )),
  purchase_date date not null,
  notes text,
  created_at timestamptz not null default now()
);

create index purchases_user_id_date_idx on public.purchases (user_id, purchase_date desc);
create index purchases_card_id_idx on public.purchases (card_id);

-- Row-level security: each user can only see and change their own purchases,
-- and a purchase can only point at one of their own cards.
alter table public.purchases enable row level security;

create policy "Users can read their own purchases"
  on public.purchases for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add purchases on their own cards"
  on public.purchases for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.cards
      where cards.id = purchases.card_id and cards.user_id = (select auth.uid())
    )
  );

create policy "Users can edit their own purchases, on their own cards"
  on public.purchases for update to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.cards
      where cards.id = purchases.card_id and cards.user_id = (select auth.uid())
    )
  );

create policy "Users can delete their own purchases"
  on public.purchases for delete to authenticated
  using ((select auth.uid()) = user_id);
