import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1721244824627 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR NOT NULL,
                "email" VARCHAR NOT NULL,
                "password" VARCHAR NOT NULL,
                "googleId" VARCHAR
            )
        `);
  }
}
