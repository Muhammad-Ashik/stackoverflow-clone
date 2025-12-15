// Common response types for API consistency

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface HealthCheckResponse {
  success: boolean;
  message: string;
  timestamp: string;
  uptime: number;
  environment: string;
  database: 'connected' | 'disconnected' | 'error' | 'unknown';
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  googleId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  token: string;
}

export interface JwtPayload {
  id: number;
  name: string;
  email: string;
  googleId?: string;
}
