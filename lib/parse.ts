import type { Repeat } from "./repeat";

// Validación de campos de formularios. Vive fuera de app/actions.ts para poder testearla.

// Hora opcional "HH:MM"; vacío es sin hora.
export function parseTime(form: FormData) {
  const time = String(form.get("time") ?? "");
  if (!time) return { value: null };
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return { error: "La hora no es válida." };
  return { value: time };
}

const MAX = { month_day: 31, business_day: 23, weekday: 5 }; // 23 hábiles y 5 de un mismo día, como mucho

// Sin repetir, o todos los meses: el día N, el N-ésimo hábil o el N-ésimo lunes/martes/…
// El select "repeat" manda month_day, business_day o el número del día de la semana (0 = domingo).
// N negativo si cuenta desde el final.
export function parseRepeat(form: FormData) {
  const kind = String(form.get("repeat") ?? "");
  const repeatWeekday = /^[0-6]$/.test(kind) ? Number(kind) : null;
  const repeat = (repeatWeekday !== null ? "weekday" : kind) as Repeat;
  if (repeat !== "month_day" && repeat !== "business_day" && repeat !== "weekday") {
    return {
      value: {
        repeat: null,
        repeatN: null,
        repeatWeekday: null,
        repeatEvery: 1,
      },
    };
  }
  const n = Number(form.get("repeatN"));
  if (!Number.isInteger(n) || n < 1 || n > MAX[repeat]) return { error: `Elegí un número del 1 al ${MAX[repeat]}.` };
  const every = Number(form.get("repeatEvery") ?? 1);
  if (!Number.isInteger(every) || every < 1 || every > 12) return { error: "Elegí cada cuántos meses (1 a 12)." };
  return {
    value: {
      repeat,
      repeatN: form.get("repeatFrom") === "end" ? -n : n,
      repeatWeekday,
      repeatEvery: every,
    },
  };
}
