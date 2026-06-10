import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "BrightSmile Dental Clinic — Expert Dental Care in New York",
  description:
    "BrightSmile Dental Clinic offers comprehensive dental services in New York City. Book your appointment online. Trusted by 1,200+ patients since 2008.",
  keywords: ["dentist", "dental clinic", "teeth whitening", "dental implants", "orthodontics", "New York"],
  openGraph: {
    title: "BrightSmile Dental Clinic",
    description: "Modern, compassionate dental care in New York City.",
    type: "website",
    locale: "en_US",
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
