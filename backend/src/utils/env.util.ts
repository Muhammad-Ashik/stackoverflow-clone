import { envConfig } from '../config/env.config';

/**
 * Check if the application is running in production environment
 */
export const isProduction = (): boolean => {
  return envConfig.NODE_ENV === 'production';
};

/**
 * Check if the application is running in development environment
 */
export const isDevelopment = (): boolean => {
  return envConfig.NODE_ENV === 'development';
};

/**
 * Check if the application is running in staging environment
 */
export const isStaging = (): boolean => {
  return envConfig.NODE_ENV === 'staging';
};

/**
 * Check if the application is running in test environment
 */
export const isTest = (): boolean => {
  return envConfig.NODE_ENV === 'test';
};

/**
 * Get the current environment name
 */
export const getEnvironment = (): string => {
  return envConfig.NODE_ENV;
};
