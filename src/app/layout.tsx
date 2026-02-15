import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Manrope, Sora } from "next/font/google";
import "@/app/globals.css";

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display"
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "AVNT | Structured Portfolio Management",
  description:
    "AVNT is a structured portfolio operator overseeing digital projects, online communities, and development teams.",
  openGraph: {
    title: "AVNT",
    description: "Structured leadership for digital communities and independent projects.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${sora.variable} ${manrope.variable}`}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
