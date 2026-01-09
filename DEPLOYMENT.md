# 🔬 BioMicro - Instructions de Déploiement

## 📋 Prérequis

Avant de déployer, assurez-vous d'avoir :
- ✅ Un modèle CNN entraîné (`cnn_model.h5`)
- ✅ Compte Railway.app (ou autre hébergeur)
- ✅ Compte Expo (pour EAS Build)
- ✅ Tests passés avec succès en local

---

## 🌐 Partie 1 : Déploiement du Backend

### Option A : Railway (Recommandé)

#### 1. Installation Railway CLI

```bash
npm install -g @railway/cli
```

#### 2. Connexion et Initialisation

```bash
cd backend
railway login
railway init
```

Suivez les instructions à l'écran pour créer un nouveau projet.

#### 3. Configuration des Variables d'Environnement

Dans le dashboard Railway, ajoutez :
- `PORT` = `8000` (optionnel, Railway le définit automatiquement)

#### 4. Déploiement

```bash
railway up
```

#### 5. Récupérer l'URL

```bash
railway open
```

Notez l'URL générée (ex: `https://biomicro-api-production.railway.app`)

---

### Option B : Render

1. Créer un compte sur [Render.com](https://render.com)
2. Nouveau Web Service → Connect Git Repository
3. Build Command : `pip install -r requirements.txt`
4. Start Command : `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Déployer

---

### Option C : Heroku

```bash
# Installer Heroku CLI
brew install heroku/brew/heroku

# Login
heroku login

# Créer l'app
cd backend
heroku create biomicro-api

# Déployer
git push heroku main

# Voir les logs
heroku logs --tail
```

---

## 📱 Partie 2 : Configuration Mobile pour Production

### 1. Mettre à jour l'URL de l'API

Dans `mobile/src/services/api.js` :

```javascript
// AVANT (développement)
const API_BASE_URL = 'http://localhost:8000';

// APRÈS (production)
const API_BASE_URL = 'https://votre-api.railway.app';
```

### 2. Tester la connexion

```bash
cd mobile
npx expo start
```

Testez l'application pour vérifier que les appels API fonctionnent.

---

## 📦 Partie 3 : Build de l'Application Mobile

### Installation d'EAS CLI

```bash
npm install -g eas-cli
eas login
```

### Configuration

```bash
cd mobile
eas build:configure
```

Cela crée un fichier `eas.json`.

---

### Build Android (APK)

```bash
eas build --platform android --profile preview
```

Options :
- `--profile preview` : APK pour tests
- `--profile production` : AAB pour Google Play Store

Le build prend **10-20 minutes**. Une fois terminé, téléchargez l'APK.

---

### Build iOS (nécessite compte Apple Developer)

```bash
eas build --platform ios --profile preview
```

⚠️ Nécessite :
- Compte Apple Developer ($99/an)
- Certificat de signature
- Provisioning profile

---

## 🚀 Partie 4 : Distribution

### Android

#### Option 1 : Test Interne (APK)
1. Télécharger l'APK depuis EAS
2. Transférer sur les téléphones des chauffeurs
3. Installer manuellement (activer "Sources inconnues")

#### Option 2 : Google Play Store (AAB)
1. Créer un compte développeur Google Play ($25 unique)
2. Build en mode production :
   ```bash
   eas build --platform android --profile production
   ```
3. Uploader l'AAB sur Play Console
4. Créer une release (Internal → Beta → Production)

---

### iOS

#### Option 1 : TestFlight (Bêta)
1. Build iOS :
   ```bash
   eas submit --platform ios
   ```
2. Accessible dans TestFlight automatiquement
3. Inviter les testeurs par email

#### Option 2 : App Store
1. Suivre les guidelines Apple
2. Soumettre pour review (délai : 1-3 jours)
3. Publication

---

## 🔄 Partie 5 : Mises à Jour OTA (Over-The-Air)

Expo permet des mises à jour **sans rebuild** pour les changements JS :

```bash
cd mobile
eas update --branch production --message "Fix de bug XYZ"
```

⚠️ Ne fonctionne pas pour :
- Modifications de dépendances natives
- Changements dans `app.json`
- Nouvelles permissions

---

## 🔍 Partie 6 : Monitoring et Logs

### Backend (Railway)

```bash
# Voir les logs en temps réel
railway logs

# Via le dashboard
railway open
```

### Mobile (Expo)

- Dashboard EAS : https://expo.dev
- Analytics : nombre d'installations, crashs, etc.

---

## ✅ Checklist Pré-Déploiement

### Backend
- [ ] Tests unitaires passent
- [ ] Modèle CNN fonctionne en local
- [ ] Requirements.txt à jour
- [ ] railway.toml configuré
- [ ] Health check répond

### Mobile
- [ ] URL API en production configurée
- [ ] Tests sur device physique OK
- [ ] Permissions caméra/galerie fonctionnent
- [ ] Build réussit sans erreur
- [ ] Version dans app.json incrémentée

---

## 🐛 Dépannage Déploiement

### "Module not found" sur Railway
```bash
# Vérifier que requirements.txt liste tous les packages
pip freeze > requirements.txt
```

### Build EAS échoue
```bash
# Nettoyer et réessayer
eas build:cancel
rm -rf node_modules
npm install
eas build --platform android --profile preview --clear-cache
```

### API ne répond pas en production
- Vérifier les logs Railway : `railway logs`
- Tester health check : `curl https://votre-api.railway.app/health`
- Vérifier CORS dans `main.py`

---

## 📊 Coûts Estimés

| Service | Coût |
|---------|------|
| Railway (Backend) | Gratuit jusqu'à $5/mois, puis $0.000463/GB-hr |
| Expo EAS Build | Gratuit (builds limités) ou $29/mois (illimité) |
| Google Play Developer | $25 une fois |
| Apple Developer | $99/an |

**Total pour commencer :** $0-30 (sans iOS)

---

## 🎯 Prochaines Étapes Après Déploiement

1. **Formation utilisateurs** : Créer guide PDF avec captures d'écran
2. **Phase de test bêta** : 2-3 chauffeurs pendant 1 semaine
3. **Collecte feedback** : Améliorer UX/UI selon retours
4. **Déploiement général** : Tous les chauffeurs
5. **Support continu** : Hotline/email pour problèmes

---

**Bon déploiement ! 🚀**
