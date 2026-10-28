import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

// Archivo: de Omnibus-Type (Buenos Aires), con cifras tabulares.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rutina",
  description: "Hábitos y tareas",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${archivo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
