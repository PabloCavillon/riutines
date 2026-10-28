import { eq } from "drizzle-orm";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { deleteHabit } from "@/app/actions";
import { HabitForm } from "@/components/habit-form";
import { db } from "@/db";
import { habits } from "@/db/schema";

export default function EditHabitPage({ params }: PageProps<"/habits/[id]">) {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 pb-16 sm:px-6">
      <Link href="/habits" className="text-sm font-medium text-malbec underline underline-offset-4">
        Volver a hábitos
      </Link>
      <Suspense fallback={<p className="py-6 text-muted-foreground">Cargando…</p>}>
        <EditHabit params={params} />
      </Suspense>
    </div>
  );
}

async function EditHabit({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const [habit] = Number.isInteger(id) ? await db.select().from(habits).where(eq(habits.id, id)) : [];
  if (!habit) notFound();

  return (
    <>
      <h1 className="mt-4 mb-6 text-2xl font-bold tracking-tight">Editar hábito</h1>
      <HabitForm habit={habit} />
      <details className="group mt-12 border-t border-border pt-6">
        <summary className="flex min-h-11 w-fit cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-missed [&::-webkit-details-marker]:hidden">
          <ChevronRight className="size-4 transition-transform group-open:rotate-90" aria-hidden />
          Borrar hábito
        </summary>
        <p className="mt-3 max-w-prose text-sm text-muted-foreground">
          Se borra el hábito y todo su historial. Si solo querés dejar de verlo, pausalo desde la lista.
        </p>
        <form action={deleteHabit} className="mt-4">
          <input type="hidden" name="id" value={habit.id} />
          <button className="h-11 rounded-md bg-missed px-5 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-missed">
            Borrar {habit.name} y su historial
          </button>
        </form>
      </details>
    </>
  );
}
