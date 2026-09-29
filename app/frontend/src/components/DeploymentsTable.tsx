'use client';

import React from 'react';
import { GitPullRequest, CheckCircle2, XCircle, Clock, ArrowUpRight } from 'lucide-react';
import { DeploymentItem } from '../types';

interface DeploymentsTableProps {
  deployments: DeploymentItem[];
  dataSource?: string;
}

export default function DeploymentsTable({ deployments, dataSource }: DeploymentsTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return (
          <span className="badge badge-emerald">
            <CheckCircle2 size={12} /> SUCCESS
          </span>
        );
      case 'failed':
        return (
          <span className="badge badge-rose">
            <XCircle size={12} /> FAILED
          </span>
        );
      default:
        return (
          <span className="badge badge-amber">
            <Clock size={12} /> {status.toUpperCase()}
          </span>
        );
    }
  };

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div className="card-header">
        <span className="card-title">
          <GitPullRequest size={16} color="var(--accent-cyan)" /> Continuous Deployment Audit Log
        </span>
        <span className="badge badge-slate font-mono">
          Engine: GitHub Actions OIDC + ECR
        </span>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Deployment ID</th>
              <th>Release</th>
              <th>Environment</th>
              <th>Commit SHA</th>
              <th>Triggered By</th>
              <th>Duration</th>
              <th>Deployed At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {deployments.map((dep) => (
              <tr key={dep.id}>
                <td className="font-mono" style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>
                  {dep.id}
                </td>
                <td className="font-mono" style={{ fontWeight: 600 }}>
                  {dep.version}
                </td>
                <td>
                  <span className="badge badge-slate font-mono" style={{ textTransform: 'uppercase' }}>
                    {dep.environment}
                  </span>
                </td>
                <td className="font-mono" style={{ color: 'var(--text-muted)' }}>
                  <code>{dep.commit_sha}</code>
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {dep.initiated_by}
                </td>
                <td className="font-mono" style={{ fontSize: '0.8rem' }}>
                  {dep.duration_seconds}s
                </td>
                <td className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(dep.deployed_at).toLocaleString()}
                </td>
                <td>{getStatusBadge(dep.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
