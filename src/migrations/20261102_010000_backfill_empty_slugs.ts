import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// 回填空 slug 为 <prefix>-<id>；只动 NULL/空串，若目标值已被占用则跳过，可重复执行
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  UPDATE "albums" a SET "slug" = 'album-' || a."id"
  WHERE (a."slug" IS NULL OR btrim(a."slug") = '')
    AND NOT EXISTS (SELECT 1 FROM "albums" b WHERE b."slug" = 'album-' || a."id");
  UPDATE "players" a SET "slug" = 'player-' || a."id"
  WHERE (a."slug" IS NULL OR btrim(a."slug") = '')
    AND NOT EXISTS (SELECT 1 FROM "players" b WHERE b."slug" = 'player-' || a."id");`)
}

// 数据回填不可精确回滚（无法区分原本就叫 album-<id> 的记录），down 为空操作
export async function down(_args: MigrateDownArgs): Promise<void> {}
