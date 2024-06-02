import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBudgetPlan1712264647341 implements MigrationInterface {
  name = 'AddBudgetPlan1712264647341';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "budget-plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "month" integer NOT NULL, "year" integer NOT NULL, "createdBy" character varying NOT NULL, CONSTRAINT "PK_abcf465e3004b5927497c9658c1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "budgets-snapshots" ADD "budgetPlanId" uuid`);
    await queryRunner.query(`ALTER TABLE "planned-payment-snapshots" ADD "budgetPlanId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "budgets-snapshots" ADD CONSTRAINT "FK_4bdceb72b9921f6c55824da3839" FOREIGN KEY ("budgetPlanId") REFERENCES "budget-plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "planned-payment-snapshots" ADD CONSTRAINT "FK_8d0266b4c672dc547752053eb83" FOREIGN KEY ("budgetPlanId") REFERENCES "budget-plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "planned-payment-snapshots" DROP CONSTRAINT "FK_8d0266b4c672dc547752053eb83"`);
    await queryRunner.query(`ALTER TABLE "budgets-snapshots" DROP CONSTRAINT "FK_4bdceb72b9921f6c55824da3839"`);
    await queryRunner.query(`ALTER TABLE "planned-payment-snapshots" DROP COLUMN "budgetPlanId"`);
    await queryRunner.query(`ALTER TABLE "budgets-snapshots" DROP COLUMN "budgetPlanId"`);
    await queryRunner.query(`DROP TABLE "budget-plans"`);
  }
}
