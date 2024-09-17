import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1726546970643 implements MigrationInterface {
    name = 'Migration1726546970643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "educational_content" ADD "summary" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "educational_content" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "educational_content" ADD "content" text array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "educational_content" ALTER COLUMN "storage_links" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "educational_content" ALTER COLUMN "storage_links" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "educational_content" ALTER COLUMN "storage_links" SET DEFAULT '{"thumbnail":"","content":{}}'`);
        await queryRunner.query(`ALTER TABLE "educational_content" ALTER COLUMN "storage_links" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "educational_content" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "educational_content" ADD "content" json NOT NULL`);
        await queryRunner.query(`ALTER TABLE "educational_content" DROP COLUMN "summary"`);
    }

}
