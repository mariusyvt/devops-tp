# ─────────────────────────────────────────────────────
# Terraform LOCAL - Provider Docker
# Crée les containers directement sur ta machine
# Usage:
#   terraform init
#   terraform plan
#   terraform apply
#   terraform destroy
# ─────────────────────────────────────────────────────

terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

# ── Réseau partagé entre les containers ──
resource "docker_network" "tp_network" {
  name = "tp_network"
}

# ── PostgreSQL ──
resource "docker_image" "postgres" {
  name = "postgres:15-alpine"
}

resource "docker_container" "postgres" {
  name  = "tp_postgres"
  image = docker_image.postgres.image_id

  env = [
    "POSTGRES_DB=taskdb",
    "POSTGRES_USER=postgres",
    "POSTGRES_PASSWORD=password"
  ]

  ports {
    internal = 5432
    external = 5432
  }

  networks_advanced {
    name = docker_network.tp_network.name
  }

  healthcheck {
    test     = ["CMD-SHELL", "pg_isready -U postgres"]
    interval = "10s"
    timeout  = "5s"
    retries  = 5
  }
}

# ── Backend Node.js ──
resource "docker_image" "backend" {
  name = "tp-backend"
  build {
    context = "../backend"
  }
}

resource "docker_container" "backend" {
  name  = "tp_backend"
  image = docker_image.backend.image_id

  env = [
    "DB_HOST=tp_postgres",
    "DB_PORT=5432",
    "DB_NAME=taskdb",
    "DB_USER=postgres",
    "DB_PASSWORD=password",
    "PORT=3001"
  ]

  ports {
    internal = 3001
    external = 3001
  }

  networks_advanced {
    name = docker_network.tp_network.name
  }

  depends_on = [docker_container.postgres]
}

# ── Frontend React ──
resource "docker_image" "frontend" {
  name = "tp-frontend"
  build {
    context = "../frontend"
  }
}

resource "docker_container" "frontend" {
  name  = "tp_frontend"
  image = docker_image.frontend.image_id

  ports {
    internal = 80
    external = 3000
  }

  networks_advanced {
    name = docker_network.tp_network.name
  }

  depends_on = [docker_container.backend]
}

# ── Outputs ──
output "frontend_url" {
  value = "http://localhost:3000"
}

output "backend_url" {
  value = "http://localhost:3001"
}

output "health_check" {
  value = "http://localhost:3001/health"
}
