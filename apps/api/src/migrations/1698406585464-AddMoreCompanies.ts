import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMoreCompanies1698406585464 implements MigrationInterface {
  name = 'AddMoreCompanies1698406585464';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."company_enum" RENAME TO "company_enum_old"`);
    await queryRunner.query(
      `CREATE TYPE "public"."company_enum" AS ENUM('google', 'youtube', 'netflix', 'spotify', 'playstation', 'konzum', 'plodine', 'dm', 'mueller', 'spar', 'ikea', 'lidl', 'kaufland', 'mlinar', 'dubravica', 'studenac')`
    );
    await queryRunner.query(
      `ALTER TABLE "records" ALTER COLUMN "company" TYPE "public"."company_enum" USING "company"::"text"::"public"."company_enum"`
    );
    await queryRunner.query(`DROP TYPE "public"."company_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."company_enum_old" AS ENUM('google', 'youtube', 'netflix', 'spotify', 'playstation', 'konzum', 'plodine', 'dm', 'mueller', 'spar', 'ikea', 'lidl')`
    );
    await queryRunner.query(
      `ALTER TABLE "records" ALTER COLUMN "company" TYPE "public"."company_enum_old" USING "company"::"text"::"public"."company_enum_old"`
    );
    await queryRunner.query(`DROP TYPE "public"."company_enum"`);
    await queryRunner.query(`ALTER TYPE "public"."company_enum_old" RENAME TO "company_enum"`);
  }
}
