import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Pages only signed-in users can open. Later features add their pages here.
const SIGNED_IN_ONLY = ["/purchases", "/starred", "/dashboard", "/cards", "/account"];
// Pages that make no sense once you're signed in.
const SIGNED_OUT_ONLY = ["/login", "/signup"];

function startsWithAny(path: string, prefixes: string[]) {
  return prefixes.some((prefix) => path === prefix || path.startsWith(prefix + "/"));
}

// Runs before every page request (from proxy.ts): keeps the login session fresh
// and sends people to the right place depending on whether they're signed in.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    },
  );

  // Checks the session (and refreshes it if it's about to expire).
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);
  const path = request.nextUrl.pathname;

  if (!signedIn && startsWithAny(path, SIGNED_IN_ONLY)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (signedIn && startsWithAny(path, SIGNED_OUT_ONLY)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
