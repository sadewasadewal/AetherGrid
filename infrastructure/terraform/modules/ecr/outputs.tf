output "backend_repository_url" {
  description = "ECR URL for backend image"
  value       = aws_ecr_repository.repos["backend"].repository_url
}

output "frontend_repository_url" {
  description = "ECR URL for frontend image"
  value       = aws_ecr_repository.repos["frontend"].repository_url
}

output "backend_repository_arn" {
  description = "ECR ARN for backend"
  value       = aws_ecr_repository.repos["backend"].arn
}

output "frontend_repository_arn" {
  description = "ECR ARN for frontend"
  value       = aws_ecr_repository.repos["frontend"].arn
}
