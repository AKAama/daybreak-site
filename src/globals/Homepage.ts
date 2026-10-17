import type { GlobalConfig } from 'payload'
import { onlyAdmin, publicRead } from '../lib/access'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: '首页配置',
  access: { read: publicRead, update: onlyAdmin },
  fields: [
    { name: 'slogan', type: 'text', defaultValue: '不止于篮球' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    {
      name: 'heroVideo',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { in: ['video/mp4', 'video/webm'] } },
      admin: { description: '可选。加载失败或用户开启减少动态效果时回退到 Hero 图片' },
    },
    { name: 'featuredPlayers', type: 'relationship', relationTo: 'players', hasMany: true },
    { name: 'featuredAlbums', type: 'relationship', relationTo: 'albums', hasMany: true },
    {
      name: 'aboutText',
      type: 'textarea',
      defaultValue: '从南京的街头出发，用篮球记录属于我们的故事。',
    },
  ],
}
