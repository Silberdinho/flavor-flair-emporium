create extension if not exists pgcrypto;

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price integer not null check (price >= 0),
  category text not null,
  image text not null,
  badge text,
  created_at timestamptz not null default now()
);

alter table public.menu_items enable row level security;

drop policy if exists "Public can read menu items" on public.menu_items;
create policy "Public can read menu items"
  on public.menu_items
  for select
  using (true);

insert into public.menu_items (name, description, price, category, image, badge)
values
  (
    'Gresk Salat',
    'Friske tomater, agurk, oliven, fetaost og rødløk med oregano-vinaigrette',
    139,
    'Salater',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
    'Populær'
  ),
  (
    'Caesar Salat',
    'Crispy romansalat, parmesan, krutonger og hjemmelaget caesar-dressing',
    149,
    'Salater',
    'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
    null
  ),
  (
    'Grillet Laks',
    'Norsk laks med sitronsmør, grønnsaker og potetpuré',
    269,
    'Hovedretter',
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
    'Anbefalt'
  ),
  (
    'Pasta Bolognese',
    'Hjemmelaget kjøttsaus med fersk pasta og parmesan',
    189,
    'Hovedretter',
    'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',
    null
  ),
  (
    'Kyllingburger',
    'Saftig kyllingfilet med avokado, tomat og aioli i brioche-brød',
    179,
    'Hovedretter',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    null
  ),
  (
    'Bruschetta',
    'Ristet surdeigsbrød med tomat, basilikum, hvitløk og olivenolje',
    89,
    'Småretter',
    'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop',
    null
  ),
  (
    'Hummus med Pita',
    'Kremet hummus med varm pitabrød og grønnsaker',
    99,
    'Småretter',
    'https://images.unsplash.com/photo-1637361973-2b1c4a44b59e?w=400&h=300&fit=crop',
    null
  ),
  (
    'Hjemmelaget Lemonade',
    'Friskpresset sitron med mynte og lett søtning',
    69,
    'Drikke',
    'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop',
    null
  ),
  (
    'Iste med Fersken',
    'Avkjølt te med fersken og isbiter',
    59,
    'Drikke',
    'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
    null
  )
on conflict do nothing;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  total_price integer not null check (total_price >= 0),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_address text not null,
  customer_postal_code text not null,
  customer_city text not null,
  customer_comment text,
  payment_status text not null default 'unpaid',
  payment_method text,
  payment_reference text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.orders add column if not exists customer_name text;
alter table public.orders add column if not exists customer_email text;
alter table public.orders add column if not exists customer_phone text;
alter table public.orders add column if not exists customer_address text;
alter table public.orders add column if not exists customer_postal_code text;
alter table public.orders add column if not exists customer_city text;
alter table public.orders add column if not exists customer_comment text;
alter table public.orders add column if not exists payment_status text;
alter table public.orders add column if not exists payment_method text;
alter table public.orders add column if not exists payment_reference text;

-- Max-length constraints for security (prevents oversized payloads)
do $$ begin
  alter table public.orders add constraint chk_customer_name_length check (length(customer_name) <= 100);
exception when duplicate_object then null;
end $$;
do $$ begin
  alter table public.orders add constraint chk_customer_email_length check (length(customer_email) <= 254);
exception when duplicate_object then null;
end $$;
do $$ begin
  alter table public.orders add constraint chk_customer_phone_length check (length(customer_phone) <= 20);
exception when duplicate_object then null;
end $$;
do $$ begin
  alter table public.orders add constraint chk_customer_address_length check (length(customer_address) <= 200);
exception when duplicate_object then null;
end $$;
do $$ begin
  alter table public.orders add constraint chk_customer_comment_length check (length(customer_comment) <= 500);
exception when duplicate_object then null;
end $$;

create table if not exists public.order_items (
  id bigserial primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id),
  item_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price integer not null check (unit_price >= 0),
  line_total integer not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Public can insert orders" on public.orders;
create policy "Public can insert orders"
  on public.orders
  for insert
  with check (true);

drop policy if exists "Public can insert order items" on public.order_items;
create policy "Public can insert order items"
  on public.order_items
  for insert
  with check (true);

select pg_notify('pgrst', 'reload schema');
