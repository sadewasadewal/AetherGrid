variable "project_name" {
  type        = string
  description = "Project name identifier"
  default     = "aethergrid"
}

variable "environment" {
  type        = string
  description = "Target environment"
  default     = "prod"
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
  description = "Whether to deploy NAT Gateway (true in production for private subnet outbound)"
  default     = true
}

variable "single_nat_gateway" {
  type        = bool
  description = "Whether to use single NAT Gateway or Multi-AZ NAT Gateway"
  default     = false
}

variable "certificate_arn" {
  type        = string
  description = "ACM certificate ARN for HTTPS listener"
  default     = ""
}

variable "backend_image" {
  type        = string
  description = "Container image URI for backend"
}

variable "frontend_image" {
  type        = string
  description = "Container image URI for frontend"
}

variable "desired_count" {
  type        = number
  description = "Desired number of task replicas in production"
  default     = 2
}
