import AppDataSource from '../config/databaseConfig';
import { QueryRunner } from 'typeorm';
import { CustomError } from '../middleware/error.middleware';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';

export async function withTransaction<T>(
  callback: (queryRunner: QueryRunner) => Promise<T>,
): Promise<T> {
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const result = await callback(queryRunner);
    await queryRunner.commitTransaction();
    return result;
  } catch (error) {
    await queryRunner.rollbackTransaction();

    if (error instanceof CustomError) {
      throw error;
    }

    throw new CustomError(
      ERROR_MESSAGES.GENERAL.INTERNAL_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  } finally {
    await queryRunner.release();
  }
}

export type TransactionManager = QueryRunner['manager'];
