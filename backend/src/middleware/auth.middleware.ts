import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { envConfig } from '../config/env.config'
import { CustomError } from './error.middleware'
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants'
import { JwtPayload } from '../types'

export interface AuthRequest extends Request {
  user?: JwtPayload
}

export const authenticateToken = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    throw new CustomError(
      ERROR_MESSAGES.AUTH.TOKEN_REQUIRED,
      HTTP_STATUS.UNAUTHORIZED,
    )
  }

  try {
    const decoded = jwt.verify(token, envConfig.JWT_SECRET) as JwtPayload
    req.user = decoded
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new CustomError(
        ERROR_MESSAGES.AUTH.TOKEN_EXPIRED,
        HTTP_STATUS.UNAUTHORIZED,
      )
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new CustomError(
        ERROR_MESSAGES.AUTH.TOKEN_INVALID,
        HTTP_STATUS.UNAUTHORIZED,
      )
    } else {
      throw new CustomError(
        ERROR_MESSAGES.AUTH.AUTH_FAILED,
        HTTP_STATUS.UNAUTHORIZED,
      )
    }
  }
}
