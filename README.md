# 🏥 MedQuiz - Quiz Médical Compétitif

**MedQuiz** est une application de quiz médical compétitive basée sur le programme **R2C des EDN** (Épreuves Classantes Nationales). Elle permet aux étudiants en médecine de s'entraîner et de se comparer sur des cas cliniques et des QCM.

## 🎯 Fonctionnalités Principales

### 📚 Mode Solo
- **Épreuves par spécialité** : Cardiologie, Neurologie, Pneumologie, Gastro-entérologie, Endocrinologie, etc.
- **Niveaux de difficulté** : Facile, Moyen, Difficile
- **QCM variés** : De 5 à 100 questions selon l'épreuve
- **Timer adaptatif** : Temps ajusté selon la complexité et le nombre de propositions
- **Corrections détaillées** : Explications après chaque épreuve

### 🎮 Mode Multijoueur (En développement)
- **Matchmaking en temps réel** : Trouvez des adversaires instantanément
- **Affrontements directs** : Répondez aux mêmes questions en simultané
- **Classement en direct** : Suivez votre progression en temps réel
- **Épreuves courtes** : 10-20 QCM pour des parties rapides

### 🏆 Système de Classement
- **Scores par spécialité** : Comparez-vous dans votre domaine de prédilection
- **Classements globaux** : Top 100 des meilleurs scores
- **Progression personnelle** : Suivez votre évolution

### 🛡️ Anti-Triche
- **Une seule tentative** : Impossible de refaire la même épreuve
- **Questions masquées** : Aucun aperçu des QCM avant l'épreuve
- **Scores uniques** : Basés uniquement sur la première tentative

## 🚀 Installation et Démarrage

### Prérequis
- **Node.js** (version 16 ou supérieure)
- **MongoDB** (version 4.4 ou supérieure)
- **npm** ou **yarn**

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd MedQuiz
```

### 2. Installer les dépendances
```bash
# Backend
cd backend
npm install

# Frontend (optionnel pour le moment)
cd ../frontend
# Les fichiers sont déjà inclus
```

### 3. Configuration de la base de données
```bash
# Créer un fichier .env dans le dossier backend
cd backend
echo "MONGODB_URI=mongodb://localhost:27017/medquiz" > .env
echo "PORT=3000" >> .env
echo "NODE_ENV=development" >> .env
```

### 4. Démarrer MongoDB
```bash
# Sur Windows
mongod

# Sur macOS/Linux
sudo systemctl start mongod
```

### 5. Initialiser la base de données
```bash
cd backend
node initDb.js
```

### 6. Lancer le serveur
```bash
cd backend
npm start
```

### 7. Ouvrir l'application
Ouvrez `frontend/index.html` dans votre navigateur ou servez les fichiers statiques.

## 📊 Structure des Données

### Spécialités Médicales
- **Cardiologie** : Pathologies cardiaques, ECG, HTA
- **Neurologie** : AVC, épilepsie, signes neurologiques
- **Pneumologie** : Embolie pulmonaire, asthme, pneumonie
- **Gastro-entérologie** : Péritonite, hémorragie digestive
- **Endocrinologie** : Diabète, hypothyroïdie
- **Néphrologie** : Insuffisance rénale, infections urinaires
- **Dermatologie** : Signes cutanés, psoriasis
- **Rhumatologie** : Polyarthrite rhumatoïde
- **Pédiatrie** : Signes pédiatriques, otite
- **Gynécologie** : Grossesse, infections vaginales
- **Psychiatrie** : Dépression, trouble panique
- **Oncologie** : Marqueurs tumoraux, signes cliniques

### Format des QCM
- **5 propositions** par question
- **1 seule bonne réponse**
- **Explication détaillée** après réponse
- **Temps adaptatif** : 45s à 2min selon la complexité

## 🔧 Configuration Avancée

### Variables d'Environnement
```bash
# backend/.env
MONGODB_URI=mongodb://localhost:27017/medquiz
PORT=3000
NODE_ENV=development
JWT_SECRET=votre_secret_jwt_tres_securise
SESSION_SECRET=votre_secret_session_tres_securise
```

### Ajouter de Nouvelles Questions
```bash
cd backend
node addMoreQuestions.js
```

### Personnaliser les Épreuves
Modifiez les fichiers `initDb.js` et `addMoreQuestions.js` pour ajouter vos propres QCM.

## 📱 Interface Utilisateur

### Design Responsive
- **Mobile-first** : Optimisé pour tous les écrans
- **Interface moderne** : Design Material Design inspiré
- **Animations fluides** : Transitions et hover effects
- **Icônes intuitives** : Font Awesome pour une meilleure UX

### Navigation
- **Menu principal** : 3 modes principaux
- **Grille des spécialités** : Sélection facile par domaine
- **Interface de quiz** : Timer, questions, options
- **Résultats** : Score, classement, corrections

## 🎓 Contenu Pédagogique

### Sources des QCM
- **Programme R2C** : Basé sur les référentiels officiels
- **Cas cliniques réels** : Situations rencontrées en pratique
- **Mise à jour régulière** : Contenu conforme aux dernières recommandations
- **Validation médicale** : Questions vérifiées par des professionnels

### Niveaux de Difficulté
- **Facile** : Notions de base, signes évidents
- **Moyen** : Cas cliniques classiques, diagnostics courants
- **Difficile** : Situations complexes, diagnostics différentiels

## 🔒 Sécurité et Performance

### Mesures Anti-Triche
- **Session unique** : Une épreuve = une tentative
- **Cache désactivé** : Pas de stockage local des questions
- **Validation serveur** : Toutes les réponses vérifiées côté serveur
- **Logs de sécurité** : Traçabilité des tentatives

### Performance
- **Base de données optimisée** : Index sur les requêtes fréquentes
- **Cache Redis** : Pour les classements et statistiques
- **CDN** : Pour les ressources statiques
- **Compression** : Gzip pour les réponses API

## 🚧 Développement Futur

### Fonctionnalités Prévues
- [ ] **Mode multijoueur complet** : Matchmaking et affrontements
- [ ] **Application mobile** : iOS et Android
- [ ] **Mode révision** : Questions sans timer pour l'apprentissage
- [ ] **Statistiques avancées** : Graphiques de progression
- [ ] **Mode équipe** : Quiz en groupe
- [ ] **Notifications** : Rappels de révision
- [ ] **Export des résultats** : PDF des performances

### Améliorations Techniques
- [ ] **Authentification JWT** : Système de connexion sécurisé
- [ ] **API GraphQL** : Requêtes plus flexibles
- [ ] **Tests automatisés** : Coverage complet
- [ ] **CI/CD** : Déploiement automatique
- [ ] **Monitoring** : Métriques de performance

## 🤝 Contribution

### Comment Contribuer
1. **Fork** le projet
2. **Créez une branche** pour votre fonctionnalité
3. **Commitez** vos changements
4. **Poussez** vers la branche
5. **Ouvrez une Pull Request**

### Ajouter des QCM
1. Modifiez les fichiers de questions dans `backend/`
2. Respectez le format existant
3. Vérifiez la qualité médicale
4. Ajoutez des explications détaillées

### Signaler des Bugs
- Utilisez les **Issues GitHub**
- Décrivez le problème clairement
- Incluez les étapes de reproduction
- Joignez des captures d'écran si possible

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

### Contact
- **Email** : support@medquiz.fr
- **GitHub** : [Issues](https://github.com/votre-repo/issues)
- **Documentation** : [Wiki](https://github.com/votre-repo/wiki)

### Communauté
- **Forum** : [Discussions GitHub](https://github.com/votre-repo/discussions)
- **Discord** : [Serveur communautaire](https://discord.gg/medquiz)
- **Twitter** : [@MedQuizApp](https://twitter.com/MedQuizApp)

## 🙏 Remerciements

- **Collèges médicaux** : Pour le programme R2C
- **Professeurs** : Pour la validation des QCM
- **Étudiants** : Pour les retours et suggestions
- **Contributeurs** : Pour le développement et l'amélioration

---

**MedQuiz** - Révisez la médecine en vous amusant ! 🎯📚
