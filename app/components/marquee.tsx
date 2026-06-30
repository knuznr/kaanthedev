export function Marquee({
  items,
  reverse = false,
  className = '',
}: {
  items: string[]
  reverse?: boolean
  className?: string
}) {
  const row = (key: string) => (
    <div
      key={key}
      className={`flex shrink-0 items-center gap-6 pr-6 animate-marquee ${
        reverse ? '[animation-direction:reverse]' : ''
      } group-hover:[animation-play-state:paused]`}
    >
      {items.map((it, i) => (
        <span
          key={`${key}-${i}`}
          className="font-display font-extrabold uppercase text-[clamp(1.5rem,4vw,3rem)] leading-none whitespace-nowrap"
        >
          {it}
          <span className="inline-block mx-6 h-3 w-3 bg-red align-middle" />
        </span>
      ))}
    </div>
  )
  return (
    <div className={`group flex overflow-hidden ${className}`} aria-hidden="true">
      {row('a')}
      {row('b')}
    </div>
  )
}
