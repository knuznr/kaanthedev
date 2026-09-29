export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-2xl px-6 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-4 md:pb-12">
      <div className="mono-label muted flex justify-between border-t-[3px] border-ink pt-4">
        <span>&#169; {new Date().getFullYear()} kaan uzuner</span>
      </div>
    </footer>
  )
}
