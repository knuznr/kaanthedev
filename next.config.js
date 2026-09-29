/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@xsynaptic/og-image-generator'],
  // the /og route reads its fonts from disk at runtime; make sure they ship with the function
  outputFileTracingIncludes: {
    '/og': ['./app/og/fonts/**/*'],
  },
}

module.exports = nextConfig
