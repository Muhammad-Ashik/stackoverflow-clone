import { NextFunction, Request, Response } from 'express'
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants'
import { ApiResponse } from '../types'
import { isDevelopment } from '../utils'

export interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

export class CustomError extends Error implements AppError {
  statusCode: number
  isOperational: boolean

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  ) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
  const message = err.message || ERROR_MESSAGES.GENERAL.INTERNAL_ERROR

  const response: ApiResponse = {
    success: false,
    message,
    ...(isDevelopment() && { errors: [err.stack || ''] }),
  }

  res.status(statusCode).json(response)
}

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
