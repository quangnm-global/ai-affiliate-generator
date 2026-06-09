-- Index for history search by product name (ilike with user_id filter)
create index if not exists idx_generations_user_product
  on public.generations(user_id, product_name);
