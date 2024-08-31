import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1725120408965 implements MigrationInterface {
    name = 'Migration1725120408965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal_log_summary" ALTER COLUMN "food_consumed" SET DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal_log_summary" ALTER COLUMN "food_consumed" DROP DEFAULT`);
    }

}
