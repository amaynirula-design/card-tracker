import { ButtonLink } from "./components/button";

// Shown for any page that doesn't exist, and for anything that belongs to
// another user (the database won't return it, so to you it doesn't exist).
export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center px-4 pb-16 pt-24 text-center">
      <h1 className="text-title1 font-bold tracking-tight">Not Found</h1>
      <p className="mt-2 text-body text-label-secondary">
        This page doesn&apos;t exist, or it isn&apos;t yours.
      </p>
      <ButtonLink href="/" variant="tinted" className="mt-8">
        Go Home
      </ButtonLink>
    </main>
  );
}
