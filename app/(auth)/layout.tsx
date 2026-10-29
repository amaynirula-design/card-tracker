import { AppMark } from "@/app/components/app-mark";

// Shared frame for the sign-up and log-in pages: a narrow centered column.
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="mx-auto w-full max-w-sm flex-1 px-4 pb-16 pt-12 sm:pt-20">
      <AppMark className="mx-auto size-14" />
      {children}
    </main>
  );
}
