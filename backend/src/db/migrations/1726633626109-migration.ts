import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1726633626109 implements MigrationInterface {
    name = 'Migration1726633626109'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "storage" ADD "link" character varying NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."storage_type_enum" RENAME TO "storage_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."storage_type_enum" AS ENUM('image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/x-ms-wmv')`);
        await queryRunner.query(`ALTER TABLE "storage" ALTER COLUMN "type" TYPE "public"."storage_type_enum" USING "type"::"text"::"public"."storage_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."storage_type_enum_old"`);

        // insert default image record
        await queryRunner.query(`INSERT INTO "storage" (storage_id, file_path, type, size, link) VALUES ('f4b20835-cb31-4893-9463-b9c89a5eaa3a', 'default/default.png', 'image/png', '1791', 'https://storage.googleapis.com/hf-nutrition.appspot.com/default/default.png?GoogleAccessId=firebase-adminsdk-n9w73%40hf-nutrition.iam.gserviceaccount.com&Expires=16725196800&Signature=gLVvlCR3K5FDzdgjipOhCsBGUsW16ft35JgnwhGo%2Fov4ev5j4bwGeLSmdMHcpWrqe2c6E%2BQ8wf0OjSp6nRGtVm0Ub4Nyb997rgyV4DGHh0MuhOy6ZKcX7H34SzGZCXyQBgjgKqu07CwAimpKvEAG%2FM8YcCdT3wfQ7kscW5sBKM2oN1Mb7g2uF3dQaLeoreCusI%2F11mOKtbTxRuYacoigPl0hhpap7KiWVDFCNif33QLGiPWb0q%2FU1aeAgWs0KtmvmNpX%2F8daHu6CLhIecUJ%2B40%2B6qCQVvYrp71LaekwW0MxTQn06JVHcvvMKtrgwn8UqbvEGcsKRNu4wgGFAdJWqFQ%3D%3D')`);


        await queryRunner.query(`ALTER TABLE "component" DROP COLUMN "storage_links"`);
        await queryRunner.query(`ALTER TABLE "component" ADD "storage_links" jsonb NOT NULL DEFAULT '{"thumbnail":"","content":{}}'`);
        await queryRunner.query(`UPDATE "component" SET "storage_links" = '{"thumbnail":"","content":{}}'::jsonb WHERE "storage_links"::jsonb = '{}'::jsonb`);

        await queryRunner.query(`ALTER TABLE "recipe" ALTER COLUMN "storage_links" SET DEFAULT '{"thumbnail":"","content":{}}'`);
        await queryRunner.query(`UPDATE "recipe" SET "storage_links" = '{"thumbnail":"","content":{}}'::jsonb WHERE "storage_links"::jsonb = '{}'::jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe" ALTER COLUMN "storage_links" SET DEFAULT '{}'`);
        await queryRunner.query(`UPDATE "recipe" SET "storage_links" = '{}'::jsonb WHERE "storage_links"::jsonb = '{"thumbnail":"","content":{}}'::jsonb`);

        await queryRunner.query(`ALTER TABLE "component" DROP COLUMN "storage_links"`);
        await queryRunner.query(`ALTER TABLE "component" ADD "storage_links" jsonb NOT NULL`);
        await queryRunner.query(`UPDATE "component" SET "storage_links" = '{}'::jsonb WHERE "storage_links"::jsonb = '{"thumbnail":"","content":{}}'::jsonb`);

        await queryRunner.query(`DELETE FROM "storage" WHERE storage_id = 'f4b20835-cb31-4893-9463-b9c89a5eaa3a'`);

        await queryRunner.query(`CREATE TYPE "public"."storage_type_enum_old" AS ENUM('jpeg', 'jpg', 'png', 'svg', 'mp4', 'mov', 'avi', 'mkv', 'wmv')`);
        await queryRunner.query(`ALTER TABLE "storage" ALTER COLUMN "type" TYPE "public"."storage_type_enum_old" USING "type"::"text"::"public"."storage_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."storage_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."storage_type_enum_old" RENAME TO "storage_type_enum"`);
        await queryRunner.query(`ALTER TABLE "storage" DROP COLUMN "link"`);
    }

}
