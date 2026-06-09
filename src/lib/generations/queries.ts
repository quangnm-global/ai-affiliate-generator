import { createClient } from "@/lib/supabase/server";
import { HISTORY_PAGE_SIZE } from "@/lib/generations/constants";
import type { HistorySearchParams } from "@/lib/validations/history";
import type { Generation } from "@/types/database";

export interface PaginatedGenerations {
  data: Generation[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getPaginatedGenerations(
  userId: string,
  params: HistorySearchParams
): Promise<PaginatedGenerations> {
  const supabase = await createClient();
  const page = params.page;
  const from = (page - 1) * HISTORY_PAGE_SIZE;
  const to = from + HISTORY_PAGE_SIZE - 1;

  let query = supabase
    .from("generations")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (params.q) {
    query = query.ilike("product_name", `%${params.q}%`);
  }

  const { data, count, error } = await query.range(from, to);

  if (error) {
    return {
      data: [],
      total: 0,
      page,
      pageSize: HISTORY_PAGE_SIZE,
      totalPages: 0,
    };
  }

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / HISTORY_PAGE_SIZE));

  return {
    data: (data ?? []) as Generation[],
    total,
    page,
    pageSize: HISTORY_PAGE_SIZE,
    totalPages: total === 0 ? 0 : totalPages,
  };
}

export async function getGenerationById(
  userId: string,
  id: string
): Promise<Generation | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("generations")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  return (data as Generation | null) ?? null;
}
