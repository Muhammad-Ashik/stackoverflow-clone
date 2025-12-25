import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1766658675876 implements MigrationInterface {
  name = 'Migrations1766658675876'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create question table
    await queryRunner.query(
      `CREATE TABLE "question" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "description" text NOT NULL, "userId" integer, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`,
    )

    // Add foreign key to user table
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_80f29cc01d0bd1644e389cc13be" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_80f29cc01d0bd1644e389cc13be"`,
    )

    // Drop question table
    await queryRunner.query(`DROP TABLE "question"`)
  }
}
