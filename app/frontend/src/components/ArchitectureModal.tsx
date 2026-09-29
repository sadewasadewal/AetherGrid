'use client';

import React from 'react';
import { X, ShieldCheck, ArrowRight, Server, Database, Cloud, Layers, Terminal } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArchitectureModal({ isOpen, onClose }: ArchitectureModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>AetherGrid End-to-End Cloud Architecture</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Production Grade AWS Reference Design (Provisioned via Terraform)
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Diagram Flow Box */}
        <div style={{ background: '#090d15', border: '1px solid var(--border-accent)', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', textAlign: 'center' }}>
            
            <div style={{ flex: '1', minWidth: '110px', background: 'var(--bg-card)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Source Code</div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff', marginTop: '0.2rem' }}>GitHub</div>
              <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>main branch</div>
            </div>

            <ArrowRight size={16} color="var(--text-muted)" />

            <div style={{ flex: '1', minWidth: '120px', background: 'var(--bg-card)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CI / Security</div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff', marginTop: '0.2rem' }}>Actions OIDC</div>
              <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)' }}>Trivy + Tests</div>
            </div>

            <ArrowRight size={16} color="var(--text-muted)" />

            <div style={{ flex: '1', minWidth: '120px', background: 'var(--bg-card)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Artifact Registry</div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff', marginTop: '0.2rem' }}>Amazon ECR</div>
              <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--accent-blue)' }}>AES-256 / SHA</div>
            </div>

            <ArrowRight size={16} color="var(--text-muted)" />

            <div style={{ flex: '1', minWidth: '130px', background: 'var(--bg-card)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ingress & Routing</div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff', marginTop: '0.2rem' }}>AWS ALB</div>
              <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--accent-amber)' }}>Public Subnet</div>
            </div>

            <ArrowRight size={16} color="var(--text-muted)" />

            <div style={{ flex: '1', minWidth: '140px', background: 'var(--bg-card)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Microservices</div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff', marginTop: '0.2rem' }}>ECS Fargate</div>
              <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>Private Subnet</div>
            </div>

            <ArrowRight size={16} color="var(--text-muted)" />

            <div style={{ flex: '1', minWidth: '120px', background: 'var(--bg-card)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Isolated Storage</div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff', marginTop: '0.2rem' }}>RDS PostgreSQL</div>
              <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)' }}>Zero Public IP</div>
            </div>
          </div>
        </div>

        {/* Deep Dive Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', fontSize: '0.8rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '0.4rem' }}>
              <ShieldCheck size={15} /> VPC Network Isolation
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Two Availability Zones (AZs) spanning public subnets for ALB and private subnets for ECS tasks & RDS. No direct internet ingress to the database.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--accent-blue)', marginBottom: '0.4rem' }}>
              <Server size={15} /> Serverless Fargate Compute
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              ECS tasks run as non-root users inside distroless / alpine containers with explicit memory and CPU constraints, logging directly to CloudWatch.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--accent-emerald)', marginBottom: '0.4rem' }}>
              <Database size={15} /> Least-Privilege IAM & Secrets
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Zero hardcoded AWS credentials in CI/CD. GitHub Actions connects using OpenID Connect (OIDC) with IAM roles assuming temporary STS tokens.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
          <button onClick={onClose} className="btn-primary">
            Close Architecture Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
