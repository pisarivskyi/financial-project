import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlannedPayment1708456180771 implements MigrationInterface {
  name = 'AddPlannedPayment1708456180771';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "planned-payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "color" character varying, "icon" character varying, "amount" integer NOT NULL, "currencyCode" "public"."currency_enum" NOT NULL, "type" "public"."record_type_enum" NOT NULL, "period" "public"."period_enum" NOT NULL, "dayOfWeek" integer, "dayOfMonth" integer, "dateOfYear" TIMESTAMP, "createdBy" character varying NOT NULL, "categoryId" uuid, CONSTRAINT "PK_e527942848b7c243cd411402188" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "planned-payments" ADD CONSTRAINT "FK_ef865a332e716766e1cf05dfa59" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "planned-payments" DROP CONSTRAINT "FK_ef865a332e716766e1cf05dfa59"`);
    await queryRunner.query(`DROP TABLE "planned-payments"`);
  }
}
