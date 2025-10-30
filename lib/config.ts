/**
 * Configuration utility for handling environment-specific settings
 */

export const config = {
  /**
   * Get the API base URL based on environment
   */
  getApiUrl: (): string => {
    if (typeof window === 'undefined') {
      // Server-side: use environment variable or fallback
      return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010';
    }
    
    // Client-side: use environment variable or fallback
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010';
  },

  /**
   * Get the GraphQL endpoint URL
   */
  getGraphQLUrl: (): string => {
    const explicitGraphQLUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL;
    if (explicitGraphQLUrl) {
      return explicitGraphQLUrl;
    }

    const baseUrl = config.getApiUrl();
    return `${baseUrl.replace(/\/$/, '')}/graphql`;
  },

  /**
   * Check if we're in development mode
   */
  isDevelopment: (): boolean => {
    return process.env.NODE_ENV === 'development';
  },

  /**
   * Check if we're in production mode
   */
  isProduction: (): boolean => {
    return process.env.NODE_ENV === 'production';
  },

  /**
   * Get the current environment name
   */
  getEnvironment: (): string => {
    return process.env.NODE_ENV || 'development';
  },

  /**
   * Log configuration details (for debugging)
   */
  logConfig: (): void => {
    if (config.isDevelopment()) {
      console.log('🔧 App Configuration:', {
        environment: config.getEnvironment(),
        apiUrl: config.getApiUrl(),
        graphqlUrl: config.getGraphQLUrl(),
        nodeEnv: process.env.NODE_ENV,
        publicApiUrl: process.env.NEXT_PUBLIC_API_URL,
        publicGraphQLUrl: process.env.NEXT_PUBLIC_GRAPHQL_URL,
      });
    }
  },
};

export default config;