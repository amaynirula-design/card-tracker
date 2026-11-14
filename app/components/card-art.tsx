// A credit card tilted on a rounded pedestal, drawn with plain shapes (no image
// files). It's decoration: the card's name is always in text right beside it.
export function CardArt({ code, name }: { code: string | undefined; name: string }) {
  return (
    <div aria-hidden="true" className="relative h-36 w-40 shrink-0 sm:h-44 sm:w-52">
      {/* The pedestal: a column with a lighter top face. */}
      <span className="absolute bottom-0 left-1/2 h-[50%] w-[52%] -translate-x-1/2 rounded-t-[999px] bg-fill-strong" />
      <span className="absolute bottom-[38%] left-1/2 h-[14%] w-[52%] -translate-x-1/2 rounded-[50%] bg-action/25" />
      {/* The card, resting on it. */}
      <span className="absolute left-1/2 top-0 flex h-[52%] w-[82%] -translate-x-1/2 -rotate-12 flex-col justify-between rounded-lg bg-winner p-2.5 text-on-winner shadow-[0_10px_24px_rgb(18_38_29/0.28)] sm:p-3">
        <span className="h-[26%] w-[20%] rounded-[3px] bg-white/35" />
        <span className="min-w-0">
          <span className="code block text-small leading-none sm:text-body">{code}</span>
          <span className="mt-1 block truncate text-caption leading-none opacity-85">{name}</span>
        </span>
      </span>
    </div>
  );
}
