import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export type PendingCookie = {
  name: string;
  value: string;
  options: {
    path?: string;
    domain?: string;
    maxAge?: number;
    expires?: Date;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none";
  };
};

/**
 * Cookie-backed Supabase client for Route Handlers.
 * Auth writes are queued in `pending` and must be attached to the outgoing
 * response with `attachCookies` so cookies survive redirects/json replies.
 */
export function createRouteSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)");
  }

  const cookieStore = cookies();
  const pending: PendingCookie[] = [];

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: PendingCookie[]) {
        cookiesToSet.forEach((cookie) => pending.push(cookie));
      },
    },
  });

  return { supabase, pending };
}

export function attachCookies<T extends NextResponse>(response: T, pending: PendingCookie[]): T {
  pending.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2]);
  });
  return response;
}

export function jsonWithCookies<T extends NextResponse>(response: T, pending: PendingCookie[]): T {
  return attachCookies(response, pending);
}
