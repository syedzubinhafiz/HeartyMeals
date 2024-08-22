import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724355187439 implements MigrationInterface {
    name = 'Migration1724355187439'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "educational_content" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "educational_content" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "educational_content" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD "updated_at" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "educational_content" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "educational_content" ADD "updated_at" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "educational_content" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "educational_content" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "educational_content" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "educational_content" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "educational_content" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "educational_content" ADD "updatedAt" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "educational_content" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

}
