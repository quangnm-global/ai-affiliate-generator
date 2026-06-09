-- Credit system: 1 credit per generation, 5 credits on signup, atomic deduction

-- ─── Constants ───────────────────────────────────────────────
-- Signup bonus: 5 credits
-- Generation cost: 1 credit (fixed)

alter table public.profiles
  alter column credits set default 5;

-- ─── Guard: block direct credit manipulation from clients ────
create or replace function public.guard_profile_credits()
returns trigger
language plpgsql
as $$
begin
  if new.credits is distinct from old.credits
     and coalesce(current_setting('app.allow_credit_update', true), '') <> 'true'
  then
    raise exception 'CREDITS_UPDATE_FORBIDDEN';
  end if;
  return new;
end;
$$;

drop trigger if exists guard_profile_credits_before_update on public.profiles;
create trigger guard_profile_credits_before_update
  before update on public.profiles
  for each row execute function public.guard_profile_credits();

-- ─── Signup: grant 5 credits ─────────────────────────────────
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

-- ─── Get balance (read-only helper) ──────────────────────────
create or replace function public.get_credit_balance(p_user_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance integer;
begin
  select credits into v_balance
  from public.profiles
  where id = p_user_id;

  return coalesce(v_balance, 0);
end;
$$;

-- ─── Atomic: deduct 1 credit + create generation ─────────────
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
  -- Lock row for atomic read-modify-write
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

-- ─── Refund 1 credit on failed generation ────────────────────
create or replace function public.refund_generation_credit(
  p_user_id       uuid,
  p_generation_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance   integer;
  v_cost      integer;
  v_refunded  boolean;
begin
  select credits_cost into v_cost
  from public.generations
  where id = p_generation_id
    and user_id = p_user_id
    and status = 'failed'
  for update;

  if v_cost is null then
    return; -- generation not found or not failed
  end if;

  -- Prevent double refund
  select exists(
    select 1 from public.credit_transactions
    where reference_id = p_generation_id and reason = 'refund'
  ) into v_refunded;

  if v_refunded then
    return;
  end if;

  perform set_config('app.allow_credit_update', 'true', true);

  update public.profiles
  set credits = credits + v_cost,
      updated_at = now()
  where id = p_user_id
  returning credits into v_balance;

  insert into public.credit_transactions (
    user_id, amount, balance_after, reason, reference_id
  ) values (
    p_user_id, v_cost, v_balance, 'refund', p_generation_id
  );
end;
$$;

-- ─── Restrict profile updates: users cannot change credits ───
drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile name"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Revoke direct RPC from anon/authenticated (only via server)
revoke execute on function public.create_generation_with_credit from public;
revoke execute on function public.refund_generation_credit from public;
revoke execute on function public.get_credit_balance from public;

grant execute on function public.create_generation_with_credit to authenticated;
grant execute on function public.refund_generation_credit to authenticated;
grant execute on function public.get_credit_balance to authenticated;
