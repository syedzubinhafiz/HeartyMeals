import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724822174898 implements MigrationInterface {
    name = 'Migration1724822174898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal_logging" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "meal_logging" ALTER COLUMN "updated_at" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal_logging" ALTER COLUMN "updated_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meal_logging" ALTER COLUMN "created_at" DROP DEFAULT`);
    }

}
