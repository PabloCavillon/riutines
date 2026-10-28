import assert from "node:assert/strict";
import { formatRepeat, isTaskOn, monthlyDate, nextDate } from "./repeat";

// Octubre 2026: arranca jueves 1, termina sábado 31 (el último hábil es el viernes 30).
assert.equal(monthlyDate("2026-10-15", "business_day", 1), "2026-10-01");
assert.equal(monthlyDate("2026-10-15", "business_day", 2), "2026-10-02");
assert.equal(monthlyDate("2026-10-15", "business_day", 3), "2026-10-05"); // salta el finde
assert.equal(monthlyDate("2026-10-15", "business_day", -1), "2026-10-30");
assert.equal(monthlyDate("2026-10-15", "business_day", -2), "2026-10-29");
assert.equal(monthlyDate("2026-10-15", "month_day", 10), "2026-10-10");
assert.equal(monthlyDate("2026-10-15", "month_day", -1), "2026-10-31");
assert.equal(monthlyDate("2026-02-15", "month_day", 31), "2026-02-28"); // mes corto: último día

const task = { dueDate: "2026-10-03", repeat: "business_day" as const, repeatN: 2 };
assert.equal(isTaskOn(task, "2026-10-02"), false); // antes de que arranque
assert.equal(isTaskOn(task, "2026-11-03"), true); // 2º hábil de noviembre: lun 2, mar 3
assert.equal(nextDate(task, "2026-10-28"), "2026-11-03");
assert.equal(nextDate(task, "2026-11-03"), "2026-11-03");
assert.equal(isTaskOn({ dueDate: "2026-10-28", repeat: null, repeatN: null }, "2026-10-28"), true);

assert.equal(formatRepeat("business_day", 2), "2º día hábil");
assert.equal(formatRepeat("business_day", -2), "anteúltimo día hábil");
assert.equal(formatRepeat("month_day", -1), "último día del mes");
assert.equal(formatRepeat("month_day", 10), "día 10");

console.log("repeat ok");
