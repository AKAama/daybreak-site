/**
 * 重置管理员密码：`npm run reset-admin`。
 * 项目未配置 SMTP，后台「忘记密码」发不出邮件，因此走 Local API 直接改密。
 * 需要 RESET_ADMIN_EMAIL 与 RESET_ADMIN_PASSWORD（≥12 位，见 Users.beforeValidate）。
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const email = process.env.RESET_ADMIN_EMAIL
const password = process.env.RESET_ADMIN_PASSWORD
if (!email) throw new Error('请先设置 RESET_ADMIN_EMAIL 环境变量（要重置的管理员邮箱）')
if (!password) throw new Error('请先设置 RESET_ADMIN_PASSWORD 环境变量（至少 12 位）')

const payload = await getPayload({ config })

const { docs } = await payload.find({
  collection: 'users',
  where: { email: { equals: email } },
  limit: 1,
  overrideAccess: true,
  user: undefined,
})
const admin = docs[0]
if (!admin) throw new Error(`找不到邮箱为 ${email} 的管理员账号`)

await payload.update({
  collection: 'users',
  id: admin.id,
  data: { password },
  overrideAccess: true,
  user: undefined,
})

console.log('RESET_OK', { email: admin.email })
