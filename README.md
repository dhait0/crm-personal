# CRM Personal

Base inicial para un CRM personal orientado a propuestas y oportunidades de proyectos.

## Stack

- React + TypeScript + Vite
- Supabase para persistencia e ingesta automatica
- Sentry para observabilidad

## Variables de entorno

Duplica `.env.example` a `.env` y define:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_SENTRY_DSN=...
```

Sin variables de Supabase, la app funciona en modo demo con `localStorage`.

## Comandos

```bash
npm install
npm run dev
npm run build
```

## Docker Compose

El frontend puede correr en contenedor sin incluir el backend:

```bash
docker compose up --build
```

Si quieres sincronizacion y reconstruccion automatica con Compose Watch:

```bash
docker compose watch
```

`src/` y archivos de configuracion se sincronizan al contenedor. Cambios en `package.json` o `package-lock.json` disparan rebuild.

## Supabase

1. Ejecuta la migracion en `supabase/migrations/001_init.sql`.
2. Despliega `supabase/functions/intake-opportunity`.
3. Configura el secreto `INTAKE_TOKEN`.

## Gmail personal

Conectar directamente el inbox principal no es la mejor primera version. La opcion mas controlable es:

1. Crear un label dedicado en Gmail.
2. Filtrar correos de oportunidades o propuestas.
3. Reenviarlos a Google Apps Script, Zapier o n8n.
4. Publicar en `intake-opportunity` con `x-intake-token`.

Eso reduce ruido, evita parsear todo el correo personal y mantiene el backend simple.
