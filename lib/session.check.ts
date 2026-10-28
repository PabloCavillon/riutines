// Auto-chequeo: npx tsx lib/session.check.ts
import assert from "node:assert/strict";
import { createSession, isValidPassword, isValidSession } from "./session";

process.env.SESSION_SECRET = "test-secret";
process.env.APP_PASSWORD = "clave";

const s = createSession();
assert.ok(isValidSession(s));
assert.ok(!isValidSession(undefined));
assert.ok(!isValidSession("garbage"));
assert.ok(!isValidSession(s.replace(/^\d/, "9"))); // vencimiento alterado
assert.ok(!isValidSession(`${Date.now() - 1}.x`));
assert.ok(isValidPassword("clave"));
assert.ok(!isValidPassword("clave2"));
assert.ok(!isValidPassword(""));
console.log("session ok");
