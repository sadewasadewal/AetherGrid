import { Request, Response } from 'express';
import { pool, checkDatabaseConnection } from '../db/index.js';
import { telemetry } from '../services/telemetry.js';
import { config } from '../config/index.js';

export async function getHealth(req: Request, res: Response): Promise<void> {
  const dbHealth = await checkDatabaseConnection();
  const isHealthy = dbHealth.healthy;

  const payload = {
    status: isHealthy ? 'healthy' : 'degraded',
    service: 'aethergrid-api',
    version: config.appVersion,
    environment: config.environment,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbHealth.healthy ? 'healthy' : 'unreachable',
      latencyMs: dbHealth.latencyMs,
      ...(dbHealth.error ? { error: dbHealth.error } : {})
    },
    orchestration: {
      type: process.env.ECS_CONTAINER_METADATA_URI_V4 ? 'ECS Fargate' : 'Docker',
      region: config.region
    }
  };

  telemetry.recordRequest(!isHealthy);
  res.status(isHealthy ? 200 : 503).json(payload);
}

export async function getServices(req: Request, res: Response): Promise<void> {
  try {
    const dbHealth = await checkDatabaseConnection();
    let services = [];

    if (dbHealth.healthy) {
      const result = await pool.query('SELECT * FROM services ORDER BY name ASC');
      services = result.rows;
    } else {
      // Fallback service registry if DB is temporarily disconnected
      services = [
        {
          id: 'frontend',
          name: 'AetherGrid Web UI',
          status: 'healthy',
          version: config.appVersion,
          environment: config.environment,
          last_health_check: new Date().toISOString(),
          uptime_seconds: Math.floor(process.uptime()),
          latency_ms: 12.4,
          cpu_percent: 6.8,
          memory_mb: 135.2
        },
        {
          id: 'backend-api',
          name: 'AetherGrid Core API',
          status: 'healthy',
          version: config.appVersion,
          environment: config.environment,
          last_health_check: new Date().toISOString(),
          uptime_seconds: Math.floor(process.uptime()),
          latency_ms: 3.8,
          cpu_percent: 11.2,
          memory_mb: 172.5
        },
        {
          id: 'database',
          name: 'Amazon RDS PostgreSQL',
          status: 'degraded',
          version: '15.4',
          environment: config.environment,
          last_health_check: new Date().toISOString(),
          uptime_seconds: 0,
          latency_ms: 0,
          cpu_percent: 0,
          memory_mb: 0
        }
      ];
    }

    telemetry.recordRequest(false);
    res.json({
      services,
      dataSource: dbHealth.healthy ? 'rds-postgresql' : 'in-memory-fallback',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    telemetry.recordRequest(true);
    telemetry.addLog('error', 'api', `Error retrieving services: ${err.message}`);
    res.status(500).json({ error: 'Failed to retrieve services', details: err.message });
  }
}

export async function getMetrics(req: Request, res: Response): Promise<void> {
  telemetry.recordRequest(false);
  const metrics = telemetry.getMetrics();
  res.json(metrics);
}

export async function getDeployments(req: Request, res: Response): Promise<void> {
  try {
    const dbHealth = await checkDatabaseConnection();
    let deployments = [];

    if (dbHealth.healthy) {
      const result = await pool.query('SELECT * FROM deployments ORDER BY deployed_at DESC LIMIT 20');
      deployments = result.rows;
    } else {
      deployments = [
        {
          id: 'dep-9a4f21',
          version: 'v1.0.0',
          environment: config.environment,
          commit_sha: config.commitSha,
          status: 'success',
          initiated_by: 'GitHub Actions (workflow #42)',
          deployed_at: new Date(Date.now() - 7200000).toISOString(),
          duration_seconds: 145
        },
        {
          id: 'dep-8b3e10',
          version: 'v0.9.8',
          environment: config.environment,
          commit_sha: '4d2e8b1',
          status: 'success',
          initiated_by: 'GitHub Actions (workflow #38)',
          deployed_at: new Date(Date.now() - 86400000).toISOString(),
          duration_seconds: 152
        }
      ];
    }

    telemetry.recordRequest(false);
    res.json({
      deployments,
      total: deployments.length,
      dataSource: dbHealth.healthy ? 'rds-postgresql' : 'cached-fallback'
    });
  } catch (err: any) {
    telemetry.recordRequest(true);
    res.status(500).json({ error: 'Failed to fetch deployments', details: err.message });
  }
}

export async function getLogs(req: Request, res: Response): Promise<void> {
  telemetry.recordRequest(false);
  const limit = parseInt(req.query.limit as string || '50', 10);
  const level = req.query.level as string | undefined;
  const logs = telemetry.getLogs(limit, level);

  res.json({
    logs,
    count: logs.length,
    timestamp: new Date().toISOString()
  });
}

export async function getSystem(req: Request, res: Response): Promise<void> {
  telemetry.recordRequest(false);
  const systemInfo = telemetry.getSystemInfo();
  res.json(systemInfo);
}

export async function getVersion(req: Request, res: Response): Promise<void> {
  telemetry.recordRequest(false);
  res.json({
    version: config.appVersion,
    commitSha: config.commitSha,
    environment: config.environment,
    nodeVersion: process.version,
    platform: process.platform,
    timestamp: new Date().toISOString()
  });
}
