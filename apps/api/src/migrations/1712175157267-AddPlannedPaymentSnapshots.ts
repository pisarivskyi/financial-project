import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlannedPaymentSnapshots1712175157267 implements MigrationInterface {
  name = 'AddPlannedPaymentSnapshots1712175157267';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "planned-payment-snapshots" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "color" character varying, "icon" character varying, "amount" integer NOT NULL, "currencyCode" "public"."currency_enum" NOT NULL, "type" "public"."record_type_enum" NOT NULL, "period" "public"."period_enum" NOT NULL, "dayOfWeek" integer, "dayOfMonth" integer, "dateOfYear" TIMESTAMP, "createdBy" character varying NOT NULL, "categoryId" uuid, "originalId" uuid, CONSTRAINT "PK_8656b72b7137c96221038d39085" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "planned-payment-snapshots" ADD CONSTRAINT "FK_ce697cdf747c510c23f7d77c2de" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "planned-payment-snapshots" ADD CONSTRAINT "FK_904c8aed5b739283b57527a2340" FOREIGN KEY ("originalId") REFERENCES "planned-payments"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "planned-payment-snapshots" DROP CONSTRAINT "FK_904c8aed5b739283b57527a2340"`);
    await queryRunner.query(`ALTER TABLE "planned-payment-snapshots" DROP CONSTRAINT "FK_ce697cdf747c510c23f7d77c2de"`);
    await queryRunner.query(`DROP TABLE "planned-payment-snapshots"`);
  }
}
