# CLAUDE.md

## Proyecto
Gestor de contratos de cliente con semaforización de alertas de vencimiento
por asesor comercial (120/90/60/30 días antes del vencimiento).
Prototipo/MVP interno para Enotria — proyecto del curso Claude Code.

## Stack
- Node.js + Express
- SQLite como base de datos
- Jest para tests

## Estructura de carpetas (objetivo)
src/
  routes/       # endpoints REST
  controllers/
  models/       # acceso a datos (SQLite)
  schemas/      # validación de entrada
  services/     # lógica de negocio (ej. cálculo de semáforo)
tests/
docs/
  spec.md
.claude/
  skills/

## Comandos
- pnpm install
- pnpm run dev
- pnpm test

## Convenciones
- Fechas en formato ISO 8601 (YYYY-MM-DD)
- Cada endpoint valida su entrada antes de tocar la base de datos
- Los umbrales de alerta (120/90/60/30) viven en una sola constante, no repetidos en el código

## Reglas
- NUNCA hardcodees los umbrales de días en más de un lugar
- SIEMPRE valida la entrada antes de tocar la base de datos
- NUNCA uses datos reales de clientes o asesores de Enotria; solo datos ficticios
- SIEMPRE usa pnpm para instalar dependencias; nunca npm ni yarn
- No modifiques /migrations ni archivos .env sin avisar
