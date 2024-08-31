import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1725114076215 implements MigrationInterface {
    name = 'Migration1725114076215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal_logging" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "meal_logging" DROP COLUMN "time"`);
        await queryRunner.query(`ALTER TABLE "meal_logging" ADD "consumed_date_time" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "meal_logging" ADD "portion" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meal_logging" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "meal_logging" ADD "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "meal_logging" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal_logging" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "meal_logging" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "meal_logging" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "meal_logging" DROP COLUMN "portion"`);
        await queryRunner.query(`ALTER TABLE "meal_logging" DROP COLUMN "consumed_date_time"`);
        await queryRunner.query(`ALTER TABLE "meal_logging" ADD "time" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meal_logging" ADD "date" date NOT NULL`);
    }

}
