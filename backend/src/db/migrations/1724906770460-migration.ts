import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724906770460 implements MigrationInterface {
    name = 'Migration1724906770460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "age" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "height" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "weight" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "user_nutrition_setting" jsonb NOT NULL DEFAULT '{"carbs_percentage":0.5,"protein_percentage":0.3,"fat_percentage":0.2,"cholesterol_level":"Normal","activity_level":1}'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "daily_budget" jsonb NOT NULL DEFAULT '{"calories":0,"carbs":0,"protein":0,"fat":0,"sodium":0,"cholesterol":0,"water_intake":0}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "daily_budget"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "user_nutrition_setting"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "weight"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "height"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "age"`);
    }

}
