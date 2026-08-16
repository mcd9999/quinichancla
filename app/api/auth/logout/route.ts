import { cookies } from "next/headers"; import { NextResponse } from "next/server";
export async function POST(req:Request){(await cookies()).delete("quinichancla_session");return NextResponse.redirect(new URL("/login",req.url),303)}
