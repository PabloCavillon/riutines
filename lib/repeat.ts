import { weekday } from "./date";

export type Repeat = "month_day" | "business_day" | "weekday";
export type Rule = {
  repeat: Repeat;
  repeatN: number;
  repeatWeekday: number | null;
  repeatEvery: number;
};
type Task = {
  dueDate: string;
  repeat: Repeat | null;
  repeatN: number | null;
  repeatWeekday: number | null;
  repeatEvery: number;
};

// La regla de la tarea, o null si no se repite.
export function ruleOf(task: Task): Rule | null {
  if (!task.repeat || !task.repeatN) return null;
  return {
    repeat: task.repeat,
    repeatN: task.repeatN,
    repeatWeekday: task.repeatWeekday,
    repeatEvery: task.repeatEvery,
  };
}

// ¿El mes de `date` está en el ciclo? Cada N meses, arrancando en el mes de `start`.
function inCycle(date: string, start: string, every: number) {
  const month = (d: string) => Number(d.slice(0, 4)) * 12 + Number(d.slice(5, 7));
  return (month(date) - month(start)) % every === 0;
}

// Fecha del mes de `date` que cumple la regla. n < 0 cuenta desde el final; si no hay tantos, cae en el último.
// shortcut: día hábil = lunes a viernes, sin feriados; sumar una tabla de feriados si hace falta.
export function monthlyDate(date: string, rule: Rule) {
  const [y, m] = date.split("-").map(Number);
  const length = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const days = Array.from({ length }, (_, i) => `${date.slice(0, 8)}${String(i + 1).padStart(2, "0")}`).filter((d) =>
    rule.repeat === "business_day"
      ? weekday(d) % 6 !== 0
      : rule.repeat === "weekday"
        ? weekday(d) === rule.repeatWeekday
        : true,
  );
  const n = rule.repeatN;
  return days[n > 0 ? Math.min(n, days.length) - 1 : Math.max(days.length + n, 0)];
}

// ¿Le toca a la tarea ese día? Las que se repiten arrancan en dueDate.
export function isTaskOn(task: Task, date: string) {
  const rule = ruleOf(task);
  if (!rule) return task.dueDate === date;
  return date >= task.dueDate && inCycle(date, task.dueDate, rule.repeatEvery) && monthlyDate(date, rule) === date;
}

// Próxima vez que toca, desde `from` inclusive.
export function nextDate(dueDate: string, rule: Rule, from: string) {
  let d = from < dueDate ? dueDate : from;
  for (;;) {
    const hit = monthlyDate(d, rule);
    if (hit >= d && inCycle(d, dueDate, rule.repeatEvery)) return hit;
    const [y, m] = d.split("-").map(Number);
    d = new Date(Date.UTC(y, m, 1)).toISOString().slice(0, 10); // 1º del mes siguiente
  }
}

export const WEEKDAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const FROM_END = ["último", "anteúltimo", "antepenúltimo"];

// "todos los meses", "mes por medio", "cada 3 meses"
export function formatEvery(every: number) {
  return every === 1 ? "todos los meses" : every === 2 ? "mes por medio" : `cada ${every} meses`;
}

// "todos los meses · 2º día hábil", "cada 3 meses · último viernes", "mes por medio · día 10"
export function formatRepeat(rule: Rule) {
  return `${formatEvery(rule.repeatEvery)} · ${formatDay(rule)}`;
}

function formatDay(rule: Rule) {
  const n = rule.repeatN;
  if (rule.repeat === "month_day" && n > 0) return `día ${n}`;
  const unit =
    rule.repeat === "business_day"
      ? "día hábil"
      : rule.repeat === "weekday"
        ? WEEKDAY_NAMES[rule.repeatWeekday!]
        : "día del mes";
  if (n > 0) return `${n}º ${unit}`;
  return FROM_END[-n - 1] ? `${FROM_END[-n - 1]} ${unit}` : `${-n}º ${unit} contando desde el final`;
}
