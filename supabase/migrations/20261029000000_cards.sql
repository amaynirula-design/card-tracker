-- Feature 2: my cards (PLAN.md section 3).
-- A user has many cards; a card has a reward rate for each spending category.
-- No card numbers, expiry dates, or CVVs: a card is just a name the user chooses.

create table public.cards (
  id bigint generated always as identity primary key,
  -- Filled in automatically with the logged-in user's id.
  user_id uuid not null default auth.uid() references public.users (id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  reward_type text not null check (reward_type in ('cashback', 'points')),
  -- What one point is worth to the user, in cents. Always 1 for cash back cards.
  point_value_cents numeric(6, 2) not null default 1 check (point_value_cents > 0),
  annual_fee numeric(8, 2) not null default 0 check (annual_fee >= 0),
  -- False once the user has closed the card; closed cards are hidden from pickers.
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index cards_user_id_idx on public.cards (user_id);

create table public.reward_rates (
  id bigint generated always as identity primary key,
  card_id bigint not null references public.cards (id) on delete cascade,
  category text not null check (category in (
    'Dining', 'Groceries', 'Gas', 'Travel', 'Online Shopping',
    'Streaming', 'Drug Stores', 'Transit', 'Everything Else'
  )),
  -- % for cash back cards, points per dollar for points cards.
  rate numeric(5, 2) not null check (rate >= 0),
  -- One rate per category per card.
  unique (card_id, category)
);

-- Row-level security: each user can only see and change their own cards...
alter table public.cards enable row level security;

create policy "Users can read their own cards"
  on public.cards for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own cards"
  on public.cards for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can edit their own cards"
  on public.cards for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own cards"
  on public.cards for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ...and the rates of their own cards. reward_rates has no user_id column,
-- so a rate belongs to whoever owns its card.
alter table public.reward_rates enable row level security;

create policy "Users can manage rates on their own cards"
  on public.reward_rates for all to authenticated
  using (exists (
    select 1 from public.cards
    where cards.id = reward_rates.card_id and cards.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.cards
    where cards.id = reward_rates.card_id and cards.user_id = (select auth.uid())
  ));
