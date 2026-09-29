# AetherGrid — Infrastructure as Code (IaC) Architecture

This document outlines the Terraform design principles, module hierarchy, state management, and configuration paradigms implemented in AetherGrid.

---

## 1. Modular Hierarchy

The Terraform codebase adheres to HashiCorp best practices by decoupling infrastructure into modular components:

```
infrastructure/terraform/modules/
├── networking  -> Provisions VPC, IGW, NAT GW, Subnets, and Route Tables
├── security    -> Provisions fine-grained Security Groups for ALB, ECS, and RDS
├── ecr         -> Provisions container registries with lifecycle policies and scan-on-push
├── alb         -> Provisions Application Load Balancer, listeners, and target groups
├── rds         -> Provisions isolated PostgreSQL 15 and Secrets Manager credentials
├── ecs         -> Provisions Fargate cluster, task definitions, and IAM roles
└── monitoring  -> Provisions CloudWatch log groups, metric alarms, and SNS topics
```

---

## 2. Environment Parity

Environments are segregated under `infrastructure/terraform/environments/`:
- **`dev/`:** Tailored for portfolio demos and low cost:
  - Single NAT Gateway (or disabled)
  - `db.t4g.micro` single-AZ PostgreSQL
  - Single ECS task replica per service
  - Skip final snapshot enabled for fast tearing down
- **`prod/`:** Tailored for high availability:
  - Multi-AZ NAT Gateways
  - Multi-AZ RDS standby failover
  - Multiple ECS task replicas per service
  - Deletion protection enabled

---

## 3. Remote State & Locking

For production environments, state should be maintained in remote storage with distributed concurrency locking:

```hcl
terraform {
  backend "s3" {
    bucket         = "aethergrid-terraform-state-prod"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "aethergrid-tf-locks-prod"
    encrypt        = true
  }
}
```

This prevents race conditions during concurrent CI/CD pipeline executions.
