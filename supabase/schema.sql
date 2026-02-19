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

-- Ensure unique menu item names (prevents duplicates on re-run)
-- Must truncate BEFORE adding constraint to avoid duplicate key errors
truncate public.menu_items cascade;

alter table public.menu_items drop constraint if exists menu_items_name_unique;
alter table public.menu_items add constraint menu_items_name_unique unique (name);

insert into public.menu_items (name, description, price, category, image, badge)
values
  -- Småretter
  ('Bruschetta', 'Ristet surdeigsbrød med tomater, basilikum, hvitløk og ekstra virgin olivenolje', 89, 'Småretter', 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop', 'Populær'),
  ('Kyllingvinger', 'Sprøstekte vinger med buffalo-saus og ranch-dip', 119, 'Småretter', 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop', null),
  ('Nachos Supreme', 'Sprø tortillachips med smeltet ost, guacamole, salsa og rømme', 109, 'Småretter', 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop', null),
  ('Hvitløksreker', 'Scampi stekt i smør med hvitløk, chili og frisk persille', 139, 'Småretter', 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400&h=300&fit=crop', null),
  -- Salater
  ('Gresk Salat', 'Friske tomater, agurk, oliven, fetaost og rødløk med oregano-vinaigrette', 139, 'Salater', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', null),
  ('Caesar Salat', 'Crispy romansalat, kylling, parmesan, krutonger og hjemmelaget dressing', 149, 'Salater', 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=300&fit=crop', 'Anbefalt'),
  ('Thai Biff-salat', 'Grillet biff med mango, koriander, peanøtter og søt chilidressing', 169, 'Salater', 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&h=300&fit=crop', null),
  -- Hovedretter
  ('Grillet Laks', 'Norsk laks med sitronsmør, dampede grønnsaker og kremet potetpuré', 269, 'Hovedretter', 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400&h=300&fit=crop', 'Anbefalt'),
  ('Klassisk Burger', 'Angus-burger med cheddar, bacon, løkringer, salat og trøffelaioli', 189, 'Hovedretter', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', 'Populær'),
  ('Pasta Carbonara', 'Fersk tagliatelle med pancetta, eggekremer, pecorino og svart pepper', 179, 'Hovedretter', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop', null),
  ('Entrecôte', '200 g grillet entrecôte med béarnaisesaus, pommes frites og grønnsaker', 329, 'Hovedretter', 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop', null),
  ('Kylling Tikka Masala', 'Mør kylling i kremet, krydret tomatsaus med basmatiris og nanbrød', 199, 'Hovedretter', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop', null),
  -- Drikke
  ('Hjemmelaget Lemonade', 'Friskpresset sitron med mynte, agurk og lett søtning', 69, 'Drikke', 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop', null),
  ('Mango Smoothie', 'Frisk mango blandet med yoghurt, banan og honning', 79, 'Drikke', 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=300&fit=crop', null),
  ('Iste med Fersken', 'Avkjølt svart te med fersken, sitron og isbiter', 59, 'Drikke', 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=400&h=300&fit=crop', null),
  ('Espresso Tonic', 'Dobbel espresso over isbiter med premium tonic og appelsinskall', 75, 'Drikke', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop', null),
  ('Pulled Pork Tacos', 'Tre myke tacos med langtidsstekt svinekjøtt, coleslaw, chipotle-aioli og syltet rødløk', 159, 'Hovedretter', 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop', 'Ny'),
  ('Edamame', 'Dampede soyabønner med havsalt og sesamolje — en lett og sunn snack', 69, 'Småretter', 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?w=400&h=300&fit=crop', 'Ny')
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
