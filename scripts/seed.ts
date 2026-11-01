/**
 * 本地演示数据：`npm run seed`。
 * 需要 SEED_ADMIN_PASSWORD（≥12 位），可选 SEED_HERO_VIDEO 指向一个 mp4/webm
 * 用来验证 Hero 视频与静态图回退。图片由 sharp 现场生成纯色占位图，
 * 只用于检查排版，不代表真实内容。
 */
import fs from 'fs'
import os from 'os'
import path from 'path'
import sharp from 'sharp'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const ADMIN_EMAIL = 'admin@example.com'
const palette = ['#f4511e', '#101010', '#777777', '#f1eee7', '#2b6cb0', '#d53f8c']

async function makeImage(file: string, width: number, height: number, color: string, label: string) {
  const buf = await sharp({
    create: { width, height, channels: 3, background: color },
  })
    .composite([
      {
        input: Buffer.from(
          `<svg width="${width}" height="${height}"><rect x="${width * 0.06}" y="${height * 0.06}" width="${width * 0.88}" height="${height * 0.88}" fill="none" stroke="rgba(255,255,255,.65)" stroke-width="${Math.round(width * 0.012)}"/><text x="50%" y="54%" font-family="monospace" font-size="${Math.round(width * 0.09)}" fill="rgba(255,255,255,.85)" text-anchor="middle">${label}</text></svg>`,
        ),
        top: 0,
        left: 0,
      },
    ])
    .jpeg({ quality: 82 })
    .toBuffer()
  const filePath = path.join(os.tmpdir(), 'daybreak-seed', file)
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, buf)
  return filePath
}

const payload = await getPayload({ config })
const password = process.env.SEED_ADMIN_PASSWORD
if (!password) throw new Error('请先设置 SEED_ADMIN_PASSWORD 环境变量（至少 12 位）')

const existingAdmin = await payload.find({
  collection: 'users',
  where: { email: { equals: ADMIN_EMAIL } },
  limit: 1,
  overrideAccess: true,
  user: undefined,
})
const admin =
  existingAdmin.docs[0] ??
  (await payload.create({
    collection: 'users',
    data: { email: ADMIN_EMAIL, password },
    overrideAccess: true,
    user: undefined,
  }))

const mediaCache = new Map<string, number>()
async function upload(alt: string, filePath: string) {
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    filePath,
    overrideAccess: true,
    user: undefined,
  })
  return doc.id
}

async function media(label: string, w: number, h: number, color: string, alt: string) {
  const key = `${label}-${w}x${h}`
  if (mediaCache.has(key)) return mediaCache.get(key)!
  const id = await upload(alt, await makeImage(`${key.replace(/[^a-z0-9]/gi, '_')}.jpg`, w, h, color, label))
  mediaCache.set(key, id)
  return id
}

const hero = await media('HERO', 1920, 1080, palette[1], '球场夜景')
const heroVideo = process.env.SEED_HERO_VIDEO ? await upload('训练短片', process.env.SEED_HERO_VIDEO) : null

const roster = [
  { name: '阿凯', en: 'Kai', num: 7, pos: 'PG' as const },
  { name: '大熊', en: 'Bear', num: 12, pos: 'C' as const },
  { name: '小宇', en: 'Yu', num: 3, pos: 'SG' as const },
  { name: '子豪', en: 'Hao', num: 23, pos: 'SF' as const },
  { name: '文亮', en: 'Liang', num: 11, pos: 'PF' as const },
  { name: '一鸣', en: 'Ming', num: 5, pos: 'PG' as const },
]

const playerIds: number[] = []
for (const [i, r] of roster.entries()) {
  const portrait = await media(`#${r.num}`, 900, 1200, palette[i % palette.length], `${r.name} 定妆照`)
  const p = await payload.create({
    collection: 'players',
    data: {
      name: r.name,
      englishName: r.en,
      number: r.num,
      position: [r.pos],
      portrait,
      bio: `南京街头篮球爱好者，${r.pos}，主战场：下马坊与玄武湖野球场。`,
      // 最后一名留草稿，用来验证前台与 REST 的发布过滤
      status: i === roster.length - 1 ? 'draft' : 'published',
      featured: i < 4,
      sortOrder: i + 1,
    },
    overrideAccess: true,
    user: undefined,
  })
  playerIds.push(p.id)
}

const albums = [
  { title: '下马坊夏日联赛', date: '2026-08-15', count: 6, cover: [1200, 900] },
  { title: '玄武湖夜场', date: '2026-09-02', count: 4, cover: [900, 1200] },
  { title: '老门东三人斗牛', date: '2026-06-21', count: 3, cover: [900, 1200] },
  { title: '3v3 新街口快闪赛', date: '2026-10-01', count: 5, cover: [900, 1200] },
]

for (const [i, a] of albums.entries()) {
  const [cw, ch] = a.cover
  const cover = await media(a.title.slice(0, 2), cw, ch, palette[i % palette.length], `${a.title} 封面`)
  const photos = await Promise.all(
    Array.from({ length: a.count }, (_, n) =>
      media(
        `${a.title.slice(0, 2)}${n + 1}`,
        1400,
        1000,
        palette[(i + n) % palette.length],
        `${a.title} 照片 ${n + 1}`,
      ),
    ),
  )
  await payload.create({
    collection: 'albums',
    data: {
      title: a.title,
      eventDate: a.date,
      description: `${a.title} · 南京`,
      cover,
      players: [playerIds[i % playerIds.length], playerIds[(i + 1) % playerIds.length]],
      photos: photos.map((image, n) => ({ image, caption: n % 2 === 0 ? `第 ${n + 1} 张` : null })),
      status: 'published',
      featured: i < 3,
    },
    overrideAccess: true,
    user: undefined,
  })
}

await payload.create({
  collection: 'albums',
  data: { title: '未发布的草稿相册', eventDate: '2026-10-10', status: 'draft' },
  overrideAccess: true,
  user: undefined,
})

const logo = fs.existsSync('public/logo.jpg')
  ? await upload('南京破晓 DAYBREAK 队徽', path.resolve('public/logo.jpg'))
  : null

await payload.updateGlobal({
  slug: 'homepage',
  data: {
    slogan: '天还没亮，我们先上场。',
    heroImage: hero,
    heroVideo,
    aboutText: '南京破晓是一支由程序员、设计与学生组成的街球队，2026 年夏天成立，周末在玄武门集合。',
  },
  overrideAccess: true,
  user: undefined,
})

await payload.updateGlobal({
  slug: 'site-settings',
  data: {
    siteTitle: '南京破晓 DAYBREAK',
    logo,
    contactEmail: 'hello@daybreak.local',
    socialLinks: [
      { platform: 'douyin', label: '@南京破晓', url: 'https://example.com/douyin' },
      { platform: 'instagram', label: '@daybreak.nj', url: 'https://example.com/ig' },
    ],
    seoDefaultImage: hero,
  },
  overrideAccess: true,
  user: undefined,
})

console.log('SEED_OK', {
  admin: admin.email,
  players: playerIds.length,
  albums: albums.length + 1,
  heroVideo: Boolean(heroVideo),
  logo: Boolean(logo),
})
