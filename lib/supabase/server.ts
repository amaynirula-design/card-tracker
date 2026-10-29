import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// A Supabase client for server code (pages and server actions). It reads the
// logged-in user's session from the browser's cookies, so every database query
// runs as that user and row-level security applies.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Pages can't set cookies, only server actions can. That's fine:
            // proxy.ts already refreshed the session before the page ran.
          }
        },
      },
    },
  );
}
