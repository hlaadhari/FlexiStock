# FlexiStock

Application de gestion de stock (Next.js + Node.js + PostgreSQL + Redis).

## Prérequis

- Docker & Docker Compose

## Démarrage rapide

1. Cloner le dépôt
2. Lancer l'application :
   ```bash
   make build
   make up
   ```
3. Accéder à l'application :
   - Frontend : http://localhost:3000
   - Backend API : http://localhost:3001
   - Documentation API : http://localhost:3001/api-docs

## Commandes utiles

- `make build` : Construit les images Docker
- `make up` : Lance les conteneurs
- `make down` : Arrête les conteneurs
- `make seed` : Initialise la base de données avec des données de test
- `make logs` : Affiche les logs des conteneurs
