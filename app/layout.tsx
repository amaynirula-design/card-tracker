import type { Metadata, Viewport } from "next";
import { Outfit, Work_Sans } from "next/font/google";
import "./globals.css";

// Self-hosted by Next.js. Outfit is for headings and codes (thin and geometric);
// Work Sans is for everything you read or scan.
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans" });

export const metadata: Metadata = {
  title: "Card Tracker",
  description: "Know which credit card to use for every purchase, and see what your cards actually earn.",
};

export const viewport: Viewport = {
  // Colors the phone's browser bar to match the black top bar.
  themeColor: "#0b0d0c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${workSans.variable} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
