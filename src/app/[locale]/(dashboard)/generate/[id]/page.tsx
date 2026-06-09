import { redirect } from "@/i18n/navigation";

interface GenerateDetailRedirectProps {
  params: Promise<{ locale: string; id: string }>;
}

/** @deprecated Use /history/[id] — kept for backward compatibility */
export default async function GenerateDetailRedirect({
  params,
}: GenerateDetailRedirectProps) {
  const { locale, id } = await params;
  redirect({ href: `/history/${id}`, locale });
}
