// backend/app.ts
import cors from "cors";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import "reflect-metadata";
import AppDataSource from "./config/database";
import { User } from "./entities/Users";
import test from "./routes/test";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.get("/", (req: Request, res: Response) => {
  res.send("Sending a response from the root route!");
});

app.get("/test", test);

app.get("/users", async (req: Request, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const users = await userRepo.find();
    res.json(users);
  } catch (error) {
    console.log(error);
  }
});

export default app;
