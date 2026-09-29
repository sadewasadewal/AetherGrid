variable "project_name" {
  type        = string
  description = "Project name identifier"
  default     = "aethergrid"
}

variable "environment" {
  type        = string
  description = "Deployment environment"
}

variable "aws_region" {
  type        = string
  description = "AWS Region"
  default     = "us-east-1"
}

variable "private_app_subnet_ids" {
  type        = list(string)
  description = "List of private application subnets"
}

variable "security_group_id" {
  type        = string
  description = "Security Group ID for ECS tasks"
}

variable "backend_image" {
  type        = string
  description = "Backend container image URI"
}

variable "frontend_image" {
  type        = string
  description = "Frontend container image URI"
}

variable "backend_target_group_arn" {
  type        = string
  description = "ARN of backend ALB target group"
}

variable "frontend_target_group_arn" {
  type        = string
  description = "ARN of frontend ALB target group"
}

variable "db_secret_arn" {
  type        = string
  description = "Secrets Manager ARN for DB credentials"
}

variable "db_address" {
  type        = string
  description = "Database host address"
}

variable "db_name" {
  type        = string
  description = "Database name"
}

variable "desired_count" {
  type        = number
  description = "Desired number of ECS task replicas"
  default     = 1
}
