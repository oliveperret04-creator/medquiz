# 🚀 Guide de Déploiement - MedQuiz

Ce guide vous explique comment déployer MedQuiz pour qu'il soit accessible à tous les utilisateurs.

## 🌐 Options d'Hébergement

### 1. **Heroku** (Recommandé - Gratuit)
### 2. **Railway** (Alternative moderne)
### 3. **Vercel + MongoDB Atlas** (Plus avancé)

---

## 🎯 Déploiement sur Heroku

### Étape 1 : Préparer le projet

1. **Créer un compte GitHub** (si pas déjà fait)
2. **Pousser votre code sur GitHub** :
```bash
git init
git add .
git commit -m "Initial commit - MedQuiz app"
git branch -M main
git remote add origin https://github.com/votre-username/medquiz.git
git push -u origin main
```

### Étape 2 : Configurer Heroku

1. **Créer un compte Heroku** : https://signup.heroku.com/
2. **Installer Heroku CLI** : https://devcenter.heroku.com/articles/heroku-cli
3. **Se connecter** :
```bash
heroku login
```

### Étape 3 : Créer l'application Heroku

```bash
# Créer l'app
heroku create medquiz-app

# Ajouter la base de données MongoDB
heroku addons:create mongolab:sandbox

# Voir les variables d'environnement
heroku config
```

### Étape 4 : Configurer les variables d'environnement

```bash
# Configurer les variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=votre_secret_jwt_tres_securise
heroku config:set SESSION_SECRET=votre_secret_session_tres_securise

# Vérifier la configuration
heroku config
```

### Étape 5 : Déployer

```bash
# Pousser vers Heroku
git push heroku main

# Initialiser la base de données
heroku run npm run init-db
heroku run npm run add-questions

# Ouvrir l'application
heroku open
```

### Étape 6 : Mettre à jour le frontend

Modifiez `frontend/app.js` pour pointer vers votre URL Heroku :

```javascript
// Remplacer cette ligne :
const API_BASE_URL = 'http://localhost:3000/api';

// Par celle-ci :
const API_BASE_URL = 'https://medquiz-app.herokuapp.com/api';
```

---

## 🚂 Déploiement sur Railway

### Étape 1 : Préparer le projet

1. **Créer un compte Railway** : https://railway.app/
2. **Connecter votre GitHub**
3. **Importer le projet**

### Étape 2 : Configurer la base de données

1. **Ajouter MongoDB** depuis l'interface Railway
2. **Copier l'URL de connexion**
3. **Configurer les variables d'environnement**

### Étape 3 : Déployer

1. **Railway détecte automatiquement** le projet Node.js
2. **Déploiement automatique** à chaque push
3. **URL générée automatiquement**

---

## ☁️ Déploiement Vercel + MongoDB Atlas

### Étape 1 : MongoDB Atlas

1. **Créer un compte** : https://www.mongodb.com/atlas
2. **Créer un cluster gratuit**
3. **Obtenir l'URL de connexion**
4. **Configurer les règles de sécurité**

### Étape 2 : Vercel

1. **Créer un compte Vercel** : https://vercel.com/
2. **Importer depuis GitHub**
3. **Configurer les variables d'environnement**
4. **Déployer automatiquement**

---

## 🔧 Configuration Avancée

### Variables d'Environnement Requises

```bash
# Base de données
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medquiz

# Serveur
PORT=3000
NODE_ENV=production

# Sécurité
JWT_SECRET=votre_secret_jwt_tres_securise
SESSION_SECRET=votre_secret_session_tres_securise
```

### Scripts de Déploiement

```bash
# Installation complète
npm run install-all

# Initialisation de la base de données
npm run init-db

# Ajout de questions supplémentaires
npm run add-questions

# Démarrage en production
npm start
```

---

## 📊 Monitoring et Maintenance

### Heroku

```bash
# Voir les logs
heroku logs --tail

# Redémarrer l'application
heroku restart

# Voir les métriques
heroku ps
```

### Railway

- **Interface web** pour monitoring
- **Logs en temps réel**
- **Métriques automatiques**

### Vercel

- **Analytics intégrés**
- **Performance monitoring**
- **Déploiements automatiques**

---

## 🛡️ Sécurité en Production

### Recommandations

1. **Variables d'environnement** : Ne jamais commiter les secrets
2. **HTTPS** : Toujours utiliser HTTPS en production
3. **CORS** : Configurer correctement les origines autorisées
4. **Rate limiting** : Limiter les requêtes par IP
5. **Validation** : Valider toutes les entrées utilisateur

### Exemple de configuration CORS

```javascript
// Dans server.js
app.use(cors({
  origin: ['https://medquiz-app.herokuapp.com', 'https://votre-domaine.com'],
  credentials: true
}));
```

---

## 🚨 Dépannage

### Problèmes courants

1. **Erreur de connexion MongoDB** :
   - Vérifier l'URL de connexion
   - Vérifier les règles de sécurité

2. **Erreur de port** :
   - Heroku assigne automatiquement le port
   - Utiliser `process.env.PORT`

3. **Erreur de build** :
   - Vérifier les versions Node.js
   - Vérifier les dépendances

### Commandes utiles

```bash
# Vérifier les logs
heroku logs --tail

# Redémarrer l'app
heroku restart

# Voir la configuration
heroku config

# Tester localement
npm run dev
```

---

## 📈 Évolutivité

### Pour plus d'utilisateurs

1. **Upgrader Heroku** : Dyno payant pour plus de performance
2. **MongoDB Atlas** : Cluster payant pour plus de stockage
3. **CDN** : Cloudflare pour les assets statiques
4. **Cache** : Redis pour améliorer les performances

### Coûts estimés

- **Heroku Hobby** : $7/mois
- **MongoDB Atlas** : $9/mois
- **Total** : ~$16/mois pour 1000+ utilisateurs

---

## 🎯 Prochaines étapes

1. **Déployer sur Heroku** (recommandé pour commencer)
2. **Configurer un domaine personnalisé**
3. **Mettre en place le monitoring**
4. **Ajouter des tests automatisés**
5. **Configurer CI/CD**

---

**Votre application sera accessible 24h/24 et 7j/7 ! 🌍**
