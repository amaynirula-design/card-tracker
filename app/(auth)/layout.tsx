import { PublicHeader } from "@/app/components/public-header";
import { SiteFooter } from "@/app/components/site-footer";

// Shared frame for the sign-up and log-in pages.
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <PublicHeader />
      <main className="flex flex-1 flex-col pt-8 md:items-center md:pt-16">{children}</main>
      <SiteFooter />
    </>
  );
}
