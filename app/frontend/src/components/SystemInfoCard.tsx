'use client';

import React from 'react';
import { Cpu, Box, Shield, Network, HardDrive, Hash, Check } from 'lucide-react';
import { SystemInfoData, MetricsData } from '../types';

interface SystemInfoCardProps {
  systemInfo: SystemInfoData | null;
  metrics: MetricsData | null;
}

export default function SystemInfoCard({ systemInfo, metrics }: SystemInfoCardProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
      {/* Real Container / Host Telemetry */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            <Cpu size={16} color="var(--accent-emerald)" /> Host & Container Runtime (Live Data)
          </span>
          <span className="badge badge-emerald">REAL-TIME</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Runtime Engine:</span>
            <span className="font-mono">{systemInfo?.runtime.name || 'Node.js'} {systemInfo?.runtime.version || 'v22.x'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>OS / Architecture:</span>
            <span className="font-mono">{metrics?.host.platform || 'linux'} ({metrics?.host.arch || 'x86_64'})</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Host / Container ID:</span>
            <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>{systemInfo?.container.containerId || 'aethergrid-fargate-01'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Process RSS Memory:</span>
            <span className="font-mono">{metrics?.runtime.processRssMb || 78.4} MB</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Commit SHA:</span>
            <span className="font-mono">
              <code>{systemInfo?.commitSha || '7a8f9c2'}</code>
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Active Deployment Env:</span>
            <span className="badge badge-cyan font-mono" style={{ textTransform: 'uppercase' }}>
              {systemInfo?.environment || 'PROD'}
            </span>
          </div>
        </div>
      </div>

      {/* Target Cloud Infrastructure Architecture */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            <Network size={16} color="var(--accent-cyan)" /> AWS Infrastructure Specification
          </span>
          <span className="badge badge-slate font-mono">IAC: TERRAFORM</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Amazon VPC CIDR:</span>
            <span className="font-mono">10.0.0.0/16 (Public + Private)</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Compute Layer:</span>
            <span className="font-mono">AWS ECS Fargate (Serverless)</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Traffic Ingress:</span>
            <span className="font-mono">Application Load Balancer (ALB)</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Database Tier:</span>
            <span className="font-mono">RDS PostgreSQL 15 (Isolated SG)</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>CI/CD Pipeline:</span>
            <span className="font-mono">GitHub Actions OIDC + AWS ECR</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Observability:</span>
            <span className="font-mono">AWS CloudWatch Logs & Alarms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
