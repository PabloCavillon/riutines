import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { ItemRow } from "@/components/item-row";
import { Tally } from "@/components/tally";
import { getDay } from "@/db/queries";
import { formatLong, formatWeekdays, today } from "@/lib/date";

export default function TodayPage() {
  return (
    <Suspense fallback={<TodaySkeleton />}>
      <Today />
    </Suspense>
  );
}

async function Today() {
  await connection(); // "hoy" se calcula en cada request, nunca en el build
  const date = today();
  const { habits, tasks } = await getDay(date);
  const { weekday, date: longDate } = formatLong(date);
  const total = habits.length + tasks.length;
  const done = [...habits, ...tasks].filter((i) => i.status === "done").length;
  const best = habits.reduce<(typeof habits)[number] | null>((a, h) => (h.streak > (a?.streak ?? 0) ? h : a), null);

  return (
    <>
      <section className="bg-malbec text-chalk">
        <div className="mx-auto max-w-3xl px-4 pt-5 pb-6 sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {weekday} <span className="font-normal whitespace-nowrap text-chalk/80">{longDate}</span>
          </h1>
          <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <dt className="text-sm text-chalk/80">hecho hoy</dt>
              <dd className="text-3xl font-semibold">
                {done}
                <span className="text-chalk/70">/{total}</span>
              </dd>
            </div>
            {best && (
              <div>
                <dt className="text-sm text-chalk/80">
                  racha más larga · {best.emoji} {best.name}
                </dt>
                <dd className="mt-1.5 flex items-center gap-3 text-3xl font-semibold">
                  <Tally count={best.streak} className="h-7" />
                  <span>
                    {best.streak} <span className="text-base font-normal">días</span>
                  </span>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-3xl pb-16">
        {total === 0 ? (
          <Empty />
        ) : (
          <>
            {habits.length > 0 && (
              <Section title="Hábitos">
                {habits.map((h) => (
                  <ItemRow
                    key={h.id}
                    kind="habit"
                    id={h.id}
                    date={date}
                    status={h.status}
                    name={h.name}
                    emoji={h.emoji}
                    streakBefore={h.streakBefore}
                    detail={h.weekdays ? formatWeekdays(h.weekdays) : undefined}
                  />
                ))}
              </Section>
            )}
            {tasks.length > 0 && (
              <Section title="Tareas de hoy">
                {tasks.map((t) => (
                  <ItemRow key={t.id} kind="task" id={t.id} date={date} status={t.status} name={t.title} />
                ))}
              </Section>
            )}
          </>
        )}
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="px-4 pb-2 text-sm font-semibold text-muted-foreground sm:px-6">{title}</h2>
      <ul className="border-t border-border">{children}</ul>
    </section>
  );
}

function Empty() {
  return (
    <div className="px-4 py-12 sm:px-6">
      <p className="text-lg font-semibold">Hoy no toca nada.</p>
      <p className="mt-1 text-muted-foreground">
        Cargá un hábito o una tarea para hoy.
      </p>
      <div className="mt-4 flex gap-4 text-sm font-semibold text-malbec">
        <Link href="/habits" className="underline underline-offset-4">
          Nuevo hábito
        </Link>
        <Link href="/tasks" className="underline underline-offset-4">
          Nueva tarea
        </Link>
      </div>
    </div>
  );
}

function TodaySkeleton() {
  return (
    <>
      <section className="bg-malbec">
        <div className="mx-auto h-40 max-w-3xl" />
      </section>
      <p className="mx-auto max-w-3xl px-4 py-6 text-muted-foreground sm:px-6">Cargando el día…</p>
    </>
  );
}
