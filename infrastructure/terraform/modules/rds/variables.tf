variable "project_name" {
  type        = string
  description = "Project name identifier"
  default     = "aethergrid"
}

variable "environment" {
  type        = string
  description = "Deployment environment"
}

variable "private_db_subnet_ids" {
  type        = list(string)
  description = "List of private DB subnets"
}

variable "security_group_id" {
  type        = string
  description = "Security Group ID for RDS instance"
}

variable "db_name" {
  type        = string
  description = "Database name"
  default     = "aethergrid_db"
}

variable "db_username" {
  type        = string
  description = "Master database user"
  default     = "aethergrid_admin"
}

variable "multi_az" {
  type        = bool
  description = "Deploy multi-AZ standby replica (false in dev to minimize cost)"
  default     = false
}

variable "instance_class" {
  type        = string
  description = "RDS DB instance class"
  default     = "db.t4g.micro"
}
