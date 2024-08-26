import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724512393700 implements MigrationInterface {
    name = 'Migration1724512393700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe" ADD "preparation_time" character varying NOT NULL DEFAULT '0 minutes'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "preparation_time"`);
    }

}
