// backend/app.ts
import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

export default app;
