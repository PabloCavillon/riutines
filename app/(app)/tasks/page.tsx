import { and, asc, desc, eq, isNotNull, isNull } from "drizzle-orm";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { TaskForm } from "@/components/task-form";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { formatShort, today } from "@/lib/date";
import { formatRepeat, nextDate } from "@/lib/repeat";

export default function TasksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 pb-16 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Tareas</h1>
      <Suspense fallback={<p className="py-6 text-muted-foreground">Cargando tareas…</p>}>
        <Tasks />
      </Suspense>
    </div>
  );
}

async function Tasks() {
  await connection();
  const date = today();
  const once = isNull(tasks.repeat);
  const [pending, repeating, done] = await Promise.all([
    db
      .select()
      .from(tasks)
      .where(and(once, eq(tasks.done, false)))
      .orderBy(asc(tasks.dueDate), asc(tasks.time), asc(tasks.id)),
    db.select().from(tasks).where(isNotNull(tasks.repeat)).orderBy(asc(tasks.id)),
    // shortcut: solo las últimas 20 hechas; sumar paginado si hace falta ver más.
    db.select().from(tasks).where(and(once, eq(tasks.done, true))).orderBy(desc(tasks.dueDate)).limit(20),
  ]);

  return (
    <>
      <section className="mt-6 border-b border-border pb-8">
        <h2 className="mb-4 font-semibold">Nueva tarea</h2>
        <TaskForm today={date} />
      </section>
      <TaskList title="Pendientes" rows={pending} today={date} empty="No hay tareas pendientes." />
      {repeating.length > 0 && <TaskList title="Se repiten" rows={repeating} today={date} />}
      {done.length > 0 && <TaskList title="Hechas" rows={done} today={date} />}
    </>
  );
}

function TaskList(props: { title: string; rows: (typeof tasks.$inferSelect)[]; today: string; empty?: string }) {
  return (
    <section className="mt-8">
      <h2 className="pb-2 text-sm font-semibold text-muted-foreground">{props.title}</h2>
      {props.rows.length === 0 ? (
        <p className="border-t border-border py-4 text-muted-foreground">{props.empty}</p>
      ) : (
        <ul className="border-t border-border">
          {props.rows.map((t) => {
            const late = !t.done && !t.repeat && t.dueDate < props.today;
            const next = t.repeat && t.repeatN ? nextDate({ ...t, repeat: t.repeat, repeatN: t.repeatN }, props.today) : t.dueDate;
            return (
              <li key={t.id} className="flex items-center gap-3 border-b border-border py-3">
                <div className="min-w-0 flex-1">
                  <p className={`truncate font-semibold ${t.done ? "text-muted-foreground line-through" : ""}`}>{t.title}</p>
                  <p className={`mt-0.5 text-sm ${late ? "font-medium text-missed" : "text-muted-foreground"}`}>
                    {t.repeat && t.repeatN && `${formatRepeat(t.repeat, t.repeatN)} · próxima: `}
                    {next === props.today ? "hoy" : formatShort(next)}
                    {t.time && ` · ${t.time.slice(0, 5)}`}
                    {late && " · vencida"}
                  </p>
                </div>
                <Link
                  href={`/tasks/${t.id}`}
                  className="flex h-11 items-center rounded-md px-3 text-sm font-medium text-malbec hover:bg-secondary focus-visible:outline-2 focus-visible:outline-malbec"
                >
                  Editar
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
