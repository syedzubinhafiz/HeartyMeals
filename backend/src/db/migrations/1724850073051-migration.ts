import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724850073051 implements MigrationInterface {
    name = 'Migration1724850073051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe" ADD "related_food_categories" jsonb NOT NULL DEFAULT '[]'`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "related_food_categories"`);
    }

}
