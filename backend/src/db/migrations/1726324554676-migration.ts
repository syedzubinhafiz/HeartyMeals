import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1726324554676 implements MigrationInterface {
    name = 'Migration1726324554676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "component" DROP COLUMN "storage_links"`);
        await queryRunner.query(`ALTER TABLE "component" ADD "storage_links" jsonb NOT NULL DEFAULT '{"thumbnail":"","content":{}}'`);
        await queryRunner.query(`UPDATE "component" SET "storage_links" = '{"thumbnail":"","content":{}}'::jsonb WHERE "storage_links"::jsonb = '{}'::jsonb`);
    
        await queryRunner.query(`ALTER TABLE "recipe" ALTER COLUMN "storage_links" SET DEFAULT '{"thumbnail":"","content":{}}'`);
        await queryRunner.query(`UPDATE "recipe" SET "storage_links" = '{"thumbnail":"","content":{}}'::jsonb WHERE "storage_links"::jsonb = '{}'::jsonb`);
    
        await queryRunner.query(`ALTER TYPE "public"."storage_type_enum" RENAME TO "storage_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."storage_type_enum" AS ENUM('image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/x-ms-wmv')`);
        await queryRunner.query(`ALTER TABLE "storage" ALTER COLUMN "type" TYPE "public"."storage_type_enum" USING "type"::text::"public"."storage_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."storage_type_enum_old"`);
    
        await queryRunner.query(`ALTER TABLE "educational_content" ALTER COLUMN "storage_links" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "educational_content" ALTER COLUMN "storage_links" SET DEFAULT '{"thumbnail":"","content":{}}'`);
        await queryRunner.query(`UPDATE "educational_content" SET "storage_links" = '{"thumbnail":"","content":{}}'::jsonb WHERE "storage_links"::jsonb = '{}'::jsonb`);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "educational_content" ALTER COLUMN "storage_links" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "educational_content" ALTER COLUMN "storage_links" DROP NOT NULL`);
        await queryRunner.query(`UPDATE "educational_content" SET "storage_links" = '{}'::jsonb WHERE "storage_links"::jsonb = '{"thumbnail":"","content":{}}'::jsonb`);
    
        await queryRunner.query(`CREATE TYPE "public"."storage_type_enum_old" AS ENUM('jpeg', 'jpg', 'png', 'svg', 'mp4', 'mov', 'avi', 'mkv', 'wmv')`);
        await queryRunner.query(`ALTER TABLE "storage" ALTER COLUMN "type" TYPE "public"."storage_type_enum_old" USING "type"::text::"public"."storage_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."storage_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."storage_type_enum_old" RENAME TO "storage_type_enum"`);
    
        await queryRunner.query(`ALTER TABLE "recipe" ALTER COLUMN "storage_links" SET DEFAULT '{}'`);
        await queryRunner.query(`UPDATE "recipe" SET "storage_links" = '{}'::jsonb WHERE "storage_links"::jsonb = '{"thumbnail":"","content":{}}'::jsonb`);
    
        await queryRunner.query(`ALTER TABLE "component" DROP COLUMN "storage_links"`);
        await queryRunner.query(`ALTER TABLE "component" ADD "storage_links" jsonb NOT NULL`);
        await queryRunner.query(`UPDATE "component" SET "storage_links" = '{}'::jsonb WHERE "storage_links"::jsonb = '{"thumbnail":"","content":{}}'::jsonb`);
      }

}
