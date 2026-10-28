"use client";

import { startTransition, useActionState, useState } from "react";
import { saveTask } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Task = {
  id: number;
  title: string;
  dueDate: string;
  time: string | null;
  repeat: "month_day" | "business_day" | null;
  repeatN: number | null;
};

const SELECT =
  "h-11 rounded-md border border-input bg-card px-3 text-sm focus-visible:outline-2 focus-visible:outline-malbec";

export function TaskForm({ task, today }: { task?: Task; today: string }) {
  const [error, action, pending] = useActionState(saveTask, null);
  const [repeats, setRepeats] = useState(Boolean(task?.repeat));
  const [kind, setKind] = useState(task?.repeat ?? "business_day");

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
      <div className="grid gap-3 sm:grid-cols-[1fr_11rem_7rem]">
        <div className="grid gap-2">
          <Label htmlFor="title">Tarea</Label>
          <Input id="title" name="title" defaultValue={task?.title} required placeholder="Pagar expensas" className="h-11" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dueDate">{repeats ? "Desde el" : "Para el"}</Label>
          <Input id="dueDate" name="dueDate" type="date" defaultValue={task?.dueDate ?? today} required className="h-11" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="time">Hora</Label>
          <Input id="time" name="time" type="time" defaultValue={task?.time?.slice(0, 5) ?? ""} className="h-11" />
        </div>
      </div>

      <fieldset className="grid gap-3">
        <legend className="mb-2 text-sm font-medium">Se repite</legend>
        <div className="flex flex-wrap gap-2">
          {[
            { value: false, label: "Una sola vez" },
            { value: true, label: "Todos los meses" },
          ].map((o) => (
            <label
              key={o.label}
              className="flex h-11 cursor-pointer items-center gap-2 rounded-md border border-input bg-card px-4 text-sm has-checked:border-malbec has-checked:bg-secondary has-checked:font-semibold has-checked:text-malbec has-focus-visible:outline-2 has-focus-visible:outline-malbec"
            >
              <input
                type="radio"
                name="repeats"
                checked={repeats === o.value}
                onChange={() => setRepeats(o.value)}
                className="sr-only"
              />
              {o.label}
            </label>
          ))}
        </div>
        {repeats && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span>El</span>
            <Input
              name="repeatN"
              type="number"
              min={1}
              max={kind === "business_day" ? 23 : 31}
              defaultValue={task?.repeatN ? Math.abs(task.repeatN) : 1}
              required
              aria-label="Número"
              className="h-11 w-20"
            />
            <select
              name="repeat"
              value={kind}
              onChange={(e) => setKind(e.target.value as typeof kind)}
              aria-label="Tipo de día"
              className={SELECT}
            >
              <option value="business_day">día hábil</option>
              <option value="month_day">día del mes</option>
            </select>
            <select
              name="repeatFrom"
              defaultValue={(task?.repeatN ?? 1) < 0 ? "end" : "start"}
              aria-label="Desde dónde se cuenta"
              className={SELECT}
            >
              <option value="start">contando desde el principio</option>
              <option value="end">contando desde el final</option>
            </select>
          </div>
        )}
      </fieldset>

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
