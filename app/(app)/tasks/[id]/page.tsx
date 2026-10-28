import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { deleteTask } from "@/app/actions";
import { TaskForm } from "@/components/task-form";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { today } from "@/lib/date";

export default function EditTaskPage({ params }: PageProps<"/tasks/[id]">) {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 pb-16 sm:px-6">
      <Link href="/tasks" className="text-sm font-medium text-malbec underline underline-offset-4">
        Volver a tareas
      </Link>
      <Suspense fallback={<p className="py-6 text-muted-foreground">Cargando…</p>}>
        <EditTask params={params} />
      </Suspense>
    </div>
  );
}

async function EditTask({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const [task] = Number.isInteger(id) ? await db.select().from(tasks).where(eq(tasks.id, id)) : [];
  if (!task) notFound();

  return (
    <>
      <h1 className="mt-4 mb-6 text-2xl font-bold tracking-tight">Editar tarea</h1>
      <TaskForm task={task} today={today()} />
      <form action={deleteTask} className="mt-12 border-t border-border pt-6">
        <input type="hidden" name="id" value={task.id} />
        <button className="h-11 rounded-md px-1 text-sm font-semibold text-missed underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-missed">
          Borrar tarea
        </button>
      </form>
    </>
  );
}
