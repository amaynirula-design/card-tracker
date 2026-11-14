// The dark forest band that closes every page. On signed-in phone screens it
// also leaves room for the tab bar fixed over the bottom of the window.
export function SiteFooter({ clearTabBar = false }: { clearTabBar?: boolean }) {
  return (
    <footer
      className={`night forest-band mt-auto px-5 pt-6 text-small text-fg-soft md:px-10 md:pb-6 ${
        clearTabBar ? "pb-[calc(5.5rem+env(safe-area-inset-bottom))]" : "pb-6"
      }`}
    >
      <p className="mx-auto w-full max-w-6xl">
        <span className="code text-fg">Card Tracker</span>
        <span className="mx-2" aria-hidden="true">
          ·
        </span>
        No card numbers are ever stored.
      </p>
    </footer>
  );
}
