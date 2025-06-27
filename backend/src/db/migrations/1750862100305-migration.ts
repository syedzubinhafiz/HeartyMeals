import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750862100305 implements MigrationInterface {
    name = 'Migration1750862100305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    }

}
