import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { session } from "@/lib/auth";

const schema = z.object({ name: z.string().trim().min(2).max(120), roundName: z.string().trim().min(1).max(80), stake: z.coerce.number().positive().max(10000), deadline: z.string().min(10), matches: z.string().trim().min(3) });
export async function POST(req: Request) {
  const s = await session();
  if (!s || s.role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const parsed = schema.safeParse(Object.fromEntries(await req.formData()));
  if (!parsed.success) return NextResponse.json({ error: "Datos no válidos" }, { status: 400 });
  const matches = parsed.data.matches.split("\n").map(line => line.trim()).filter(Boolean).map(line => line.split("|").map(v => v.trim()));
  if (!matches.length || matches.length > 20 || matches.some(m => m.length !== 2 || !m[0] || !m[1])) return NextResponse.json({ error: "Usa: Local|Visitante" }, { status: 400 });
  const conn = await db().getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.execute<any>("INSERT INTO pools(name,round_name,stake,deadline,status,created_by) VALUES(?,?,?,?,'OPEN',?)", [parsed.data.name, parsed.data.roundName, parsed.data.stake, new Date(parsed.data.deadline), s.userId]);
    for (const [index, [home, away]] of matches.entries()) await conn.execute("INSERT INTO matches(pool_id,position,home_team,away_team) VALUES(?,?,?,?)", [result.insertId, index + 1, home, away]);
    await conn.commit();
  } catch (error) { await conn.rollback(); throw error; } finally { conn.release(); }
  return NextResponse.redirect(new URL("/admin?created=pool", req.url), 303);
}
