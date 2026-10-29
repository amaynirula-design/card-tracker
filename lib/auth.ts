import "server-only";
import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  email: string;
  // When the row in our users table was created; null if the row is missing.
  createdAt: string | null;
};

// Who is logged in right now, or null if nobody is. Reads the user's row from
// our own public.users table; row-level security only lets them see their own.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const claims = auth?.claims;
  if (!claims) return null;

  const { data: row } = await supabase
    .from("users")
    .select("id, email, created_at")
    .eq("id", claims.sub)
    .maybeSingle();

  return {
    id: claims.sub,
    email: row?.email ?? claims.email ?? "",
    createdAt: row?.created_at ?? null,
  };
}
