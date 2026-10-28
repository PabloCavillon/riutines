import { asc, desc } from "drizzle-orm";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { setHabitActive } from "@/app/actions";
import { HabitForm } from "@/components/habit-form";
import { db } from "@/db";
import { habits } from "@/db/schema";
import { formatWeekdays } from "@/lib/date";

export default function HabitsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 pb-16 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Hábitos</h1>
      <section className="mt-6 border-b border-border pb-8">
        <h2 className="mb-4 font-semibold">Nuevo hábito</h2>
        <HabitForm />
      </section>
      <Suspense fallback={<p className="py-6 text-muted-foreground">Cargando hábitos…</p>}>
        <HabitList />
      </Suspense>
    </div>
  );
}

async function HabitList() {
  await connection();
  const rows = await db.select().from(habits).orderBy(desc(habits.active), asc(habits.time), asc(habits.id));
  if (!rows.length) return <p className="py-6 text-muted-foreground">Todavía no cargaste hábitos.</p>;

  return (
    <ul className="mt-2">
      {rows.map((h) => (
        <li key={h.id} className="flex items-center gap-3 border-b border-border py-3">
          <div className={`min-w-0 flex-1 ${h.active ? "" : "text-muted-foreground"}`}>
            <p className="truncate font-semibold">
              {h.emoji && <span className="mr-1.5">{h.emoji}</span>}
              {h.name}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {h.weekdays ? formatWeekdays(h.weekdays) : "todos los días"}
              {h.time && ` · ${h.time.slice(0, 5)}`}
              {!h.active && " · pausado"}
            </p>
          </div>
          <form action={setHabitActive}>
            <input type="hidden" name="id" value={h.id} />
            <input type="hidden" name="active" value={String(!h.active)} />
            <button className="h-11 rounded-md px-3 text-sm font-medium text-malbec hover:bg-secondary focus-visible:outline-2 focus-visible:outline-malbec">
              {h.active ? "Pausar" : "Reactivar"}
            </button>
          </form>
          <Link
            href={`/habits/${h.id}`}
            className="flex h-11 items-center rounded-md px-3 text-sm font-medium text-malbec hover:bg-secondary focus-visible:outline-2 focus-visible:outline-malbec"
          >
            Editar
          </Link>
        </li>
      ))}
    </ul>
  );
}
