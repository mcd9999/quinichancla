import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function Admin() {
  await requireAdmin();
  const [users] = await db().query<any[]>("SELECT u.id,u.name,u.email,u.role,b.balance FROM users u JOIN user_balances b ON b.user_id=u.id ORDER BY u.name");
  const [pools] = await db().query<any[]>("SELECT id,name,round_name,stake,deadline,status FROM pools ORDER BY created_at DESC");
  return <section>
    <div className="eyebrow">ADMINISTRACIÓN</div><h1>Control de la peña</h1>
    <div className="grid">
      <form className="panel" action="/api/admin/users" method="post"><h2>Nuevo usuario</h2><input name="name" placeholder="Nombre" required/><input name="email" type="email" placeholder="Email" required/><input name="password" type="password" placeholder="Contraseña (mínimo 8)" minLength={8} required/><select name="role"><option value="USER">Usuario</option><option value="ADMIN">Administrador</option></select><button className="btn">Crear usuario</button></form>
      <form className="panel" action="/api/admin/ledger" method="post"><h2>Añadir aportación</h2><select name="userId" required><option value="">Selecciona usuario</option>{users.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select><input name="amount" type="number" min="0.01" step="0.01" placeholder="Importe €" required/><input name="note" placeholder="Nota (opcional)"/><button className="btn">Sumar saldo</button></form>
    </div>
    <form className="panel admin-form" action="/api/admin/pools" method="post"><h2>Nueva quiniela</h2><div className="grid"><input name="name" placeholder="Nombre" required/><input name="roundName" placeholder="Jornada" required/><input name="stake" type="number" min="0.01" step="0.01" placeholder="Coste por usuario €" required/><input name="deadline" type="datetime-local" required/></div><label>Partidos, uno por línea: <code>Local|Visitante</code><textarea name="matches" rows={8} placeholder={'Real Madrid|Barcelona\nSevilla|Betis'} required/></label><button className="btn">Crear y abrir</button></form>
    <div className="grid"><div className="panel"><h2>Usuarios y saldos</h2><table><tbody>{users.map(u=><tr key={u.id}><td>{u.name}<small className="muted"> · {u.role}</small></td><td>{Number(u.balance).toFixed(2)} €</td></tr>)}</tbody></table></div><div className="panel"><h2>Quinielas</h2><table><tbody>{pools.map(p=><tr key={p.id}><td>{p.name}<small className="muted"> · {p.status}</small></td><td>{Number(p.stake).toFixed(2)} €</td></tr>)}</tbody></table></div></div>
  </section>;
}
