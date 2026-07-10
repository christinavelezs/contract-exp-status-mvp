# Bitácora — Gestor de contratos con semaforización de vencimiento

Proyecto: `contract-exp-status-mvp`
Curso: Claude Code desde cero — Certificación Claude Code Dev (Coding Latam)
Repositorio: https://github.com/christinavelezs/contract-exp-status-mvp

---

## Fase 0 · Preparar el terreno

Configuración del entorno:
- Instalación en equipo (primera vez con Claude Code) e inicio del proyecto con `CLAUDE.md`.

- [CAPTURA: instalación de Claude Code — pantalla con "Claude Code successfully installed!", versión 2.1.205]
- [CAPTURA: error inicial "zsh: command not found: claude" antes de corregir el PATH]
- [CAPTURA: pantalla de bienvenida "Welcome back Christina!" tras el login con la cuenta Team]
- [CAPTURA: intento de `/init` sobre repo vacío — menú "The directory is empty" / "Skip CLAUDE.md for now"]

**Qué se hizo:** se creó CLAUDE.md manualmente para evitar que se genere un 
archivo vacío. Para esto, con ayuda de Claude, se definió de antemano el 
stack (Node.js + Express + SQLite + Jest), estructura de carpetas objetivo, 
comandos del proyecto, convenciones (fechas ISO 8601, umbrales de alerta en
una sola constante) y reglas imperativas, incluyendo la instrucción del profesor 
de usar siempre `pnpm` para instalar dependencias.

---

## Fase 1 · Definir el trabajo (SDD)

Se escribió `docs/spec.md` antes de generar código, con: objetivo,
6 requisitos numerados, criterios de aceptación con casos exactos (25, 45,
75, 95, 200 y -10 días), casos anómalos (contrato vencido, sin fecha de
vencimiento, asesor sin contratos asignados) y fuera de alcance (renovación
automática real, notificaciones por email/SMS, integración con sistemas
reales de Enotria).

- [CAPTURA opcional: confirmación de creación de docs/spec.md en Claude Code]

---

## Fase 2 · Planificar (Plan Mode)

Se activó `/plan` pidiéndole a Claude que leyera `docs/spec.md` y `CLAUDE.md`
para que proponga estructura de archivos, endpoints, modelo de datos y tests.
Antes de aprobar, el plan se detuvo dos veces a pedir confirmación, y se
identificó un tercer punto faltante que se agregó manualmente.

### Ajuste 1 — Librerías extra

El CLAUDE.md solo declaraba Express/SQLite/Jest. El plan propuso añadir
`zod` (validación de esquemas) y `better-sqlite3` (driver síncrono). Se
investigó con Claude para decidir si añadir o no.

- [CAPTURA "ANTES": menú "Librerías extra" con opciones "Sí, zod + better-sqlite3" vs "Sin librerías extra"]

Se aprobaron ambas por guaurdar coherencia con la carpeta `schemas/` ya
definida en el CLAUDE.md.

### Ajuste 2 — Alcance CRUD

El plan ofrecía dos opciones, que no cumplían con el requisito obligatorio
de "operaciones CRUD completas" del caso de estudio:
1. Incluir solo POST, sin PATCH/DELETE.
2. Solo lectura (GET) + datos sembrados vía seed.js, sin endpoint de creación.

- [CAPTURA "ANTES": menú "Alcance CRUD" con las dos opciones incompletas]

Se rechazaron ambas opciones y se escribió manualmente la corrección
pidiendo las 5 operaciones: `POST`, `GET` listar, `GET` por id, `PUT`,
`DELETE`, más `seed.js` para datos ficticios en los contratos.

- [CAPTURA "DESPUÉS": instrucción escrita pidiendo el CRUD completo]

### Ajuste 3 — README faltante

Al revisar el plan generado en texto, se detectó que no incluía `README.md`
en la estructura de archivos. Se agregó a través de instrucción manual antes
de aprobar el plan.

- [CAPTURA: plan final aprobado, ya con README.md incluido en la estructura]

---

## Fase 3 · Implementar

Ejecución del plan aprobado en auto mode.

- [CAPTURA: resumen final de auto mode — archivos creados, resultado de tests]

**Fricción de entorno:** la máquina no tenía Node/npm/pnpm instalados (en los
pasos iniciales no hizo correctamente la instalación), lo que no permitió la
verificación automática (`pnpm install`, `migrate`, `seed`, `test`) durante 
la ejecución del plan. Se resolvió instalando Node.js desde nodejs.org y habilitando
pnpm vía corepack.

- [CAPTURA: error "EACCES: permission denied" al habilitar corepack sin sudo]
- [CAPTURA: `sudo corepack enable` ejecutado correctamente]
- [CAPTURA: `pnpm --version` → 11.11.0]

**Resultado de la verificación automatizada:**

- [CAPTURA: resultado "40/40 tests pasaron"]

**Verificación manual contra datos reales:** a sugerencia de Claude se levantó el 
servidor con `pnpm run dev` en segundo plano y se probó con `curl`:
- `GET /api/contratos` → orden correcto por urgencia (vencido primero, verde
  al final).
- `GET /api/contratos/por-asesor` → agrupación correcta, caso raro de asesor
  sin contratos verificado (`contratos: []`).
- `GET /api/contratos?color=ROJO_CRITICO` → filtro correcto.

- [CAPTURA: respuestas de los tres endpoints probados con curl]

Se detuvo el servidor al finalizar la verificación.

---

## Fase 4 · Automatizar el estilo (Skill)

Se creó `.claude/skills/nuevo-endpoint/SKILL.md`, documentando el patrón
usado en el proyecto: 
schema (zod) → modelo (better-sqlite3, consultas preparadas) → servicio (lógica de negocio) 
→ controlador/ruta → tests (unitario + integración)
junto con reglas imperativas (nunca SQL por concatenación, siempre pnpm, siempre envolver la respuesta en `{ "data": ... }`).

- [CAPTURA: creación del archivo SKILL.md, "Wrote 37 lines"]

**Prueba del Skill:** se pidió un segundo endpoint (`GET /api/asesores/:id`
con conteo de contratos por color de semáforo) sin repetir ninguna regla del
patrón. Claude Code siguió el Skill sin que se le recordara (-sigo sin entender 
bien como identifica las palabras-):
- Reutilizó `COLORES_SEMAFORO` como si fuese su única opción a usar.
- Puso la lógica de negocio en `src/services/asesor.service.js`.
- Manejó el 404 para asesor inexistente.
- Agregó tests unitarios y de integración.
- Actualizó el README con la nueva fila en la tabla de endpoints, aunque no 
se pidió explicitamente.

- [CAPTURA: resultado de la prueba del skill — "45/45 tests" + resumen de lo implementado]

---

## Fase 5 · Bonus — MCP Servers

Se intentó conectar el MCP de GitHub para crear el repositorio remoto y
hacer el push directamente desde Claude Code.

- [CAPTURA: primer intento fallido — "Invalid environment variable format" con `--env`]
- [CAPTURA: `claude mcp list` mostrando "github: ... ✓ Connected"]
- [CAPTURA: sesión de Claude Code sin detectar el MCP pese a estar conectado — "No tengo acceso a un MCP de GitHub"]

**Causa raíz identificada:** Además de no escribir los comandos correctos en la terminal 
separada para la conexión con el MCP al inicio, cuando se logró hacer la instalación no 
se hizo en donde el proyecto la alcance sino "fuera". Para corregir, se reinicio sesión
en Claude y se avanzo a partir de las sugerencias que daba el mismo Claude.


- [CAPTURA: repositorio creado y pusheado — "Listo — repositorio creado y pusheado" con la URL final]

---

## Qué aprendí

- Plan Mode no siempre propone el alcance "correcto" por defecto (el caso del
  CRUD incompleto); hay que leerlo contra los requisitos reales de lo que se 
  requiere construir, no solo contra lo técnicamente razonable o lo más simple 
  de implementar.
- Si el Skill esta "bien escrito" (y descrito), se nota cuando Claude aplica 
  el patrón completo en una tarea nueva sin que se le repitan las reglas. 
  Se comprueba que esa parte que se encapsulo sí es reproducible.
- No toda MCP funciona igual en todos los entornos, pasó también con la 
  limitación de autenticación que lanzó Claude con GitHub y con el error al 
  intentar conectarlo por terminal externa; cuando algo falla por el entorno 
  y no por el enfoque, vale la pena insistir directamente con las instrucciones 
  a través de chat con Claude.
- La seguridad de credenciales (tokens de acceso) es una responsabilidad
  activa: un token pegado en una captura o en un chat debe tratarse como
  potencialmente expuesto. Claude mando varios mensajes molestos por esta práctica.

## Qué me costó

- La instalación inicial de Node/pnpm tuvo fricciones de permisos (PATH,
  symlinks en `/usr/local`, `EACCES` en corepack) que no tenían que ver con
  el código del proyecto, sino con la configuración del entorno Mac.
- Diferenciar en Plan Mode cuándo una propuesta requería mi criterio de
  negocio (alcance CRUD, README) de cuándo era simplemente una decisión
  técnica razonable de Claude (librerías de validación y driver de base de
  datos).
- Conectar el MCP de GitHub tomó varios intentos por errores de sintaxis del
  comando (`--env` vs `-e`) antes de descubrir la limitación real.
