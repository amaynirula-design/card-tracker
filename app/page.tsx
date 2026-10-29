import { AppMark } from "./components/app-mark";
import { GroupedSection, ListRow } from "./components/grouped-list";
import { IconArrowDownCircle, IconChart, IconLock, IconReceipt, IconTarget } from "./components/icons";

export default function Home() {
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
