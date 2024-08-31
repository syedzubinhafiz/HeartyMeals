import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1725085756198 implements MigrationInterface {
    name = 'Migration1725085756198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fluid_logging" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "logging_date" date NOT NULL, "remaining_fluid" double precision NOT NULL, "logging_history" jsonb NOT NULL, "user_id" uuid, CONSTRAINT "PK_3f25dcadaaa95b97a6a9d9604e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "daily_budget" jsonb NOT NULL DEFAULT '{"calories":0,"carbs":0,"protein":0,"fat":0,"sodium":0,"cholesterol":0,"water_intake":0}'`);
        await queryRunner.query(`ALTER TABLE "fluid_logging" ADD CONSTRAINT "FK_22095eb1b575fa0143e591b489e" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fluid_logging" DROP CONSTRAINT "FK_22095eb1b575fa0143e591b489e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "daily_budget"`);
        await queryRunner.query(`DROP TABLE "fluid_logging"`);
    }

}
