variable "project_name" {
  type        = string
  description = "Project name identifier"
  default     = "aethergrid"
}

variable "environment" {
  type        = string
  description = "Deployment environment"
}

variable "ecs_cluster_name" {
  type        = string
  description = "ECS Cluster Name to monitor"
}

variable "backend_service_name" {
  type        = string
  description = "Backend ECS service name"
}

variable "alb_arn_suffix" {
  type        = string
  description = "ALB ARN Suffix for metric dimensioning"
}

variable "backend_tg_arn_suffix" {
  type        = string
  description = "Target Group ARN Suffix for backend"
}

variable "alert_email" {
  type        = string
  description = "Optional email address for CloudWatch alarm notifications"
  default     = ""
}
