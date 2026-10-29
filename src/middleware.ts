import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/team", "/submission", "/onboarding", "/notifications", "/admin"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const path = request.nextUrl.pathname;

  if (url && anonKey) {
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isProtected = PROTECTED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));

    if (isProtected && !user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.search = `?next=${encodeURIComponent(path)}`;
      return NextResponse.redirect(redirectUrl);
    }

    if (user && (path === "/login" || path === "/register")) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|api/|img/|fonts/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|otf)$).*)"],
};
