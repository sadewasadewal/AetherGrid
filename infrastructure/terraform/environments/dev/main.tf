# ========================================================
# AetherGrid — Development Infrastructure Root
# ========================================================

# 1. Networking Module (VPC, Subnets across 2 AZs, Route Tables)
module "networking" {
  source = "../../modules/networking"

  project_name       = var.project_name
  environment        = var.environment
  vpc_cidr           = var.vpc_cidr
  availability_zones = ["${var.aws_region}a", "${var.aws_region}b"]
  enable_nat_gateway = var.enable_nat_gateway
  single_nat_gateway = true
}

# 2. Security Module (Least-Privilege Tiered Security Groups)
module "security" {
  source = "../../modules/security"

  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.networking.vpc_id
}

# 3. ECR Module (Container Registries with Vulnerability Scanning)
module "ecr" {
  source = "../../modules/ecr"

  project_name = var.project_name
  environment  = var.environment
}

# 4. ALB Module (Public Load Balancer & Health Check Ingress)
module "alb" {
  source = "../../modules/alb"

  project_name      = var.project_name
  environment       = var.environment
  vpc_id            = module.networking.vpc_id
  public_subnet_ids = module.networking.public_subnet_ids
  security_group_id = module.security.alb_security_group_id
  certificate_arn   = var.certificate_arn
}

# 5. RDS Module (PostgreSQL 15 Isolated Database)
module "rds" {
  source = "../../modules/rds"

  project_name          = var.project_name
  environment           = var.environment
  private_db_subnet_ids = module.networking.private_db_subnet_ids
  security_group_id     = module.security.rds_security_group_id
  instance_class        = "db.t4g.micro"
  multi_az              = false
}

# 6. ECS Module (Fargate Serverless Microservices Orchestration)
module "ecs" {
  source = "../../modules/ecs"

  project_name               = var.project_name
  environment                = var.environment
  aws_region                 = var.aws_region
  private_app_subnet_ids     = module.networking.private_app_subnet_ids
  security_group_id          = module.security.ecs_tasks_security_group_id
  backend_image              = var.backend_image != "public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest" ? var.backend_image : module.ecr.backend_repository_url
  frontend_image             = var.frontend_image != "public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest" ? var.frontend_image : module.ecr.frontend_repository_url
  backend_target_group_arn   = module.alb.backend_target_group_arn
  frontend_target_group_arn  = module.alb.frontend_target_group_arn
  db_secret_arn              = module.rds.db_credentials_secret_arn
  db_address                 = module.rds.db_address
  db_name                    = module.rds.db_name
  desired_count              = 1
}

# 7. Monitoring Module (CloudWatch Logs & Metric Alarms)
module "monitoring" {
  source = "../../modules/monitoring"

  project_name          = var.project_name
  environment           = var.environment
  ecs_cluster_name      = module.ecs.cluster_name
  backend_service_name  = module.ecs.backend_service_name
  alb_arn_suffix        = module.alb.alb_id
  backend_tg_arn_suffix = module.alb.backend_target_group_arn_suffix
}
