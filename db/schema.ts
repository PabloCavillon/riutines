import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const frequencyType = pgEnum("frequency_type", ["daily", "weekdays"]);
export const logStatus = pgEnum("log_status", ["done", "missed", "skipped"]);

// Las fechas se guardan como string 'YYYY-MM-DD' (mode: "string") para que nunca haya conversión de zona horaria.

export const habits = pgTable(
  "habits",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    emoji: text("emoji"),
    frequencyType: frequencyType("frequency_type").notNull().default("daily"),
    weekdays: integer("weekdays").array(), // 0 = domingo … 6 = sábado; null si es diario
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check(
      "weekdays_match_frequency",
      sql`(${t.frequencyType} = 'daily' AND ${t.weekdays} IS NULL) OR (${t.frequencyType} = 'weekdays' AND ${t.weekdays} IS NOT NULL AND cardinality(${t.weekdays}) > 0 AND ${t.weekdays} <@ '{0,1,2,3,4,5,6}'::int[])`,
    ),
  ],
);

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  dueDate: date("due_date", { mode: "string" }).notNull(),
  done: boolean("done").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const dailyLogs = pgTable(
  "daily_logs",
  {
    id: serial("id").primaryKey(),
    date: date("date", { mode: "string" }).notNull(),
    habitId: integer("habit_id").references(() => habits.id, { onDelete: "cascade" }),
    taskId: integer("task_id").references(() => tasks.id, { onDelete: "cascade" }),
    status: logStatus("status").notNull(),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique().on(t.date, t.habitId),
    unique().on(t.date, t.taskId),
    check("one_target", sql`num_nonnulls(${t.habitId}, ${t.taskId}) = 1`),
  ],
);

export const reflections = pgTable("reflections", {
  id: serial("id").primaryKey(),
  date: date("date", { mode: "string" }).notNull().unique(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
