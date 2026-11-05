-- =====================================================================
-- Golary · Esquema de base de datos para Supabase (PostgreSQL)
-- Se ejecuta una sola vez en: Supabase > SQL Editor > New query > Run
-- Refleja el mismo modelo que usa hoy el prototipo del panel (src/lib/admin/types.ts)
-- =====================================================================

-- Perfiles y roles ------------------------------------------------------
create type user_role as enum ('admin', 'vendedor', 'cliente');

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  role user_role not null default 'cliente',
  created_at timestamptz not null default now()
);

-- Crea el perfil automáticamente cuando alguien se registra
create function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name) values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

create function is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'vendedor'));
$$;

create function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- Catálogo --------------------------------------------------------------
create table categories (
  slug text primary key,
  name text not null,
  description text,
  sort int not null default 0
);

create table products (
  id uuid primary key default gen_random_uuid(),
  sku text unique not null,
  slug text unique not null,
  name text not null,
  category text not null references categories(slug),
  kind text not null,                 -- futbol | futsal | voleibol | baloncesto | microfutbol
  description text,
  price integer not null check (price >= 0),        -- COP, sin decimales
  old_price integer check (old_price >= 0),
  cost integer not null default 0 check (cost >= 0),
  colors text[] not null default '{"#ffffff","#00a8e8"}',
  badge text,
  min_stock integer not null default 5,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products on delete cascade,
  path text not null,                 -- ruta en Supabase Storage (bucket "productos")
  sort int not null default 0
);

-- Una fila por talla: aquí vive el stock
create table variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products on delete cascade,
  size text not null,
  stock integer not null default 0 check (stock >= 0),
  unique (product_id, size)
);

-- Inventario ------------------------------------------------------------
create type movement_type as enum ('entrada', 'salida', 'ajuste', 'venta', 'anulacion');

create table inventory_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references variants on delete cascade,
  qty integer not null check (qty <> 0),
  type movement_type not null,
  note text,
  sale_id uuid,
  created_by uuid references auth.users,
  created_at timestamptz not null default now()
);

-- Ventas ----------------------------------------------------------------
create sequence sale_number_seq start 1001;

create table sales (
  id uuid primary key default gen_random_uuid(),
  number integer unique not null default nextval('sale_number_seq'),
  channel text not null,              -- Local | WhatsApp | Web | Por mayor
  payment text not null,              -- Efectivo | Transferencia | Nequi | Daviplata | Tarjeta
  customer text,
  discount integer not null default 0,
  total integer not null,
  status text not null default 'pagada' check (status in ('pagada', 'anulada')),
  created_by uuid references auth.users,
  created_at timestamptz not null default now()
);

create table sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references sales on delete cascade,
  variant_id uuid not null references variants,
  name text not null,                 -- copia del nombre al momento de vender
  size text not null,
  qty integer not null check (qty > 0),
  price integer not null check (price >= 0)
);

-- Registrar una venta de forma atómica: valida stock, descuenta y deja movimientos.
-- items = '[{"variant_id":"...","qty":2,"price":69900}, ...]'
create function register_sale(p_channel text, p_payment text, p_customer text, p_discount integer, p_items jsonb)
returns sales language plpgsql security definer set search_path = public as $$
declare
  v_sale sales;
  v_item jsonb;
  v_variant variants;
  v_gross integer := 0;
begin
  if not is_staff() then raise exception 'No autorizado'; end if;

  insert into sales (channel, payment, customer, discount, total, created_by)
  values (p_channel, p_payment, p_customer, p_discount, 0, auth.uid()) returning * into v_sale;

  for v_item in select * from jsonb_array_elements(p_items) loop
    select * into v_variant from variants where id = (v_item->>'variant_id')::uuid for update;
    if v_variant.stock < (v_item->>'qty')::int then
      raise exception 'Stock insuficiente en talla %', v_variant.size;
    end if;
    update variants set stock = stock - (v_item->>'qty')::int where id = v_variant.id;
    insert into sale_items (sale_id, variant_id, name, size, qty, price)
      select v_sale.id, v_variant.id, p.name, v_variant.size, (v_item->>'qty')::int, (v_item->>'price')::int
      from products p where p.id = v_variant.product_id;
    insert into inventory_movements (variant_id, qty, type, note, sale_id, created_by)
      values (v_variant.id, -(v_item->>'qty')::int, 'venta', 'Venta #' || v_sale.number, v_sale.id, auth.uid());
    v_gross := v_gross + (v_item->>'qty')::int * (v_item->>'price')::int;
  end loop;

  update sales set total = greatest(0, v_gross - least(p_discount, v_gross)) where id = v_sale.id returning * into v_sale;
  return v_sale;
end $$;

-- Seguridad (Row Level Security) -----------------------------------------
alter table profiles enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table variants enable row level security;
alter table inventory_movements enable row level security;
alter table sales enable row level security;
alter table sale_items enable row level security;

-- Cualquiera ve el catálogo publicado; solo el equipo lo modifica
create policy "catalogo publico" on categories for select using (true);
create policy "productos publicados" on products for select using (active or is_staff());
create policy "imagenes publicas" on product_images for select using (true);
create policy "tallas publicas" on variants for select using (true);

create policy "admin categorias" on categories for all using (is_admin()) with check (is_admin());
create policy "admin productos" on products for all using (is_admin()) with check (is_admin());
create policy "admin imagenes" on product_images for all using (is_admin()) with check (is_admin());
create policy "staff tallas" on variants for all using (is_staff()) with check (is_staff());

create policy "staff movimientos" on inventory_movements for all using (is_staff()) with check (is_staff());
create policy "staff ventas" on sales for all using (is_staff()) with check (is_staff());
create policy "staff items" on sale_items for all using (is_staff()) with check (is_staff());

create policy "mi perfil" on profiles for select using (id = auth.uid() or is_admin());
create policy "admin perfiles" on profiles for update using (is_admin());

-- Categorías iniciales
insert into categories (slug, name, sort) values
  ('futbol', 'Fútbol', 1), ('futsal', 'Futsal', 2), ('voleibol', 'Voleibol', 3),
  ('baloncesto', 'Baloncesto', 4), ('microfutbol', 'Microfútbol', 5), ('importados', 'Importados', 6);
