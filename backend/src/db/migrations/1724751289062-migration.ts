import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724751289062 implements MigrationInterface {
    name = 'Migration1724751289062'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "component" DROP COLUMN "units"`);
        await queryRunner.query(`DROP TYPE "public"."component_units_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."component_unit_enum" AS ENUM('g', 'kg', 'mg', 'μg', 'lb', 'oz', 'cup', 'tsp', 'tbsp', 'fl oz', 'pt', 'qt', 'gal', 'l', 'ml', 'cl', 'palm (Only for protein)', 'fist (Only for vegetables)', 'thumb tip (Only for fats)', 'thumb nail (Only for fats)', 'cupped hand (Only for carbs)')`);
        await queryRunner.query(`ALTER TABLE "component" ADD "unit" "public"."component_unit_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD "preparation_time" character varying NOT NULL DEFAULT '0 minutes'`);
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
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "preparation_time"`);
        await queryRunner.query(`ALTER TABLE "component" DROP COLUMN "unit"`);
        await queryRunner.query(`DROP TYPE "public"."component_unit_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."component_units_enum" AS ENUM('g', 'kg', 'mg', 'μg', 'lb', 'oz', 'cup', 'tsp', 'tbsp', 'fl oz', 'pt', 'qt', 'gal')`);
        await queryRunner.query(`ALTER TABLE "component" ADD "units" "public"."component_units_enum" NOT NULL`);
    }

}
