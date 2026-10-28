import { weekday } from "./date";

export type Repeat = "month_day" | "business_day";
type Task = { dueDate: string; repeat: Repeat | null; repeatN: number | null };

// Fecha del mes de `date` que cumple la regla. n < 0 cuenta desde el final; si el mes es corto, cae en el último.
// shortcut: día hábil = lunes a viernes, sin feriados; sumar una tabla de feriados si hace falta.
export function monthlyDate(date: string, repeat: Repeat, n: number) {
  const [y, m] = date.split("-").map(Number);
  const length = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const days = Array.from({ length }, (_, i) => `${date.slice(0, 8)}${String(i + 1).padStart(2, "0")}`).filter(
    (d) => repeat === "month_day" || weekday(d) % 6 !== 0,
  );
  return days[n > 0 ? Math.min(n, days.length) - 1 : Math.max(days.length + n, 0)];
}

// ¿Le toca a la tarea ese día? Las que se repiten arrancan en dueDate.
export function isTaskOn(task: Task, date: string) {
  if (!task.repeat || !task.repeatN) return task.dueDate === date;
  return date >= task.dueDate && monthlyDate(date, task.repeat, task.repeatN) === date;
}

// Próxima vez que toca, desde `from` inclusive.
export function nextDate(task: Task & { repeat: Repeat; repeatN: number }, from: string) {
  let d = from < task.dueDate ? task.dueDate : from;
  for (;;) {
    const hit = monthlyDate(d, task.repeat, task.repeatN);
    if (hit >= d) return hit;
    const [y, m] = d.split("-").map(Number);
    d = new Date(Date.UTC(y, m, 1)).toISOString().slice(0, 10); // 1º del mes siguiente
  }
}

const FROM_END = ["último", "anteúltimo", "antepenúltimo"];

// "2º día hábil", "anteúltimo día hábil", "día 10", "último día del mes"
export function formatRepeat(repeat: Repeat, n: number) {
  const unit = repeat === "business_day" ? "día hábil" : "día del mes";
  if (n < 0) return FROM_END[-n - 1] ? `${FROM_END[-n - 1]} ${unit}` : `${-n}º ${unit} contando desde el final`;
  return repeat === "business_day" ? `${n}º día hábil` : `día ${n}`;
}
