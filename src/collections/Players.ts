import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { onlyAdmin, readPublished } from '../lib/access'

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')

export const Players: CollectionConfig = {
  slug: 'players',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'number', 'position', 'status', 'featured'],
    listSearchableFields: ['name', 'englishName', 'number'],
  },
  access: {
    read: readPublished,
    create: onlyAdmin,
    update: onlyAdmin,
    delete: onlyAdmin,
  },
  hooks: {
    // slug 决定前台 URL，管理员只需填中英文名，留空时自动生成
    beforeValidate: [
      ({ data, originalDoc }) => {
        if (data?.slug || originalDoc?.slug) return data
        const source = data?.englishName || data?.name
        if (!source) throw new APIError('请填写姓名或英文名，用于生成访问链接')
        return { ...data, slug: slugify(source) }
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'englishName', type: 'text' },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { description: '留空时按英文名或姓名自动生成' },
    },
    { name: 'number', type: 'number', required: true, min: 0, max: 99 },
    {
      name: 'position',
      type: 'select',
      options: ['PG', 'SG', 'SF', 'PF', 'C'].map(value => ({ label: value, value })),
    },
    { name: 'portrait', type: 'upload', relationTo: 'media' },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'textarea' },
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
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
