"use client";

import { startTransition, useActionState, useState } from "react";
import { saveHabit } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DAYS = [
  { value: 1, short: "L", name: "lunes" },
  { value: 2, short: "M", name: "martes" },
  { value: 3, short: "M", name: "miércoles" },
  { value: 4, short: "J", name: "jueves" },
  { value: 5, short: "V", name: "viernes" },
  { value: 6, short: "S", name: "sábado" },
  { value: 0, short: "D", name: "domingo" },
];

type Habit = {
  id: number;
  name: string;
  emoji: string | null;
  time: string | null;
  frequencyType: string;
  weekdays: number[] | null;
};

export function HabitForm({ habit }: { habit?: Habit }) {
  const [error, action, pending] = useActionState(saveHabit, null);
  const [frequency, setFrequency] = useState(habit?.frequencyType ?? "daily");

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
      {habit && <input type="hidden" name="id" value={habit.id} />}
      <div className="grid grid-cols-[4.5rem_1fr] gap-3 sm:grid-cols-[4.5rem_1fr_7rem]">
        <div className="grid gap-2">
          <Label htmlFor="emoji">Emoji</Label>
          <Input id="emoji" name="emoji" defaultValue={habit?.emoji ?? ""} maxLength={8} className="h-11 text-center text-lg" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" name="name" defaultValue={habit?.name} required placeholder="Tomar 2 L de agua" className="h-11" />
        </div>
        <div className="col-span-2 grid max-w-40 gap-2 sm:col-span-1">
          <Label htmlFor="time">Hora</Label>
          <Input id="time" name="time" type="time" defaultValue={habit?.time?.slice(0, 5) ?? ""} className="h-11" />
        </div>
      </div>

      <fieldset className="grid gap-3">
        <legend className="mb-2 text-sm font-medium">Frecuencia</legend>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "daily", label: "Todos los días" },
            { value: "weekdays", label: "Algunos días" },
          ].map((o) => (
            <label
              key={o.value}
              className="flex h-11 cursor-pointer items-center gap-2 rounded-md border border-input bg-card px-4 text-sm has-checked:border-malbec has-checked:bg-secondary has-checked:font-semibold has-checked:text-malbec has-focus-visible:outline-2 has-focus-visible:outline-malbec"
            >
              <input
                type="radio"
                name="frequency"
                value={o.value}
                checked={frequency === o.value}
                onChange={() => setFrequency(o.value)}
                className="sr-only"
              />
              {o.label}
            </label>
          ))}
        </div>
        {frequency === "weekdays" && (
          <div className="flex gap-1.5" role="group" aria-label="Días de la semana">
            {DAYS.map((d) => (
              <label
                key={d.value}
                className="grid size-11 cursor-pointer place-items-center rounded-md border border-input bg-card text-sm font-semibold text-muted-foreground has-checked:border-malbec has-checked:bg-malbec has-checked:text-chalk has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-malbec"
              >
                <input
                  type="checkbox"
                  name="weekdays"
                  value={d.value}
                  defaultChecked={habit?.weekdays?.includes(d.value)}
                  aria-label={d.name}
                  className="sr-only"
                />
                <span aria-hidden>{d.short}</span>
              </label>
            ))}
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
          {pending ? "Guardando…" : habit ? "Guardar cambios" : "Agregar hábito"}
        </Button>
      </div>
    </form>
  );
}
