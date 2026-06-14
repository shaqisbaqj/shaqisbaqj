import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Churchy — Automated Guest Follow-Up for Churches",
  description:
    "Churchy connects to Planning Center and handles guest follow-up automatically so no one falls through the cracks.",
  openGraph: {
    title: "Churchy — Automated Guest Follow-Up for Churches",
    description:
      "Churchy connects to Planning Center and handles guest follow-up automatically so no one falls through the cracks.",
    url: "https://churchy.app",
    siteName: "Churchy",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
