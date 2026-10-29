import assert from "node:assert/strict";
import { parseRepeat, parseTime } from "./parse";

const form = (fields: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.set(k, v);
  return f;
};

assert.deepEqual(parseTime(form({ time: "07:30" })), { value: "07:30" });
assert.deepEqual(parseTime(form({ time: "" })), { value: null });
assert.deepEqual(parseTime(form({})), { value: null });
assert.ok(parseTime(form({ time: "24:00" })).error);
assert.ok(parseTime(form({ time: "7:30" })).error);

assert.deepEqual(parseRepeat(form({})).value, {
  repeat: null,
  repeatN: null,
  repeatWeekday: null,
  repeatEvery: 1,
});
assert.deepEqual(parseRepeat(form({ repeat: "business_day", repeatN: "2" })).value, {
  repeat: "business_day",
  repeatN: 2,
  repeatWeekday: null,
  repeatEvery: 1,
});
assert.deepEqual(parseRepeat(form({ repeat: "business_day", repeatN: "2", repeatFrom: "end" })).value?.repeatN, -2);
assert.deepEqual(parseRepeat(form({ repeat: "6", repeatN: "3", repeatEvery: "3" })).value, {
  repeat: "weekday",
  repeatN: 3,
  repeatWeekday: 6,
  repeatEvery: 3,
});
assert.ok(parseRepeat(form({ repeat: "month_day", repeatN: "1", repeatEvery: "13" })).error);
assert.ok(parseRepeat(form({ repeat: "month_day", repeatN: "1", repeatEvery: "0" })).error);
assert.deepEqual(parseRepeat(form({ repeat: "0", repeatN: "1" })).value?.repeatWeekday, 0); // domingo no es falsy-bug
assert.ok(parseRepeat(form({ repeat: "business_day", repeatN: "24" })).error);
assert.ok(parseRepeat(form({ repeat: "6", repeatN: "6" })).error);
assert.ok(parseRepeat(form({ repeat: "month_day", repeatN: "0" })).error);
assert.ok(parseRepeat(form({ repeat: "7", repeatN: "1" })).value?.repeat === null); // basura: no se repite

console.log("parse ok");
