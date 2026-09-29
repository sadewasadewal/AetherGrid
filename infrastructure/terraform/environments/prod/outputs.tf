output "alb_dns_name" {
  description = "The public endpoint URL of the Application Load Balancer"
  value       = module.alb.alb_dns_name
}

output "vpc_id" {
  description = "Amazon VPC ID"
  value       = module.networking.vpc_id
}

output "backend_ecr_url" {
  description = "ECR Repository URL for Backend"
  value       = module.ecr.backend_repository_url
}

output "frontend_ecr_url" {
  description = "ECR Repository URL for Frontend"
  value       = module.ecr.frontend_repository_url
}

output "ecs_cluster_name" {
  description = "ECS Cluster Name"
  value       = module.ecs.cluster_name
}

output "rds_endpoint" {
  description = "RDS PostgreSQL connection endpoint"
  value       = module.rds.db_endpoint
}
