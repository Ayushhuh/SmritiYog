import type { Metadata } from "next";
import { I18nProvider } from "@/lib/i18n/store";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SmritiYog CG — Caregiver Dashboard",
    template: "%s | SmritiYog CG",
  },
  description:
    "SmritiYog CG is the caregiver dashboard for managing and monitoring loved ones using the SmritiYog patient app.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}