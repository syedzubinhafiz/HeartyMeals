import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724335813689 implements MigrationInterface {
    name = 'Migration1724335813689'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "country" ("id" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dietary" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_1d14ac040dfef0305ba2dc25054" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ethnicity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_9370ffe2b4fa092af528d6cba55" UNIQUE ("name"), CONSTRAINT "PK_bbeaf6fff4fda1b0daabe64ed2d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_gender_enum" AS ENUM('Male', 'Female')`);
        await queryRunner.query(`CREATE TABLE "user" ("user_id" uuid NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "gender" "public"."user_gender_enum" NOT NULL, "nyha_level" integer, "medical_info" jsonb NOT NULL, "user_role" "public"."user_user_role_enum" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "country_id" character varying, "dietary_id" uuid, "ethnicity_id" uuid, CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "cuisine" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "country_id" character varying NOT NULL, CONSTRAINT "PK_d4c1e9427b94335350fecaf238e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipe" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "instruction" text array NOT NULL, "serving_size" integer NOT NULL, "nutrition_info" json NOT NULL, "recommended_meal_time" json NOT NULL, "is_approved" boolean NOT NULL DEFAULT false, "visibility" "public"."recipe_visibility_enum" NOT NULL DEFAULT 'Private', "storage_links" json NOT NULL DEFAULT '{}', "user_id" uuid, "cuisine_id" uuid, "dietary_id" uuid, CONSTRAINT "PK_e365a2fedf57238d970e07825ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."meal_logging_type_enum" AS ENUM('Breakfast', 'Lunch', 'Dinner', 'Other')`);
        await queryRunner.query(`CREATE TABLE "meal_logging" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "time" TIMESTAMP WITH TIME ZONE NOT NULL, "type" "public"."meal_logging_type_enum" NOT NULL, "is_consumed" boolean NOT NULL DEFAULT false, "user_id" uuid, "recipe_id" uuid, CONSTRAINT "PK_18b0ff0390788f99e22067373c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "storage" ("storage_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "file_path" character varying NOT NULL, "type" "public"."storage_type_enum" NOT NULL, "size" integer NOT NULL, CONSTRAINT "PK_d993734d0a9f00104de4e4aaeaa" PRIMARY KEY ("storage_id"))`);
        await queryRunner.query(`CREATE TABLE "food_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, CONSTRAINT "PK_12d79e4940385900bdee7453bd0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "meal_log_summary" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "remaining_nutrients" json NOT NULL, "food_consumed" json NOT NULL, "user_id" uuid, CONSTRAINT "PK_f8efd380171c257cbde270088a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "component" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "component_type" "public"."component_component_type_enum" NOT NULL, "nutrition_info" jsonb NOT NULL, "units" "public"."component_units_enum" NOT NULL, "amount" integer NOT NULL, "storage_links" jsonb NOT NULL, "food_cat_id" uuid, CONSTRAINT "PK_c084eba2d3b157314de79135f09" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipe_component" ("component_id" uuid NOT NULL, "recipe_id" uuid NOT NULL, "amount" integer NOT NULL, CONSTRAINT "PK_7763c6c7140e6980e69df54c7b6" PRIMARY KEY ("component_id", "recipe_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."educational_content_visibility_enum" AS ENUM('Private', 'Unlisted', 'Public')`);
        await queryRunner.query(`CREATE TABLE "educational_content" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "content" json NOT NULL, "storage_links" json, "visibility" "public"."educational_content_visibility_enum" NOT NULL DEFAULT 'Public', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_428b812a274f59b636fb9caed75" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_allergy" ("user_id" uuid NOT NULL, "food_cat_id" uuid NOT NULL, CONSTRAINT "PK_8516c78a9bb14b5473de2a6694a" PRIMARY KEY ("user_id", "food_cat_id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_b89cdc0829042ce01f20140eced" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_eb1541e406043a279016f2b3420" FOREIGN KEY ("dietary_id") REFERENCES "dietary"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_efe7baa533a2b4779e8bc8b7add" FOREIGN KEY ("ethnicity_id") REFERENCES "ethnicity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cuisine" ADD CONSTRAINT "FK_1af6fedd4e9401c7dbe0fb9351f" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD CONSTRAINT "FK_385770dfbf5b275c495dd298546" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD CONSTRAINT "FK_b1f59c918b32bb1a5979effa785" FOREIGN KEY ("cuisine_id") REFERENCES "cuisine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe" ADD CONSTRAINT "FK_41b030865d3944de69ee4353eca" FOREIGN KEY ("dietary_id") REFERENCES "dietary"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meal_logging" ADD CONSTRAINT "FK_6152780b0b836a7dece5b600d43" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meal_logging" ADD CONSTRAINT "FK_89c02c8e9ac8949d063d440fdd7" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meal_log_summary" ADD CONSTRAINT "FK_3a5bfb397dd6b9da27b23b79ee6" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "component" ADD CONSTRAINT "FK_f5ed992edcda5d8da57a580554d" FOREIGN KEY ("food_cat_id") REFERENCES "food_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_component" ADD CONSTRAINT "FK_fa26474a2ecf315c0ab0980d96f" FOREIGN KEY ("component_id") REFERENCES "component"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_component" ADD CONSTRAINT "FK_0823a43b77d87379efea9e00ca7" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_allergy" ADD CONSTRAINT "FK_aa88990be3d94c5e44fa0b355d2" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_allergy" ADD CONSTRAINT "FK_edbd6ab749396eba62d50be27f5" FOREIGN KEY ("food_cat_id") REFERENCES "food_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_allergy" DROP CONSTRAINT "FK_edbd6ab749396eba62d50be27f5"`);
        await queryRunner.query(`ALTER TABLE "user_allergy" DROP CONSTRAINT "FK_aa88990be3d94c5e44fa0b355d2"`);
        await queryRunner.query(`ALTER TABLE "recipe_component" DROP CONSTRAINT "FK_0823a43b77d87379efea9e00ca7"`);
        await queryRunner.query(`ALTER TABLE "recipe_component" DROP CONSTRAINT "FK_fa26474a2ecf315c0ab0980d96f"`);
        await queryRunner.query(`ALTER TABLE "component" DROP CONSTRAINT "FK_f5ed992edcda5d8da57a580554d"`);
        await queryRunner.query(`ALTER TABLE "meal_log_summary" DROP CONSTRAINT "FK_3a5bfb397dd6b9da27b23b79ee6"`);
        await queryRunner.query(`ALTER TABLE "meal_logging" DROP CONSTRAINT "FK_89c02c8e9ac8949d063d440fdd7"`);
        await queryRunner.query(`ALTER TABLE "meal_logging" DROP CONSTRAINT "FK_6152780b0b836a7dece5b600d43"`);
        await queryRunner.query(`ALTER TABLE "recipe" DROP CONSTRAINT "FK_41b030865d3944de69ee4353eca"`);
        await queryRunner.query(`ALTER TABLE "recipe" DROP CONSTRAINT "FK_b1f59c918b32bb1a5979effa785"`);
        await queryRunner.query(`ALTER TABLE "recipe" DROP CONSTRAINT "FK_385770dfbf5b275c495dd298546"`);
        await queryRunner.query(`ALTER TABLE "cuisine" DROP CONSTRAINT "FK_1af6fedd4e9401c7dbe0fb9351f"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_efe7baa533a2b4779e8bc8b7add"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_eb1541e406043a279016f2b3420"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_b89cdc0829042ce01f20140eced"`);
        await queryRunner.query(`DROP TABLE "user_allergy"`);
        await queryRunner.query(`DROP TABLE "educational_content"`);
        await queryRunner.query(`DROP TYPE "public"."educational_content_visibility_enum"`);
        await queryRunner.query(`DROP TABLE "recipe_component"`);
        await queryRunner.query(`DROP TABLE "component"`);
        await queryRunner.query(`DROP TABLE "meal_log_summary"`);
        await queryRunner.query(`DROP TABLE "food_category"`);
        await queryRunner.query(`DROP TABLE "storage"`);
        await queryRunner.query(`DROP TABLE "meal_logging"`);
        await queryRunner.query(`DROP TYPE "public"."meal_logging_type_enum"`);
        await queryRunner.query(`DROP TABLE "recipe"`);
        await queryRunner.query(`DROP TABLE "cuisine"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
        await queryRunner.query(`DROP TABLE "ethnicity"`);
        await queryRunner.query(`DROP TABLE "dietary"`);
        await queryRunner.query(`DROP TABLE "country"`);
    }

}
