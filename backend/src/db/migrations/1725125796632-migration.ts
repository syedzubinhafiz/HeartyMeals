import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1725125796632 implements MigrationInterface {
    name = 'Migration1725125796632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal_log_summary" ALTER COLUMN "food_consumed" SET DEFAULT '{"Breakfast":[],"Lunch":[],"Dinner":[],"Other":[]}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal_log_summary" ALTER COLUMN "food_consumed" DROP DEFAULT`);
    }

}
