"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Hoy" },
  { href: "/habits", label: "Hábitos" },
  { href: "/tasks", label: "Tareas" },
];

export function Nav() {
  return <NavLinks path={usePathname()} />;
}

// Sin `path` (fallback mientras carga la ruta) no marca ninguna pestaña.
export function NavLinks({ path = "" }: { path?: string }) {
  return (
    <nav aria-label="Secciones" className="flex gap-1">
      {LINKS.map(({ href, label }) => {
        const active = href === "/" ? path === "/" : Boolean(path) && path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className="flex min-h-11 items-center rounded-md px-3 text-sm text-chalk/80 transition-colors hover:bg-chalk/10 hover:text-chalk focus-visible:outline-2 focus-visible:outline-chalk aria-[current=page]:bg-chalk aria-[current=page]:font-semibold aria-[current=page]:text-malbec"
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
