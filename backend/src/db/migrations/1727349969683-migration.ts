import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1727349969683 implements MigrationInterface {
    name = 'Migration1727349969683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recipe_of_the_day" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP WITH TIME ZONE NOT NULL, "recipe_id" uuid, "user_id" uuid, CONSTRAINT "REL_d9872764046daf2be3f3e9e116" UNIQUE ("user_id"), CONSTRAINT "PK_00bd9d858d42885eed2108566d4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "recipe_of_the_day" ADD CONSTRAINT "FK_4f9ed51599c1a5718bb466d982f" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_of_the_day" ADD CONSTRAINT "FK_d9872764046daf2be3f3e9e116c" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe_of_the_day" DROP CONSTRAINT "FK_d9872764046daf2be3f3e9e116c"`);
        await queryRunner.query(`ALTER TABLE "recipe_of_the_day" DROP CONSTRAINT "FK_4f9ed51599c1a5718bb466d982f"`);
        await queryRunner.query(`DROP TABLE "recipe_of_the_day"`);
    }

}
