import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AppDataSource from '../../config/databaseConfig';
import { User } from '../../entities/User';

export const registerUser = async (
  name: string,
  email: string,
  password: string,
): Promise<User | null> => {
  console.log('registerUser');
  const userRepo = AppDataSource.getRepository(User);
  const existingUser = await userRepo.findOne({ where: { email } });
  if (existingUser) return null;
  const user = await userRepo.create({ name, email, password });
  await userRepo.save(user);
  return user;
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<string | null> => {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({ where: { email } });
  if (!user) return null;

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return null;

  const jwtSecret = process.env.JWT_SECRET || '';
  const { id, name, googleId } = user;
  const token = jwt.sign(
    {
      id,
      name,
      email,
      googleId,
    },
    jwtSecret,
    {
      expiresIn: '1d',
    },
  );
  return token;
};
