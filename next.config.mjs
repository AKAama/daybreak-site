import { withPayload } from '@payloadcms/next/withPayload'

const isS3Enabled = Boolean(process.env.S3_BUCKET)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // 本地模式下媒体由同源 /media 提供；启用 S3 后按 endpoint 放行域名
    remotePatterns: isS3Enabled
      ? [
          {
            protocol: 'https',
            hostname: new URL(process.env.S3_ENDPOINT || 'https://example.com').hostname,
          },
        ]
      : [],
  },
}

export default withPayload(nextConfig)
