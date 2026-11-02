import type { CollectionAfterChangeHook, CollectionBeforeValidateHook, CollectionSlug } from 'payload'
import { idSlug } from './slug'

type Candidate = (data: Record<string, unknown>) => string

const SKIP = 'skipSlugBackfill'

/**
 * 留空 slug 一定得到可用默认值：
 * 1. 先按 candidate（标题/英文名/日期）生成，并在重名时追加 -2、-3…；
 * 2. 取不出 ASCII 时用 `<prefix>-<id>`；新建时还没有 ID，交给 afterChange 回填。
 * 已有的非空 slug 不会被改动；只有显式清空才会重新生成。
 */
export function slugHooks(collection: CollectionSlug, prefix: string, candidate: Candidate) {
  const beforeValidate: CollectionBeforeValidateHook = async ({ data, originalDoc, req }) => {
    if (!data) return data
    const given = typeof data.slug === 'string' ? data.slug.trim() : data.slug
    if (given) return data
    if (!('slug' in data) && originalDoc?.slug) return data

    const merged = { ...(originalDoc || {}), ...data }
    const base = candidate(merged)
    const id = originalDoc?.id as number | undefined
    if (!base) {
      return { ...data, slug: id != null ? idSlug(prefix, id) : null }
    }
    for (let n = 1; n < 50; n++) {
      const slug = n === 1 ? base : `${base}-${n}`
      const found = await req.payload.find({
        collection,
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
        req,
      })
      const other = found.docs[0]
      if (!other || other.id === id) return { ...data, slug }
    }
    return { ...data, slug: id != null ? idSlug(prefix, id) : null }
  }

  const afterChange: CollectionAfterChangeHook = async ({ doc, req, context }) => {
    if (doc.slug || context?.[SKIP]) return doc
    const slug = idSlug(prefix, doc.id)
    await req.payload.update({
      collection,
      id: doc.id,
      data: { slug },
      depth: 0,
      overrideAccess: true,
      req,
      context: { [SKIP]: true },
    })
    return { ...doc, slug }
  }

  return { beforeValidate, afterChange }
}
