import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center bg-red px-4 text-center text-paper">
      <h1 className="font-display font-extrabold uppercase leading-[0.8] tracking-tight text-[clamp(5rem,30vw,18rem)]">
        404
      </h1>
      <p className="mt-4 font-mono text-sm uppercase tracking-widest">THIS PAGE DOES NOT EXIST</p>
      <Link
        href="/"
        className="mt-8 border-2 border-ink bg-paper px-6 py-3 font-mono text-sm uppercase tracking-widest text-ink hover:bg-ink hover:text-paper transition-colors"
      >
        &#8592; BACK HOME
      </Link>
    </section>
  )
}
