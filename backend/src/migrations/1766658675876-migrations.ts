import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1766658675876 implements MigrationInterface {
  name = 'Migrations1766658675876'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_user_email"`)
    await queryRunner.query(
      `CREATE TABLE "question" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "description" text NOT NULL, "userId" integer, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "createdAt" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updatedAt" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT now()`,
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "name" character varying(255) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_user_email"`,
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "email" character varying(255) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`,
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "password" character varying(255) NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "googleId"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "googleId" character varying(255)`,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `,
    )
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_80f29cc01d0bd1644e389cc13be" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_80f29cc01d0bd1644e389cc13be"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`,
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "googleId"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "googleId" character varying`,
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "password" character varying NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`,
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "email" character varying NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_user_email" UNIQUE ("email")`,
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "name" character varying NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`,
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updatedAt" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`,
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "createdAt" DROP NOT NULL`,
    )
    await queryRunner.query(`DROP TABLE "question"`)
    await queryRunner.query(
      `CREATE INDEX "IDX_user_email" ON "user" ("email") `,
    )
  }
}
