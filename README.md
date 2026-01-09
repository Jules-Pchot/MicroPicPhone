# 🔬 BioMicro - Application Mobile d'Analyse Microscopique

Application mobile cross-platform permettant aux chauffeurs de camion de photographier des échantillons microscopiques et d'obtenir instantanément un verdict **GO / NO-GO** pour le déversement de solution de bio-minéralisation.

---

## 📱 Stack Technique

### Frontend Mobile
- **React Native** avec **Expo** (v50)
- **React Navigation** pour la navigation
- **Axios** pour les appels API
- **Expo Camera** & **Image Picker**

### Backend API
- **FastAPI** (Python)
- **TensorFlow** pour l'inférence du modèle CNN
- **OpenCV** pour le traitement d'image
- **Uvicorn** comme serveur ASGI

---

## 📂 Structure du Projet

```
Project Microscope/
│
├── backend/                      # API Python FastAPI
│   ├── main.py                   # Point d'entrée de l'API
│   ├── requirements.txt          # Dépendances Python
│   ├── railway.toml              # Config déploiement Railway
│   │
│   ├── app/
│   │   ├── services/
│   │   │   ├── image_processor.py    # Traitement d'image
│   │   │   └── model_service.py      # Chargement CNN et prédiction
│   │   │
│   │   └── models/
│   │       └── cnn_model.h5          # ⚠️ À placer ici
│   │
│   └── tests/
│       └── test_prediction.py
│
├── mobile/                       # Application React Native
│   ├── App.js                    # Point d'entrée
│   ├── app.json                  # Configuration Expo
│   ├── package.json
│   │
│   └── src/
│       ├── screens/
│       │   ├── HomeScreen.js         # Écran d'accueil
│       │   ├── CameraScreen.js       # Capture photo
│       │   └── ResultScreen.js       # Affichage résultat
│       │
│       ├── services/
│       │   └── api.js                # Appels API
│       │
│       └── styles/
│           └── theme.js              # Design system
│
└── README.md (ce fichier)
```

---

## 🚀 Démarrage Rapide

### Prérequis

- **Python 3.10+** installé
- **Node.js 18+** et **npm** installés
- **Expo Go** app sur votre téléphone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

---

### 1️⃣ Configuration du Backend

```bash
# Se placer dans le dossier backend
cd backend

# Créer un environnement virtuel Python
python3 -m venv venv

# Activer l'environnement
source venv/bin/activate  # Sur macOS/Linux
# OU
venv\Scripts\activate     # Sur Windows

# Installer les dépendances
pip install -r requirements.txt

# ⚠️ IMPORTANT : Placer votre fichier cnn_model.h5 dans app/models/
# Si vous n'avez pas encore de modèle, le serveur retournera une erreur au démarrage

# Lancer le serveur API
python main.py
```

Le serveur démarre sur **http://localhost:8000**

Testez avec : http://localhost:8000/health

---

### 2️⃣ Configuration du Mobile

```bash
# Ouvrir un nouveau terminal
cd mobile

# Installer les dépendances
npm install

# Lancer Expo
npx expo start
```

Un QR code s'affichera dans le terminal.

**Sur votre téléphone :**
1. Ouvrez l'app **Expo Go**
2. Scannez le QR code
3. L'application se lance automatiquement

---

## 📸 Utilisation de l'Application

### Écran 1 : Accueil
- Présentation de l'application
- Instructions en 3 étapes
- Bouton "Analyser un échantillon"

### Écran 2 : Caméra
- Guide de cadrage visuel pour centrer le microscope
- Bouton de capture photo
- Possibilité de sélectionner depuis la galerie
- Indicateur de chargement pendant l'analyse

### Écran 3 : Résultat
- Badge visuel **GO** (vert) ou **NO-GO** (rouge)
- Aperçu de l'image analysée
- Barre de confiance (pourcentage)
- Instructions détaillées selon le verdict
- Boutons pour nouvelle analyse ou retour accueil

---

## 🔧 Configuration API en Production

### Modifier l'URL de l'API

Dans le fichier `mobile/src/services/api.js`, ligne 4 :

```javascript
// En développement local
const API_BASE_URL = 'http://localhost:8000';

// En production (après déploiement Railway)
const API_BASE_URL = 'https://votre-api.railway.app';
```

---

## 🌐 Déploiement

### Backend sur Railway

1. Créer un compte sur [Railway.app](https://railway.app)
2. Installer Railway CLI :
   ```bash
   npm install -g @railway/cli
   ```

3. Déployer :
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

4. Récupérer l'URL générée et la copier dans `mobile/src/services/api.js`

### Build Mobile

```bash
cd mobile

# Installation d'EAS CLI
npm install -g eas-cli

# Configuration
eas login
eas build:configure

# Build Android (APK)
eas build --platform android --profile preview

# Build iOS (nécessite compte Apple Developer)
eas build --platform ios --profile preview
```

---

## 🧪 Tests

### Backend

```bash
cd backend
source venv/bin/activate

# Installer pytest
pip install pytest pytest-asyncio httpx

# Lancer les tests
pytest tests/
```

### Tester l'API avec curl

```bash
# Health check
curl http://localhost:8000/health

# Prédiction avec une image
curl -X POST http://localhost:8000/predict \
  -F "file=@chemin/vers/image.jpg"
```

---

## ⚠️ Points d'Attention

### 1. Modèle CNN Manquant

Si vous n'avez pas encore de modèle `cnn_model.h5` :
- Le backend démarrera mais retournera une erreur lors des prédictions
- Placez votre modèle entraîné dans `backend/app/models/cnn_model.h5`

### 2. Permissions Caméra

Sur iOS/Android, l'application demandera automatiquement les permissions :
- Accès à la caméra
- Accès à la galerie photos

Les messages de demande sont configurés dans `mobile/app.json`.

### 3. Connexion Réseau

- En développement : votre téléphone et ordinateur doivent être sur le même réseau Wi-Fi
- En production : utiliser une URL HTTPS pour l'API

### 4. Qualité des Images

Pour de meilleurs résultats :
- Photos de microscope à grossissement x400 minimum
- Bon éclairage
- Mise au point nette
- Centrage de l'oculaire

---

## 📊 API Endpoints

### `GET /health`
Vérification de l'état du serveur

**Réponse :**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### `POST /predict`
Analyse d'une image microscopique

**Paramètres :**
- `file` : Image (JPEG, PNG)

**Réponse :**
```json
{
  "prediction": "GO",
  "confidence": 0.87,
  "message": "Solution prête pour déversement"
}
```

---

## 🎨 Personnalisation

### Couleurs

Modifiez `mobile/src/styles/theme.js` pour changer :
- Couleurs principales (primary, accent)
- Couleurs des états GO/NO-GO
- Espacements
- Rayons de bordure

### Seuil de Décision

Dans `backend/app/services/model_service.py`, ligne 27 :
```python
threshold = 0.5  # Ajustez selon vos besoins
```

---

## 🐛 Dépannage

### Backend ne démarre pas
- Vérifier que Python 3.10+ est installé : `python --version`
- Vérifier que l'environnement virtuel est activé
- Réinstaller les dépendances : `pip install -r requirements.txt`

### App mobile ne se connecte pas
- Vérifier que le backend tourne sur `http://localhost:8000`
- Tester l'URL avec : `curl http://localhost:8000/health`
- Sur mobile, vérifier que Wi-Fi est activé et sur le même réseau

### Expo ne démarre pas
- Supprimer `node_modules` et réinstaller : 
  ```bash
  rm -rf node_modules
  npm install
  ```

### Erreur "Model not found"
- Placer votre fichier `cnn_model.h5` dans `backend/app/models/`
- Vérifier les permissions du fichier

---

## 📞 Support

En cas de problème :
1. Vérifier les logs du backend : terminal où tourne `python main.py`
2. Vérifier les logs Expo : terminal où tourne `npx expo start`
3. Consulter la console du téléphone dans Expo Go

---

## 📝 Checklist de Mise en Production

- [ ] Modèle CNN entraîné et placé dans `backend/app/models/`
- [ ] Backend testé en local avec images réelles
- [ ] API déployée sur Railway (ou autre)
- [ ] URL de production configurée dans `mobile/src/services/api.js`
- [ ] Tests sur iPhone et Android
- [ ] Build APK Android généré
- [ ] Documentation utilisateur finale créée
- [ ] Formation des chauffeurs planifiée

---

## 🏆 Fonctionnalités Futures (V2)

- [ ] Historique des analyses
- [ ] Export des résultats en PDF
- [ ] Mode hors ligne avec synchronisation
- [ ] Statistiques et graphiques
- [ ] Multi-utilisateurs avec authentification
- [ ] Notifications push pour rappels d'analyse

---

## 📄 Licence

Ce projet est développé pour un usage interne dans le cadre de l'analyse de solutions de bio-minéralisation.

---

**Version :** 1.0.0  
**Dernière mise à jour :** Décembre 2024
