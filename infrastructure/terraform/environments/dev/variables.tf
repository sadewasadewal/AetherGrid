variable "project_name" {
  type        = string
  description = "Project name identifier"
  default     = "aethergrid"
}

variable "environment" {
  type        = string
  description = "Target environment"
  default     = "dev"
}

variable "aws_region" {
  type        = string
  description = "AWS deployment region"
  default     = "us-east-1"
}

variable "vpc_cidr" {
  type        = string
  description = "VPC CIDR block"
  default     = "10.0.0.0/16"
}

variable "enable_nat_gateway" {
  type        = bool
  description = "Whether to deploy NAT Gateway (default false in dev to eliminate $32/mo idle charges)"
  default     = false
}

variable "certificate_arn" {
  type        = string
  description = "Optional ACM certificate ARN for HTTPS"
  default     = ""
}

variable "backend_image" {
  type        = string
  description = "Container image URI for backend"
  default     = "public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest"
}

variable "frontend_image" {
  type        = string
  description = "Container image URI for frontend"
  default     = "public.ecr.aws/ecs-sample-image/amazon-ecs-sample:latest"
}
