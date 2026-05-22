# DevOps TP — Task Manager

Stack : **React + Node.js + PostgreSQL + Docker + CI/CD + Terraform + Ansible + Monitoring**

## Structure

```
devops-tp/
├── frontend/          # React (port 3000)
├── backend/           # Node.js + Express (port 3001)
├── monitoring/        # Prometheus + Grafana
├── terraform/         # Infrastructure AWS
├── ansible/           # Déploiement automatisé
└── .github/workflows/ # CI/CD GitHub Actions
```

## Démarrage rapide

**Prérequis** : Docker + Docker Compose

```bash
docker compose up --build
```

| Service    | URL                          | Login       |
| ---------- | ---------------------------- | ----------- |
| Frontend   | http://localhost:3000        | -           |
| Backend    | http://localhost:3001        | -           |
| Health     | http://localhost:3001/health | -           |
| Prometheus | http://localhost:9090        | -           |
| Grafana    | http://localhost:3002        | admin/admin |

## Tests

```bash
cd backend && npm install && npm test
```

## Infrastructure (Terraform)

```bash
cd terraform
terraform init
terraform plan
terraform apply       # crée le serveur AWS
terraform output server_ip
terraform destroy
```

> Nécessite des credentials AWS (`aws configure`)

## Déploiement (Ansible)

```bash
# Mettre à jour l'IP dans ansible/inventory.ini
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml
```

## CI/CD (GitHub Actions)

Pipeline déclenché automatiquement sur push :

- **`master`** → Tests + Build Docker + Deploy

Secrets à configurer dans Settings → Secrets → Actions :

```
DOCKER_USERNAME
DOCKER_PASSWORD
SERVER_HOST
SERVER_USER
SSH_PRIVATE_KEY
```

## API Endpoints

| Méthode | Route          | Description               |
| ------- | -------------- | ------------------------- |
| GET     | /health        | Santé de l'application    |
| GET     | /metrics       | Métriques Prometheus      |
| GET     | /api/tasks     | Liste toutes les tâches   |
| POST    | /api/tasks     | Créer une tâche `{title}` |
| PUT     | /api/tasks/:id | Modifier `{done: bool}`   |
| DELETE  | /api/tasks/:id | Supprimer une tâche       |
