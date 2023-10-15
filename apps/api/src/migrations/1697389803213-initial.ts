import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1697389803213 implements MigrationInterface {
  name = 'Initial1697389803213';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."provider_type_enum" AS ENUM('monobank', 'manual')`);
    await queryRunner.query(
      `CREATE TABLE "providers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "providerType" "public"."provider_type_enum" NOT NULL, "data" json NOT NULL, "createdBy" character varying NOT NULL, CONSTRAINT "PK_af13fc2ebf382fe0dad2e4793aa" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE TYPE "public"."account_type_enum" AS ENUM('cash', 'credit', 'debit')`);
    await queryRunner.query(`CREATE TYPE "public"."currency_enum" AS ENUM('840', '980', '978')`);
    await queryRunner.query(
      `CREATE TYPE "public"."issuer_enum" AS ENUM('unknown', 'visa', 'mastercard', 'maestro', 'amex')`
    );
    await queryRunner.query(
      `CREATE TABLE "accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "bankAccountId" character varying, "name" character varying NOT NULL, "type" "public"."account_type_enum" NOT NULL, "balance" integer NOT NULL, "creditLimit" integer NOT NULL DEFAULT '0', "bankSpecificType" character varying, "color" character varying, "currencyCode" "public"."currency_enum" NOT NULL, "metadata" json, "providerType" "public"."provider_type_enum" NOT NULL, "maskedPan" character varying, "createdBy" character varying NOT NULL, "lastSyncDate" TIMESTAMP, "issuer" "public"."issuer_enum" NOT NULL DEFAULT 'unknown', "providerId" uuid, CONSTRAINT "UQ_08ab8b282adef05997e03bf62ac" UNIQUE ("bankAccountId"), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "color" character varying NOT NULL, "icon" character varying NOT NULL, "createdBy" character varying NOT NULL, "mccRangeStart" smallint, "mccRangeEnd" smallint, "parentCategoryId" uuid, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE TYPE "public"."record_type_enum" AS ENUM('income', 'outcome')`);
    await queryRunner.query(`CREATE TYPE "public"."record_creation_type_enum" AS ENUM('manual', 'synced')`);
    await queryRunner.query(
      `CREATE TABLE "records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "bankRecordId" character varying, "name" character varying NOT NULL, "amount" integer NOT NULL, "operationAmount" integer, "type" "public"."record_type_enum" NOT NULL, "balance" integer NOT NULL, "comment" character varying NOT NULL DEFAULT '', "creationType" "public"."record_creation_type_enum" NOT NULL, "currencyCode" "public"."currency_enum" NOT NULL, "operationCurrencyCode" "public"."currency_enum", "description" character varying NOT NULL DEFAULT '', "mcc" integer NOT NULL, "bankCreatedAt" TIMESTAMP, "metadata" json, "createdBy" character varying NOT NULL, "accountId" uuid, "categoryId" uuid, CONSTRAINT "UQ_b2403822ed944f57ea103fd23e6" UNIQUE ("bankRecordId"), CONSTRAINT "PK_188149422ee2454660abf1d5ee5" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE TYPE "public"."period_enum" AS ENUM('one-time', 'weekly', 'monthly', 'yearly')`);
    await queryRunner.query(
      `CREATE TABLE "budgets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "amount" integer NOT NULL, "currencyCode" "public"."currency_enum" NOT NULL, "color" character varying, "period" "public"."period_enum" NOT NULL, "fromDate" TIMESTAMP, "toDate" TIMESTAMP, "createdBy" character varying NOT NULL, CONSTRAINT "PK_9c8a51748f82387644b773da482" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "billingPeriodStartDayNumber" integer NOT NULL DEFAULT '1', "createdBy" character varying NOT NULL, "defaultCurrencyCode" "public"."currency_enum" NOT NULL DEFAULT '980', CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "budgets_categories_categories" ("budgetsId" uuid NOT NULL, "categoriesId" uuid NOT NULL, CONSTRAINT "PK_a74ae9863c7c4642db92c22f781" PRIMARY KEY ("budgetsId", "categoriesId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7edca3b2785c04e5e08d9125a7" ON "budgets_categories_categories" ("budgetsId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d3e5192ff46da417927946d665" ON "budgets_categories_categories" ("categoriesId") `
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "FK_43c1707c90ac8d9418a7248317b" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "FK_ccde635bce518afe7c110858cc4" FOREIGN KEY ("parentCategoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "records" ADD CONSTRAINT "FK_98973d612b97d87f64b4afabe87" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "records" ADD CONSTRAINT "FK_9237a6e731418bb2b6111d17fb1" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "budgets_categories_categories" ADD CONSTRAINT "FK_7edca3b2785c04e5e08d9125a76" FOREIGN KEY ("budgetsId") REFERENCES "budgets"("id") ON DELETE SET NULL ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "budgets_categories_categories" ADD CONSTRAINT "FK_d3e5192ff46da417927946d665e" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "budgets_categories_categories" DROP CONSTRAINT "FK_d3e5192ff46da417927946d665e"`
    );
    await queryRunner.query(
      `ALTER TABLE "budgets_categories_categories" DROP CONSTRAINT "FK_7edca3b2785c04e5e08d9125a76"`
    );
    await queryRunner.query(`ALTER TABLE "records" DROP CONSTRAINT "FK_9237a6e731418bb2b6111d17fb1"`);
    await queryRunner.query(`ALTER TABLE "records" DROP CONSTRAINT "FK_98973d612b97d87f64b4afabe87"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_ccde635bce518afe7c110858cc4"`);
    await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_43c1707c90ac8d9418a7248317b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d3e5192ff46da417927946d665"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7edca3b2785c04e5e08d9125a7"`);
    await queryRunner.query(`DROP TABLE "budgets_categories_categories"`);
    await queryRunner.query(`DROP TABLE "settings"`);
    await queryRunner.query(`DROP TYPE "public"."currency_enum"`);
    await queryRunner.query(`DROP TABLE "budgets"`);
    await queryRunner.query(`DROP TYPE "public"."period_enum"`);
    await queryRunner.query(`DROP TABLE "records"`);
    await queryRunner.query(`DROP TYPE "public"."record_creation_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."record_type_enum"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "accounts"`);
    await queryRunner.query(`DROP TYPE "public"."issuer_enum"`);
    await queryRunner.query(`DROP TYPE "public"."provider_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."account_type_enum"`);
    await queryRunner.query(`DROP TABLE "providers"`);
  }
}
