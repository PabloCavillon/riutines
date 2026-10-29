"use client";

import { startTransition, useActionState, useState } from "react";
import { saveTask } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatShort } from "@/lib/date";
import { formatEvery, formatRepeat, nextDate, type Repeat, type Rule, WEEKDAY_NAMES } from "@/lib/repeat";

type Task = {
  id: number;
  title: string;
  dueDate: string;
  time: string | null;
  repeat: Repeat | null;
  repeatN: number | null;
  repeatWeekday: number | null;
  repeatEvery: number;
};

// En la lista, los días de la semana van por su número (0 = domingo), empezando por el lunes.
const KINDS = [
  { value: "business_day", label: "día hábil" },
  { value: "month_day", label: "día del mes (hábil o no)" },
  ...[1, 2, 3, 4, 5, 6, 0].map((d) => ({
    value: String(d),
    label: WEEKDAY_NAMES[d],
  })),
];

const SELECT =
  "h-11 rounded-md border border-input bg-card px-3 text-sm focus-visible:outline-2 focus-visible:outline-malbec";

export function TaskForm({ task, today }: { task?: Task; today: string }) {
  const [error, action, pending] = useActionState(saveTask, null);
  const [repeats, setRepeats] = useState(Boolean(task?.repeat));
  const [kind, setKind] = useState(
    task?.repeat === "weekday" ? String(task.repeatWeekday) : (task?.repeat ?? "business_day"),
  );
  const [n, setN] = useState(task?.repeatN ? Math.abs(task.repeatN) : 1);
  const [fromEnd, setFromEnd] = useState((task?.repeatN ?? 1) < 0);
  const [every, setEvery] = useState(task?.repeatEvery ?? 1);
  const [dueDate, setDueDate] = useState(task?.dueDate ?? today);
  const isWeekday = /^[0-6]$/.test(kind);
  const max = kind === "business_day" ? 23 : kind === "month_day" ? 31 : 5;
  const rule: Rule | null =
    Number.isInteger(n) && n >= 1 && n <= max
      ? {
          repeat: isWeekday ? "weekday" : (kind as Repeat),
          repeatN: fromEnd ? -n : n,
          repeatWeekday: isWeekday ? Number(kind) : null,
          repeatEvery: every,
        }
      : null;

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
          <Input
            id="title"
            name="title"
            defaultValue={task?.title}
            required
            placeholder="Pagar expensas"
            className="h-11"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dueDate">{repeats ? "Desde el" : "Para el"}</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="h-11"
          />
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
            { value: true, label: "Cada tantos meses" },
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
          <>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <select
                name="repeatEvery"
                value={every}
                onChange={(e) => setEvery(Number(e.target.value))}
                aria-label="Cada cuántos meses"
                className={SELECT}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {formatEvery(m)}
                  </option>
                ))}
              </select>
              <span>, el</span>
              <Input
                name="repeatN"
                type="number"
                min={1}
                max={max}
                value={n}
                onChange={(e) => setN(e.target.valueAsNumber)}
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
                {KINDS.map((k) => (
                  <option key={k.value} value={k.value}>
                    {k.label}
                  </option>
                ))}
              </select>
              <select
                name="repeatFrom"
                value={fromEnd ? "end" : "start"}
                onChange={(e) => setFromEnd(e.target.value === "end")}
                aria-label="Desde dónde se cuenta"
                className={SELECT}
              >
                <option value="start">contando desde el principio</option>
                <option value="end">contando desde el final</option>
              </select>
            </div>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {rule
                ? `${formatRepeat(rule)} · próxima: ${formatShort(nextDate(dueDate || today, rule, today))}`
                : `Elegí un número del 1 al ${max}.`}
            </p>
          </>
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
