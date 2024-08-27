import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724746271467 implements MigrationInterface {
    name = 'Migration1724746271467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recipe_component_archive" ("component_id" uuid NOT NULL, "recipe_id" uuid NOT NULL, "amount" double precision NOT NULL, CONSTRAINT "PK_2654c1792beb1754199f33b32ef" PRIMARY KEY ("component_id", "recipe_id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "educational_content" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "educational_content" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "educational_content" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD "updated_at" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "educational_content" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "educational_content" ADD "updated_at" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "educational_content" ADD "deleted_at" TIMESTAMP`);
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
        await queryRunner.query(`ALTER TABLE "educational_content" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "educational_content" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "educational_content" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "educational_content" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "educational_content" ADD "updatedAt" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "educational_content" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "recipe_component_archive"`);
    }

}
