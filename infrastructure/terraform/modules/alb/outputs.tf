output "alb_id" {
  description = "The ARN suffix of the ALB"
  value       = aws_lb.main.arn_suffix
}

output "alb_arn" {
  description = "The ARN of the ALB"
  value       = aws_lb.main.arn
}

output "alb_dns_name" {
  description = "Public DNS name of the ALB"
  value       = aws_lb.main.dns_name
}

output "alb_zone_id" {
  description = "Route 53 Hosted Zone ID for ALB alias records"
  value       = aws_lb.main.zone_id
}

output "frontend_target_group_arn" {
  description = "ARN of frontend target group"
  value       = aws_lb_target_group.frontend.arn
}

output "backend_target_group_arn" {
  description = "ARN of backend target group"
  value       = aws_lb_target_group.backend.arn
}

output "frontend_target_group_arn_suffix" {
  description = "ARN suffix of frontend target group"
  value       = aws_lb_target_group.frontend.arn_suffix
}

output "backend_target_group_arn_suffix" {
  description = "ARN suffix of backend target group"
  value       = aws_lb_target_group.backend.arn_suffix
}
