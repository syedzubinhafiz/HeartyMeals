import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1726680441921 implements MigrationInterface {
    name = 'Migration1726680441921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "educational_content" ADD "summary" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "educational_content" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "educational_content" ADD "content" text array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "educational_content" DROP COLUMN "storage_links"`);
        await queryRunner.query(`ALTER TABLE "educational_content" ADD "storage_links" jsonb NOT NULL DEFAULT '{"thumbnail":"","content":{}}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "educational_content" DROP COLUMN "storage_links"`);
        await queryRunner.query(`ALTER TABLE "educational_content" ADD "storage_links" json`);
        await queryRunner.query(`ALTER TABLE "educational_content" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "educational_content" ADD "content" json NOT NULL`);
        await queryRunner.query(`ALTER TABLE "educational_content" DROP COLUMN "summary"`);
    }

}
