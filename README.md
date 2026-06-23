# Trouve ton artisan !

Plateforme de mise en relation entre particuliers et artisans de la région Auvergne-Rhône-Alpes.

## Prérequis

- Node.js >= 18
- npm >= 9
- MySQL >= 8 (ou MariaDB >= 10.5)

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-user/trouve-ton-artisan.git
cd trouve-ton-artisan
```

### 2. Base de données

```bash
mysql -u root -p < database/create.sql
mysql -u root -p trouve_ton_artisan < database/seed.sql
```

### 3. Backend

```bash
cd backend
cp .env.example .env
# Remplir les variables dans .env
npm install
npm start
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

## Variables d'environnement (backend/.env)

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=trouve_ton_artisan
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
API_KEY=votre_cle_api_secrete
PORT=3001
FRONTEND_URL=http://localhost:5173
```

## Scripts disponibles

### Backend
- `npm start` — Lance le serveur en production
- `npm run dev` — Lance le serveur avec nodemon (développement)

### Frontend
- `npm run dev` — Lance Vite en mode développement
- `npm run build` — Build de production
- `npm run preview` — Prévisualise le build

## Structure du projet

```
trouve-ton-artisan/
├── frontend/   ← React + Vite + Bootstrap + Sass
├── backend/    ← Node.js + Express + Sequelize
└── database/   ← Scripts SQL
```
