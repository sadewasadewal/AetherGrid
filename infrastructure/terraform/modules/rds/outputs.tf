output "db_endpoint" {
  description = "Connection endpoint of the PostgreSQL database"
  value       = aws_db_instance.postgres.endpoint
}

output "db_address" {
  description = "Hostname of the database"
  value       = aws_db_instance.postgres.address
}

output "db_port" {
  description = "Port of the database"
  value       = aws_db_instance.postgres.port
}

output "db_name" {
  description = "Database name"
  value       = aws_db_instance.postgres.db_name
}

output "db_credentials_secret_arn" {
  description = "ARN of Secrets Manager secret containing database credentials"
  value       = aws_secretsmanager_secret.db_credentials.arn
}

output "db_credentials_secret_name" {
  description = "Name of Secrets Manager secret containing database credentials"
  value       = aws_secretsmanager_secret.db_credentials.name
}
