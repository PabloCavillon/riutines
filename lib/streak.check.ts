// Auto-chequeo: npx tsx lib/streak.check.ts
import assert from "node:assert/strict";
import { addDays, today, weekday } from "./date";
import { currentStreak } from "./streak";

const daily = { frequencyType: "daily" as const, weekdays: null };
const m = (o: Record<string, string>) => new Map(Object.entries(o));

assert.equal(addDays("2026-03-01", -1), "2026-02-28");
assert.equal(weekday("2026-10-28"), 3); // miércoles
assert.equal(today(new Date("2026-10-29T02:30:00Z")), "2026-10-28"); // 23:30 en Mendoza

// hoy sin marcar no corta; ayer y anteayer hechos
assert.equal(currentStreak(daily, m({ "2026-10-27": "done", "2026-10-26": "done" }), "2026-10-28", "2026-10-01"), 2);
// hoy hecho suma
assert.equal(currentStreak(daily, m({ "2026-10-28": "done", "2026-10-27": "done" }), "2026-10-28", "2026-10-01"), 2);
// hoy no hecho corta todo
assert.equal(currentStreak(daily, m({ "2026-10-28": "missed", "2026-10-27": "done" }), "2026-10-28", "2026-10-01"), 0);
// omitido no corta ni suma
assert.equal(currentStreak(daily, m({ "2026-10-27": "skipped", "2026-10-26": "done" }), "2026-10-28", "2026-10-01"), 1);
// un día pasado sin registro corta
assert.equal(currentStreak(daily, m({ "2026-10-26": "done" }), "2026-10-28", "2026-10-01"), 0);
// no cuenta antes de la creación
assert.equal(currentStreak(daily, m({}), "2026-10-28", "2026-10-28"), 0);
// lun/mié/vie: los días no programados se saltean
const lmv = { frequencyType: "weekdays" as const, weekdays: [1, 3, 5] };
assert.equal(currentStreak(lmv, m({ "2026-10-26": "done", "2026-10-23": "done" }), "2026-10-28", "2026-10-01"), 2);
console.log("streak ok");
