terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  # In production, use remote S3 backend with DynamoDB state locking:
  # backend "s3" {
  #   bucket         = "aethergrid-terraform-state-dev"
  #   key            = "dev/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "aethergrid-tf-locks-dev"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "AetherGrid"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
