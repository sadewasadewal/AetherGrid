'use client';

import React, { useState } from 'react';
import { Terminal, Filter, Search, Trash2 } from 'lucide-react';
import { LogItem } from '../types';

interface LogsViewerProps {
  logs: LogItem[];
  onClear?: () => void;
}

export default function LogsViewer({ logs, onClear }: LogsViewerProps) {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = filterLevel === 'ALL' || log.level.toUpperCase() === filterLevel;
    const matchesSearch =
      searchQuery === '' ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return 'var(--accent-rose)';
      case 'warn':
        return 'var(--accent-amber)';
      case 'debug':
        return 'var(--text-muted)';
      default:
        return 'var(--accent-cyan)';
    }
  };

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        <span className="card-title">
          <Terminal size={16} color="var(--accent-cyan)" /> Live Container & CloudWatch Ingestion Log
        </span>

        {/* Filter controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '0.2rem 0.5rem' }}>
            <Search size={13} color="var(--text-muted)" style={{ marginRight: '6px' }} />
            <input
              type="text"
              placeholder="Search log stream..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '0.75rem',
                outline: 'none',
                width: '140px'
              }}
            />
          </div>

          {['ALL', 'INFO', 'WARN', 'ERROR'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              style={{
                background: filterLevel === lvl ? 'var(--border-accent)' : 'transparent',
                border: '1px solid var(--border-subtle)',
                color: filterLevel === lvl ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.7rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="terminal-window">
        {filteredLogs.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>
            No logs match current filter criteria.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="terminal-line">
              <span style={{ color: 'var(--text-muted)', minWidth: '150px' }}>
                {new Date(log.timestamp).toISOString().split('T')[1].replace('Z', '')}
              </span>
              <span
                style={{
                  color: getLevelColor(log.level),
                  fontWeight: 600,
                  minWidth: '55px',
                  textTransform: 'uppercase'
                }}
              >
                [{log.level}]
              </span>
              <span style={{ color: 'var(--accent-blue)', minWidth: '85px' }}>
                @{log.service}
              </span>
              <span style={{ color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                {log.message}
                {log.metadata && (
                  <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>
                    {JSON.stringify(log.metadata)}
                  </span>
                )}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
