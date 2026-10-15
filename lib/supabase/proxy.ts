import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, supabaseEnv } from "./env";

const AUTH_ROUTES = ["/welcome", "/signup", "/login"];

let warnedAboutKeys = false;

// Refreshes the Supabase session cookies, then applies route protection:
// logged out → app routes go to /welcome; logged in → auth routes go to /app.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  let isLoggedIn = false;

  if (isSupabaseConfigured()) {
    const { url, anonKey } = supabaseEnv();
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) =>
            response.headers.set(key, value),
          );
        },
      },
    });

    // Don't run code between createServerClient and getClaims: this call is
    // what refreshes an expired session and writes the new cookies.
    const { data } = await supabase.auth.getClaims();
    isLoggedIn = Boolean(data?.claims);
  } else if (!warnedAboutKeys) {
    // No keys yet (fresh clone). Nobody can be logged in, so the public
    // screens still render; signing up or logging in reports what's missing.
    warnedAboutKeys = true;
    console.warn(
      "Supabase keys are missing: copy .env.example to .env.local, fill them in, and restart.",
    );
  }

  const { pathname } = request.nextUrl;
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isPublic = pathname === "/" || isAuthRoute;

  if (!isLoggedIn && !isPublic) {
    return redirectTo("/welcome", request, response);
  }
  if (isLoggedIn && isAuthRoute) {
    return redirectTo("/app", request, response);
  }
  return response;
}

// Redirect, keeping any refreshed session cookies set on `from`.
function redirectTo(path: string, request: NextRequest, from: NextResponse) {
  const url = request.nextUrl.clone();
  url.pathname = path;
  url.search = "";

  const redirect = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}
