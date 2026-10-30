import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "players" ADD COLUMN "height" numeric;
  ALTER TABLE "players" ADD COLUMN "weight" numeric;
  ALTER TABLE "players" ADD COLUMN "motto" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "players" DROP COLUMN "height";
  ALTER TABLE "players" DROP COLUMN "weight";
  ALTER TABLE "players" DROP COLUMN "motto";`)
}
