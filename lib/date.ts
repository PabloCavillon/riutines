const TZ = "America/Argentina/Mendoza";

// 'YYYY-MM-DD' en hora de Mendoza (en-CA formatea en ISO).
export function today(now = new Date()) {
  return now.toLocaleDateString("en-CA", { timeZone: TZ });
}

// 0 = domingo … 6 = sábado, para una fecha 'YYYY-MM-DD'.
export function weekday(date: string) {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}

export function isDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function addDays(date: string, days: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const DAY_NAMES = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

// "lun · mié · vie", empezando por el lunes.
export function formatWeekdays(days: number[]) {
  return [1, 2, 3, 4, 5, 6, 0].filter((d) => days.includes(d)).map((d) => DAY_NAMES[d]).join(" · ");
}

// { weekday: "Miércoles", date: "28 de octubre" }
export function formatLong(date: string) {
  const d = new Date(`${date}T12:00:00Z`);
  const weekday = d.toLocaleDateString("es-AR", { weekday: "long", timeZone: "UTC" });
  return {
    weekday: weekday[0].toUpperCase() + weekday.slice(1),
    date: d.toLocaleDateString("es-AR", { day: "numeric", month: "long", timeZone: "UTC" }),
  };
}

// "28 oct"
export function formatShort(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("es-AR", { day: "numeric", month: "short", timeZone: "UTC" });
}
