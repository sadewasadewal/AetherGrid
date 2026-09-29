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
  description = "VPC ID where security groups will be created"
}
