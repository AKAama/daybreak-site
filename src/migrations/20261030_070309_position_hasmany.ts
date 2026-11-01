import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "players_position" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_players_position",
  	"id" serial PRIMARY KEY NOT NULL
  );

  ALTER TABLE "players_position" ADD CONSTRAINT "players_position_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "players_position_order_idx" ON "players_position" USING btree ("order");
  CREATE INDEX "players_position_parent_idx" ON "players_position" USING btree ("parent_id");
  -- 先把单选列的存量值搬进多选表，再删旧列
  INSERT INTO "players_position" ("order", "parent_id", "value")
  SELECT 0, "id", "position" FROM "players" WHERE "position" IS NOT NULL;
  ALTER TABLE "players" DROP COLUMN "position";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "players" ADD COLUMN "position" "enum_players_position";
  -- 回退时保留 order 最小（即原单选）的那个位置
  UPDATE "players" SET "position" = sub."value"
  FROM (
    SELECT DISTINCT ON ("parent_id") "parent_id", "value"
    FROM "players_position" ORDER BY "parent_id", "order"
  ) AS sub
  WHERE "players"."id" = sub."parent_id";
  DROP TABLE "players_position" CASCADE;`)
}
