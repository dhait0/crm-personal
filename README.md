# CRM Personal

Base inicial para un CRM personal orientado a propuestas y oportunidades de proyectos.

## Stack

- Next.js Pages Router
- PostgreSQL + Prisma ORM
- API Routes para login y oportunidades
- Sentry para observabilidad

## Variables de entorno

Duplica `.env.example` a `.env` y define:

```bash
NEXT_PUBLIC_SENTRY_DSN=...
AUTH_SECRET=...
DATABASE_URL=postgresql://crm_user:crm_password@localhost:5432/crm_personal?schema=public
INTAKE_TOKEN=...
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
```

## Comandos

```bash
npm install
npm run dev
npm run build
npx prisma generate
npx prisma migrate dev
npm run user:seed -- --email tu@email.com --password "tu-password"
```

## Docker Compose

El stack local corre con PostgreSQL y una sola app Next:

```bash
docker compose up --build
```

Si quieres sincronizacion y reconstruccion automatica con Compose Watch:

```bash
docker compose watch
```

`src/` y archivos de configuracion se sincronizan al contenedor. Cambios en `package.json` o `package-lock.json` disparan rebuild.

## Prisma y PostgreSQL

1. Levanta PostgreSQL.
2. Ejecuta `npx prisma generate`.
3. Ejecuta `npx prisma migrate dev`.
4. Crea tu usuario inicial con `npm run user:seed`.
5. Inicia la app con `npm run dev`.

El esquema vive en [prisma/schema.prisma](/Users/keys/Documents/crm_personal/prisma/schema.prisma).

## Login

- `GET /login`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /dashboard` protegido por sesion en cookie

La sesion usa `AUTH_SECRET` y cookie `httpOnly`.

## API REST

- `GET /api/health`
- `GET /api/opportunities`
- `POST /api/opportunities`
- `POST /api/intake/opportunities` con header `x-intake-token`

## Gmail personal

Conectar directamente el inbox principal no es la mejor primera version. La opcion mas controlable es:

1. Crear un label dedicado en Gmail.
2. Filtrar correos de oportunidades o propuestas.
3. Reenviarlos a Google Apps Script, Zapier o n8n.
4. Publicar en `/api/intake/opportunities` con `x-intake-token`.

Eso reduce ruido, evita parsear todo el correo personal y mantiene el backend simple.

Hay un ejemplo listo en [gmail-apps-script.js](/Users/keys/Documents/crm_personal/docs/gmail-apps-script.js).
