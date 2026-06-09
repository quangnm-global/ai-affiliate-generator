import { NextResponse } from "next/server";

import { guardReadRequest } from "@/lib/abuse-prevention/api-guard";
import { abuseJsonResponse } from "@/lib/abuse-prevention/responses";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await guardReadRequest();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  if (!UUID_REGEX.test(id)) {
    return abuseJsonResponse(400, {
      error: "Invalid generation id",
      code: "VALIDATION",
    });
  }

  const { user, supabase } = auth;

  const { data, error } = await supabase
    .from("generations")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}
