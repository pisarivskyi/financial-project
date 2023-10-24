import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCurrencyOfTerrorists1697813763359 implements MigrationInterface {
  name = 'AddCurrencyOfTerrorists1697813763359';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."currency_enum" RENAME TO "currency_enum_old"`);
    await queryRunner.query(
      `CREATE TYPE "public"."currency_enum" AS ENUM('840', '980', '978', '203', '191', '985', '643')`
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ALTER COLUMN "currencyCode" TYPE "public"."currency_enum" USING "currencyCode"::"text"::"public"."currency_enum"`
    );
    await queryRunner.query(
      `ALTER TABLE "budgets" ALTER COLUMN "currencyCode" TYPE "public"."currency_enum" USING "currencyCode"::"text"::"public"."currency_enum"`
    );
    await queryRunner.query(`ALTER TABLE "settings" ALTER COLUMN "defaultCurrencyCode" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "settings" ALTER COLUMN "defaultCurrencyCode" TYPE "public"."currency_enum" USING "defaultCurrencyCode"::"text"::"public"."currency_enum"`
    );
    await queryRunner.query(`ALTER TABLE "settings" ALTER COLUMN "defaultCurrencyCode" SET DEFAULT '980'`);
    await queryRunner.query(
      `ALTER TABLE "records" ALTER COLUMN "currencyCode" TYPE "public"."currency_enum" USING "currencyCode"::"text"::"public"."currency_enum"`
    );
    await queryRunner.query(
      `ALTER TABLE "records" ALTER COLUMN "operationCurrencyCode" TYPE "public"."currency_enum" USING "operationCurrencyCode"::"text"::"public"."currency_enum"`
    );
    await queryRunner.query(`DROP TYPE "public"."currency_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."currency_enum_old" AS ENUM('840', '980', '978', '203', '191', '985')`
    );
    await queryRunner.query(
      `ALTER TABLE "records" ALTER COLUMN "operationCurrencyCode" TYPE "public"."currency_enum_old" USING "operationCurrencyCode"::"text"::"public"."currency_enum_old"`
    );
    await queryRunner.query(
      `ALTER TABLE "records" ALTER COLUMN "currencyCode" TYPE "public"."currency_enum_old" USING "currencyCode"::"text"::"public"."currency_enum_old"`
    );
    await queryRunner.query(`ALTER TABLE "settings" ALTER COLUMN "defaultCurrencyCode" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "settings" ALTER COLUMN "defaultCurrencyCode" TYPE "public"."currency_enum_old" USING "defaultCurrencyCode"::"text"::"public"."currency_enum_old"`
    );
    await queryRunner.query(`ALTER TABLE "settings" ALTER COLUMN "defaultCurrencyCode" SET DEFAULT '980'`);
    await queryRunner.query(
      `ALTER TABLE "budgets" ALTER COLUMN "currencyCode" TYPE "public"."currency_enum_old" USING "currencyCode"::"text"::"public"."currency_enum_old"`
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ALTER COLUMN "currencyCode" TYPE "public"."currency_enum_old" USING "currencyCode"::"text"::"public"."currency_enum_old"`
    );
    await queryRunner.query(`DROP TYPE "public"."currency_enum"`);
    await queryRunner.query(`ALTER TYPE "public"."currency_enum_old" RENAME TO "currency_enum"`);
  }
}
