import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMCCTable1698233024781 implements MigrationInterface {
  name = 'AddMCCTable1698233024781';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "merchant-category-codes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "code" integer NOT NULL, "createdBy" character varying NOT NULL DEFAULT 'SYSTEM', CONSTRAINT "UQ_cf0774e51393478655b4c74d04b" UNIQUE ("code"), CONSTRAINT "PK_ded6e41e78cc0aea4a3ec9662a6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "merchant-category-codes_categories_categories" ("merchantCategoryCodesId" uuid NOT NULL, "categoriesId" uuid NOT NULL, CONSTRAINT "PK_e5a141d7eae75f4d6a40695d124" PRIMARY KEY ("merchantCategoryCodesId", "categoriesId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_351cba7babc0dddc08024e5b1d" ON "merchant-category-codes_categories_categories" ("merchantCategoryCodesId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7d87edc54352b49e27437b91b8" ON "merchant-category-codes_categories_categories" ("categoriesId") `
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "mccRangeStart"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "mccRangeEnd"`);
    await queryRunner.query(
      `ALTER TABLE "merchant-category-codes_categories_categories" ADD CONSTRAINT "FK_351cba7babc0dddc08024e5b1d7" FOREIGN KEY ("merchantCategoryCodesId") REFERENCES "merchant-category-codes"("id") ON DELETE SET NULL ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "merchant-category-codes_categories_categories" ADD CONSTRAINT "FK_7d87edc54352b49e27437b91b84" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "merchant-category-codes_categories_categories" DROP CONSTRAINT "FK_7d87edc54352b49e27437b91b84"`
    );
    await queryRunner.query(
      `ALTER TABLE "merchant-category-codes_categories_categories" DROP CONSTRAINT "FK_351cba7babc0dddc08024e5b1d7"`
    );
    await queryRunner.query(`ALTER TABLE "categories" ADD "mccRangeEnd" smallint`);
    await queryRunner.query(`ALTER TABLE "categories" ADD "mccRangeStart" smallint`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7d87edc54352b49e27437b91b8"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_351cba7babc0dddc08024e5b1d"`);
    await queryRunner.query(`DROP TABLE "merchant-category-codes_categories_categories"`);
    await queryRunner.query(`DROP TABLE "merchant-category-codes"`);
  }
}
