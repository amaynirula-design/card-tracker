import { PublicHeader } from "@/app/components/public-header";

// Shared frame for the sign-up and log-in pages.
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <PublicHeader />
      <main className="flex flex-1 flex-col pt-6 md:items-center md:pt-14">{children}</main>
    </>
  );
}
