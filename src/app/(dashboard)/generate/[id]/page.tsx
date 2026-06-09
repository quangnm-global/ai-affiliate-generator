import { redirect } from "next/navigation";

interface GenerateDetailRedirectProps {
  params: Promise<{ id: string }>;
}

/** @deprecated Use /history/[id] — kept for backward compatibility */
export default async function GenerateDetailRedirect({
  params,
}: GenerateDetailRedirectProps) {
  const { id } = await params;
  redirect(`/history/${id}`);
}
