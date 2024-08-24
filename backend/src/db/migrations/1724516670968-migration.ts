import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724516670968 implements MigrationInterface {
    name = 'Migration1724516670968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "component" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "component" ADD "amount" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "serving_size"`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD "serving_size" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recipe_component" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "recipe_component" ADD "amount" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe_component" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "recipe_component" ADD "amount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "serving_size"`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD "serving_size" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "component" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "component" ADD "amount" integer NOT NULL`);
    }

}
