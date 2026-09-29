variable "project_name" {
  type        = string
  description = "Project name identifier"
  default     = "aethergrid"
}

variable "environment" {
  type        = string
  description = "Deployment environment"
}

variable "vpc_id" {
  type        = string
  description = "VPC ID"
}

variable "public_subnet_ids" {
  type        = list(string)
  description = "List of public subnet IDs for ALB placement"
}

variable "security_group_id" {
  type        = string
  description = "Security Group ID for ALB"
}

variable "certificate_arn" {
  type        = string
  description = "Optional ACM certificate ARN for HTTPS listener"
  default     = ""
}
