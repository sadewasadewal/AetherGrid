import pg from 'pg';
import { config } from '../config/index.js';

const { Pool } = pg;

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  ssl: config.db.ssl,
  max: config.db.maxPool,
  idleTimeoutMillis: config.db.idleTimeoutMillis,
  connectionTimeoutMillis: config.db.connectionTimeoutMillis,
});

pool.on('error', (err) => {
  console.error('[PostgreSQL] Unexpected pool error on idle client:', err.message);
});

export async function checkDatabaseConnection(): Promise<{ healthy: boolean; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT 1');
      return { healthy: true, latencyMs: Date.now() - start };
    } finally {
      client.release();
    }
  } catch (err: any) {
    return { healthy: false, latencyMs: Date.now() - start, error: err.message };
  }
}

export async function initializeDatabase(): Promise<void> {
  try {
    const { healthy, error } = await checkDatabaseConnection();
    if (!healthy) {
      console.warn(`[Database] PostgreSQL connection failed at startup: ${error}. Continuing in standby mode.`);
      return;
    }

    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS services (
          id VARCHAR(64) PRIMARY KEY,
          name VARCHAR(128) NOT NULL,
          status VARCHAR(32) NOT NULL,
          version VARCHAR(32) NOT NULL,
          environment VARCHAR(32) NOT NULL,
          last_health_check TIMESTAMPTZ DEFAULT NOW(),
          uptime_seconds BIGINT DEFAULT 0,
          latency_ms REAL DEFAULT 0,
          cpu_percent REAL DEFAULT 0,
          memory_mb REAL DEFAULT 0,
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS deployments (
          id VARCHAR(64) PRIMARY KEY,
          version VARCHAR(32) NOT NULL,
          environment VARCHAR(32) NOT NULL,
          commit_sha VARCHAR(64) NOT NULL,
          status VARCHAR(32) NOT NULL,
          initiated_by VARCHAR(64) NOT NULL,
          deployed_at TIMESTAMPTZ DEFAULT NOW(),
          duration_seconds INT DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS health_checks (
          id SERIAL PRIMARY KEY,
          service_id VARCHAR(64) NOT NULL,
          status VARCHAR(32) NOT NULL,
          latency_ms REAL NOT NULL,
          details JSONB,
          checked_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS system_events (
          id SERIAL PRIMARY KEY,
          event_type VARCHAR(64) NOT NULL,
          level VARCHAR(16) NOT NULL,
          message TEXT NOT NULL,
          metadata JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // Seed initial data if tables are empty
      const servicesCount = await client.query('SELECT COUNT(*) FROM services');
      if (parseInt(servicesCount.rows[0].count, 10) === 0) {
        await client.query(`
          INSERT INTO services (id, name, status, version, environment, latency_ms, cpu_percent, memory_mb) VALUES
          ('frontend', 'AetherGrid Web UI', 'healthy', '1.0.0', $1, 14.2, 8.4, 142.5),
          ('backend-api', 'AetherGrid Core API', 'healthy', '1.0.0', $1, 4.1, 12.1, 186.2),
          ('database', 'Amazon RDS PostgreSQL', 'healthy', '15.4', $1, 1.8, 15.0, 512.0)
        `, [config.environment]);
      }

      const deploymentsCount = await client.query('SELECT COUNT(*) FROM deployments');
      if (parseInt(deploymentsCount.rows[0].count, 10) === 0) {
        await client.query(`
          INSERT INTO deployments (id, version, environment, commit_sha, status, initiated_by, deployed_at, duration_seconds) VALUES
          ('dep-9a4f21', 'v1.0.0', $1, '7a8f9c2', 'success', 'GitHub Actions (workflow #42)', NOW() - INTERVAL '2 hours', 145),
          ('dep-8b3e10', 'v0.9.8', $1, '4d2e8b1', 'success', 'GitHub Actions (workflow #38)', NOW() - INTERVAL '1 day', 152),
          ('dep-7c2d09', 'v0.9.7', $1, '1a9f0e4', 'success', 'GitHub Actions (workflow #35)', NOW() - INTERVAL '3 days', 160)
        `, [config.environment]);
      }

      console.log('[Database] Schema verified and initial seed records established successfully.');
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error('[Database] Initialization error:', err.message);
  }
}
