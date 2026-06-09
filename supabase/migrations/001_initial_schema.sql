-- profiles (extends auth.users)
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  full_name     text,
  credits       integer not null default 5 check (credits >= 0),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- credit ledger
create table public.credit_transactions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  amount        integer not null,
  balance_after integer not null,
  reason        text not null,
  reference_id  uuid,
  created_at    timestamptz not null default now()
);

create type public.content_type as enum (
  'product_review',
  'comparison',
  'buying_guide',
  'social_post'
);

create type public.generation_status as enum (
  'pending',
  'completed',
  'failed'
);

create table public.generations (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  title         text not null,
  content_type  public.content_type not null,
  product_name  text not null,
  affiliate_url text,
  keywords      text[],
  tone          text default 'professional',
  prompt        text not null,
  output        text,
  tokens_used   integer,
  credits_cost  integer not null default 1,
  status        public.generation_status not null default 'pending',
  error_message text,
  created_at    timestamptz not null default now(),
  completed_at  timestamptz
);

create index idx_generations_user_created on public.generations(user_id, created_at desc);
create index idx_credit_tx_user on public.credit_transactions(user_id, created_at desc);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  bonus constant integer := 5;
begin
  perform set_config('app.allow_credit_update', 'true', true);

  insert into public.profiles (id, email, credits)
  values (new.id, new.email, bonus);

  insert into public.credit_transactions (user_id, amount, balance_after, reason)
  values (new.id, bonus, bonus, 'signup_bonus');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- atomic credit deduction + generation
create or replace function public.create_generation_with_credit(
  p_user_id       uuid,
  p_title         text,
  p_content_type  public.content_type,
  p_product_name  text,
  p_affiliate_url text,
  p_keywords      text[],
  p_tone          text,
  p_prompt        text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance   integer;
  v_gen_id    uuid;
  v_cost      constant integer := 1;
begin
  select credits into v_balance
  from public.profiles
  where id = p_user_id
  for update;

  if v_balance is null then
    raise exception 'USER_NOT_FOUND';
  end if;

  if v_balance < v_cost then
    raise exception 'INSUFFICIENT_CREDITS';
  end if;

  perform set_config('app.allow_credit_update', 'true', true);

  update public.profiles
  set credits = credits - v_cost,
      updated_at = now()
  where id = p_user_id
  returning credits into v_balance;

  insert into public.generations (
    user_id, title, content_type, product_name, affiliate_url,
    keywords, tone, prompt, credits_cost, status
  ) values (
    p_user_id, p_title, p_content_type, p_product_name, p_affiliate_url,
    p_keywords, p_tone, p_prompt, v_cost, 'pending'
  ) returning id into v_gen_id;

  insert into public.credit_transactions (
    user_id, amount, balance_after, reason, reference_id
  ) values (
    p_user_id, -v_cost, v_balance, 'generation', v_gen_id
  );

  return v_gen_id;
end;
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.generations enable row level security;
alter table public.credit_transactions enable row level security;

create policy "Users read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users read own generations"
  on public.generations for select using (auth.uid() = user_id);

create policy "Users insert own generations"
  on public.generations for insert with check (auth.uid() = user_id);

create policy "Users update own generations"
  on public.generations for update using (auth.uid() = user_id);

create policy "Users read own transactions"
  on public.credit_transactions for select using (auth.uid() = user_id);
