# ─────────────────────────────────────────────────────
# Terraform - Infrastructure as Code
# Provision a simple server on AWS (or local with Docker)
# ─────────────────────────────────────────────────────

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Variables
variable "aws_region" {
  default = "eu-west-1"
}
variable "instance_type" {
  default = "t3.micro"
}
variable "app_name" {
  default = "devops-tp"
}

# Security Group
resource "aws_security_group" "app_sg" {
  name        = "${var.app_name}-sg"
  description = "Security group for DevOps TP"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH"
  }
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Frontend"
  }
  ingress {
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Backend API"
  }
  ingress {
    from_port   = 3002
    to_port     = 3002
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Grafana"
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "${var.app_name}-sg"
    Project = var.app_name
  }
}

# EC2 Instance
resource "aws_instance" "app_server" {
  ami           = "ami-0905a3c97561e0b69" # Ubuntu 22.04 eu-west-1
  instance_type = var.instance_type

  vpc_security_group_ids = [aws_security_group.app_sg.id]

  user_data = <<-EOF
    #!/bin/bash
    apt-get update -y
    apt-get install -y docker.io docker-compose-plugin git
    systemctl start docker
    systemctl enable docker
    usermod -aG docker ubuntu
  EOF

  tags = {
    Name    = "${var.app_name}-server"
    Project = var.app_name
  }
}

# Outputs
output "server_ip" {
  value       = aws_instance.app_server.public_ip
  description = "Public IP of the server"
}
output "frontend_url" {
  value = "http://${aws_instance.app_server.public_ip}:3000"
}
output "backend_url" {
  value = "http://${aws_instance.app_server.public_ip}:3001"
}
output "grafana_url" {
  value = "http://${aws_instance.app_server.public_ip}:3002"
}
