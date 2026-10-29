import assert from "node:assert/strict";
import { formatRepeat, isTaskOn, monthlyDate, nextDate, type Rule } from "./repeat";

const rule = (repeat: Rule["repeat"], repeatN: number, repeatWeekday: number | null = null, repeatEvery = 1): Rule => ({
  repeat,
  repeatN,
  repeatWeekday,
  repeatEvery,
});

// Octubre 2026: arranca jueves 1, termina sábado 31 (el último hábil es el viernes 30).
assert.equal(monthlyDate("2026-10-15", rule("business_day", 1)), "2026-10-01");
assert.equal(monthlyDate("2026-10-15", rule("business_day", 2)), "2026-10-02");
assert.equal(monthlyDate("2026-10-15", rule("business_day", 3)), "2026-10-05"); // salta el finde
assert.equal(monthlyDate("2026-10-15", rule("business_day", -1)), "2026-10-30");
assert.equal(monthlyDate("2026-10-15", rule("business_day", -2)), "2026-10-29");
assert.equal(monthlyDate("2026-10-15", rule("month_day", 10)), "2026-10-10");
assert.equal(monthlyDate("2026-10-15", rule("month_day", 3)), "2026-10-03"); // sábado: cuenta igual
assert.equal(monthlyDate("2026-10-15", rule("month_day", -1)), "2026-10-31");
assert.equal(monthlyDate("2026-02-15", rule("month_day", 31)), "2026-02-28"); // mes corto: último día
// Sábados de octubre 2026: 3, 10, 17, 24, 31.
assert.equal(monthlyDate("2026-10-15", rule("weekday", 3, 6)), "2026-10-17");
assert.equal(monthlyDate("2026-10-15", rule("weekday", -1, 6)), "2026-10-31");
assert.equal(monthlyDate("2026-10-15", rule("weekday", 5, 6)), "2026-10-31");
assert.equal(monthlyDate("2026-11-15", rule("weekday", 5, 6)), "2026-11-28"); // nov tiene 4 sábados: cae en el último

const task = {
  dueDate: "2026-10-03",
  repeat: "business_day" as const,
  repeatN: 2,
  repeatWeekday: null,
  repeatEvery: 1,
};
assert.equal(isTaskOn(task, "2026-10-02"), false); // antes de que arranque
assert.equal(isTaskOn(task, "2026-11-03"), true); // 2º hábil de noviembre: lun 2, mar 3
assert.equal(nextDate(task.dueDate, task, "2026-10-28"), "2026-11-03");
assert.equal(nextDate(task.dueDate, task, "2026-11-03"), "2026-11-03");
assert.equal(nextDate("2026-10-01", rule("weekday", 3, 6), "2026-10-18"), "2026-11-21");
assert.equal(
  isTaskOn(
    {
      dueDate: "2026-10-28",
      repeat: null,
      repeatN: null,
      repeatWeekday: null,
      repeatEvery: 1,
    },
    "2026-10-28",
  ),
  true,
);

// Cada 3 meses desde noviembre: nov, feb, may, ago… (cruza el año).
const quarterly = {
  dueDate: "2026-11-01",
  ...rule("business_day", 2, null, 3),
};
assert.equal(isTaskOn(quarterly, "2026-11-03"), true);
assert.equal(isTaskOn(quarterly, "2026-12-02"), false); // 2º hábil de dic, pero fuera del ciclo
assert.equal(isTaskOn(quarterly, "2027-02-02"), true);
assert.equal(nextDate(quarterly.dueDate, quarterly, "2026-11-04"), "2027-02-02");
// Arranque a mitad de mes, después de la fecha que toca: el mes de inicio cuenta pero ya pasó.
const bimonthly = { dueDate: "2026-10-20", ...rule("month_day", 10, null, 2) };
assert.equal(nextDate(bimonthly.dueDate, bimonthly, "2026-10-20"), "2026-12-10");
assert.equal(isTaskOn(bimonthly, "2026-11-10"), false);

assert.equal(formatRepeat(rule("business_day", 2)), "todos los meses · 2º día hábil");
assert.equal(formatRepeat(rule("business_day", -2)), "todos los meses · anteúltimo día hábil");
assert.equal(formatRepeat(rule("weekday", 3, 6, 2)), "mes por medio · 3º sábado");
assert.equal(formatRepeat(rule("weekday", -1, 5, 6)), "cada 6 meses · último viernes");
assert.equal(formatRepeat(rule("month_day", -1)), "todos los meses · último día del mes");
assert.equal(formatRepeat(rule("month_day", 10, null, 3)), "cada 3 meses · día 10");

console.log("repeat ok");
