"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { setHabitStatus, setTaskStatus, STATUSES, type Status } from "@/db/queries";
import { habits, tasks } from "@/db/schema";
import { isDate } from "@/lib/date";
import { parseRepeat, parseTime } from "@/lib/parse";
import { createSession, isValidPassword, SESSION_COOKIE, SESSION_DAYS } from "@/lib/session";

// Las actions son endpoints públicos: se valida todo lo que llega, aunque el proxy ya exige sesión.

export async function login(_: string | null, form: FormData) {
  if (!isValidPassword(String(form.get("password") ?? ""))) return "Contraseña incorrecta.";
  (await cookies()).set(SESSION_COOKIE, createSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  redirect("/");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}

function parseHabit(form: FormData) {
  const name = String(form.get("name") ?? "").trim();
  const emoji = String(form.get("emoji") ?? "").trim() || null;
  const time = parseTime(form);
  const days = [...new Set(form.getAll("weekdays").map(Number))].filter(
    (d) => Number.isInteger(d) && d >= 0 && d <= 6,
  );
  if (!name) return { error: "Poné un nombre." };
  if (time.error) return { error: time.error };
  if (form.get("frequency") === "weekdays") {
    if (!days.length) return { error: "Elegí al menos un día." };
    return { value: { name, emoji, time: time.value, frequencyType: "weekdays" as const, weekdays: days.sort() } };
  }
  return { value: { name, emoji, time: time.value, frequencyType: "daily" as const, weekdays: null } };
}

function parseId(value: FormDataEntryValue | null) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new Error("id inválido");
  return id;
}

export async function saveHabit(_: string | null, form: FormData) {
  const parsed = parseHabit(form);
  if (parsed.error) return parsed.error;
  if (form.get("id")) {
    await db.update(habits).set(parsed.value!).where(eq(habits.id, parseId(form.get("id"))));
  } else {
    await db.insert(habits).values(parsed.value!);
  }
  redirect("/habits");
}

export async function setHabitActive(form: FormData) {
  await db
    .update(habits)
    .set({ active: form.get("active") === "true" })
    .where(eq(habits.id, parseId(form.get("id"))));
  refresh();
}

export async function deleteHabit(form: FormData) {
  await db.delete(habits).where(eq(habits.id, parseId(form.get("id"))));
  redirect("/habits");
}

export async function saveTask(_: string | null, form: FormData) {
  const title = String(form.get("title") ?? "").trim();
  const dueDate = form.get("dueDate");
  const time = parseTime(form);
  const repeat = parseRepeat(form);
  if (!title) return "Poné un título.";
  if (!isDate(dueDate)) return "Elegí una fecha.";
  if (time.error) return time.error;
  if (repeat.error) return repeat.error;
  // Si pasa a repetirse, se reabre: tasks.done no aplica a las que se repiten.
  const values = { title, dueDate, time: time.value, ...repeat.value!, ...(repeat.value!.repeat && { done: false }) };
  if (form.get("id")) {
    await db.update(tasks).set(values).where(eq(tasks.id, parseId(form.get("id"))));
  } else {
    await db.insert(tasks).values(values);
  }
  redirect("/tasks");
}

export async function deleteTask(form: FormData) {
  await db.delete(tasks).where(eq(tasks.id, parseId(form.get("id"))));
  redirect("/tasks");
}

// Tocar el estado que ya está marcado lo desmarca.
export async function setStatus(form: FormData) {
  const date = form.get("date");
  const status = form.get("status") as Status;
  if (!isDate(date) || !STATUSES.includes(status)) throw new Error("datos inválidos");
  const next = form.get("current") === status ? null : status;
  const id = parseId(form.get("id"));
  if (form.get("kind") === "task") await setTaskStatus(id, date, next);
  else await setHabitStatus(id, date, next);
  refresh();
}
