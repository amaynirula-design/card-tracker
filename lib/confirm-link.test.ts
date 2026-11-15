import { describe, expect, it } from "vitest";
import { readConfirmLink } from "./confirm-link";

const hash = "pkce_3f9a1c0b7d2e4f6a8b0c1d2e3f4a5b6c";

describe("readConfirmLink", () => {
  it("reads a link from the confirmation email", () => {
    expect(readConfirmLink({ token_hash: hash, type: "email" })).toEqual({ tokenHash: hash });
  });

  it("accepts the older name for a sign-up link", () => {
    expect(readConfirmLink({ token_hash: hash, type: "signup" })).toEqual({ tokenHash: hash });
  });

  it("turns away a link with no token", () => {
    expect(readConfirmLink({ type: "email" })).toBeNull();
  });

  it("turns away other kinds of link, like a password reset", () => {
    expect(readConfirmLink({ token_hash: hash, type: "recovery" })).toBeNull();
  });

  it("turns away a token that isn't shaped like one", () => {
    expect(readConfirmLink({ token_hash: "abc", type: "email" })).toBeNull();
    expect(readConfirmLink({ token_hash: `${hash}<script>`, type: "email" })).toBeNull();
  });

  it("turns away a value that appears twice in the address", () => {
    expect(readConfirmLink({ token_hash: [hash, hash], type: "email" })).toBeNull();
  });
});
