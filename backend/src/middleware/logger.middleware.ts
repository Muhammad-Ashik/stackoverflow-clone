import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';

export interface RequestWithId extends Request {
  id?: string;
}

export const requestId = (
  req: RequestWithId,
  _res: Response,
  next: NextFunction,
): void => {
  req.id = randomUUID();
  next();
};

export const requestLogger = (
  req: RequestWithId,
  _res: Response,
  next: NextFunction,
): void => {
  const timestamp = new Date().toISOString();
  const requestId = req.id || 'unknown';
  console.log(`[${timestamp}] [${requestId}] ${req.method} ${req.path}`);
  next();
};
