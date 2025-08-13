# 🚀 Guide Rapide - MedQuiz

## 🎯 Votre application est prête !

### ✅ Ce qui fonctionne déjà :
- **Backend complet** : API REST + Socket.io + MongoDB
- **Frontend moderne** : Interface responsive et intuitive
- **16 épreuves** : 12 spécialités médicales couvertes
- **QCM R2C** : Basés sur le programme des EDN
- **Système anti-triche** : Une seule tentative par épreuve

---

## 🖥️ Test Local (Votre PC)

### Démarrage rapide :
```bash
# Dans le dossier MedQuiz
cd backend
npm start
```

### Accès :
- **API** : http://localhost:3000
- **Frontend** : Ouvrir `frontend/index.html` dans votre navigateur

---

## 🌐 Déploiement en Ligne (Pour tout le monde)

### Option 1 : Heroku (Recommandé - Gratuit)

#### Étape 1 : Préparer GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/votre-username/medquiz.git
git push -u origin main
```

#### Étape 2 : Déployer sur Heroku
```bash
# Installer Heroku CLI
# Créer compte sur https://heroku.com

heroku login
heroku create medquiz-app
heroku addons:create mongolab:sandbox
git push heroku main
heroku run npm run init-db
heroku run npm run add-questions
heroku open
```

#### Résultat :
- **URL publique** : https://medquiz-app.herokuapp.com
- **Accessible 24h/24** à tout le monde
- **Gratuit** pour commencer

---

### Option 2 : Railway (Plus simple)

1. **Créer compte** : https://railway.app/
2. **Connecter GitHub**
3. **Importer le projet**
4. **Ajouter MongoDB**
5. **Déploiement automatique**

---

## 📱 Utilisation

### Pour les étudiants :
1. **Aller sur l'URL** de votre application
2. **Choisir une spécialité** (Cardiologie, Neurologie, etc.)
3. **Répondre aux QCM** avec timer
4. **Voir les résultats** et classements

### Fonctionnalités :
- ✅ **Mode Solo** : Quiz par spécialité
- ✅ **Classements** : Comparaison des scores
- ✅ **Corrections** : Explications détaillées
- 🚧 **Mode Multijoueur** : En développement

---

## 🔧 Configuration

### Variables d'environnement :
```bash
MONGODB_URI=mongodb://localhost:27017/medquiz
PORT=3000
NODE_ENV=development
```

### Scripts utiles :
```bash
npm run init-db      # Initialiser la base de données
npm run add-questions # Ajouter plus de QCM
npm start            # Démarrer le serveur
```

---

## 🎓 Spécialités Disponibles

- **Cardiologie** : Cœur, vaisseaux, ECG
- **Neurologie** : Cerveau, nerfs, AVC
- **Pneumologie** : Poumons, respiration
- **Gastro-entérologie** : Tube digestif
- **Endocrinologie** : Hormones, diabète
- **Néphrologie** : Reins, urines
- **Dermatologie** : Peau, signes cutanés
- **Rhumatologie** : Articulations
- **Pédiatrie** : Enfants
- **Gynécologie** : Femmes enceintes
- **Psychiatrie** : Santé mentale
- **Oncologie** : Cancer

---

## 🚨 Problèmes Courants

### Erreur "Cannot find module" :
```bash
cd backend
npm install
npm start
```

### Erreur MongoDB :
- Vérifier que MongoDB est installé et démarré
- Ou utiliser MongoDB Atlas (cloud)

### Erreur de port :
- Changer le port dans `.env`
- Ou utiliser `process.env.PORT`

---

## 📈 Évolutivité

### Pour plus d'utilisateurs :
- **Heroku Hobby** : $7/mois
- **MongoDB Atlas** : $9/mois
- **Total** : ~$16/mois pour 1000+ utilisateurs

### Fonctionnalités futures :
- 🔄 Mode multijoueur temps réel
- 📱 Application mobile
- 📊 Statistiques avancées
- 🎯 Mode révision sans timer

---

## 🎯 Prochaines Étapes

1. **Tester localement** ✅
2. **Déployer sur Heroku** 🌐
3. **Partager l'URL** avec des étudiants
4. **Collecter les retours** 📝
5. **Améliorer l'application** 🚀

---

## 📞 Support

### En cas de problème :
1. **Vérifier les logs** : `heroku logs --tail`
2. **Redémarrer** : `heroku restart`
3. **Vérifier la config** : `heroku config`

### Ressources :
- **Documentation complète** : `README.md`
- **Guide de déploiement** : `DEPLOYMENT.md`
- **Code source** : GitHub

---

**🎉 Votre application MedQuiz est prête à révolutionner l'apprentissage médical !**
