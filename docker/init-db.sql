-- AetherGrid Database Schema Initialization

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

-- Seed initial services
INSERT INTO services (id, name, status, version, environment, latency_ms, cpu_percent, memory_mb) VALUES
('frontend', 'AetherGrid Web UI', 'healthy', '1.0.0', 'production', 14.2, 6.8, 142.5),
('backend-api', 'AetherGrid Core API', 'healthy', '1.0.0', 'production', 3.8, 11.2, 186.2),
('database', 'Amazon RDS PostgreSQL', 'healthy', '15.4', 'production', 1.8, 15.0, 512.0)
ON CONFLICT (id) DO NOTHING;

-- Seed initial deployments
INSERT INTO deployments (id, version, environment, commit_sha, status, initiated_by, deployed_at, duration_seconds) VALUES
('dep-9a4f21', 'v1.0.0', 'production', '7a8f9c2', 'success', 'GitHub Actions (workflow #42)', NOW() - INTERVAL '2 hours', 145),
('dep-8b3e10', 'v0.9.8', 'production', '4d2e8b1', 'success', 'GitHub Actions (workflow #38)', NOW() - INTERVAL '1 day', 152),
('dep-7c2d09', 'v0.9.7', 'production', '1a9f0e4', 'success', 'GitHub Actions (workflow #35)', NOW() - INTERVAL '3 days', 160)
ON CONFLICT (id) DO NOTHING;

-- Seed system events
INSERT INTO system_events (event_type, level, message, metadata) VALUES
('DEPLOYMENT_COMPLETE', 'info', 'AetherGrid v1.0.0 successfully deployed to AWS ECS Fargate', '{"region": "us-east-1", "cluster": "aethergrid-ecs-cluster"}'),
('HEALTHCHECK_PASS', 'info', 'ALB Target Group target health checks all green', '{"targets": 2, "healthy": 2}'),
('SECURITY_AUDIT', 'info', 'ECR Vulnerability Scan passed: 0 critical, 0 high', '{"scanner": "AWS Clair/Trivy"}')
ON CONFLICT DO NOTHING;
