import type { GlobalConfig } from 'payload'
import { onlyAdmin, publicRead } from '../lib/access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: '站点设置',
  access: { read: publicRead, update: onlyAdmin },
  fields: [
    {
      name: 'siteTitle',
      type: 'text',
      defaultValue: '南京破晓 DAYBREAK',
      admin: { description: '用于页面标题、SEO 与分享卡片' },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { in: ['image/png', 'image/webp', 'image/avif', 'image/jpeg'] } },
      admin: { description: '建议使用透明背景 PNG 或 SVG' },
    },
    { name: 'contactEmail', type: 'text' },
    {
      name: 'socialLinks',
      type: 'array',
      label: '社交媒体',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: ['instagram', 'douyin', 'weibo', 'bilibili', 'xiaohongshu', 'wechat'].map((value) => ({
            label: value,
            value,
          })),
        },
        { name: 'label', type: 'text', admin: { description: '展示文案，如 @daybreak' } },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'seoDefaultImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: '页面没有专属配图时，分享卡片使用该图' },
    },
  ],
}
