import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCurrenciesToRecords1717430024427 implements MigrationInterface {
  name = 'AddCurrenciesToRecords1717430024427';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "budgets-snapshots_categories_categories" DROP CONSTRAINT "FK_eb173823be90e6414f288a250bf"`,
    );
    await queryRunner.query(`ALTER TABLE "records" ADD "currenciesMetadata" json NOT NULL DEFAULT '[]'`);
    await queryRunner.query(
      `ALTER TABLE "budgets-snapshots_categories_categories" ADD CONSTRAINT "FK_eb173823be90e6414f288a250bf" FOREIGN KEY ("budgetsSnapshotsId") REFERENCES "budgets-snapshots"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "budgets-snapshots_categories_categories" DROP CONSTRAINT "FK_eb173823be90e6414f288a250bf"`,
    );
    await queryRunner.query(`ALTER TABLE "records" DROP COLUMN "currenciesMetadata"`);
    await queryRunner.query(
      `ALTER TABLE "budgets-snapshots_categories_categories" ADD CONSTRAINT "FK_eb173823be90e6414f288a250bf" FOREIGN KEY ("budgetsSnapshotsId") REFERENCES "budgets-snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
