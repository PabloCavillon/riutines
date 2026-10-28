import { NextResponse, type NextRequest } from "next/server";
import { isValidSession, SESSION_COOKIE } from "@/lib/session";

export function proxy(request: NextRequest) {
  if (isValidSession(request.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.next();
  return NextResponse.redirect(new URL("/login", request.url));
}

// Todo protegido salvo login, webhook de Telegram, cron y assets.
export const config = {
  matcher: ["/((?!login|api/telegram/webhook|api/cron/|_next/|favicon.ico).*)"],
};
