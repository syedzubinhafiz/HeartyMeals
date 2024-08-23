import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724383217796 implements MigrationInterface {
    name = 'Migration1724383217796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal_logging" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meal_logging" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meal_logging" ADD "deleted_at" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal_logging" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "meal_logging" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "meal_logging" DROP COLUMN "created_at"`);
    }

}
