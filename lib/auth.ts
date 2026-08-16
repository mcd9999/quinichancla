import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type Session = { userId: number; name: string; role: "USER" | "ADMIN" };
const key = () => new TextEncoder().encode(process.env.AUTH_SECRET);

export async function createSession(data: Session) {
  const token = await new SignJWT(data).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(key());
  (await cookies()).set("quinichancla_session", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 604800 });
}

export async function session(): Promise<Session | null> {
  const token = (await cookies()).get("quinichancla_session")?.value;
  if (!token || !process.env.AUTH_SECRET) return null;
  try { return (await jwtVerify(token, key())).payload as unknown as Session; } catch { return null; }
}

export async function requireUser() { const s = await session(); if (!s) redirect("/login"); return s; }
export async function requireAdmin() { const s = await requireUser(); if (s.role !== "ADMIN") redirect("/"); return s; }
