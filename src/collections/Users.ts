import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { onlyAdmin } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'createdAt'],
  },
  access: {
    read: onlyAdmin,
    update: onlyAdmin,
    delete: onlyAdmin,
    // create 不显式放开：首个管理员由后台的 create-first-user 流程写入，
    // 之后任何人都无法通过 API 自建账号（V1 禁止开放注册）
  },
  hooks: {
    // Payload 3.91 没有密码长度配置项，只能在写入前自行校验（PRD 第 8 节：管理员强密码）
    beforeValidate: [
      ({ data }) => {
        if (typeof data?.password === 'string' && data.password.length < 12)
          throw new APIError('管理员密码至少 12 位', 400)
        return data
      },
    ],
  },
  fields: [],
}
