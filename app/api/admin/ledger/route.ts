import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { session } from "@/lib/auth";

const schema = z.object({ userId: z.coerce.number().int().positive(), amount: z.coerce.number().positive().max(100000), note: z.string().trim().max(255).optional() });
export async function POST(req: Request) {
  const s = await session();
  if (!s || s.role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const parsed = schema.safeParse(Object.fromEntries(await req.formData()));
  if (!parsed.success) return NextResponse.json({ error: "Aportación no válida" }, { status: 400 });
  await db().execute("INSERT INTO ledger(user_id,type,amount,note,created_by) VALUES(?,'CONTRIBUTION',?,?,?)", [parsed.data.userId, parsed.data.amount, parsed.data.note || "Aportación", s.userId]);
  return NextResponse.redirect(new URL("/admin?created=contribution", req.url), 303);
}
