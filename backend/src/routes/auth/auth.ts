import { Request, Response, Router } from 'express'
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../../constants'
import { LoginDto } from '../../dto/login.dto'
import { RegisterDto } from '../../dto/register.dto'
import { asyncHandler } from '../../middleware/error.middleware'
import { validateDto } from '../../middleware/validation.middleware'
import {
  loginUser,
  registerUser,
} from '../../services/auth-services/AuthServices'
import { ApiResponse, AuthResponse, UserResponse } from '../../types'

const router = Router()

router.post(
  '/register',
  validateDto(RegisterDto),
  asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body as RegisterDto
    const user = await registerUser(name, email, password)

    const response: ApiResponse<UserResponse> = {
      success: true,
      message: SUCCESS_MESSAGES.USER.REGISTERED,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        googleId: user.googleId,
      },
    }

    res.status(HTTP_STATUS.CREATED).json(response)
  }),
)

router.post(
  '/login',
  validateDto(LoginDto),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginDto
    const token = await loginUser(email, password)

    const response: ApiResponse<AuthResponse> = {
      success: true,
      message: SUCCESS_MESSAGES.USER.LOGIN,
      data: {
        token,
      },
    }

    res.status(HTTP_STATUS.OK).json(response)
  }),
)

export default router
