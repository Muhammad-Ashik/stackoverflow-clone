import AppDataSource from '../../config/databaseConfig';
import { User } from '../../entities/User';
import { CustomError } from '../../middleware/error.middleware';
import { ERROR_MESSAGES, HTTP_STATUS } from '../../constants';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface UserListResult {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'googleId', 'createdAt', 'updatedAt'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async findByIdWithPassword(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'password', 'googleId'],
    });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
      select: ['id', 'name', 'email', 'password', 'googleId'],
    });
  }

  async getUsersList(pagination: PaginationParams): Promise<UserListResult> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [users, total] = await this.userRepository.findAndCount({
      select: ['id', 'name', 'email', 'googleId', 'createdAt', 'updatedAt'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip,
    });

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const user = this.userRepository.create({
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      password: data.password,
    });

    try {
      await this.userRepository.save(user);
      // Remove password from returned user
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error: unknown) {
      // Handle database constraint violations
      const dbError = error as { code?: string; constraint?: string };
      if (dbError?.code === '23505' || dbError?.constraint) {
        throw new CustomError(
          ERROR_MESSAGES.USER.ALREADY_EXISTS,
          HTTP_STATUS.CONFLICT,
        );
      }
      console.error('Error creating user:', error);
      throw new CustomError(
        ERROR_MESSAGES.USER.CREATION_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserTimestamps(id: number): Promise<{
    createdAt?: Date;
    updatedAt?: Date;
  }> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'createdAt', 'updatedAt'],
    });

    return {
      createdAt: user?.createdAt,
      updatedAt: user?.updatedAt,
    };
  }
}

export default new UserService();
