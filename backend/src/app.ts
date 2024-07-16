// backend/app.ts
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import 'reflect-metadata';
import AppDataSource from './config/databaseConfig';
import { User } from './entities/User';
import authRoutes from './routes/auth/auth';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.get('/', (_req, _res) => {
  _res.sendFile('home.html', { root: __dirname });
});

app.use('/v1/auth', authRoutes);

app.use('/users', async (_req, res) => {
  const userRepo = AppDataSource.getRepository(User);
  const users = await userRepo.find({
    select: ['id', 'name', 'email', 'googleId'],
  });
  return res.json(users);
});

export default app;
