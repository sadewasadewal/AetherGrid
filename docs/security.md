# AetherGrid — Security & Compliance Architecture

AetherGrid enforces Defense-in-Depth principles across all architectural tiers.

---

## 1. Zero Trust Network Segmentation

- **Public Subnets:** Contain only the Application Load Balancer. No databases or application containers exist here.
- **Private Application Subnets:** Contain ECS Fargate containers. Containers do not possess public IPv4 addresses; outbound egress is routed via NAT Gateway.
- **Private Database Subnets:** Contain Amazon RDS PostgreSQL. Completely isolated route table without internet gateways or NAT routes.

---

## 2. Secrets Management & Credential Hygiene

- **Zero Hardcoded Secrets:** No database passwords, tokens, or private keys are stored in source code or `.env` files committed to Git.
- **AWS Secrets Manager:** Automatically stores RDS credentials with KMS encryption (`aws/secretsmanager`).
- **Dynamic ECS Secrets Injection:** The ECS Task Definition references secrets directly from Secrets Manager (`valueFrom: arn:aws:...:secret:password::`), injecting them as runtime environment variables into memory only.

---

## 3. Container Security Hardening

- **Non-Root Execution:** All Docker containers run as unprivileged users (`USER node` in backend, `USER nextjs` in frontend).
- **Read-Only / Minimal Base Images:** Multi-stage builds utilize Alpine Linux minimal base images to minimize CVE attack surfaces.
- **Vulnerability Scanning:**
  - Automated Trivy vulnerability scans run on every push in `.github/workflows/docker.yml`.
  - Amazon ECR `scan_on_push = true` inspects images upon upload.

---

## 4. IAM Least Privilege

- Separate **Task Execution Role** (grants ECS agent rights to fetch ECR images and send logs) from **Task Role** (grants runtime application containers rights to execute business logic).
- GitHub Actions uses **OIDC federated role assumptions** with short-lived STS tokens instead of static IAM user credentials.
