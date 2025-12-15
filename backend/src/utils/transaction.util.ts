import AppDataSource from '../config/databaseConfig';
import { QueryRunner } from 'typeorm';
import { CustomError } from '../middleware/error.middleware';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';

/**
 * Executes a callback function within a database transaction.
 * Automatically commits on success and rolls back on error.
 *
 * @template T The return type of the callback function
 * @param callback Function to execute within the transaction context
 * @returns Promise resolving to the callback's return value
 * @throws CustomError if transaction fails or callback throws an error
 *
 * @example
 * const result = await withTransaction(async (queryRunner) => {
 *   const user = await queryRunner.manager.save(User, userData);
 *   const profile = await queryRunner.manager.save(Profile, { userId: user.id });
 *   return { user, profile };
 * });
 */
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

    // Re-throw the error if it's already a CustomError
    if (error instanceof CustomError) {
      throw error;
    }

    // Otherwise, wrap it in a CustomError
    throw new CustomError(
      ERROR_MESSAGES.GENERAL.INTERNAL_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  } finally {
    await queryRunner.release();
  }
}

/**
 * Utility type for transaction-aware repositories
 * Use queryRunner.manager to access repositories within a transaction
 *
 * @example
 * const user = await queryRunner.manager.findOne(User, { where: { id: 1 } });
 * await queryRunner.manager.save(User, updatedUser);
 */
export type TransactionManager = QueryRunner['manager'];
