import { TabBar } from "@/app/components/tab-bar";

// Every signed-in screen: the tab bar (or sidebar on wide screens) next to the page.
export default function SignedInLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 md:pl-1">
      <TabBar />
      {/* Bottom padding keeps the last row clear of the phone tab bar. */}
      <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">{children}</div>
    </div>
  );
}
