import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

// Every page here is per-user, per-household financial data — nothing to
// statically prerender. Forcing dynamic also sidesteps Clerk's build-time
// requirement for env vars to be present just to produce a static shell.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ledger",
  description: "One financial brain for the household. Ask it anything.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a09",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#1f8354",
          colorBackground: "#111110",
          colorText: "#f2ede2",
          colorInputBackground: "#1c1c1a",
          colorInputText: "#f2ede2",
          borderRadius: "10px",
        },
      }}
    >
      <html lang="en" className={`${sans.variable} ${mono.variable} dark`}>
        <body className="font-sans">{children}</body>
      </html>
    </ClerkProvider>
  );
}
