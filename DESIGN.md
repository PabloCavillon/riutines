---
name: Rutina
description: Hábitos y tareas de una persona, contados en palotes de tiza sobre malbec.
colors:
  malbec: "#4a1530"
  chalk: "#f3f1f4"
  background: "#f3f1f4"
  foreground: "#1e1418"
  card: "#ffffff"
  secondary: "#e7dce3"
  muted-foreground: "#5e4f59"
  border: "#ddd7de"
  input: "#c9bfc8"
  done: "#4f7a28"
  done-row: "#e8f0e0"
  missed: "#b23a26"
  missed-row: "#f6e3df"
  skipped: "#6f6873"
  skipped-row: "#eae7ec"
typography:
  display:
    fontFamily: "Archivo, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.025em"
    fontFeature: "\"tnum\" 1"
  headline:
    fontFamily: "Archivo, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
    fontFeature: "\"tnum\" 1"
  title:
    fontFamily: "Archivo, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.333
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Archivo, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "\"tnum\" 1"
  body-strong:
    fontFamily: "Archivo, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
  label:
    fontFamily: "Archivo, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.43
rounded:
  md: "0.4rem"
  lg: "0.5rem"
spacing:
  gutter: "16px"
  gutter-sm: "24px"
  row-y: "12px"
  control-gap: "6px"
  section: "24px"
  container: "48rem"
components:
  status-button:
    backgroundColor: "{colors.card}"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.md}"
    size: "44px"
  status-button-done:
    backgroundColor: "{colors.done}"
    textColor: "{colors.card}"
    rounded: "{rounded.md}"
    size: "44px"
  status-button-missed:
    backgroundColor: "{colors.missed}"
    textColor: "{colors.card}"
    rounded: "{rounded.md}"
    size: "44px"
  status-button-skipped:
    backgroundColor: "{colors.skipped}"
    textColor: "{colors.card}"
    rounded: "{rounded.md}"
    size: "44px"
  button-primary:
    backgroundColor: "{colors.malbec}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.lg}"
    height: "44px"
    padding: "0 20px"
  button-quiet:
    textColor: "{colors.malbec}"
    rounded: "{rounded.md}"
    height: "40px"
    padding: "0 12px"
  button-quiet-hover:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.malbec}"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    height: "44px"
    padding: "4px 10px"
  choice:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    height: "44px"
    padding: "0 16px"
  choice-checked:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.malbec}"
  nav-link:
    textColor: "{colors.chalk}"
    rounded: "{rounded.md}"
    height: "44px"
    padding: "0 12px"
  nav-link-active:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.malbec}"
---

# Design System: Rutina

## Overview

**Creative North Star: "La pizarra de la bodega"**

La constancia se cuenta como en la bodega: palotes de a cinco, a tiza, sobre malbec. Arriba de cada pantalla de la app hay una banda malbec donde la tiza es la tinta: marca, navegación, la fecha grande y la racha. Abajo, sobre un gris lavanda claro, una lista plana separada por hairlines, donde cada fila toma el color del estado que se le marcó y se queda ahí, sin moverse.

El sistema es de color plano: sin sombras, sin gradientes, sin grano, sin modo oscuro. La profundidad la da el contraste entre la banda malbec y la hoja clara, y las filas teñidas. La única gráfica es el trazo: los palotes y las tres marcas de estado se dibujan con el mismo trazo redondeado, levemente torcido, como hecho a mano. Las cifras son tabulares en todo el producto.

Rechaza explícitamente la app de hábitos estándar: cards blancas flotando, checkbox redondo, anillo de progreso, llamita de racha.

**Key Characteristics:**
- Banda malbec con tinta de tiza arriba; hoja gris lavanda abajo.
- Lista plana a hairlines; la fila marcada se tiñe y no se reordena.
- Palotes de a cinco como única unidad gráfica de constancia.
- Tres botones cuadrados de 44px por fila: hecho, no hecho, omitido.
- Archivo en una sola familia, cifras tabulares siempre.

## Colors

Un vino oscuro y una tiza fría, más tres estados planos que tiñen filas enteras.

### Primary
- **Malbec**: la banda superior (encabezado, hero de Hoy, login), el texto de acción en la hoja clara (links, "Editar", "Pausar"), el borde y color de hover de los botones de estado, los palotes de las filas, el anillo de foco, el caret, `accent-color` y la selección de texto. En shadcn también es `primary` y `ring`.
- **Tiza**: la tinta sobre malbec. Texto, palotes y pestaña activa de la nav. Las jerarquías secundarias dentro de la banda se hacen con tiza translúcida (80% para etiquetas, 70% para el denominador), nunca con otro color.

### Secondary
- **Brezo** (`secondary`, también `muted` y `accent`): fondo de hover de los botones discretos y fondo de la opción elegida en los selectores de frecuencia.

### Tertiary (estados)
- **Vid** (`done`): botón "hecho" presionado; la fila hecha se tiñe con **Vid lavada** (`done-row`).
- **Ladrillo** (`missed`, también `destructive`): botón "no hecho" presionado, errores de formulario, tarea vencida y la acción de borrar; la fila se tiñe con **Ladrillo lavado** (`missed-row`).
- **Ceniza** (`skipped`): botón "omitido" presionado; la fila se tiñe con **Ceniza lavada** (`skipped-row`).

### Neutral
- **Gris lavanda** (`background`): la hoja de toda la app, mismo valor que la tiza.
- **Tinta de orujo** (`foreground`): texto principal.
- **Orujo gastado** (`muted-foreground`): metadatos de fila, encabezados de sección, estados vacíos, marcas sin presionar.
- **Hairline** (`border`): separadores de filas y secciones.
- **Borde de control** (`input`): borde de botones de estado, inputs y opciones.
- **Blanco** (`card`): solo como relleno de controles (botones de estado, opciones). No se usa para tarjetas.

### Named Rules
**The Fila Pintada Rule.** El estado se comunica pintando la fila entera con su tono lavado y el botón presionado con su tono pleno, con texto blanco. La fila no se reordena ni se mueve al marcarse.

**The Tiza Sobre Malbec Rule.** Sobre la banda malbec solo hay tiza; la jerarquía se hace con opacidad de tiza (100 / 80 / 70%), no con colores nuevos.

## Typography

**Display Font:** Archivo (vía `next/font`, variable `--font-archivo`)
**Body Font:** Archivo
**Label/Mono Font:** Archivo

**Character:** Una sola grotesca argentina (Omnibus-Type) en todos los roles; la jerarquía sale de peso y tamaño. `font-variant-numeric: tabular-nums` en el `body`, para que las cifras y la racha se alineen.

### Hierarchy
- **Display** (700, 2.25rem en celular / 3rem desde `sm`, interlineado ajustado, tracking −0.025em): el día en la banda de Hoy ("Miércoles" en bold, la fecha en 400 a tiza 80%) y la palabra "Rutina" en el login.
- **Headline** (600, 1.875rem): las cifras del día en la banda ("2/6", "13 días"); la unidad "días" baja a 1rem 400.
- **Title** (700, 1.5rem, tracking −0.025em): el título de página en Hábitos, Tareas y edición.
- **Body** (400 / 600, 1rem): el nombre del ítem va en 600; texto corrido en 400.
- **Label** (600, 0.875rem): encabezados de lista ("Hábitos", "Tareas de hoy", "Pendientes") en `muted-foreground`, etiquetas de formulario y de cifras, botones. Sin mayúsculas sostenidas ni tracking abierto.

### Named Rules
**The Cifra Tabular Rule.** Todo número que se compare (conteos, rachas, fechas) va en cifras tabulares; ya lo hereda el `body`, no se apaga.

## Layout

Una sola columna centrada, de 48rem de ancho máximo, igual en celular y desktop. Margen lateral de 16px, 24px desde `sm` (640px). La banda malbec ocupa todo el ancho; su contenido respeta la misma columna.

Las listas son `ul` con hairline arriba y debajo de cada fila; en Hoy las filas llegan al borde de la columna con su propio padding (16/24px), en Hábitos y Tareas viven dentro del padding de la página. Filas de 12px de padding vertical; contenido a la izquierda que trunca, controles fijos a la derecha. Secciones separadas por 24px; formulario de alta arriba, cerrado por una hairline, y la lista debajo.

Ritmo: 6px entre botones de estado, 12px entre bloque de texto y controles, 20px entre grupos de formulario. Todo objetivo táctil mide al menos 44px, salvo los botones discretos de lista (40px de alto).

## Elevation & Depth

Plano por completo. No hay `box-shadow` en ningún componente propio ni gradientes. La profundidad se arma con dos planos de color (banda malbec contra hoja clara), hairlines de 1px y el teñido de filas. El foco se marca con un contorno de 2px (malbec en la hoja, tiza en la banda), no con elevación.

### Named Rules
**The Sin Sombras Rule.** Nada flota. Si algo necesita separarse, lleva una hairline o un cambio de plano de color.

## Shapes

Esquinas apenas suavizadas: los controles hechos a medida usan `rounded.md` (0.4rem); el botón y el input de shadcn usan `rounded.lg` (0.5rem). Los contenedores no tienen borde ni radio: las filas son franjas rectas de borde a borde, separadas por hairlines.

La forma propia del sistema es el trazo: 1.7px con extremos redondeados en los palotes, 2px (3px presionado) en las marcas de estado, con un desvío determinista de ±1 por palote para que parezca escrito a mano.

## Components

### Buttons
Directos y planos.
- **Shape:** esquinas suaves (0.5rem en el primario, 0.4rem en el resto).
- **Primary:** malbec con texto tiza, 44px de alto, 20px de padding horizontal, 0.875rem 500. Hover baja el malbec al 80%. Uno por formulario ("Agregar hábito", "Guardar cambios").
- **Quiet:** texto malbec 0.875rem 500 sin fondo, 40px de alto; hover con fondo brezo. Para acciones de fila ("Editar", "Pausar", "Reactivar").
- **Sobre malbec (login):** tiza con texto malbec, 48px de alto; hover baja opacidad al 90%.
- **Destructivo:** ladrillo pleno con texto blanco, escondido detrás de un `details` ("Borrar hábito").
- **Focus:** contorno de 2px con 2px de offset, en malbec (o tiza sobre la banda).

### Inputs / Fields
- **Style:** fondo transparente, borde `input` de 1px, radio 0.5rem, 44px de alto en formularios.
- **Focus:** el borde pasa a malbec con un halo malbec al 50%.
- **Error:** el mensaje va debajo en ladrillo 0.875rem 500 con `role="alert"`.
- **Sobre malbec (login):** borde tiza al 40%, texto 1.125rem, 48px; foco con borde tiza y halo tiza al 40%.

### Chips (selectores de frecuencia y días)
- **Style:** radios y checkboxes visualmente ocultos dentro de un `label` de 44px, fondo blanco, borde `input`.
- **State:** la frecuencia elegida toma borde malbec, fondo brezo y texto malbec en 600. Los días elegidos (cuadrados de 44px con la inicial) se rellenan en malbec con texto tiza.

### Navigation
Pestañas de texto dentro de la banda malbec: 0.875rem, tiza al 80%, 44px de alto, 12px de padding horizontal. Hover con fondo tiza al 10%. La pestaña activa se invierte: fondo tiza, texto malbec, 600. A la izquierda, un grupo de cinco palotes como marca (más la palabra "Rutina" desde `sm`); a la derecha, salir como ícono de 44px.

### Fila de estado (componente firma)
Nombre (emoji + texto 600) y debajo, para hábitos, los palotes de la racha en malbec con "N días" o "sin racha" y los días de la semana. A la derecha, tres botones cuadrados de 44px: borde `input`, fondo blanco, marca en `muted-foreground`; hover pasa borde y marca a malbec. Presionado: relleno pleno del estado y marca blanca de trazo grueso; tocar de nuevo desmarca. La fila se tiñe con el tono lavado del estado, con transición de color de 300ms. La racha se actualiza de forma optimista: el palote nuevo se dibuja en 320ms con `cubic-bezier(0.16, 1, 0.3, 1)`, desactivado con `prefers-reduced-motion`.

### Palotes y marcas
Grupos de cinco (cuatro verticales y un quinto cruzado), hasta 20 palotes; la cifra exacta va siempre al lado en texto. Las tres marcas de estado salen del mismo trazo: un tilde con el trazo largo pasado de largo (hecho), un palote tachado (no hecho) y un palote con un salto (omitido).

## Do's and Don'ts

### Do:
- **Do** poner la banda malbec arriba de toda pantalla de la app, con la tiza como única tinta.
- **Do** contar rachas con palotes de a cinco y la cifra al lado.
- **Do** separar con hairlines `border` de 1px y dejar las listas planas.
- **Do** teñir la fila entera con `done-row`, `missed-row` o `skipped-row` y mantenerla en su lugar.
- **Do** dar 44px a todo control táctil.
- **Do** marcar foco con contorno de 2px malbec (tiza sobre la banda).

### Don't:
- **Don't** usar sombras, gradientes ni grano.
- **Don't** usar cards blancas, checkbox redondo, anillo de progreso ni llamita de racha.
- **Don't** reordenar la lista cuando se marca un ítem.
- **Don't** introducir colores nuevos sobre la banda malbec; la jerarquía va con opacidad de tiza.
- **Don't** apagar las cifras tabulares.
- **Don't** agregar un tema oscuro; el sistema es solo claro.
