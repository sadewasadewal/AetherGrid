'use client';

import React from 'react';
import { Layers, Server, Globe, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServicesListProps {
  services: ServiceItem[];
  dataSource?: string;
}

export default function ServicesList({ services, dataSource }: ServicesListProps) {
  const getIcon = (id: string) => {
    switch (id) {
      case 'frontend':
        return <Globe size={16} color="var(--accent-cyan)" />;
      case 'database':
        return <Database size={16} color="var(--accent-blue)" />;
      default:
        return <Server size={16} color="var(--accent-emerald)" />;
    }
  };

  const getBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return (
          <span className="badge badge-emerald">
            <span className="status-dot emerald" /> HEALTHY
          </span>
        );
      case 'degraded':
        return (
          <span className="badge badge-amber">
            <span className="status-dot amber" /> DEGRADED
          </span>
        );
      default:
        return (
          <span className="badge badge-rose">
            <span className="status-dot rose" /> UNHEALTHY
          </span>
        );
    }
  };

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div className="card-header">
        <span className="card-title">
          <Layers size={16} color="var(--accent-cyan)" /> Microservices & Cloud Infrastructure Topology
        </span>
        <span className="badge badge-slate font-mono">
          Source: {dataSource || 'PostgreSQL'}
        </span>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Status</th>
              <th>Version</th>
              <th>Environment</th>
              <th>Latency</th>
              <th>Resource Footprint</th>
              <th>Last Probe</th>
            </tr>
          </thead>
          <tbody>
            {services.map((svc) => (
              <tr key={svc.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600 }}>
                    {getIcon(svc.id)}
                    <div>
                      <div>{svc.name}</div>
                      <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        id: {svc.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{getBadge(svc.status)}</td>
                <td className="font-mono">{svc.version}</td>
                <td>
                  <span className="badge badge-slate font-mono" style={{ textTransform: 'uppercase' }}>
                    {svc.environment}
                  </span>
                </td>
                <td className="font-mono">
                  {svc.latency_ms > 0 ? `${svc.latency_ms.toFixed(1)} ms` : '< 1 ms'}
                </td>
                <td className="font-mono" style={{ fontSize: '0.8rem' }}>
                  {svc.cpu_percent}% CPU • {svc.memory_mb.toFixed(0)} MB
                </td>
                <td className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(svc.last_health_check).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
