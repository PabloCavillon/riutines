"use client";

import { useOptimistic } from "react";
import { setStatus } from "@/app/actions";
import { StatusMark, Tally } from "@/components/tally";
import type { Status } from "@/db/queries";

const BUTTONS = [
  { status: "done", label: "Hecho", on: "bg-done border-done" },
  { status: "missed", label: "No hecho", on: "bg-missed border-missed" },
  { status: "skipped", label: "Omitido", on: "bg-skipped border-skipped" },
] as const;

const ROW = { done: "bg-done-row", missed: "bg-missed-row", skipped: "bg-skipped-row" };

// Fila de Hoy: el color del estado queda en la fila y la lista nunca se reordena.
export function ItemRow(props: {
  kind: "habit" | "task";
  id: number;
  date: string;
  status: Status | null;
  name: string;
  emoji?: string | null;
  // Hábitos: racha sin contar hoy, para que la marca optimista sume o corte al instante.
  streakBefore?: number;
  detail?: string;
}) {
  const [status, setOptimistic] = useOptimistic(props.status);
  const before = props.streakBefore ?? 0;
  const streak = status === "done" ? before + 1 : status === "missed" ? 0 : before;

  async function action(form: FormData) {
    const next = form.get("status") as Status;
    setOptimistic(status === next ? null : next);
    await setStatus(form);
  }

  return (
    <li
      className={`flex items-center gap-3 border-b border-border px-4 py-3 transition-colors duration-300 sm:px-6 ${status ? ROW[status] : ""}`}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">
          {props.emoji && <span className="mr-1.5">{props.emoji}</span>}
          {props.name}
        </p>
        {props.kind === "habit" && (
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Tally count={streak} drawFrom={status === "done" ? before : undefined} className="h-3.5 text-malbec" />
            <span>{streak ? `${streak} ${streak === 1 ? "día" : "días"}` : "sin racha"}</span>
            {props.detail && <span aria-hidden>·</span>}
            {props.detail && <span>{props.detail}</span>}
          </p>
        )}
      </div>
      <form action={action} className="flex shrink-0 gap-1.5">
        <input type="hidden" name="kind" value={props.kind} />
        <input type="hidden" name="id" value={props.id} />
        <input type="hidden" name="date" value={props.date} />
        <input type="hidden" name="current" value={status ?? ""} />
        {BUTTONS.map(({ status: s, label, on }) => (
          <button
            key={s}
            name="status"
            value={s}
            aria-pressed={status === s}
            aria-label={`${label}: ${props.name}`}
            title={label}
            className={`grid size-11 place-items-center rounded-md border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-malbec ${
              status === s
                ? `${on} text-white`
                : "border-input bg-card text-muted-foreground hover:border-malbec hover:text-malbec"
            }`}
          >
            <StatusMark status={s} pressed={status === s} />
          </button>
        ))}
      </form>
    </li>
  );
}
