import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Zahnarztpraxis Dr. Stephan Heußinger — Zahnarzt in Oberasbach",
  description:
    "Zahnarztpraxis Dr. Stephan Heußinger in Oberasbach bei Nürnberg. Prophylaxe, Implantologie, Ästhetische Zahnheilkunde und mehr. Jetzt Termin online buchen.",
  keywords: ["Zahnarzt", "Oberasbach", "Nürnberg", "Implantologie", "Prophylaxe", "Dr. Heußinger", "Zahnersatz"],
  openGraph: {
    title: "Zahnarztpraxis Dr. Stephan Heußinger",
    description: "Moderne Zahnheilkunde in entspannter Atmosphäre — Oberasbach bei Nürnberg.",
    type: "website",
    locale: "de_DE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
