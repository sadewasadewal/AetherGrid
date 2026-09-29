import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  appVersion: process.env.APP_VERSION || '1.0.0',
  commitSha: process.env.COMMIT_SHA || process.env.GIT_COMMIT || 'local-dev',
  region: process.env.AWS_REGION || 'us-east-1',
  environment: process.env.ENVIRONMENT || 'dev',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'aethergrid_user',
    password: process.env.DB_PASSWORD || 'aethergrid_secure_password',
    database: process.env.DB_NAME || 'aethergrid_db',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    maxPool: parseInt(process.env.DB_POOL_MAX || '10', 10),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  },

  corsOrigin: process.env.CORS_ORIGIN || '*'
};
