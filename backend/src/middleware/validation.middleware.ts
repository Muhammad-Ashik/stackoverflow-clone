import { ClassConstructor, plainToInstance } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { Request, Response, NextFunction } from 'express'
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants'
import { ApiResponse } from '../types'

export function validateDto<T extends object>(dtoClass: ClassConstructor<T>) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (!req.body || Object.keys(req.body).length === 0) {
      const response: ApiResponse = {
        success: false,
        message: ERROR_MESSAGES.VALIDATION.FAILED,
        errors: [ERROR_MESSAGES.VALIDATION.BODY_REQUIRED],
      }
      res.status(HTTP_STATUS.BAD_REQUEST).json(response)
      return
    }

    const dto = plainToInstance(dtoClass, req.body)
    const errors: ValidationError[] = await validate(dto)

    if (errors.length > 0) {
      const errorMessages = errors.map((error) => {
        return Object.values(error.constraints || {}).join(', ')
      })

      const response: ApiResponse = {
        success: false,
        message: ERROR_MESSAGES.VALIDATION.FAILED,
        errors: errorMessages,
      }
      res.status(HTTP_STATUS.BAD_REQUEST).json(response)
      return
    }

    req.body = dto
    next()
  }
}
