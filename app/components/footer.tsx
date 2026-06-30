import { Socials } from './socials'

export default function Footer() {
  return (
    <footer className="border-t-2 border-ink px-4 py-12 md:px-6">
      <div className="mb-10">
        <Socials />
      </div>
      <div className="flex flex-col items-start justify-between gap-4 font-mono text-xs uppercase tracking-widest sm:flex-row sm:items-center">
        <p>&#169; {new Date().getFullYear()} KAAN UZUNER</p>
        <p className="opacity-70">BUILT WITH NEXT.JS</p>
        <a href="#hero" className="border-2 border-ink bg-paper px-4 py-2 hover:bg-yellow transition-colors">
          BACK TO TOP &#8593;
        </a>
      </div>
    </footer>
  )
}
