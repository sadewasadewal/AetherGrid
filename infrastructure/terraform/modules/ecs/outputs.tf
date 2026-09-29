output "cluster_id" {
  description = "ECS Cluster ID"
  value       = aws_ecs_cluster.main.id
}

output "cluster_name" {
  description = "ECS Cluster Name"
  value       = aws_ecs_cluster.main.name
}

output "backend_service_name" {
  description = "Backend ECS service name"
  value       = aws_ecs_service.backend.name
}

output "frontend_service_name" {
  description = "Frontend ECS service name"
  value       = aws_ecs_service.frontend.name
}

output "execution_role_arn" {
  description = "IAM Role ARN for task execution"
  value       = aws_iam_role.ecs_execution_role.arn
}

output "task_role_arn" {
  description = "IAM Role ARN for task runtime"
  value       = aws_iam_role.ecs_task_role.arn
}
