# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Una sola persona: el dueño de la app, que la usa para sí mismo. No hay otros usuarios ni roles.
Usa la web a diario, tanto desde el celular como desde desktop, y además responde el check-in
nocturno por Telegram.

## Product Purpose
Trackear hábitos recurrentes y tareas puntuales para sostener una rutina. El éxito es que
registrar el día cueste casi nada (unos toques) y que las rachas y el cumplimiento semanal
muestren con honestidad cómo viene la constancia.

## Positioning
App personal hecha a medida: el registro diario llega solo, a las 22:00 por Telegram, y se
completa con botones, sin abrir la app. La web complementa con la vista del día y la historia.

## Operating Context
- Durante el día: abre la vista "Hoy" (celular o desktop) para ver qué le toca y marcar estados.
- 22:00 (America/Argentina/Mendoza): el bot manda la lista del día con botones ✅ / ❌ / ⏭️ por
  ítem y un botón "📝 Nota del día" para dejar una reflexión.
- Cada tanto: carga o edita hábitos y tareas y mira estadísticas.
- "Hoy" siempre se calcula en hora de Mendoza, nunca en UTC.

## Capabilities and Constraints
- Hábitos: nombre, emoji, frecuencia diaria o días puntuales de la semana, activo/inactivo.
- Tareas: título y fecha límite; se completan una vez.
- Cada día, cada ítem queda como hecho, no hecho u omitido (done / missed / skipped), con nota opcional.
- Una reflexión de texto por día.
- Estadísticas: racha actual por hábito, % de cumplimiento de la semana, heatmap de los últimos 90 días.
- Acceso por una sola contraseña; sin cuentas.
- Fuera de alcance: multiusuario, categorías, IA, notificaciones push, PWA.
- Stack: Next.js (App Router), Neon Postgres + Drizzle, Tailwind + shadcn/ui, Vercel.

## Brand Commitments
- Nombre: Rutina.
- Idioma: español rioplatense (voseo).
- Tono: cálido pero corto. Algún toque humano ("¡Buena racha!"), sin frases motivacionales largas.
- Emojis de estado del bot: ✅ hecho, ❌ no hecho, ⏭️ omitido, 📝 nota.

## Evidence on Hand
Sin datos reales todavía. No inventar rachas, historiales ni ejemplos presentados como reales.

## Product Principles
1. Registrar tiene que costar segundos: pocos toques, sin formularios para lo diario.
2. Honestidad sobre motivación: los números muestran lo que pasó, sin maquillaje.
3. Igual de cómoda en celular que en desktop.
4. Simple: una persona, sin configuración que no se use.
