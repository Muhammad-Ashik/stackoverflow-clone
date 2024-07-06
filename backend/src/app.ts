// backend/app.ts
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import 'reflect-metadata';
import AppDataSource from './config/databaseConfig';
import { User } from './entities/User';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.get('/', (_req, _res) => {
  _res.sendFile('home.html', { root: __dirname });
});

app.get('/users', async (req: Request, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const users = await userRepo.find();
    res.json(users);
  } catch (error) {
    console.log(error);
  }
});

export default app;
