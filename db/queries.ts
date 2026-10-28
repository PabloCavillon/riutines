import { and, asc, eq, isNotNull, or, sql } from "drizzle-orm";
import { db } from ".";
import { today, weekday } from "@/lib/date";
import { currentStreak } from "@/lib/streak";
import { dailyLogs, habits, tasks } from "./schema";

export type Status = (typeof dailyLogs.$inferInsert)["status"];
export const STATUSES: Status[] = ["done", "missed", "skipped"];

// Hábitos activos que tocan ese día (con su racha) + tareas que vencen ese día, cada uno con su estado (o null).
export async function getDay(date: string) {
  const [habitRows, taskRows, logs, habitLogs] = await Promise.all([
    db
      .select()
      .from(habits)
      .where(
        and(
          eq(habits.active, true),
          or(eq(habits.frequencyType, "daily"), sql`${weekday(date)} = any(${habits.weekdays})`),
        ),
      )
      .orderBy(asc(habits.id)),
    db.select().from(tasks).where(eq(tasks.dueDate, date)).orderBy(asc(tasks.id)),
    db.select().from(dailyLogs).where(eq(dailyLogs.date, date)),
    // shortcut: trae todo el historial de hábitos para las rachas; alcanza para años de un solo usuario.
    db
      .select({ habitId: dailyLogs.habitId, date: dailyLogs.date, status: dailyLogs.status })
      .from(dailyLogs)
      .where(isNotNull(dailyLogs.habitId)),
  ]);
  const history = new Map<number, Map<string, string>>();
  for (const l of habitLogs) {
    if (!history.has(l.habitId!)) history.set(l.habitId!, new Map());
    history.get(l.habitId!)!.set(l.date, l.status);
  }
  const habitStatus = new Map(logs.filter((l) => l.habitId).map((l) => [l.habitId, l.status]));
  const taskStatus = new Map(logs.filter((l) => l.taskId).map((l) => [l.taskId, l.status]));
  return {
    habits: habitRows.map((h) => {
      const past = new Map(history.get(h.id));
      past.delete(date);
      const status = habitStatus.get(h.id) ?? null;
      // streakBefore no cuenta hoy: la fila suma o corta según el estado que se marque.
      const streakBefore = currentStreak(h, past, date, today(h.createdAt));
      return { ...h, status, streakBefore, streak: status === "done" ? streakBefore + 1 : status === "missed" ? 0 : streakBefore };
    }),
    tasks: taskRows.map((t) => ({ ...t, status: taskStatus.get(t.id) ?? null })),
  };
}

// null borra el registro del día (desmarcar).
export async function setHabitStatus(habitId: number, date: string, status: Status | null) {
  const where = and(eq(dailyLogs.date, date), eq(dailyLogs.habitId, habitId));
  if (!status) return db.delete(dailyLogs).where(where);
  await db
    .insert(dailyLogs)
    .values({ habitId, date, status })
    .onConflictDoUpdate({ target: [dailyLogs.date, dailyLogs.habitId], set: { status } });
}

// Único lugar que cambia el estado de una tarea: mantiene tasks.done y daily_logs en sync.
export async function setTaskStatus(taskId: number, date: string, status: Status | null) {
  const done = db.update(tasks).set({ done: status === "done" }).where(eq(tasks.id, taskId));
  if (!status) {
    await db.batch([
      db.delete(dailyLogs).where(and(eq(dailyLogs.date, date), eq(dailyLogs.taskId, taskId))),
      done,
    ]);
    return;
  }
  await db.batch([
    db
      .insert(dailyLogs)
      .values({ taskId, date, status })
      .onConflictDoUpdate({ target: [dailyLogs.date, dailyLogs.taskId], set: { status } }),
    done,
  ]);
}
