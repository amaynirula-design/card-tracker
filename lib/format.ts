// Turning numbers and dates into text the same way on every screen.

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

// 1234.5 → "$1,234.50"
export function formatMoney(amount: number): string {
  return money.format(amount);
}

// Purchase dates are stored as "2026-10-29" with no time or time zone, so they
// are read as a local calendar date (new Date("2026-10-29") would be UTC and
// could show the day before in California).
function parseDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// "2026-10-29" → "Oct 29, 2026"
export function formatDate(date: string): string {
  return parseDate(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// "2026-10-29" → "October 2026"
export function formatMonth(date: string): string {
  return parseDate(date).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// Today in the browser's time zone, as "2026-10-29".
export function todayISO(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// The app's home time zone. The server runs on UTC, which would start a new
// month 7 or 8 hours early for someone in California.
export const APP_TIME_ZONE = "America/Los_Angeles";

// Today in the app's time zone, as "2026-10-29" (for "this month" on the server).
export function todayInAppTimeZone(): string {
  // The "en-CA" format happens to be year-month-day.
  return new Date().toLocaleDateString("en-CA", { timeZone: APP_TIME_ZONE });
}
