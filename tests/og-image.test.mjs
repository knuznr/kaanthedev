import assert from 'node:assert/strict'
import test from 'node:test'
import sharp from 'sharp'

const baseUrl = process.env.TEST_BASE_URL ?? 'http://localhost:3000'

function getMetaContent(html, property) {
  const escapedProperty = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = html.match(
    new RegExp(`<meta[^>]+property=["']${escapedProperty}["'][^>]+content=["']([^"']+)["']`, 'i'),
  )

  return match?.[1]?.replaceAll('&amp;', '&')
}

test('serves a 1200×630 PNG from the reusable OG endpoint', async () => {
  const response = await fetch(`${baseUrl}/og?title=${encodeURIComponent('A focused OG title')}`)

  assert.equal(response.status, 200)
  assert.match(response.headers.get('content-type') ?? '', /^image\/png\b/)

  const image = Buffer.from(await response.arrayBuffer())
  const metadata = await sharp(image).metadata()

  assert.equal(metadata.width, 1200)
  assert.equal(metadata.height, 630)
  assert.equal(metadata.format, 'png')
})

test('publishes the OG endpoint in the home page metadata', async () => {
  const response = await fetch(baseUrl)
  const html = await response.text()
  const ogImage = getMetaContent(html, 'og:image')

  assert.ok(ogImage, 'Expected an og:image meta tag on the home page')
  assert.equal(new URL(ogImage, baseUrl).pathname, '/og')
})

test('uses the post title in blog OG metadata', async () => {
  const response = await fetch(`${baseUrl}/blog/building-a-project`)
  const html = await response.text()
  const ogImage = getMetaContent(html, 'og:image')

  assert.ok(ogImage, 'Expected an og:image meta tag on the blog post')

  const imageUrl = new URL(ogImage, baseUrl)
  assert.equal(imageUrl.pathname, '/og')
  assert.equal(
    imageUrl.searchParams.get('title'),
    'Starting a Stock Management System: Our Beginner’s Journey in Progress',
  )
})
