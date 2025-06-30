import { MigrationInterface, QueryRunner } from "typeorm";

export class StoreImagesInDb1751283078308 implements MigrationInterface {
    name = 'StoreImagesInDb1751283078308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "storage" ADD "data" bytea`);
        await queryRunner.query(`ALTER TABLE "storage" ALTER COLUMN "file_path" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "storage" ALTER COLUMN "link" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "storage" ALTER COLUMN "link" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "storage" ALTER COLUMN "file_path" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "storage" DROP COLUMN "data"`);
    }

}
