# 🚀 DevOps TP — Task Manager

Application complète démontrant le toolchain DevOps :
**React + Node.js + PostgreSQL + Docker + CI/CD + IaC + Monitoring**

---

## 📁 Structure du projet

```
devops-tp/
├── frontend/          # React (port 3000)
├── backend/           # Node.js + Express (port 3001)
├── monitoring/        # Prometheus + Grafana (port 3002)
├── terraform/         # Infrastructure AWS
├── ansible/           # Déploiement automatisé
└── .github/workflows/ # CI/CD GitHub Actions
```

---

## ⚡ Démarrage rapide (local)

### Prérequis
- Docker + Docker Compose
- Node.js 18+ (pour développement local)

### Lancer toute l'application

```bash
# Cloner le projet
git clone https://github.com/YOUR_USERNAME/devops-tp.git
cd devops-tp

# Démarrer tous les services
docker compose up -d

# Vérifier les logs
docker compose logs -f
```

### Accès aux services

| Service | URL | Login |
|---------|-----|-------|
| Frontend (React) | http://localhost:3000 | - |
| Backend API | http://localhost:3001 | - |
| API Health | http://localhost:3001/health | - |
| Metrics | http://localhost:3001/metrics | - |
| Prometheus | http://localhost:9090 | - |
| Grafana | http://localhost:3002 | admin / admin |

---

## 🧪 Tests

```bash
# Backend
cd backend && npm ci && npm test

# Frontend build
cd frontend && npm ci && npm run build
```

---

## 🐳 Docker

```bash
# Build individuel
docker build -t tp-backend ./backend
docker build -t tp-frontend ./frontend

# Compose
docker compose up -d        # démarrer
docker compose down         # arrêter
docker compose ps           # statut
docker compose logs backend # logs d'un service
```

---

## 🏗️ Infrastructure (Terraform)

```bash
cd terraform

# Initialiser
terraform init

# Planifier (preview)
terraform plan

# Appliquer (crée le serveur AWS)
terraform apply

# Récupérer l'IP du serveur
terraform output server_ip

# Détruire l'infrastructure
terraform destroy
```

> ⚠️ Nécessite des credentials AWS configurés (`aws configure`)

---

## 📦 Déploiement (Ansible)

```bash
cd ansible

# Modifier inventory.ini avec l'IP du serveur
# ansible/inventory.ini → remplacer 1.2.3.4 par l'IP Terraform

# Tester la connexion
ansible -i inventory.ini app_servers -m ping

# Déployer
ansible-playbook -i inventory.ini deploy.yml
```

---

## 🔄 CI/CD (GitHub Actions)

Le pipeline `.github/workflows/ci-cd.yml` s'exécute automatiquement :

1. **Push sur `develop`** → Tests backend + frontend
2. **Push sur `main`** → Tests + Build Docker + Deploy

### Configurer les secrets GitHub

Dans Settings → Secrets → Actions :
```
DOCKER_USERNAME    # Votre Docker Hub username
DOCKER_PASSWORD    # Votre Docker Hub password
SERVER_HOST        # IP de votre serveur
SERVER_USER        # ubuntu
SSH_PRIVATE_KEY    # Clé SSH privée
```

---

## 📊 Monitoring

### Prometheus
- Scrape les métriques du backend toutes les 15s
- Accès : http://localhost:9090

### Grafana
- Dashboard pré-configuré "DevOps TP Dashboard"
- Métriques disponibles :
  - Total requêtes HTTP
  - Requêtes par méthode (GET/POST/PUT/DELETE)
  - Taux de requêtes (req/s)
  - Mémoire Node.js (heap used/total)

---

## 🔌 API Endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /health | Santé de l'application |
| GET | /metrics | Métriques Prometheus |
| GET | /api/tasks | Liste toutes les tâches |
| POST | /api/tasks | Créer une tâche `{ title }` |
| PUT | /api/tasks/:id | Modifier `{ done: true/false }` |
| DELETE | /api/tasks/:id | Supprimer une tâche |

---

## 🛠️ Développement local (sans Docker)

```bash
# Terminal 1 - PostgreSQL
docker run -d -p 5432:5432 \
  -e POSTGRES_DB=taskdb \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  postgres:15-alpine

# Terminal 2 - Backend
cd backend && npm install && npm run dev

# Terminal 3 - Frontend
cd frontend && npm install && npm start
```
