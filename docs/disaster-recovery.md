# AetherGrid — Disaster Recovery & Continuity Plan

---

## 1. Objectives & Metrics

- **Recovery Point Objective (RPO):** < 5 minutes (via automated RDS point-in-time recovery and continuous WAL archiving).
- **Recovery Time Objective (RTO):** < 15 minutes (via Terraform automated infrastructure provisioning and multi-AZ standby failover).

---

## 2. RDS PostgreSQL Recovery Procedures

### Point-in-Time Restore (PITR)
Amazon RDS captures daily automated snapshots and continuous transaction logs:

```bash
# Restore database to a specific timestamp
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier aethergrid-prod-db \
  --target-db-instance-identifier aethergrid-prod-db-restored \
  --restore-time "2026-09-29T10:00:00Z" \
  --db-subnet-group-name aethergrid-prod-db-subnet-group \
  --vpc-security-group-ids <RDS_SECURITY_GROUP_ID>
```

---

## 3. Total Region Loss Failover (Multi-Region Plan)

In the event of an entire AWS Region failure (e.g. `us-east-1`):
1. **Infrastructure Re-provisioning:** Deploy the Terraform configuration to secondary region `us-west-2` via:
   ```bash
   terraform apply -var="aws_region=us-west-2"
   ```
2. **ECR Cross-Region Replication:** ECR repository replication policy replicates tagged images automatically to `us-west-2`.
3. **Route 53 DNS Failover:** Update DNS Alias records or utilize Route 53 Health Checks with automated failover routing policies.
