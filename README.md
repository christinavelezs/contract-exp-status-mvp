# Gestor de contratos con semaforización de vencimiento

Prototipo/MVP interno para Enotria (proyecto del curso Claude Code). Permite a cada
asesor comercial visualizar el estado de sus contratos según proximidad al vencimiento
(120/90/60/30 días), para anticipar renegociaciones antes de que un contrato se renueve
automáticamente en condiciones desfavorables. Usa datos ficticios — ver `docs/spec.md`
para la especificación funcional completa.

## Stack

- Node.js + Express
- SQLite (`better-sqlite3`) como base de datos
- Jest + Supertest para tests

## Instalación

Este proyecto usa **pnpm** exclusivamente (nunca npm ni yarn). Si no lo tienes instalado:

```bash
corepack enable
corepack prepare pnpm@latest --activate
# o, si no usas corepack:
npm install -g pnpm
```

Luego instala las dependencias del proyecto:

```bash
pnpm install
```

## Migraciones y datos ficticios

```bash
pnpm run migrate   # crea el esquema (tablas asesores/contratos) en DATABASE_PATH
pnpm run seed      # carga asesores y contratos ficticios con fechas relativas a "hoy"
```

`DATABASE_PATH` se configura en `.env` (ver `.env.example`); por defecto usa
`./data/dev.sqlite3`.

## Levantar el servidor

```bash
pnpm run dev    # con recarga automática (node --watch)
pnpm start      # modo normal
```

## Correr los tests

```bash
pnpm test           # unitarios + integración
pnpm run test:watch # modo watch
```

## Endpoints

Prefijo `/api` para todas las rutas.

| Método   | Ruta                       | Descripción                                                                 |
|----------|----------------------------|------------------------------------------------------------------------------|
| `POST`   | `/api/contratos`           | Crea un contrato. Valida el body y verifica que el asesor exista.           |
| `GET`    | `/api/contratos`           | Lista contratos ordenados por urgencia. Filtros: `?color=`, `?asesorId=`.   |
| `GET`    | `/api/contratos/por-asesor`| Contratos agrupados por asesor comercial (asesores sin contratos → `[]`).    |
| `GET`    | `/api/contratos/:id`       | Detalle de un contrato (404 si no existe).                                   |
| `PUT`    | `/api/contratos/:id`       | Actualiza un contrato (ej. renovar condiciones o cambiar vencimiento).      |
| `DELETE` | `/api/contratos/:id`       | Elimina un contrato.                                                         |
| `GET`    | `/api/asesores`            | Lista de asesores comerciales.                                              |
| `GET`    | `/api/asesores/:id`        | Detalle de un asesor con el conteo de sus contratos por color de semáforo.  |

Colores de semáforo posibles: `VERDE`, `AMARILLO`, `NARANJA`, `ROJO`, `ROJO_CRITICO`, `VENCIDO`.
