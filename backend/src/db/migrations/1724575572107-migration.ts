import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724575572107 implements MigrationInterface {
    name = 'Migration1724575572107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal_logging" DROP COLUMN "time"`);
        await queryRunner.query(`ALTER TABLE "meal_logging" ADD "portion" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meal_logging" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meal_logging" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meal_logging" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "meal_logging" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "meal_logging" ADD "date" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal_logging" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "meal_logging" ADD "date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meal_logging" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "meal_logging" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "meal_logging" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "meal_logging" DROP COLUMN "portion"`);
        await queryRunner.query(`ALTER TABLE "meal_logging" ADD "time" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

}
