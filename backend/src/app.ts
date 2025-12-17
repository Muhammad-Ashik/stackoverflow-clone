import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import path from 'path';
import 'reflect-metadata';
import AppDataSource from './config/databaseConfig';
import { envConfig } from './config/env.config';
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  REQUEST,
  SUCCESS_MESSAGES,
} from './constants';
import { errorHandler } from './middleware/error.middleware';
import { requestId, requestLogger } from './middleware/logger.middleware';
import authRoutes from './routes/auth/auth';
import userRoutes from './routes/users/users';
import { ApiResponse, HealthCheckResponse } from './types';
import { isProduction, isTest } from './utils';

const app: Application = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
  }),
);

app.use(
  cors({
    origin: isProduction()
      ? envConfig.CORS_ORIGIN?.split(',') || []
      : envConfig.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json({ limit: REQUEST.BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: REQUEST.BODY_LIMIT }));
app.use(express.static(path.join(__dirname, 'public')));

if (!isTest()) {
  app.use(requestId);
  app.use(requestLogger);
}

app.get('/health', async (_req: Request, res: Response) => {
  const healthCheck: HealthCheckResponse = {
    success: true,
    message: SUCCESS_MESSAGES.HEALTH.OK,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: envConfig.NODE_ENV,
    database: 'unknown',
  };

  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.query('SELECT 1');
      healthCheck.database = 'connected';
    } else {
      healthCheck.database = 'disconnected';
    }
  } catch (error) {
    healthCheck.database = 'error';
    healthCheck.success = false;
    healthCheck.message = ERROR_MESSAGES.GENERAL.DB_CONNECTION_FAILED;
  }

  const statusCode = healthCheck.success
    ? HTTP_STATUS.OK
    : HTTP_STATUS.SERVICE_UNAVAILABLE;
  res.status(statusCode).json(healthCheck);
});

app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/v1/auth', authRoutes);
app.use('/v1/users', userRoutes);

app.use((_req: Request, res: Response) => {
  const response: ApiResponse = {
    success: false,
    message: ERROR_MESSAGES.GENERAL.ROUTE_NOT_FOUND,
  };
  res.status(HTTP_STATUS.NOT_FOUND).json(response);
});

app.use(errorHandler);

export default app;
