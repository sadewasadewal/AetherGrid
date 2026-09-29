import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import apiRoutes from './routes/api.routes.js';
import { initializeDatabase, pool } from './db/index.js';
import { telemetry } from './services/telemetry.js';

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const isError = res.statusCode >= 400;
    telemetry.addLog(
      isError ? 'warn' : 'info',
      'http',
      `${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`
    );
  });
  next();
});

// Root metadata route
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'AetherGrid Control Plane Backend API',
    tagline: 'Engineering the Invisible',
    version: config.appVersion,
    status: 'online',
    endpoints: [
      '/api/health',
      '/api/services',
      '/api/metrics',
      '/api/deployments',
      '/api/logs',
      '/api/system',
      '/api/version'
    ]
  });
});

// Mount API routes
app.use('/api', apiRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.originalUrl });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error]', err);
  telemetry.addLog('error', 'unhandled', err.message || 'Internal server error');
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Server bootstrap
const server = app.listen(config.port, async () => {
  console.log(`[AetherGrid API] Service running on http://0.0.0.0:${config.port} (env: ${config.environment})`);
  telemetry.addLog('info', 'bootstrap', `Service started on port ${config.port}`);

  // Initialize DB asynchronously
  await initializeDatabase();
});

// Graceful signal handling for Docker & ECS Fargate
const handleShutdown = async (signal: string) => {
  console.log(`[AetherGrid API] Received ${signal}. Initiating graceful termination...`);
  telemetry.addLog('info', 'lifecycle', `Shutting down via ${signal}`);

  server.close(async () => {
    console.log('[AetherGrid API] HTTP connections closed.');
    try {
      await pool.end();
      console.log('[AetherGrid API] PostgreSQL connection pool terminated.');
    } catch (e: any) {
      console.error('[AetherGrid API] Error draining DB pool:', e.message);
    }
    process.exit(0);
  });

  // Force exit if connections don't drain within 10 seconds
  setTimeout(() => {
    console.error('[AetherGrid API] Forcefully terminating after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

export default app;
