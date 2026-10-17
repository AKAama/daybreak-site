/**
 * URL 只保留 ASCII：中文标题转拼音需要额外依赖，分享链接里带百分号编码也容易在
 * 微信/抖音里被截断，所以这里直接丢掉非 ASCII 字符，由调用方决定回退方案。
 */
export const slugify = (value: string | null | undefined) =>
  (value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** 2026-08-15T… → 2026-08-15，供日期型回退 slug 使用 */
export const dateSlug = (iso: string | null | undefined) => {
  const matched = /^\d{4}-\d{2}-\d{2}/.exec((iso || '').trim())
  return matched ? matched[0] : ''
}
