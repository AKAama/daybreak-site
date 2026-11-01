import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { onlyAdmin, readPublished } from '../lib/access'
import { slugify } from '../lib/slug'

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
        const slug = slugify(data?.englishName || data?.name)
        if (!slug) throw new APIError('请填写英文名（字母或数字），用于生成访问链接', 400)
        return { ...data, slug }
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
      admin: { description: '留空时按英文名生成，仅支持字母和数字' },
    },
    { name: 'number', type: 'number', required: true, min: 0, max: 99 },
    {
      name: 'position',
      type: 'select',
      hasMany: true,
      options: ['PG', 'SG', 'SF', 'PF', 'C'].map((value) => ({ label: value, value })),
    },
    {
      name: 'height',
      type: 'number',
      min: 100,
      max: 250,
      admin: { description: '身高，单位 cm，如 188' },
    },
    {
      name: 'weight',
      type: 'number',
      min: 30,
      max: 200,
      admin: { description: '体重，单位 kg，如 82' },
    },
    { name: 'motto', type: 'text', admin: { description: '座右铭，一句话' } },
    { name: 'portrait', type: 'upload', relationTo: 'media' },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'textarea', admin: { description: '球员介绍，展示在详情页' } },
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
