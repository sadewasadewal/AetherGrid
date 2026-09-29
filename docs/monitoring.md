# AetherGrid — Monitoring & Incident Response Runbook

This runbook guides engineers through monitoring telemetry, alarms, and responding to operational incidents.

---

## 1. CloudWatch Observability Suite

AetherGrid configures 4 primary metric alarms:

| Alarm Name | Metric | Threshold | Evaluation Period | Action |
|---|---|---|---|---|
| `ecs-cpu-high` | `CPUUtilization` | >= 80% | 2 consecutive (4 min) | Send SNS Alert |
| `ecs-memory-high` | `MemoryUtilization` | >= 80% | 2 consecutive (4 min) | Send SNS Alert |
| `alb-5xx-errors` | `HTTPCode_Target_5XX_Count` | > 5 | 1 period (5 min) | Send SNS Alert |
| `unhealthy-hosts` | `UnHealthyHostCount` | >= 1 | 2 consecutive (2 min) | Send SNS Alert |

---

## 2. Incident Triage Runbook

### Scenario A: Unhealthy Host Alarm (`unhealthy-hosts`)

1. **Check ALB Target Group Health:**
   ```bash
   aws elbv2 describe-target-health \
     --target-group-arn <TARGET_GROUP_ARN> \
     --region us-east-1
   ```
2. **Inspect Container CloudWatch Logs:**
   Navigate to `/ecs/aethergrid-dev` in CloudWatch Log Groups or run via AWS CLI:
   ```bash
   aws logs tail /ecs/aethergrid-dev --since 15m --follow
   ```
3. **Verify Database Connectivity:**
   Confirm whether the error stems from database pool exhaustion or credentials mismatch by testing `/api/health` response.

---

### Scenario B: High CPU / Memory Exhaustion

1. **Verify Container Insights:**
   Examine ECS Cluster metrics in the AWS CloudWatch Console under **Container Insights**.
2. **Horizontal Scaling:**
   If sustained traffic causes load:
   ```bash
   aws ecs update-service \
     --cluster aethergrid-dev-cluster \
     --service aethergrid-dev-backend-svc \
     --desired-count 3
   ```
3. **Analyze Node.js Event Loop & Memory Profiling:**
   Review heap metrics in the AetherGrid Control Plane dashboard.
