import { LogOut } from "lucide-react";
import { Suspense } from "react";
import { logout } from "@/app/actions";
import { Nav, NavLinks } from "@/components/nav";
import { Tally } from "@/components/tally";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="bg-malbec text-chalk">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-2 pt-3 sm:gap-4 sm:px-4">
          <div role="img" aria-label="Rutina" className="flex items-center gap-2 pl-2 font-bold tracking-tight">
            <Tally count={5} className="h-5" />
            <span className="hidden sm:inline" aria-hidden>
              Rutina
            </span>
          </div>
          <Suspense fallback={<NavLinks />}>
            <Nav />
          </Suspense>
          <form action={logout} className="ml-auto">
            <button
              title="Salir"
              aria-label="Salir"
              className="grid size-11 place-items-center rounded-md text-chalk/80 hover:bg-chalk/10 hover:text-chalk focus-visible:outline-2 focus-visible:outline-chalk"
            >
              <LogOut className="size-4" aria-hidden />
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </>
  );
}
