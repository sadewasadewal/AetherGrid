# AetherGrid — Architecture Documentation

**Tagline:** Engineering the Invisible.

---

## 1. Executive Summary

AetherGrid is an enterprise-grade cloud control plane designed to illustrate production DevOps practices: Infrastructure as Code (Terraform), containerization (Docker), zero-trust networking (AWS VPC), serverless container orchestration (ECS Fargate), secure database management (Amazon RDS PostgreSQL), and automated CI/CD (GitHub Actions with OIDC).

---

## 2. High-Level Architecture Diagram

```mermaid
flowchart TD
    subgraph Developer_Environment["Developer Environment"]
        Dev["Cloud Engineer / Developer"] -->|"git push"| GH["GitHub Repository"]
    end

    subgraph CI_CD["CI/CD Automation (GitHub Actions)"]
        GH -->|"Trigger"| GHA["GitHub Actions Runner"]
        GHA -->|"Lint & Test"| TestPass["Unit & Integration Tests"]
        TestPass -->|"Multi-Stage Build"| DockerBuild["Docker Build"]
        DockerBuild -->|"Trivy Scan"| SecurityScan["Vulnerability Scan"]
        SecurityScan -->|"OIDC STS Token"| ECR["Amazon ECR"]
    end

    subgraph AWS_Cloud["Amazon Web Services (us-east-1)"]
        subgraph VPC["Amazon VPC (10.0.0.0/16)"]
            subgraph Public_Subnets["Public Subnets (AZ-a / AZ-b)"]
                IGW["Internet Gateway"] <--> ALB["Application Load Balancer"]
                NAT["NAT Gateway (Single/Multi)"]
            end

            subgraph Private_App_Subnets["Private Subnets: ECS Tasks"]
                ALB -->|"HTTP /api/* :4000"| ECS_BE["ECS Fargate: Backend API"]
                ALB -->|"HTTP /* :3000"| ECS_FE["ECS Fargate: Frontend UI"]
                ECS_BE -->|"Secrets Ingestion"| SM["AWS Secrets Manager"]
            end

            subgraph Private_DB_Subnets["Private Subnets: Data Tier"]
                ECS_BE -->|"PostgreSQL :5432"| RDS["Amazon RDS PostgreSQL 15"]
            end
        end

        subgraph Observability["Observability Tier"]
            ECS_BE -->|"Logs & Metrics"| CW["Amazon CloudWatch Logs"]
            ECS_FE -->|"Logs & Metrics"| CW
            ALB -->|"Telemetry"| CW
            CW -->|"Alarms"| SNS["Amazon SNS Alerts"]
        end
    end
```

---

## 3. Network Architecture & Subnet Planning

AetherGrid provisions a dedicated VPC with CIDR `10.0.0.0/16` across two Availability Zones (`us-east-1a` and `us-east-1b`):

| Subnet Purpose | Availability Zone | CIDR Block | Route Target | Exposed to Internet |
|---|---|---|---|---|
| Public Subnet 1 | `us-east-1a` | `10.0.1.0/24` | Internet Gateway (`igw`) | Yes (ALB only) |
| Public Subnet 2 | `us-east-1b` | `10.0.2.0/24` | Internet Gateway (`igw`) | Yes (ALB only) |
| Private App 1 | `us-east-1a` | `10.0.11.0/24` | NAT Gateway (`nat`) | No (Outbound only) |
| Private App 2 | `us-east-1b` | `10.0.12.0/24` | NAT Gateway (`nat`) | No (Outbound only) |
| Private DB 1 | `us-east-1a` | `10.0.21.0/24` | Isolated (Local VPC only) | No (Strict Isolation) |
| Private DB 2 | `us-east-1b` | `10.0.22.0/24` | Isolated (Local VPC only) | No (Strict Isolation) |

---

## 4. Multi-Layer Security Architecture

### Ingress & Security Group Isolation
1. **ALB Security Group (`alb-sg`):** Inbound ports 80/443 open to the public internet (`0.0.0.0/0`).
2. **ECS Security Group (`ecs-tasks-sg`):** Inbound ports 4000 (backend) and 3000 (frontend) allow traffic **strictly** from `alb-sg`. Direct internet requests to container IPs are dropped at the ENI level.
3. **RDS Security Group (`rds-sg`):** Inbound port 5432 allows connections **strictly** from `ecs-tasks-sg`. No public IP is assigned to RDS.

### Health Check Chain
```mermaid
graph TD
    Client["Client / User"] --> ALB["ALB Ingress"]
    ALB -->|"Target Group Probe: /api/health"| ECS["ECS Fargate Container"]
    ECS -->|"Docker HEALTHCHECK: wget"| APP["Express API Process"]
    APP -->|"SELECT 1"| DB["Amazon RDS PostgreSQL"]
```
