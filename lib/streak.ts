import { addDays, weekday } from "./date";

type Habit = { frequencyType: "daily" | "weekdays"; weekdays: number[] | null };

export function isScheduled(habit: Habit, date: string) {
  return habit.frequencyType === "daily" || Boolean(habit.weekdays?.includes(weekday(date)));
}

// Días programados seguidos con ✅ hasta hoy. ⏭️ no corta ni suma; hoy sin marcar todavía no corta.
export function currentStreak(habit: Habit, statusByDate: Map<string, string>, today: string, since: string) {
  let streak = 0;
  for (let d = today; d >= since; d = addDays(d, -1)) {
    if (!isScheduled(habit, d)) continue;
    const status = statusByDate.get(d);
    if (status === "done") streak++;
    else if (status === "skipped" || (!status && d === today)) continue;
    else break;
  }
  return streak;
}
