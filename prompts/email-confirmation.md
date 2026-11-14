# Prompt log: email confirmation (Issue #53)

Branch: `feature/email-confirmation`. Written Nov 13, 2026, after the demo. Not in the original plan.

## Prompt 1 (me, Nov 4, right after the demo)

> demo done... how easy or difficult would it be to add:
>
> 1. Geolocation
> 2. email and phone # confirmation when signing up
> 3. Teller or Plaid API so that purchases get added automatically

## What Claude Code did

- Read the sign-up code and rated each idea:
  - Email confirmation: easy, about one PR.
  - Phone confirmation: medium, and it needs a paid text-message service.
  - Geolocation: easy to tag purchases, harder to work out which store you're in.
  - Plaid or Teller: hard, 3–5 PRs.
- Checked Supabase's docs and found a blocker: its built-in email sender only emails members of your own project, two an hour. So strangers could never confirm without a real email sender.
- Asked me which one to plan first. I picked email confirmation.

## Prompt 2 (me, Nov 13, part of a longer message about a redesign)

> Let's start with the email confirmation now and getting that added in like we had discussed earlier. The Plaid connectivity we can come back to later, but let's start with the email confirmation for now

Claude Code asked which email sender to use. I chose **Resend with my own domain**.

## Prompt 3 (me)

> continue

(Claude Code had stopped partway when my usage limit ran out.)

## What Claude Code did

- Opened Issue #53 and created `feature/email-confirmation` from main.
- **After sign-up:** if Supabase needs the email confirmed, the form becomes a "Check your inbox" screen with a "Send the email again" button.
- **The link in the email** opens a new page, `/auth/confirm`, with one "Confirm my email" button. Confirming happens on the button press, not when the page opens, because some email apps open every link to scan it and would use the link up.
- **Logging in before confirming** shows "Confirm your email first" and the resend button.
- **A bad or expired link** shows a friendly message with links to log in or sign up. Password-reset links and malformed tokens are turned away before Supabase is asked.
- **Resend can't be used to find out who has an account.** The answer is the same either way.
- **It works with the setting on or off.** With "Confirm email" off in Supabase, sign-up behaves exactly as before, so this is safe to merge before the email sender exists.
- **Tests:** 6 no-database tests for reading the link (`lib/confirm-link.test.ts`).
- **README:** the four dashboard steps to turn it on. **PLAN.md:** one Plan vs. Reality row.

## How it was checked

- **Seen at phone size on a local copy:**
  - the confirm page
  - the expired-link message, by pressing the button with a made-up link
  - a wrong kind of link being turned away
  - "Check your inbox" and its resend note
  - the "confirm first" message on log-in and its resend note
- **The inbox and "confirm first" screens were reached with temporary stand-ins** in the local code, because the real ones only appear once Supabase's setting is on. The stand-ins were removed before each commit, and a search confirms none are left.
- **Type check, lint, production build, and the 53 no-database tests:** all pass.

## What went wrong / caught along the way

- **Claude Code created a real account on my live database by mistake.** To preview "Check your inbox" it added a stand-in for the address `preview@test.local` and submitted the sign-up form. The local server hadn't loaded the stand-in, so the real sign-up ran. The account is empty and logged out, and I have to delete it in Supabase's dashboard (Authentication → Users). Claude Code told me straight away. After that it restarted the server and tried a wrong-password log-in first, which can't change anything, to prove the stand-ins were live before using them.
- **Why the stand-in hadn't loaded:** Claude Code opened the local copy at `127.0.0.1` instead of `localhost` to get a signed-out browser without logging me out. At that address the dev server doesn't hot-reload code, and the page's JavaScript doesn't start.
- **That accident exposed a real bug.** The first resend button kept its own separate state. Without JavaScript running, pressing it wiped the form and showed no message at all. Claude Code saw a hint of this in a screenshot, reproduced it, and rebuilt resend to share the form's one state. It now works with or without JavaScript, and both paths were re-checked.
- **Not tested:** a real confirmation email from start to finish. That needs my Resend domain and the Supabase settings first. Also not tested: the fully interactive (JavaScript on) version of the resend button, a real iPhone, or a screen reader.
