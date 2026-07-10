# .claude/skills/nuevo-endpoint/SKILL.md

## Skill: Crear un endpoint en el Gestor de Contratos

Cuando te pidan un endpoint nuevo sobre contratos (o una entidad similar),
sigue este patrón exacto, en este orden:

1. Define el schema de validación en `src/schemas/` usando zod
   (nombre: `<entidad>.schema.js`). Sigue el patrón de
   `contrato.schema.js`: separa el schema de creación del de
   actualización (con `.partial()` + `.refine()` para exigir al menos
   un campo).

2. Agrega el método correspondiente en `src/models/<entidad>.model.js`
   usando better-sqlite3 (consultas preparadas, nunca concatenación
   de strings en SQL).

3. Si hay lógica de negocio (cálculos, enriquecimiento, agrupación),
   colócala en `src/services/`, nunca directamente en el controlador.

4. Crea o extiende el controlador en `src/controllers/`, y la ruta en
   `src/routes/`, montándola bajo `/api` en `src/routes/index.js`.

5. Aplica la validación con el middleware `src/middlewares/validate.js`
   antes de que el controller toque el modelo.

6. Agrega al menos un test unitario (schema o service) y un test de
   integración (en `tests/integration/`) que cubra el happy path y
   un caso de error (ej. 400 o 404).

## Reglas
- NUNCA escribas SQL con concatenación de strings; usa siempre
  consultas preparadas de better-sqlite3.
- NUNCA pongas lógica de negocio en el controlador; va en `services/`.
- SIEMPRE valida con zod antes de tocar la base de datos.
- SIEMPRE usa pnpm para instalar cualquier dependencia nueva.
- La respuesta HTTP siempre se envuelve en `{ "data": ... }`.
