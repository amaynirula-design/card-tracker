import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppHeader } from "./components/app-header";
import { themeScript } from "./components/theme-switch";

export const metadata: Metadata = {
  title: "Card Tracker",
  description: "Know which credit card to use for every purchase, and see what your cards actually earn.",
};

export const viewport: Viewport = {
  // Colors the phone's browser bar to match the page in each mode.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f2f7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
