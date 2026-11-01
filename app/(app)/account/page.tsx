import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { logOut } from "@/app/(auth)/actions";
import { Screen } from "@/app/components/screen";
import { Row, Section } from "@/app/components/rows";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Account · Card Tracker" };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  return (
    <Screen title="Account">
      <Section>
        <Row title="Email" trailing={<span className="block max-w-[52vw] truncate sm:max-w-xs">{user.email}</span>} />
        {memberSince && <Row title="Member since" trailing={memberSince} />}
      </Section>

      <form action={logOut} className="mt-14">
        <button
          type="submit"
          className="h-12 w-full rounded-md border border-danger font-bold text-danger transition-colors hover:bg-danger hover:text-white"
        >
          Log out
        </button>
      </form>
    </Screen>
  );
}
