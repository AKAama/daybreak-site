import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { onlyAdmin, readPublished } from '../lib/access'

const pick = (data: Record<string, unknown>, originalDoc: Record<string, unknown>, key: string) =>
  key in data ? data[key] : originalDoc?.[key]

export const Albums: CollectionConfig = {
  slug: 'albums',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'eventDate', 'status', 'featured'],
    listSearchableFields: ['title', 'description'],
  },
  access: {
    read: readPublished,
    create: onlyAdmin,
    update: onlyAdmin,
    delete: onlyAdmin,
  },
  hooks: {
    // PRD 5.1 选定「空相册不允许发布」，前台因此不需要空相册分支
    beforeChange: [
      ({ data, originalDoc }) => {
        const status = pick(data, originalDoc, 'status')
        if (status !== 'published') return data
        const cover = pick(data, originalDoc, 'cover')
        const photos = pick(data, originalDoc, 'photos')
        if (!cover) throw new APIError('发布前请先设置封面', 400)
        if (!Array.isArray(photos) || photos.length === 0)
          throw new APIError('发布前请至少添加一张照片', 400)
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, index: true },
    { name: 'eventDate', type: 'date' },
    { name: 'description', type: 'textarea' },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'players', type: 'relationship', relationTo: 'players', hasMany: true },
    {
      name: 'photos',
      type: 'array',
      admin: { description: '按顺序排列，第一张为灯箱起始位置参考' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      options: [
        { label: '草稿（前台不可见）', value: 'draft' },
        { label: '已发布', value: 'published' },
      ],
    },
    { name: 'featured', type: 'checkbox', defaultValue: false },
  ],
}
