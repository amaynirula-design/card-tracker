import { redirect } from "next/navigation";
import { isSignedIn } from "@/lib/auth";
import { findPreset } from "@/lib/card-presets";
import type { Card } from "@/lib/cards";
import { ButtonLink } from "./components/button";
import { PublicHeader } from "./components/public-header";
import { RouteFinder } from "./components/route-finder";
import { Row, Section } from "./components/rows";

export default async function Home() {
  // Signed-in users go straight to the answer.
  if (await isSignedIn()) redirect("/cards/best");
  return <Welcome />;
}

// Three real presets, so the map on this page works the way it will for you.
const SAMPLE_PRESETS = ["amex-gold", "chase-sapphire-preferred", "citi-double-cash"];

function sampleCards(): Card[] {
  return SAMPLE_PRESETS.flatMap((id, index) => {
    const preset = findPreset(id);
    if (!preset) return [];
    const { name, rewardType, pointValueCents, annualFee, rates } = preset;
    return [{ id: index + 1, name, rewardType, pointValueCents, annualFee, isActive: true, rates }];
  });
}

function Welcome() {
  return (
    <>
      <PublicHeader
        action={
          <ButtonLink href="/login" variant="text" className="-mr-2 px-2">
            Log in
          </ButtonLink>
        }
      />
      <RouteFinder
        cards={sampleCards()}
        initialCategory="Dining"
        headingLevel="h2"
        updateAddress={false}
        mapNote="Sample cards. Pick a category to try it."
        intro={
          <div className="mb-8">
            <h1 className="wide text-headline font-extrabold leading-[1.05] tracking-tight">
              Use the right credit card for every purchase.
            </h1>
            <p className="mt-2 text-fg-soft">See what your cards actually earn you, and what the wrong one cost.</p>
            <ButtonLink href="/signup" size="lg" className="mt-4 w-full sm:w-auto">
              Create account
            </ButtonLink>
          </div>
        }
      >
        <div className="mt-9">
          <Section header="What it does">
            <Row title="Best card for every category" subtitle="Pick Dining or Groceries and see which of your cards earns the most." />
            <Row title="Every purchase, in one place" subtitle="Log the merchant, amount, card, and category in a few taps." />
            <Row title="Rewards you've earned" subtitle="Total rewards and your effective reward rate, month by month." />
            <Row title="What the wrong card cost you" subtitle="See the rewards you missed by not using your best card." />
            <Row
              title="Private by design"
              subtitle="No card numbers are ever stored. Each card is just a name you choose, and only you can see your data."
            />
          </Section>
        </div>
      </RouteFinder>
    </>
  );
}
