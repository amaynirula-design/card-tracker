import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

// Self-hosted by Next.js. The width axis gives the app its wide headings and
// narrow labels from one family.
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo" });

export const metadata: Metadata = {
  title: "Card Tracker",
  description: "Know which credit card to use for every purchase, and see what your cards actually earn.",
};

export const viewport: Viewport = {
  // Colors the phone's browser bar to match the page.
  themeColor: "#2230c8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
