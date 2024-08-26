import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724678399866 implements MigrationInterface {
    name = 'Migration1724678399866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal_logging" ALTER COLUMN "date" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal_logging" ALTER COLUMN "date" SET NOT NULL`);
    }

}
