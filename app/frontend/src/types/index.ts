export interface HealthData {
  status: 'healthy' | 'degraded' | 'unhealthy';
  service: string;
  version: string;
  environment: string;
  timestamp: string;
  uptimeSeconds: number;
  database: {
    status: 'healthy' | 'unreachable' | 'degraded';
    latencyMs: number;
    error?: string;
  };
  orchestration: {
    type: string;
    region: string;
  };
}

export interface ServiceItem {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  environment: string;
  last_health_check: string;
  uptime_seconds: number;
  latency_ms: number;
  cpu_percent: number;
  memory_mb: number;
}

export interface DeploymentItem {
  id: string;
  version: string;
  environment: string;
  commit_sha: string;
  status: 'success' | 'in_progress' | 'failed' | 'rolled_back';
  initiated_by: string;
  deployed_at: string;
  duration_seconds: number;
}

export interface LogItem {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  service: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface MetricsData {
  runtime: {
    uptimeSeconds: number;
    requestCount: number;
    errorCount: number;
    errorRatePercent: number;
    processMemoryMb: number;
    processRssMb: number;
  };
  host: {
    platform: string;
    arch: string;
    hostname: string;
    loadAverage: number[];
    systemMemory: {
      total: number;
      free: number;
      usedPercent: number;
    };
    cpuCount: number;
    cpuModel: string;
  };
  aws: {
    region: string;
    environment: string;
    ecsTaskArn: string;
    isFargate: boolean;
  };
  timestamp: string;
}

export interface SystemInfoData {
  application: string;
  tagline: string;
  version: string;
  commitSha: string;
  environment: string;
  runtime: {
    name: string;
    version: string;
    platform: string;
    architecture: string;
  };
  container: {
    isContainerized: boolean;
    containerId: string;
    orchestrator: string;
  };
  aws: {
    region: string;
    infrastructure: {
      vpc: string;
      orchestration: string;
      loadBalancer: string;
      database: string;
      storage: string;
      monitoring: string;
    };
  };
  timestamp: string;
}
