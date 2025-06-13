import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false

    return config
  },
  experimental: {
    viewTransition: true,
  },
}

export default nextConfig
