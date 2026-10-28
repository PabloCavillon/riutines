// Palotes de tiza: grupos de cinco (cuatro verticales y uno cruzado). Muestra hasta `max`; el número va aparte.
// Los palotes desde `drawFrom` se dibujan con una animación (el que se acaba de sumar).
export function Tally({
  count,
  max = 20,
  drawFrom = Infinity,
  className,
}: {
  count: number;
  max?: number;
  drawFrom?: number;
  className?: string;
}) {
  const n = Math.min(count, max);
  if (!n) return null;
  const groups = Math.ceil(n / 5);
  const strokes = [];
  for (let i = 0; i < n; i++) {
    const g = Math.floor(i / 5);
    const k = i % 5;
    const x = g * 24 + k * 4.5 + 2;
    const l = lean(i);
    strokes.push(
      <path
        key={i}
        pathLength={1}
        className={i >= drawFrom ? "tally-draw" : undefined}
        d={k === 4 ? `M${g * 24} ${11 - l * 0.5}L${g * 24 + 17} ${3 + l * 0.5}` : `M${x + l * 0.4} 1.5L${x - l * 0.4} 12.5`}
      />,
    );
  }
  return (
    <svg
      aria-hidden
      viewBox={`-1 0 ${groups * 24} 14`}
      className={className}
      style={{ aspectRatio: `${groups * 24 + 1} / 14` }}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
    >
      {strokes}
    </svg>
  );
}

// Pequeño desvío para que parezca a mano, siempre igual para el mismo palote.
function lean(i: number) {
  return ((i * 7) % 3) - 1;
}

// Marcas de estado en el trazo de los palotes: tilde con el trazo largo pasado de largo,
// un palote tachado como el quinto de un grupo, y un palote inclinado con salto.
const MARKS = {
  done: "M3.8 13.2L9.1 18.4L21 3.6",
  missed: "M9.6 3.5L7.8 20.5M3.5 15.8L20.5 7.4",
  skipped: "M6.4 4.5L5.2 19.5M11.2 6.2L18.8 12.6L10.6 18.2",
};

export function StatusMark({ status, pressed }: { status: keyof typeof MARKS; pressed: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={pressed ? 3 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={MARKS[status]} />
    </svg>
  );
}
