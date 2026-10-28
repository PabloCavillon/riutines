"use client";

import { useActionState } from "react";
import { login } from "@/app/actions";
import { Tally } from "@/components/tally";

export default function LoginPage() {
  const [error, action, pending] = useActionState(login, null);

  return (
    <main className="flex flex-1 items-center bg-malbec px-6 text-chalk">
      <form action={action} className="mx-auto grid w-full max-w-sm gap-6">
        <div>
          <Tally count={5} className="h-8" />
          <h1 className="mt-4 text-5xl font-bold tracking-tight">Rutina</h1>
        </div>
        <div className="grid gap-2">
          <label htmlFor="password" className="text-sm text-chalk/80">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "login-error" : undefined}
            className="h-12 rounded-md border border-chalk/40 bg-transparent px-3 text-lg text-chalk caret-chalk outline-none focus-visible:border-chalk focus-visible:ring-2 focus-visible:ring-chalk/40"
          />
          {error && (
            <p id="login-error" role="alert" className="text-sm font-medium text-[#ffb4a6]">
              {error}
            </p>
          )}
        </div>
        <button
          disabled={pending}
          className="h-12 rounded-md bg-chalk text-base font-semibold text-malbec transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk disabled:opacity-60"
        >
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
