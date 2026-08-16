import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { session } from "@/lib/auth";

const schema = z.object({ name: z.string().trim().min(2).max(80), email: z.string().email().max(190), password: z.string().min(8).max(100), role: z.enum(["USER", "ADMIN"]) });
export async function POST(req: Request) {
  const s = await session();
  if (!s || s.role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const parsed = schema.safeParse(Object.fromEntries(await req.formData()));
  if (!parsed.success) return NextResponse.json({ error: "Datos no válidos" }, { status: 400 });
  const { name, email, password, role } = parsed.data;
  await db().execute("INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,?)", [name, email.toLowerCase(), await bcrypt.hash(password, 12), role]);
  return NextResponse.redirect(new URL("/admin?created=user", req.url), 303);
}
