import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCompanyEnum1698404558688 implements MigrationInterface {
  name = 'AddCompanyEnum1698404558688';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "merchant-category-codes_categories_categories" DROP CONSTRAINT "FK_7d87edc54352b49e27437b91b84"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."company_enum" AS ENUM('google', 'youtube', 'netflix', 'spotify', 'playstation', 'konzum', 'plodine', 'dm', 'muller', 'spar', 'ikea', 'lidl')`
    );
    await queryRunner.query(`ALTER TABLE "records" ADD "company" "public"."company_enum"`);
    await queryRunner.query(
      `ALTER TABLE "merchant-category-codes_categories_categories" ADD CONSTRAINT "FK_7d87edc54352b49e27437b91b84" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "merchant-category-codes_categories_categories" DROP CONSTRAINT "FK_7d87edc54352b49e27437b91b84"`
    );
    await queryRunner.query(`ALTER TABLE "records" DROP COLUMN "company"`);
    await queryRunner.query(`DROP TYPE "public"."company_enum"`);
    await queryRunner.query(
      `ALTER TABLE "merchant-category-codes_categories_categories" ADD CONSTRAINT "FK_7d87edc54352b49e27437b91b84" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }
}
