/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@xsynaptic/og-image-generator'],
  // the /og route reads its fonts from disk at runtime; make sure they ship with the function
  outputFileTracingIncludes: {
    '/og': ['./app/og/fonts/**/*'],
  },
  // /pomodro is a prebuilt Vite app in public/pomodro; Next doesn't serve index.html for directories
  async rewrites() {
    return [{ source: '/pomodro', destination: '/pomodro/index.html' }]
  },
}

module.exports = nextConfig
