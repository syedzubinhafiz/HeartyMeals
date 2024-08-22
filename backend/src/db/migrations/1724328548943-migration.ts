import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724328548943 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE IF EXISTS user_allergies');
        await queryRunner.query(`DROP TABLE IF EXISTS food_categories`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "food_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, CONSTRAINT "PK_b7818b6140a91907d79e0aba514" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_allergies" ("user_id" uuid NOT NULL, "food_cat_id" uuid NOT NULL, CONSTRAINT "PK_4167de23d24104c1fff6908ead8" PRIMARY KEY ("user_id", "food_cat_id"))`);

    }

}
