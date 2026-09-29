# ==========================================
# Amazon RDS PostgreSQL (Isolated Database)
# ==========================================

# Random password for master user
resource "random_password" "db_password" {
  length           = 24
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

# AWS Secrets Manager to store DB connection credentials safely
resource "aws_secretsmanager_secret" "db_credentials" {
  name                    = "${var.project_name}-${var.environment}-db-credentials"
  recovery_window_in_days = 0 # Immediate deletion upon destroy

  tags = {
    Name        = "${var.project_name}-${var.environment}-db-secret"
    Environment = var.environment
  }
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    engine   = "postgres"
    host     = aws_db_instance.postgres.address
    port     = aws_db_instance.postgres.port
    username = var.db_username
    password = random_password.db_password.result
    database = var.db_name
  })
}

# Subnet group spanning private DB subnets
resource "aws_db_subnet_group" "rds" {
  name        = "${var.project_name}-${var.environment}-db-subnet-group"
  subnet_ids  = var.private_db_subnet_ids
  description = "Private isolated database subnet group"

  tags = {
    Name        = "${var.project_name}-${var.environment}-db-subnet-group"
    Environment = var.environment
  }
}

# DB Parameter Group
resource "aws_db_parameter_group" "pg15" {
  name        = "${var.project_name}-${var.environment}-pg15-params"
  family      = "postgres15"
  description = "AetherGrid PostgreSQL 15 custom parameters"

  parameter {
    name  = "rds.force_ssl"
    value = "0" # Allow flexible SSL during portfolio demonstrations
  }

  tags = {
    Environment = var.environment
  }
}

# RDS PostgreSQL Instance
resource "aws_db_instance" "postgres" {
  identifier        = "${var.project_name}-${var.environment}-db"
  allocated_storage = 20
  max_allocated_storage = 50 # Autoscaling storage cap
  storage_type      = "gp3"
  engine            = "postgres"
  engine_version    = "15.4"
  instance_class    = var.instance_class

  db_name  = var.db_name
  username = var.db_username
  password = random_password.db_password.result

  db_subnet_group_name   = aws_db_subnet_group.rds.name
  vpc_security_group_ids = [var.security_group_id]
  parameter_group_name   = aws_db_parameter_group.pg15.name

  multi_az               = var.multi_az
  publicly_accessible    = false
  storage_encrypted      = true
  skip_final_snapshot    = true # Cost & ease of destruction for portfolio
  deletion_protection    = false

  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "Sun:04:30-Sun:05:30"

  auto_minor_version_upgrade = true

  tags = {
    Name        = "${var.project_name}-${var.environment}-postgres"
    Environment = var.environment
  }
}
