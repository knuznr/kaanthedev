import Link from 'next/link';

export default function NotFound() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        404 - Page Not Found
      </h1>
      <p className="mb-4">you seem to have lost your way, do you want to go back?</p>
      <Link href="/">take me back</Link>
    </section>
  )
}
