import mysql from "mysql2/promise";

let pool: mysql.Pool | undefined;
export function db() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL no configurada");
  pool ??= mysql.createPool({ uri: process.env.DATABASE_URL, connectionLimit: 10, decimalNumbers: true });
  return pool;
}
