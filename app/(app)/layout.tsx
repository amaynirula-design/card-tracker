import { AppNav } from "@/app/components/app-nav";
import { SiteFooter } from "@/app/components/site-footer";

// Every signed-in screen: the black bar on top, the page, then the footer band.
export default function SignedInLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppNav />
      {children}
      <SiteFooter clearTabBar />
    </div>
  );
}
