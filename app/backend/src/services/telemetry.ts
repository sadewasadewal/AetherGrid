import os from 'os';
import { config } from '../config/index.js';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  service: string;
  message: string;
  metadata?: Record<string, any>;
}

class TelemetryService {
  private startTime: number = Date.now();
  private requestCount: number = 0;
  private errorCount: number = 0;
  private logRingBuffer: LogEntry[] = [];
  private maxLogs: number = 100;

  constructor() {
    this.addLog('info', 'telemetry', `AetherGrid telemetry initialized for environment: ${config.environment}`);
  }

  public recordRequest(isError: boolean = false) {
    this.requestCount++;
    if (isError) {
      this.errorCount++;
    }
  }

  public addLog(level: 'info' | 'warn' | 'error' | 'debug', service: string, message: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      level,
      service,
      message,
      metadata,
    };
    this.logRingBuffer.unshift(entry);
    if (this.logRingBuffer.length > this.maxLogs) {
      this.logRingBuffer.pop();
    }
  }

  public getLogs(limit: number = 50, level?: string): LogEntry[] {
    let logs = this.logRingBuffer;
    if (level) {
      logs = logs.filter(l => l.level.toLowerCase() === level.toLowerCase());
    }
    return logs.slice(0, limit);
  }

  public getMetrics() {
    const memoryUsage = process.memoryUsage();
    const systemMemory = {
      total: os.totalmem(),
      free: os.freemem(),
      usedPercent: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100 * 10) / 10
    };

    const cpus = os.cpus();
    const cpuModel = cpus.length > 0 ? cpus[0].model : 'Unknown';
    const cpuCount = cpus.length;

    const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const errorRate = this.requestCount > 0
      ? Math.round((this.errorCount / this.requestCount) * 10000) / 100
      : 0.0;

    return {
      runtime: {
        uptimeSeconds,
        requestCount: this.requestCount,
        errorCount: this.errorCount,
        errorRatePercent: errorRate,
        processMemoryMb: Math.round(memoryUsage.heapUsed / 1024 / 1024 * 10) / 10,
        processRssMb: Math.round(memoryUsage.rss / 1024 / 1024 * 10) / 10,
      },
      host: {
        platform: os.platform(),
        arch: os.arch(),
        hostname: os.hostname(),
        loadAverage: os.loadavg(),
        systemMemory,
        cpuCount,
        cpuModel,
      },
      aws: {
        region: config.region,
        environment: config.environment,
        ecsTaskArn: process.env.ECS_CONTAINER_METADATA_URI_V4 ? 'arn:aws:ecs:fargate-task' : 'local-docker',
        isFargate: Boolean(process.env.ECS_CONTAINER_METADATA_URI_V4),
      },
      timestamp: new Date().toISOString()
    };
  }

  public getSystemInfo() {
    return {
      application: 'AetherGrid Control Plane',
      tagline: 'Engineering the Invisible',
      version: config.appVersion,
      commitSha: config.commitSha,
      environment: config.environment,
      runtime: {
        name: 'Node.js',
        version: process.version,
        platform: process.platform,
        architecture: process.arch,
      },
      container: {
        isContainerized: process.env.CONTAINERIZED === 'true' || Boolean(process.env.ECS_CONTAINER_METADATA_URI_V4),
        containerId: process.env.HOSTNAME || os.hostname(),
        orchestrator: process.env.ECS_CONTAINER_METADATA_URI_V4 ? 'AWS ECS Fargate' : 'Docker Compose / Local',
      },
      aws: {
        region: config.region,
        infrastructure: {
          vpc: 'vpc-aethergrid (10.0.0.0/16)',
          orchestration: 'ECS Fargate (Linux/ARM64 or x86_64)',
          loadBalancer: 'Application Load Balancer (dual-az)',
          database: 'Amazon RDS PostgreSQL 15 (db.t4g.micro)',
          storage: 'Amazon ECR (AES-256 encrypted)',
          monitoring: 'AWS CloudWatch (Logs + Metric Alarms)'
        }
      },
      timestamp: new Date().toISOString(),
    };
  }
}

export const telemetry = new TelemetryService();
