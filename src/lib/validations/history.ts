import { z } from "zod";

import { HISTORY_MAX_SEARCH_LENGTH } from "@/lib/generations/constants";

export const historySearchParamsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  q: z
    .string()
    .max(HISTORY_MAX_SEARCH_LENGTH)
    .optional()
    .transform((val) => val?.trim() || undefined),
});

export type HistorySearchParams = z.infer<typeof historySearchParamsSchema>;

export function buildHistoryUrl(params: { page?: number; q?: string }) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.page && params.page > 1) search.set("page", String(params.page));
  const qs = search.toString();
  return qs ? `/history?${qs}` : "/history";
}
