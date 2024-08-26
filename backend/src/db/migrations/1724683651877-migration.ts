import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724683651877 implements MigrationInterface {
    name = 'Migration1724683651877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal_logging" RENAME COLUMN "date" TO "consumed_date_time"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal_logging" RENAME COLUMN "consumed_date_time" TO "date"`);
    }

}
