import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724328081110 implements MigrationInterface {
    name = 'Migration1724328081110'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "component" DROP CONSTRAINT "FK_8f9c40490d5db7d085ecc4ff153"`);
        await queryRunner.query(`ALTER TABLE "component" RENAME COLUMN "cuisine_id" TO "food_cat_id"`);
        await queryRunner.query(`CREATE TABLE "food_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, CONSTRAINT "PK_12d79e4940385900bdee7453bd0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_allergy" ("user_id" uuid NOT NULL, "food_cat_id" uuid NOT NULL, CONSTRAINT "PK_8516c78a9bb14b5473de2a6694a" PRIMARY KEY ("user_id", "food_cat_id"))`);
        await queryRunner.query(`ALTER TABLE "component" ADD CONSTRAINT "FK_f5ed992edcda5d8da57a580554d" FOREIGN KEY ("food_cat_id") REFERENCES "food_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_allergy" ADD CONSTRAINT "FK_aa88990be3d94c5e44fa0b355d2" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_allergy" ADD CONSTRAINT "FK_edbd6ab749396eba62d50be27f5" FOREIGN KEY ("food_cat_id") REFERENCES "food_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_allergy" DROP CONSTRAINT "FK_edbd6ab749396eba62d50be27f5"`);
        await queryRunner.query(`ALTER TABLE "user_allergy" DROP CONSTRAINT "FK_aa88990be3d94c5e44fa0b355d2"`);
        await queryRunner.query(`ALTER TABLE "component" DROP CONSTRAINT "FK_f5ed992edcda5d8da57a580554d"`);
        await queryRunner.query(`DROP TABLE "user_allergy"`);
        await queryRunner.query(`DROP TABLE "food_category"`);
        await queryRunner.query(`ALTER TABLE "component" RENAME COLUMN "food_cat_id" TO "cuisine_id"`);
        await queryRunner.query(`ALTER TABLE "component" ADD CONSTRAINT "FK_8f9c40490d5db7d085ecc4ff153" FOREIGN KEY ("cuisine_id") REFERENCES "cuisine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
