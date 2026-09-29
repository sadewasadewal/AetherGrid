import test from 'node:test';
import assert from 'node:assert';
import { telemetry } from '../src/services/telemetry.js';
import { config } from '../src/config/index.js';

test('Telemetry records and calculates metrics accurately', () => {
  telemetry.recordRequest(false);
  telemetry.recordRequest(false);
  telemetry.recordRequest(true);

  const metrics = telemetry.getMetrics();
  assert.ok(metrics.runtime.requestCount >= 3);
  assert.ok(metrics.runtime.errorCount >= 1);
  assert.ok(typeof metrics.runtime.errorRatePercent === 'number');
  assert.ok(metrics.runtime.uptimeSeconds >= 0);
  assert.ok(metrics.aws.region === config.region);
});

test('Telemetry ring buffer records and retrieves logs', () => {
  telemetry.addLog('info', 'test-suite', 'Test log verification message', { traceId: 'trace-123' });
  const logs = telemetry.getLogs(5);
  assert.ok(logs.length > 0);
  const found = logs.find(l => l.message === 'Test log verification message');
  assert.ok(found);
  assert.strictEqual(found?.service, 'test-suite');
  assert.strictEqual(found?.level, 'info');
});

test('System info reports environment, runtime and infrastructure specifications', () => {
  const sys = telemetry.getSystemInfo();
  assert.strictEqual(sys.application, 'AetherGrid Control Plane');
  assert.strictEqual(sys.tagline, 'Engineering the Invisible');
  assert.ok(sys.aws.infrastructure.vpc.includes('10.0.0.0/16'));
  assert.ok(sys.runtime.name === 'Node.js');
});
