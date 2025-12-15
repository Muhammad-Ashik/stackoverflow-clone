import { Request, Response, Router } from 'express';
import { asyncHandler, CustomError } from '../../middleware/error.middleware';
import {
  authenticateToken,
  AuthRequest,
} from '../../middleware/auth.middleware';
import UserService from '../../services/user/UserService';
import { PAGINATION, HTTP_STATUS, ERROR_MESSAGES } from '../../constants';
import { PaginatedResponse, ApiResponse, UserResponse } from '../../types';

const router = Router();

// Get all users (protected route with pagination)
router.get(
  '/',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const page = Math.max(
      PAGINATION.DEFAULT_PAGE,
      parseInt(req.query.page as string) || PAGINATION.DEFAULT_PAGE,
    );
    const limit = Math.min(
      PAGINATION.MAX_LIMIT,
      Math.max(
        PAGINATION.MIN_LIMIT,
        parseInt(req.query.limit as string) || PAGINATION.DEFAULT_LIMIT,
      ),
    );

    const result = await UserService.getUsersList({ page, limit });

    const response: PaginatedResponse<UserResponse> = {
      success: true,
      data: result.users as UserResponse[],
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };

    res.status(HTTP_STATUS.OK).json(response);
  }),
);

// Get current user profile (uses JWT data, minimal DB query)
router.get(
  '/me',
  authenticateToken,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new CustomError(
        ERROR_MESSAGES.USER.INFO_NOT_AVAILABLE,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    // Get only timestamps from database
    const timestamps = await UserService.getUserTimestamps(req.user.id);

    const response: ApiResponse<UserResponse> = {
      success: true,
      data: {
        ...req.user,
        ...timestamps,
      },
    };

    res.status(HTTP_STATUS.OK).json(response);
  }),
);

export default router;
