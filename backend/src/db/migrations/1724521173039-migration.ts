import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724521173039 implements MigrationInterface {
    name = 'Migration1724521173039'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "component" RENAME COLUMN "units" TO "unit"`);
        await queryRunner.query(`ALTER TYPE "public"."component_units_enum" RENAME TO "component_unit_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."component_unit_enum" RENAME TO "component_units_enum"`);
        await queryRunner.query(`ALTER TABLE "component" RENAME COLUMN "unit" TO "units"`);
    }

}
