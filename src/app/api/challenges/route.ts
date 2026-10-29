import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { mapProblem, ProblemRow } from "@/lib/supabase/mappers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = createAdminSupabase();
    const { data, error } = await admin
      .from("problem_statements")
      .select("*")
      .eq("is_published", true)
      .order("code");

    if (error) throw new Error(error.message);

    return NextResponse.json({ challenges: (data || []).map((row) => mapProblem(row as ProblemRow)) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
