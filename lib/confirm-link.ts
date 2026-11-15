// Reads the two values a confirmation email's link carries. Plain code with no
// database, so it can be tested on its own.
//
// The link looks like /auth/confirm?token_hash=...&type=email. Anything else
// (a missing value, a different kind of link, a value repeated) isn't one of ours.

export type ConfirmLink = { tokenHash: string };

type Params = Record<string, string | string[] | undefined>;

// Supabase's token hashes are letters, digits, dashes and underscores.
const TOKEN_HASH = /^[A-Za-z0-9_-]{16,256}$/;

export function readConfirmLink(params: Params): ConfirmLink | null {
  const { token_hash: tokenHash, type } = params;
  if (typeof tokenHash !== "string" || typeof type !== "string") return null;
  // "email" is what the template sends. "signup" is the older name for the same thing.
  if (type !== "email" && type !== "signup") return null;
  if (!TOKEN_HASH.test(tokenHash)) return null;
  return { tokenHash };
}
