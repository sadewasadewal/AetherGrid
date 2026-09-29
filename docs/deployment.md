# AetherGrid — Deployment & CI/CD Guide

This guide details the CI/CD pipeline, OpenID Connect (OIDC) AWS authentication, and zero-downtime rolling deployment strategies.

---

## 1. CI/CD Architecture

AetherGrid leverages GitHub Actions to implement trunk-based continuous integration and deployment.

### Authentication: GitHub Actions OIDC
Instead of generating long-lived AWS IAM access keys (which can leak), AetherGrid utilizes AWS OpenID Connect (OIDC) identity federation:

1. GitHub Actions runner requests a signed JSON Web Token (JWT) from GitHub's OIDC provider (`token.actions.githubusercontent.com`).
2. The runner invokes `sts:AssumeRoleWithWebIdentity` on AWS STS.
3. AWS validates the token signature, audience (`sts.amazonaws.com`), and repository claim (`repo:username/AetherGrid:*`).
4. AWS STS issues short-lived temporary security credentials (valid for 1 hour).

---

## 2. GitHub Actions Workflows

| Workflow | File | Trigger | Purpose |
|---|---|---|---|
| **CI** | `.github/workflows/ci.yml` | PR & push to `main` | Linting, TypeScript typechecking, unit tests, Next.js build |
| **Docker** | `.github/workflows/docker.yml` | Push to `main` | Multi-stage Docker build, Trivy security CVE scan |
| **Deploy** | `.github/workflows/deploy.yml` | Git tag (`v*`) or manual dispatch | OIDC login, ECR push, ECS task definition update, rollout & health check |

---

## 3. Rolling Deployments & Stability

ECS Fargate executes a zero-downtime rolling update:
- `minimum_healthy_percent = 100`
- `maximum_percent = 200`

During deployment:
1. New container tasks are launched alongside the old tasks.
2. The ALB initiates health check probes (`/api/health`) against the new tasks.
3. Once new tasks report `healthy`, ALB begins routing traffic to them.
4. Old tasks receive a `SIGTERM` signal and are granted a 30-second draining period to finish in-flight requests.
5. Old tasks terminate gracefully.

---

## 4. Rollback Strategy

If the post-deployment health check probe fails:
1. The GitHub Actions workflow returns exit code `1` and fails.
2. ECS detects task failure and automatically rolls back to the prior stable task definition revision.
3. CloudWatch alarm `unhealthy-hosts` triggers an immediate SNS notification to on-call engineers.
