output "sns_topic_arn" {
  description = "SNS Topic ARN for CloudWatch alerts"
  value       = aws_sns_topic.alerts.arn
}

output "ecs_cpu_alarm_arn" {
  description = "ARN of ECS CPU alarm"
  value       = aws_cloudwatch_metric_alarm.ecs_cpu_high.arn
}

output "ecs_memory_alarm_arn" {
  description = "ARN of ECS Memory alarm"
  value       = aws_cloudwatch_metric_alarm.ecs_memory_high.arn
}

output "alb_5xx_alarm_arn" {
  description = "ARN of ALB 5XX alarm"
  value       = aws_cloudwatch_metric_alarm.alb_5xx_errors.arn
}

output "unhealthy_hosts_alarm_arn" {
  description = "ARN of Unhealthy Hosts alarm"
  value       = aws_cloudwatch_metric_alarm.unhealthy_hosts.arn
}
