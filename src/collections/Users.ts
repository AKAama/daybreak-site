import type { CollectionConfig } from 'payload'
import { onlyAdmin } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // V1 只有管理员账号，密码强度按 PRD 第 8 节安全要求收紧
    minPasswordLength: 12,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'createdAt'],
  },
  access: {
    read: onlyAdmin,
    update: onlyAdmin,
    delete: onlyAdmin,
    // create 不显式放开：后台首个管理员由 Payload 的 create-first-user 流程写入，
    // 之后任何人都无法通过 API 自建账号（V1 禁止开放注册）
  },
  fields: [],
}
