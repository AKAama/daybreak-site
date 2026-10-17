import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { fileURLToPath } from 'url'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Players } from './collections/Players'
import { Albums } from './collections/Albums'
import { Homepage } from './globals/Homepage'
import { SiteSettings } from './globals/SiteSettings'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// PAYLOAD_SECRET 用于签发后台会话，绝不能有可预测的兜底值。
// 镜像构建阶段无法拿到运行时密钥，因此只在 Dockerfile 内联设置了
// PAYLOAD_ALLOW_PLACEHOLDER_SECRET 的那一条命令里允许占位符。
const secret =
  process.env.PAYLOAD_SECRET ||
  (process.env.PAYLOAD_ALLOW_PLACEHOLDER_SECRET === 'true' ? 'build-time-placeholder' : '')
if (!secret) {
  throw new Error(
    '缺少 PAYLOAD_SECRET：复制 .env.example 为 .env 并填入 `openssl rand -base64 48` 生成的随机串。',
  )
}

export default buildConfig({
  secret,
  serverURL: process.env.NEXT_PUBLIC_SITE_URL,
  admin: {
    user: Users.slug,
  },
  editor: lexicalEditor(),
  collections: [Users, Media, Players, Albums],
  globals: [Homepage, SiteSettings],
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || 'postgresql://daybreak:daybreak@localhost:5432/daybreak' },
  }),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  plugins: process.env.S3_BUCKET
    ? [
        s3Storage({
          collections: { media: true },
          bucket: process.env.S3_BUCKET,
          config: {
            region: process.env.S3_REGION || 'auto',
            endpoint: process.env.S3_ENDPOINT,
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
            },
            forcePathStyle: true,
          },
        }),
      ]
    : [],
})
