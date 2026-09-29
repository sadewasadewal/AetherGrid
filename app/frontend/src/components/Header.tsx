'use client';

import React from 'react';
import { Cloud, RefreshCw, Cpu, GitCommit, Network, ShieldCheck } from 'lucide-react';
import { HealthData } from '../types';

interface HeaderProps {
  health: HealthData | null;
  loading: boolean;
  onRefresh: () => void;
  onOpenArchitecture: () => void;
}

export default function Header({ health, loading, onRefresh, onOpenArchitecture }: HeaderProps) {
  const isHealthy = health?.status === 'healthy';

  return (
    <header className="header">
      <div className="brand">
        <div className="brand-icon">
          <Cloud size={22} />
        </div>
        <div>
          <div className="brand-title">AetherGrid</div>
          <div className="brand-tagline">Engineering the Invisible</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {/* Status indicator */}
        <div className={`badge ${isHealthy ? 'badge-emerald' : 'badge-amber'}`}>
          <span className={`status-dot ${isHealthy ? 'emerald' : 'amber'}`}></span>
          {health?.status ? health.status.toUpperCase() : 'CONNECTING'}
        </div>

        {/* Region */}
        <div className="badge badge-cyan font-mono">
          <Cpu size={13} style={{ marginRight: '4px' }} />
          {health?.orchestration.region || 'us-east-1'}
        </div>

        {/* Commit SHA */}
        <div className="badge badge-slate font-mono">
          <GitCommit size={13} style={{ marginRight: '4px' }} />
          v{health?.version || '1.0.0'}
        </div>

        {/* Architecture Modal Button */}
        <button
          onClick={onOpenArchitecture}
          className="btn-primary"
          title="Inspect AWS Cloud Architecture"
        >
          <Network size={14} />
          <span>Cloud Topology</span>
        </button>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="btn-primary"
          title="Refresh Telemetry"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Sync</span>
        </button>
      </div>
    </header>
  );
}
