import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1725090554476 implements MigrationInterface {
    name = 'Migration1725090554476'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "daily_budget" jsonb NOT NULL DEFAULT '{"calories":0,"carbs":0,"protein":0,"fat":0,"sodium":0,"cholesterol":0,"water_intake":0}'`);
        await queryRunner.query(`ALTER TABLE "meal_log_summary" ALTER COLUMN "food_consumed" SET DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal_log_summary" ALTER COLUMN "food_consumed" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "daily_budget"`);
    }

}
