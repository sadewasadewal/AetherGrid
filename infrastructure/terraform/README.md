# AetherGrid — Terraform Infrastructure as Code (IaC)

This directory contains the production-grade, modular Terraform architecture for provisioning and managing AetherGrid on Amazon Web Services (AWS).

---

## 1. Modular Directory Layout

```
infrastructure/terraform/
├── modules/
│   ├── networking/    # VPC (10.0.0.0/16), 2 AZs, public/private subnets, IGW, NAT GW
│   ├── security/      # Tiered Security Groups (ALB -> ECS Tasks -> RDS Postgres)
│   ├── ecr/           # Amazon ECR registries with scan-on-push & lifecycle rules
│   ├── alb/           # Application Load Balancer, target groups, path routing (/api/*)
│   ├── rds/           # Amazon RDS PostgreSQL 15, private subnet group, Secrets Manager
│   ├── ecs/           # ECS Cluster, Fargate services, IAM execution & task roles
│   └── monitoring/    # CloudWatch Log Groups, CPU/Memory/5xx Metric Alarms, SNS
│
└── environments/
    ├── dev/           # Cost-optimized single-instance environment
    └── prod/          # High-availability multi-AZ environment
```

---

## 2. Prerequisites

- [Terraform CLI](https://developer.hashicorp.com/terraform/downloads) >= 1.5.0
- [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) configured with appropriate IAM permissions (`aws configure`)
- Docker (for building and tagging container images prior to deployment)

---

## 3. Provisioning Step-by-Step

### Step 1: Navigate to the Target Environment

```bash
cd infrastructure/terraform/environments/dev
```

### Step 2: Initialize Terraform Modules & Providers

```bash
terraform init
```

### Step 3: Review the Execution Plan

```bash
cp terraform.tfvars.example terraform.tfvars
terraform plan -out=tfplan
```

### Step 4: Apply Infrastructure

```bash
terraform apply tfplan
```

Upon completion, Terraform outputs:
- `alb_dns_name`: Public HTTP endpoint
- `backend_ecr_url`: Target container registry for backend
- `frontend_ecr_url`: Target container registry for frontend
- `rds_endpoint`: Internal database hostname

---

## 4. Decommissioning & Cost Destruction

To avoid ongoing AWS charges after evaluation:

```bash
cd infrastructure/terraform/environments/dev
terraform destroy -auto-approve
```

> **Note:** S3 buckets and Secrets Manager secrets have immediate destruction configurations enabled for dev environments to ensure zero lingering costs.
