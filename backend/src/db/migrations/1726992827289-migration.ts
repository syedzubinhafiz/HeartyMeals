import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1726992827289 implements MigrationInterface {
    name = 'Migration1726992827289'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal_log_summary" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "meal_log_summary" ADD "date" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "fluid_logging" DROP COLUMN "logging_date"`);
        await queryRunner.query(`ALTER TABLE "fluid_logging" ADD "logging_date" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fluid_logging" DROP COLUMN "logging_date"`);
        await queryRunner.query(`ALTER TABLE "fluid_logging" ADD "logging_date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meal_log_summary" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "meal_log_summary" ADD "date" date NOT NULL`);
    }

}
