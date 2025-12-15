import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { envConfig } from '../../config/env.config';
import { ERROR_MESSAGES, HTTP_STATUS, JWT } from '../../constants';
import { User } from '../../entities/User';
import { CustomError } from '../../middleware/error.middleware';
import { JwtPayload } from '../../types';
import UserService from '../user/UserService';

export const registerUser = async (
  name: string,
  email: string,
  password: string,
): Promise<User> => {
  // Check if user already exists
  const existingUser = await UserService.findByEmail(email);
  if (existingUser) {
    throw new CustomError(
      ERROR_MESSAGES.USER.ALREADY_EXISTS,
      HTTP_STATUS.CONFLICT,
    );
  }

  // Create new user using service
  return await UserService.createUser({ name, email, password });
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<string> => {
  // Find user with password
  const user = await UserService.findByEmailWithPassword(email);

  if (!user) {
    throw new CustomError(
      ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
      HTTP_STATUS.UNAUTHORIZED,
    );
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new CustomError(
      ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
      HTTP_STATUS.UNAUTHORIZED,
    );
  }

  // Generate JWT token
  const payload: JwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    googleId: user.googleId,
  };

  const token = jwt.sign(payload, envConfig.JWT_SECRET, {
    expiresIn: envConfig.JWT_EXPIRES_IN || JWT.DEFAULT_EXPIRY,
  } as jwt.SignOptions);

  return token;
};
