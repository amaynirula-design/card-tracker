import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { beforeAll, describe, expect, it } from "vitest";

// Test 1, data isolation (PLAN.md section 4): User B can't see User A's cards
// or purchases, even by direct link.
//
// This runs against a real Supabase project, because what it checks is the
// database's row-level security. It uses a separate test project, never the
// real one: run the files in supabase/migrations there, turn off email
// confirmation, and put its URL and publishable key in .env.test.local as
// TEST_SUPABASE_URL and TEST_SUPABASE_PUBLISHABLE_KEY.
//
// Each run signs up two new throwaway accounts, so runs don't affect each other.

const NO_PERMISSION = "42501"; // Postgres's "row-level security said no" error

// Each user gets their own connection, logged in as them, like their own browser.
async function signUp(name: string): Promise<SupabaseClient> {
  const url = process.env.TEST_SUPABASE_URL;
  const key = process.env.TEST_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Set TEST_SUPABASE_URL and TEST_SUPABASE_PUBLISHABLE_KEY in .env.test.local");
  }

  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  // A real mail domain, since Supabase can refuse ones like example.com. With
  // email confirmation off, nothing is sent.
  const { data, error } = await client.auth.signUp({
    email: `card-tracker-${name}-${Date.now()}@mailinator.com`,
    password: "throwaway-test-account",
  });
  if (error) throw error;
  if (!data.session) throw new Error("Turn off email confirmation in the test project");
  return client;
}

// The same query the purchase detail page uses (getPurchase in
// app/(app)/purchases/data.ts). No row means the page shows "Not found."
function openPurchase(user: SupabaseClient, id: number) {
  return user.from("purchases").select("id, merchant, card:cards (id, name)").eq("id", id).maybeSingle();
}

describe("data isolation", { timeout: 15_000 }, () => {
  let userA: SupabaseClient;
  let userB: SupabaseClient;
  let cardId: number;
  let purchaseIds: number[];

  // Given User A has one card and two purchases (one starred), and User B has
  // just signed up.
  beforeAll(async () => {
    userA = await signUp("user-a");
    userB = await signUp("user-b");

    const card = await userA
      .from("cards")
      .insert({ name: "User A's Card", reward_type: "cashback", point_value_cents: 1 })
      .select("id")
      .single();
    if (card.error) throw card.error;
    cardId = card.data.id;

    const purchases = await userA
      .from("purchases")
      .insert([
        { card_id: cardId, merchant: "Secret Cafe", amount: 20, category: "Dining", purchase_date: "2026-10-01" },
        { card_id: cardId, merchant: "Secret Market", amount: 50, category: "Groceries", purchase_date: "2026-10-02" },
      ])
      .select("id");
    if (purchases.error) throw purchases.error;
    purchaseIds = purchases.data.map((purchase) => purchase.id);

    const star = await userA.from("stars").insert({ purchase_id: purchaseIds[0] });
    if (star.error) throw star.error;
  }, 30_000);

  // Without this, a broken setup would pass every "sees nothing" check below.
  it("User A can see their own card, purchases, and star", async () => {
    const cards = await userA.from("cards").select("id");
    const purchases = await userA.from("purchases").select("id");
    const stars = await userA.from("stars").select("id");

    expect(cards.data).toHaveLength(1);
    expect(purchases.data).toHaveLength(2);
    expect(stars.data).toHaveLength(1);
    expect((await openPurchase(userA, purchaseIds[0])).data?.merchant).toBe("Secret Cafe");
  });

  it("User B's purchases list is empty", async () => {
    const { data, error } = await userB.from("purchases").select("id, merchant");

    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it("User B's cards list is empty", async () => {
    const { data, error } = await userB.from("cards").select("id, name");

    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it("User B's Starred list is empty", async () => {
    const { data, error } = await userB.from("purchases").select("id, stars!inner (id)");

    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it("User A's purchase by direct link is not found for User B", async () => {
    const { data, error } = await openPurchase(userB, purchaseIds[0]);

    expect(error).toBeNull();
    expect(data).toBeNull();
  });

  it("User A's card by direct link is not found for User B", async () => {
    const { data, error } = await userB.from("cards").select("id, name").eq("id", cardId).maybeSingle();

    expect(error).toBeNull();
    expect(data).toBeNull();
  });

  it("User B can't edit User A's purchase", async () => {
    const { data } = await userB
      .from("purchases")
      .update({ merchant: "Changed by User B" })
      .eq("id", purchaseIds[0])
      .select("id");

    expect(data).toEqual([]);
    expect((await openPurchase(userA, purchaseIds[0])).data?.merchant).toBe("Secret Cafe");
  });

  it("User B can't delete User A's purchase", async () => {
    const { data } = await userB.from("purchases").delete().eq("id", purchaseIds[1]).select("id");

    expect(data).toEqual([]);
    expect((await openPurchase(userA, purchaseIds[1])).data?.merchant).toBe("Secret Market");
  });

  it("User B can't add a purchase on User A's card", async () => {
    const { error } = await userB.from("purchases").insert({
      card_id: cardId,
      merchant: "Added by User B",
      amount: 10,
      category: "Dining",
      purchase_date: "2026-10-03",
    });

    expect(error?.code).toBe(NO_PERMISSION);
  });

  it("User B can't star User A's purchase", async () => {
    const { error } = await userB.from("stars").insert({ purchase_id: purchaseIds[0] });

    expect(error?.code).toBe(NO_PERMISSION);
  });
});
