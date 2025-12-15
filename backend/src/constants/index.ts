// Application constants

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

export const PASSWORD = {
  MIN_LENGTH: 8,
  BCRYPT_ROUNDS: 10,
  BCRYPT_PREFIX: '$2',
} as const;

export const JWT = {
  DEFAULT_EXPIRY: '7d',
} as const;

export const DATABASE = {
  CONNECTION_POOL: {
    PRODUCTION: {
      MAX: 20,
      MIN: 5,
    },
    DEVELOPMENT: {
      MAX: 10,
      MIN: 2,
    },
    IDLE_TIMEOUT: 30000,
    CONNECTION_TIMEOUT: 2000,
    MAX_IDLE_TIME: 10000,
  },
} as const;

export const REQUEST = {
  BODY_LIMIT: '10mb',
} as const;

export const ERROR_MESSAGES = {
  AUTH: {
    TOKEN_REQUIRED: 'Authentication token required',
    TOKEN_EXPIRED: 'Token has expired',
    TOKEN_INVALID: 'Invalid token',
    AUTH_FAILED: 'Authentication failed',
    INVALID_CREDENTIALS: 'Invalid email or password',
    JWT_NOT_CONFIGURED: 'JWT secret is not configured',
  },
  USER: {
    ALREADY_EXISTS: 'User with this email already exists',
    NOT_FOUND: 'User not found',
    CREATION_FAILED: 'Failed to create user',
    INFO_NOT_AVAILABLE: 'User information not available',
  },
  VALIDATION: {
    FAILED: 'Validation failed',
    BODY_REQUIRED: 'Request body is required',
  },
  GENERAL: {
    INTERNAL_ERROR: 'Internal Server Error',
    ROUTE_NOT_FOUND: 'Route not found',
    DB_CONNECTION_FAILED: 'Database connection failed',
  },
} as const;

export const SUCCESS_MESSAGES = {
  USER: {
    REGISTERED: 'User registered successfully',
    LOGIN: 'Login successful',
  },
  HEALTH: {
    OK: 'Server is healthy',
  },
} as const;
