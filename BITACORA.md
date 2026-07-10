# Bitácora — Gestor de contratos con semaforización de vencimiento

Proyecto: `contract-exp-status-mvp`

Curso: Claude Code desde cero — Certificación Claude Code Dev (Coding Latam)

Repositorio: https://github.com/christinavelezs/contract-exp-status-mvp

---

## Fase 0 · Preparar el terreno

Configuración del entorno:
- Instalación en equipo (primera vez con Claude Code) e inicio del proyecto con `CLAUDE.md`.
- Se tuvieron algunos problemas porque la terminal no loalizaba ~/.local/bin en el PATH. Así
  que se agregó a través de comando.

<img width="594" height="338" alt="image" src="https://github.com/user-attachments/assets/65dbaa8d-c251-4512-854e-1ac58067d7b8" />
<img width="634" height="396" alt="image" src="https://github.com/user-attachments/assets/238a8ed8-7832-4ceb-ae92-3491e3ee7dc2" />
<img width="638" height="177" alt="image" src="https://github.com/user-attachments/assets/38162949-96b4-4cae-b1ac-223d201b48c6" />
<img width="884" height="634" alt="image" src="https://github.com/user-attachments/assets/c19a5bad-4428-4afd-b827-af4bfa7215c4" />



**Qué se hizo:** se creó CLAUDE.md manualmente para evitar que se genere un 
archivo vacío. Para esto, con ayuda de Claude, se definió primero el stack
(Node.js + Express + SQLite + Jest), estructura de carpetas objetivo, 
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

<img width="1276" height="759" alt="image" src="https://github.com/user-attachments/assets/b948b17d-8733-408a-8768-b699bbbc1cb9" />

---

## Fase 2 · Planificar (Plan Mode)

Se activó `/plan` pidiéndole a Claude que leyera `docs/spec.md` y `CLAUDE.md`
para que proponga estructura de archivos, endpoints, modelo de datos y tests.
Antes de aprobar, el plan se detuvo dos veces a pedir confirmación, y se
identificó un tercer punto faltante que se agregó manualmente.

<img width="1135" height="385" alt="image" src="https://github.com/user-attachments/assets/1c235a2b-fb26-43d8-9956-94da7a7f720c" />


### Ajuste 1 — Librerías extra

El CLAUDE.md solo declaraba Express/SQLite/Jest. El plan propuso añadir
`zod` (validación de esquemas) y `better-sqlite3` (driver síncrono). Se
investigó con Claude para decidir si añadir o no.

<img width="1135" height="385" alt="image" src="https://github.com/user-attachments/assets/2c2a4089-341d-4579-be9a-d2fffaf6a230" />

Se aprobaron ambas por guaurdar coherencia con la carpeta `schemas/` ya
definida en el CLAUDE.md.

### Ajuste 2 — Alcance CRUD

El plan ofrecía dos opciones, que no cumplían con el requisito obligatorio
de "operaciones CRUD completas" del caso de estudio:
1. Incluir solo POST, sin PATCH/DELETE.
2. Solo lectura (GET) + datos sembrados vía seed.js, sin endpoint de creación.

<img width="1139" height="242" alt="image" src="https://github.com/user-attachments/assets/9b9ff8e9-5adf-4458-bbcf-1d60b98bd86f" />

Se rechazaron ambas opciones y se escribió manualmente la corrección
pidiendo las 5 operaciones: `POST`, `GET` listar, `GET` por id, `PUT`,
`DELETE`, más `seed.js` para datos ficticios en los contratos.

<img width="1126" height="511" alt="image" src="https://github.com/user-attachments/assets/4b7c376f-5282-4650-9455-561c0f824617" />

### Ajuste 3 — README faltante

Al revisar el plan generado en texto, se detectó que no incluía `README.md`
en la estructura de archivos. Se agregó a través de instrucción manual antes
de aprobar el plan.

<img width="1271" height="524" alt="image" src="https://github.com/user-attachments/assets/01528772-a2f1-401c-ac20-871ede860bd2" />

---

## Fase 3 · Implementar

Ejecución del plan aprobado en auto mode.

<img width="1274" height="499" alt="image" src="https://github.com/user-attachments/assets/698034c9-fd64-4652-b6aa-7a0591d13ba7" />

**Fricción de entorno:** la máquina no tenía Node/npm/pnpm instalados (en los
pasos iniciales no se hizo correctamente la instalación), lo que no permitió la
verificación automática (`pnpm install`, `migrate`, `seed`, `test`) durante 
la ejecución del plan. Se resolvió instalando Node.js desde nodejs.org y habilitando
pnpm vía corepack.

<img width="610" height="156" alt="image" src="https://github.com/user-attachments/assets/e4c8a144-a549-47f2-b58f-e2530d907423" />
<img width="1139" height="448" alt="image" src="https://github.com/user-attachments/assets/312aef39-a683-4dc4-90fc-32c64e1b1a77" />

**Resultado de la verificación automatizada:**

<img width="1111" height="492" alt="image" src="https://github.com/user-attachments/assets/e7aa846f-a106-47ab-836b-139dad9a349e" />

**Verificación manual contra datos reales:** a sugerencia de Claude se levantó el 
servidor con `pnpm run dev` en segundo plano y se probó con `curl`:
- `GET /api/contratos` → orden correcto por urgencia (vencido primero, verde
  al final).
- `GET /api/contratos/por-asesor` → agrupación correcta, caso raro de asesor
  sin contratos verificado (`contratos: []`).
- `GET /api/contratos?color=ROJO_CRITICO` → filtro correcto.

<img width="1133" height="426" alt="image" src="https://github.com/user-attachments/assets/19e4ae87-942a-4d39-91a9-3969e0e831a9" />
<img width="1143" height="369" alt="image" src="https://github.com/user-attachments/assets/3587f899-442c-4c92-b5b8-274f7b203d5a" />

Se detuvo el servidor al finalizar la verificación.

---

## Fase 4 · Automatizar el estilo (Skill)

Se creó `.claude/skills/nuevo-endpoint/SKILL.md`, documentando el patrón
usado en el proyecto: 
schema (zod) → modelo (better-sqlite3, consultas preparadas) → servicio (lógica de negocio) 
→ controlador/ruta → tests (unitario + integración)
junto con reglas imperativas (nunca SQL por concatenación, siempre pnpm, siempre envolver la respuesta en `{ "data": ... }`).

<img width="1137" height="861" alt="image" src="https://github.com/user-attachments/assets/7e1cc489-52a8-431d-9ed9-101162ff3958" />
<img width="1128" height="399" alt="image" src="https://github.com/user-attachments/assets/a17c9234-99b7-449d-9ae4-1976ab3c3861" />

**Skill en acción:** se pidió un segundo endpoint (`GET /api/asesores/:id`
con conteo de contratos por color de semáforo) sin repetir ninguna regla del
patrón. Claude Code siguió el Skill sin que se le recordara (-sigo sin entender 
bien como identifica las palabras-):
- Reutilizó `COLORES_SEMAFORO` como si fuese su única opción a usar.
- Puso la lógica de negocio en `src/services/asesor.service.js`.
- Manejó el 404 para asesor inexistente.
- Agregó tests unitarios y de integración.
- Actualizó el README con la nueva fila en la tabla de endpoints, aunque no 
se pidió explicitamente.

<img width="940" height="302" alt="image" src="https://github.com/user-attachments/assets/009276df-e84b-4582-9d27-9d7d9e2822d6" />
<img width="941" height="999" alt="image" src="https://github.com/user-attachments/assets/d3683529-1625-40f1-b023-9f844d26b6ae" />
<img width="935" height="685" alt="image" src="https://github.com/user-attachments/assets/916d0e19-6710-4ef2-b807-40fd61c36087" />


---

## Fase 5 · Bonus — MCP Servers

Se intentó conectar el MCP de GitHub para crear el repositorio remoto y
hacer el push directamente desde Claude Code.

<img width="737" height="69" alt="image" src="https://github.com/user-attachments/assets/6365ae20-035f-45f4-9a19-98f61b7d8221" />
<img width="1128" height="399" alt="image" src="https://github.com/user-attachments/assets/ff9a28e6-512a-43b4-b422-26bee1b41168" />
<img width="1065" height="318" alt="image" src="https://github.com/user-attachments/assets/bf2c8acd-117f-4612-b021-74b57dac673f" />
<img width="1068" height="233" alt="image" src="https://github.com/user-attachments/assets/2ce1b0a4-cad7-46d7-87b0-e135e87e2370" />

**Causa raíz identificada:** Además de no escribir los comandos correctos en la terminal 
separada para la conexión con el MCP al inicio, cuando se logró hacer la instalación no 
se hizo en donde el proyecto la alcance sino "fuera". Para corregir, se reinicio sesión
en Claude y se avanzo a partir de las sugerencias que daba el mismo Claude.

<img width="1879" height="519" alt="image" src="https://github.com/user-attachments/assets/43a9066f-a1a9-4ff2-8bff-580a65695524" />
<img width="1873" height="609" alt="image" src="https://github.com/user-attachments/assets/9019a330-5a26-4f4c-a372-0b7dd776d88c" />
<img width="1884" height="432" alt="image" src="https://github.com/user-attachments/assets/85bfff99-44ea-498a-8752-e703e2526b54" />

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
