import { AppNav } from "@/app/components/app-nav";

// Every signed-in screen: the navigation around the page.
export default function SignedInLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col md:pl-56">
      <AppNav />
      {children}
    </div>
  );
}
