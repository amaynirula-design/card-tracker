import { getCurrentUser, type CurrentUser } from "@/lib/auth";
import { logOut } from "./(auth)/actions";
import { getCards } from "./cards/data";
import { AppMark } from "./components/app-mark";
import { ButtonLink } from "./components/button";
import { GroupedSection, ListRow } from "./components/grouped-list";
import { IconArrowDownCircle, IconCard, IconChart, IconLock, IconReceipt, IconTarget } from "./components/icons";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) return <Welcome />;
  const cards = await getCards();
  return <SignedInHome user={user} cardCount={cards.filter((card) => card.isActive).length} />;
}

function SignedInHome({ user, cardCount }: { user: CurrentUser; cardCount: number }) {
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-16 pt-10">
      <h1 className="text-[34px] font-bold leading-tight tracking-tight">Welcome</h1>
      <p className="mt-1 truncate text-[17px] text-label-secondary">{user.email}</p>

      <div className="mt-8 space-y-8">
        <GroupedSection>
          <ListRow
            href="/cards"
            icon={<IconCard className="size-[18px]" />}
            title="Cards"
            trailing={cardCount > 0 ? cardCount : "Add your first"}
          />
        </GroupedSection>

        <GroupedSection header="Account">
          <ListRow title="Email" trailing={<span className="block max-w-[52vw] truncate sm:max-w-xs">{user.email}</span>} />
          {memberSince && <ListRow title="Member since" trailing={memberSince} />}
        </GroupedSection>

        {/* Like "Sign Out" in iOS Settings: a red row on its own. */}
        <form action={logOut}>
          <button
            type="submit"
            className="h-12 w-full rounded-2xl bg-surface text-[17px] text-danger shadow-panel transition-opacity hover:opacity-80 active:opacity-60"
          >
            Log out
          </button>
        </form>
      </div>
    </main>
  );
}

function Welcome() {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-16 pt-14 sm:pt-20">
      <div className="flex flex-col items-center text-center">
        <AppMark className="size-[76px] drop-shadow-[0_10px_24px_rgb(0_124_119/0.28)]" />
        <h1 className="mt-6 text-[34px] font-bold leading-tight tracking-tight sm:text-[40px]">
          Card Tracker
        </h1>
        <p className="mt-3 max-w-sm text-[17px] leading-relaxed text-label-secondary">
          Use the right credit card for every purchase, and see what your cards actually earn you.
        </p>
        <div className="mt-8 flex w-full max-w-xs flex-col gap-2">
          <ButtonLink href="/signup" size="lg">
            Create account
          </ButtonLink>
          <ButtonLink href="/login" variant="plain" size="lg">
            Log in
          </ButtonLink>
        </div>
      </div>

      <div className="mt-12 space-y-8">
        <GroupedSection header="What it does">
          <ListRow
            icon={<IconTarget />}
            title="Best card for every category"
            subtitle="Pick Dining or Groceries and see which of your cards earns the most."
          />
          <ListRow
            icon={<IconReceipt />}
            title="Every purchase, in one place"
            subtitle="Log the merchant, amount, card, and category in a few taps."
          />
          <ListRow
            icon={<IconChart />}
            title="Rewards you've earned"
            subtitle="Total rewards and your effective reward rate, month by month."
          />
          <ListRow
            icon={<IconArrowDownCircle />}
            title="What the wrong card cost you"
            subtitle="See the rewards you missed by not using your best card."
          />
        </GroupedSection>

        <GroupedSection>
          <ListRow
            icon={<IconLock />}
            title="Private by design"
            subtitle="No card numbers are ever stored. Each card is just a name you choose, and only you can see your data."
          />
        </GroupedSection>
      </div>
    </main>
  );
}
