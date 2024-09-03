import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1725380962513 implements MigrationInterface {
    name = 'Migration1725380962513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."storage_type_enum" RENAME TO "storage_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."storage_type_enum" AS ENUM('image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/x-ms-wmv')`);
        await queryRunner.query(`ALTER TABLE "storage" ALTER COLUMN "type" TYPE "public"."storage_type_enum" USING "type"::"text"::"public"."storage_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."storage_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."storage_type_enum_old" AS ENUM('jpeg', 'jpg', 'png', 'svg', 'mp4', 'mov', 'avi', 'mkv', 'wmv')`);
        await queryRunner.query(`ALTER TABLE "storage" ALTER COLUMN "type" TYPE "public"."storage_type_enum_old" USING "type"::"text"::"public"."storage_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."storage_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."storage_type_enum_old" RENAME TO "storage_type_enum"`);
    }

}
