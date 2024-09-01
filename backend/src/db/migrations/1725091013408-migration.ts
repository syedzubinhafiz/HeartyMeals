import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1725091013408 implements MigrationInterface {
    name = 'Migration1725091013408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_allergy" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_allergy" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_allergy" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "user_allergy" DROP COLUMN "created_at"`);
    }

}
