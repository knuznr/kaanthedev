import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const name = typeof data?.name === 'string' ? data.name.trim() : ''
    const email = typeof data?.email === 'string' ? data.email.trim() : ''
    const message = typeof data?.message === 'string' ? data.message.trim() : ''

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: 'All fields are required.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'Please enter a valid email.' }, { status: 400 })
    }
    if (message.length < 10) {
      return NextResponse.json({ ok: false, error: 'Message is too short.' }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Something went wrong.' }, { status: 400 })
  }
}
