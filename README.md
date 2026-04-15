# ERP Coopérative

Système de gestion pour coopératives agricoles avec gestion multi-adhérents, collecte de produits, paiements différés, et mise en relation avec les acheteurs. Traçabilité complète.

## Fonctionnalités

- **Gestion multi-adhérents**: Ajout et gestion des membres de la coopérative
- **Collecte de produits**: Suivi des produits collectés avec codes de traçabilité
- **Paiements différés**: Gestion des paiements avec différentes méthodes et échéances
- **Mise en relation avec les acheteurs**: Gestion des acheteurs et transactions
- **Traçabilité complète**: Suivi complet des produits de la collecte à la vente

## Architecture

- **Backend**: Flask avec SQLAlchemy
- **Frontend**: React.js avec Axios
- **Base de données**: SQLite (développement)

## Installation et Démarrage

### Backend

1. Naviguer vers le dossier backend:
```bash
cd backend
```

2. Créer un environnement virtuel:
```bash
python -m venv venv
```

3. Activer l'environnement virtuel:
- Windows: `venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

4. Installer les dépendances:
```bash
pip install -r requirements.txt
```

5. Démarrer le serveur Flask:
```bash
python app.py
```

Le backend sera disponible sur `http://localhost:5000`

### Frontend

1. Naviguer vers le dossier frontend:
```bash
cd frontend
```

2. Installer les dépendances:
```bash
npm install
```

3. Démarrer le serveur de développement:
```bash
npm start
```

Le frontend sera disponible sur `http://localhost:3000`

## API Endpoints

### Membres
- `GET /api/members` - Lister tous les membres
- `POST /api/members` - Créer un nouveau membre

### Produits
- `GET /api/products` - Lister tous les produits
- `POST /api/products` - Ajouter un nouveau produit

### Acheteurs
- `GET /api/buyers` - Lister tous les acheteurs
- `POST /api/buyers` - Ajouter un nouvel acheteur

### Transactions
- `GET /api/transactions` - Lister toutes les transactions
- `POST /api/transactions` - Créer une nouvelle transaction

### Paiements
- `GET /api/payments` - Lister tous les paiements
- `POST /api/payments` - Créer un nouveau paiement

### Traçabilité
- `GET /api/traceability/<code>` - Obtenir les informations de traçabilité d'un produit

## Structure du Projet

```
erp-cooperative/
|-- backend/
|   |-- app.py              # Application Flask principale
|   |-- requirements.txt    # Dépendances Python
|   `-- cooperative.db      # Base de données SQLite (créée automatiquement)
|-- frontend/
|   |-- public/
|   |   `-- index.html      # HTML principal
|   |-- src/
|   |   |-- components/
|   |   |   `-- Navbar.js   # Barre de navigation
|   |   |-- pages/
|   |   |   |-- Dashboard.js    # Tableau de bord
|   |   |   |-- Members.js       # Gestion des membres
|   |   |   |-- Products.js      # Gestion des produits
|   |   |   |-- Buyers.js        # Gestion des acheteurs
|   |   |   |-- Transactions.js  # Gestion des transactions
|   |   |   |-- Payments.js      # Gestion des paiements
|   |   |   `-- Traceability.js  # Suivi de traçabilité
|   |   |-- App.js           # Application React principale
|   |   |-- App.css          # Styles principaux
|   |   |-- index.js         # Point d'entrée React
|   |   `-- index.css        # Styles globaux
|   `-- package.json        # Dépendances Node.js
`-- README.md               # Documentation
```

## Modèles de Données

### Member (Adhérent)
- id, name, email, phone, address, join_date, is_active

### Product (Produit)
- id, name, quantity, unit, collection_date, quality_grade, status, traceability_code, member_id

### Buyer (Acheteur)
- id, name, email, phone, company, is_active

### Transaction
- id, quantity, unit_price, total_amount, transaction_date, status, product_id, buyer_id

### Payment (Paiement)
- id, amount, payment_date, payment_method, status, due_date, member_id, transaction_id

## Fonctionnement de la Traçabilité

Chaque produit reçoit un code de traçabilité unique généré automatiquement. Ce code permet de suivre:
- Les informations du produit (nom, quantité, qualité, date de collecte)
- L'adhérent qui a fourni le produit
- L'historique complet des transactions

## Technologies Utilisées

- **Backend**: Python, Flask, SQLAlchemy, Flask-CORS
- **Frontend**: JavaScript, React, React Router, Axios
- **Base de données**: SQLite
- **Styling**: CSS3 avec design responsive

## Déploiement

Pour la production:
1. Utiliser une base de données PostgreSQL ou MySQL
2. Configurer Nginx comme reverse proxy
3. Utiliser Gunicorn pour servir l'application Flask
4. Builder l'application React pour la production

## Contribuer

1. Fork le projet
2. Créer une branche pour la fonctionnalité
3. Commit les changements
4. Push vers la branche
5. Créer une Pull Request
