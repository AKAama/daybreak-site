import type { Access } from 'payload'

/**
 * V1 只有一个管理员且不开放注册，因此「已登录」等价于「管理员」。
 * 若将来引入球员自行维护资料，需要在此处换成角色判断。
 */
export const onlyAdmin: Access = ({ req }) => Boolean(req.user)

/**
 * 匿名访客只能读到已发布内容，管理员可读到草稿用于预览。
 * 这是 REST/GraphQL 层的兜底；前台页面另外显式带 where 过滤，
 * 避免本地 API 绕过访问控制时把草稿带出去。
 */
export const readPublished: Access = ({ req }) =>
  req.user ? true : { status: { equals: 'published' } }

/** 媒体文件本身需要被匿名访客的 <img> 直接访问，故公开可读。 */
export const publicRead: Access = () => true
