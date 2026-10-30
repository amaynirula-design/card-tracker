import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { logOut } from "@/app/(auth)/actions";
import { GroupedSection, ListRow } from "@/app/components/grouped-list";
import { ThemeSwitch } from "@/app/components/theme-switch";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Account · Card Tracker" };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-16 pt-5 md:pt-10">
      <h1 className="text-large-title font-bold leading-tight tracking-tight">Account</h1>

      <div className="mt-6 space-y-8">
        <GroupedSection>
          <ListRow title="Email" trailing={<span className="block max-w-[52vw] truncate sm:max-w-xs">{user.email}</span>} />
          {memberSince && <ListRow title="Member Since" trailing={memberSince} />}
        </GroupedSection>

        <GroupedSection header="Appearance" footer="System follows your device's light or dark setting.">
          <li className="p-2.5">
            <ThemeSwitch />
          </li>
        </GroupedSection>

        {/* Like "Sign Out" in iOS Settings: a red row on its own. */}
        <form action={logOut}>
          <button
            type="submit"
            className="h-12 w-full rounded-2xl bg-surface text-body text-danger shadow-panel transition-opacity hover:opacity-80 active:opacity-60"
          >
            Log Out
          </button>
        </form>
      </div>
    </main>
  );
}
