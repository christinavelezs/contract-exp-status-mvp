# Spec: Semaforización de contratos por vencimiento

## Objetivo
Permitir que cada asesor comercial visualice el estado de sus contratos
según proximidad al vencimiento, para anticipar negociaciones antes de
que un contrato se renueve automáticamente en condiciones desfavorables.

## Requisitos
1. Cada contrato tiene: cliente, asesor comercial, fecha de vencimiento,
   condiciones actuales.
2. El sistema calcula días restantes hasta el vencimiento a partir de la
   fecha actual.
3. Se asigna un color de semáforo según días restantes:
   - Verde: 120 días o más
   - Amarillo: menor a 120 días
   - Naranja: menor a 90 días
   - Rojo: menor a 60 días
   - Rojo crítico: menor a 30 días
4. Existe un endpoint para listar contratos agrupados por asesor comercial,
   incluyendo su color de semáforo.
5. El listado de contratos se ordena siempre del más urgente al menos
   urgente (menor cantidad de días restantes primero).
6. Es posible filtrar contratos por color de semáforo (ej. solo los rojos).

## Criterios de aceptación
- Un contrato a 25 días muestra semáforo rojo crítico.
- Un contrato a 45 días muestra semáforo rojo.
- Un contrato a 75 días muestra semáforo naranja.
- Un contrato a 95 días muestra semáforo amarillo.
- Un contrato a 200 días muestra semáforo verde.
- El endpoint agrupado devuelve los contratos ordenados de mayor a menor
  urgencia dentro de cada asesor.

## Edge cases
- Contrato ya vencido (fecha de vencimiento en el pasado): debe marcarse
  con un estado distinto, ej. "vencido", no solo "rojo crítico".
- Contrato sin fecha de vencimiento registrada: debe rechazarse en la
  validación, no debe llegar a calcularse su semáforo.
- Asesor comercial sin contratos asignados: debe aparecer en el listado
  con una lista vacía, no debe romper el endpoint.

## Fuera de alcance
- Renovación automática real de contratos (solo se detecta y alerta,
  no se ejecuta ninguna acción sobre el contrato).
- Envío de notificaciones (email, SMS, etc.) — solo se expone la
  información vía API.
- Integración con sistemas reales de Enotria; este es un prototipo con
  datos ficticios.
