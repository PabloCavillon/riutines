"use client";

import { startTransition, useActionState } from "react";
import { saveTask } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Task = { id: number; title: string; dueDate: string };

export function TaskForm({ task, today }: { task?: Task; today: string }) {
  const [error, action, pending] = useActionState(saveTask, null);

  return (
    <form
      // onSubmit en vez de action: así React no vacía los campos cuando vuelve un error
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
      className="grid gap-5"
    >
      {task && <input type="hidden" name="id" value={task.id} />}
      <div className="grid gap-3 sm:grid-cols-[1fr_11rem]">
        <div className="grid gap-2">
          <Label htmlFor="title">Tarea</Label>
          <Input id="title" name="title" defaultValue={task?.title} required placeholder="Pagar expensas" className="h-11" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dueDate">Para el</Label>
          <Input id="dueDate" name="dueDate" type="date" defaultValue={task?.dueDate ?? today} required className="h-11" />
        </div>
      </div>
      {error && (
        <p role="alert" className="text-sm font-medium text-missed">
          {error}
        </p>
      )}
      <div>
        <Button type="submit" disabled={pending} className="h-11 px-5 text-sm">
          {pending ? "Guardando…" : task ? "Guardar cambios" : "Agregar tarea"}
        </Button>
      </div>
    </form>
  );
}
