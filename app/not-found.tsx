import { ButtonLink } from "./components/button";
import { EmptyState } from "./components/empty-state";
import { Land } from "./components/screen";
import { PublicHeader } from "./components/public-header";

// Shown for any page that doesn't exist, and for anything that belongs to
// another user (the database won't return it, so to you it doesn't exist).
export default function NotFound() {
  return (
    <>
      <PublicHeader />
      <main className="flex flex-1 flex-col pt-6">
        <h1 className="wide px-5 pb-6 text-headline font-extrabold tracking-tight md:px-10">Not found</h1>
        <Land>
          <EmptyState title="No route to this page" text="This page doesn't exist, or it isn't yours." />
          <ButtonLink href="/" variant="secondary">
            Go home
          </ButtonLink>
        </Land>
      </main>
    </>
  );
}
