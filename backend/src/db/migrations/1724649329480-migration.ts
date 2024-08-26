import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724649329480 implements MigrationInterface {
    name = 'Migration1724649329480'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recipe_component_archive" ("component_id" uuid NOT NULL, "recipe_id" uuid NOT NULL, "amount" double precision NOT NULL, CONSTRAINT "PK_2654c1792beb1754199f33b32ef" PRIMARY KEY ("component_id", "recipe_id"))`);
        await queryRunner.query(`ALTER TABLE "recipe_component" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "recipe_component" ADD "amount" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recipe_component_archive" ADD CONSTRAINT "FK_e81bee144f06ec3179669dda9d1" FOREIGN KEY ("component_id") REFERENCES "component"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_component_archive" ADD CONSTRAINT "FK_55d1eae3266a3aead2a89928d6c" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe_component_archive" DROP CONSTRAINT "FK_55d1eae3266a3aead2a89928d6c"`);
        await queryRunner.query(`ALTER TABLE "recipe_component_archive" DROP CONSTRAINT "FK_e81bee144f06ec3179669dda9d1"`);
        await queryRunner.query(`ALTER TABLE "recipe_component" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "recipe_component" ADD "amount" integer NOT NULL`);
        await queryRunner.query(`DROP TABLE "recipe_component_archive"`);
    }

}
