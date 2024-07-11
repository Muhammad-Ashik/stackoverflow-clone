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

// write a route where if hit then it will create 50 users in the user table
app.get('/create-users', async (req: Request, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    for (let i = 0; i < 50; i++) {
      const user = new User();
      user.username = `User${i}`;
      user.email = `User@${i}`;
      user.password = 'password';
      await userRepo.save(user);
    }
    res.send('Users created successfully');
  } catch (error) {
    console.log(error);
  }
});

// write a route where if hit then it will delete all the users from the user table
app.get('/delete-users', async (req: Request, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    await userRepo.clear();
    res.send('Users deleted successfully');
  } catch (error) {
    console.log(error);
  }
});

// write a route where if hit then it will delete the user with id send in the query params
app.get('/delete-user', async (req: Request, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: Number(req.query.id) },
    });
    if (user) {
      await userRepo.remove(user);
      res.send('User deleted successfully');
    } else {
      res.send('User not found');
    }
  } catch (error) {
    console.log(error);
  }
});
// write a route where if hit then it will create a user in the user table
app.get('/create-user', async (req: Request, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const user = new User();
    user.username = 'New User';
    user.email = 'User@new';
    user.password = 'password';
    await userRepo.save(user);
    res.send('User created successfully');
  } catch (error) {
    console.log(error);
  }
});

// write a route where if hit then it will get the user with id send in the query params
app.get('/get-user', async (req: Request, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: Number(req.query.id) },
    });
    if (user) {
      res.json(user);
    } else {
      res.send('User not found');
    }
  } catch (error) {
    console.log(error);
  }
});

// write a route where if hit then it will get the user with id from the url like /get-user/2
app.get('/get-user/:id', async (req: Request, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: Number(req.params.id) },
    });
    if (user) {
      res.json(user);
    } else {
      res.send('User not found');
    }
  } catch (error) {
    console.log(error);
  }
});

// write a route where if hit then it will update the user with id 2
app.get('/update-user', async (req: Request, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: Number(req.query.id) },
    });
    if (user) {
      user.username = 'Updated User';
      await userRepo.save(user);
      res.send('User updated successfully');
    } else {
      res.send('User not found');
    }
  } catch (error) {
    console.log(error);
  }
});

export default app;
