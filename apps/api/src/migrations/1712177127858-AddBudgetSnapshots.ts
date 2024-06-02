import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBudgetSnapshots1712177127858 implements MigrationInterface {
  name = 'AddBudgetSnapshots1712177127858';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "budgets-snapshots" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "amount" integer NOT NULL, "currencyCode" "public"."currency_enum" NOT NULL, "color" character varying, "period" "public"."period_enum" NOT NULL, "fromDate" TIMESTAMP, "toDate" TIMESTAMP, "createdBy" character varying NOT NULL, "originalId" uuid, CONSTRAINT "PK_e8da42e052a19aee368cef3dcb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "budgets-snapshots_categories_categories" ("budgetsSnapshotsId" uuid NOT NULL, "categoriesId" uuid NOT NULL, CONSTRAINT "PK_b09571362a519ab2f7cbac03b8f" PRIMARY KEY ("budgetsSnapshotsId", "categoriesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eb173823be90e6414f288a250b" ON "budgets-snapshots_categories_categories" ("budgetsSnapshotsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9b067fd6a7db73622cf9658d31" ON "budgets-snapshots_categories_categories" ("categoriesId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "budgets-snapshots" ADD CONSTRAINT "FK_c8da1e2296b599ca66f91d0ad4a" FOREIGN KEY ("originalId") REFERENCES "budgets"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "budgets-snapshots_categories_categories" ADD CONSTRAINT "FK_eb173823be90e6414f288a250bf" FOREIGN KEY ("budgetsSnapshotsId") REFERENCES "budgets-snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "budgets-snapshots_categories_categories" ADD CONSTRAINT "FK_9b067fd6a7db73622cf9658d318" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "budgets-snapshots_categories_categories" DROP CONSTRAINT "FK_9b067fd6a7db73622cf9658d318"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budgets-snapshots_categories_categories" DROP CONSTRAINT "FK_eb173823be90e6414f288a250bf"`,
    );
    await queryRunner.query(`ALTER TABLE "budgets-snapshots" DROP CONSTRAINT "FK_c8da1e2296b599ca66f91d0ad4a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_9b067fd6a7db73622cf9658d31"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_eb173823be90e6414f288a250b"`);
    await queryRunner.query(`DROP TABLE "budgets-snapshots_categories_categories"`);
    await queryRunner.query(`DROP TABLE "budgets-snapshots"`);
  }
}
