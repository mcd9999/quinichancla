# Quinichancla

MVP para gestionar quinielas de fútbol entre amigos.

## Incluido

- Inicio de sesión y roles `USER` / `ADMIN`.
- Jornadas con partidos, fecha límite y coste.
- Pronóstico único por usuario con selecciones `1/X/2`.
- Descuento automático del saldo al enviar el pronóstico.
- Libro contable por usuario: aportaciones, participaciones, ajustes y premios.
- Panel personal y vista administrativa inicial.
- Operaciones críticas en transacciones MySQL.

## Puesta en marcha

1. Crear una base MySQL y ejecutar `database/schema.sql`.
2. Copiar `.env.example` a `.env.local` y completar las variables.
3. Ejecutar `npm install` y `npm run dev`.
4. Crear el primer admin: `node --env-file=.env.local database/seed-admin.mjs "Nombre" "email" "contraseña"`.

## Reglas actuales

- El administrador establece un coste por quiniela.
- Cada usuario aporta saldo mediante movimientos contables.
- Al enviar un pronóstico se comprueba saldo suficiente y se descuenta el coste.
- No se puede modificar después de enviado ni enviar fuera de plazo.

## Siguiente bloque

CRUD administrativo de usuarios, aportaciones, quinielas y partidos; cálculo de aciertos; premios; recuperación de contraseña; auditoría; pruebas automatizadas; y configuración del despliegue.
