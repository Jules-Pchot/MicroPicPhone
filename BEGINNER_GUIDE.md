## 🛠️ Étape 0 : Installation des Outils

### 1. Python (pour le backend)

**macOS :**
```bash
# Vérifier si Python est installé
python3 --version

# Si pas installé, télécharger depuis python.org
# Ou installer avec Homebrew :
brew install python@3.11
```

**Windows :**
1. Télécharger depuis [python.org](https://www.python.org/downloads/)
2. Cocher "Add Python to PATH" pendant l'installation
3. Vérifier : `python --version` dans le terminal

---

### 2. Node.js (pour le mobile)

**macOS :**
```bash
# Télécharger depuis nodejs.org
# Ou installer avec Homebrew :
brew install node@18
```

**Windows :**
1. Télécharger depuis [nodejs.org](https://nodejs.org/)
2. Installer la version LTS (Long Term Support)
3. Vérifier : `node --version` et `npm --version`

---

### 3. Expo Go (sur votre téléphone)

**iPhone :**
- Ouvrir l'App Store
- Chercher "Expo Go"
- Installer

**Android :**
- Ouvrir le Google Play Store
- Chercher "Expo Go"
- Installer

## 🚀 Étape 1 : Premier Lancement (Local)

### Option A : Script Automatique (Recommandé)

```bash
# 1. Ouvrir le terminal
# 2. Aller dans le dossier du projet
# 3. Vérifier la configuration
./check.sh

# 4. Lancer tout automatiquement
./start.sh
```

C'est tout ! Le backend et le mobile démarrent automatiquement.

---

### Option B : Manuel (Pour Comprendre)

#### Terminal 1 : Backend

```bash
# 1. Aller dans le dossier backend

# 2. Créer un environnement virtuel Python
python3 -m venv venv

# 3. Activer l'environnement
source venv/bin/activate  # macOS/Linux
# OU
venv\Scripts\activate     # Windows

# 4. Installer les dépendances
pip install -r requirements.txt

# 5. Lancer le serveur
python main.py
```

**Vous devriez voir :**
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

✅ Backend lancé ! Testez : http://localhost:8000/health

---

#### Terminal 2 : Mobile

```bash
# 1. Ouvrir un NOUVEAU terminal
# 2. Aller dans le dossier mobile

# 3. Installer les dépendances
npm install

# 4. Lancer Expo
npx expo start
```

**Vous devriez voir :**
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go
```

✅ Mobile lancé ! Scannez le QR code avec Expo Go.

---

## 📱 Étape 2 : Tester l'Application

### 1. Scanner le QR Code

- Ouvrez **Expo Go** sur votre téléphone
- **iPhone** : Ouvrez l'appareil photo natif, pointez vers le QR code
- **Android** : Dans Expo Go, appuyez sur "Scan QR Code"

### 2. L'app se lance

Vous devriez voir l'écran d'accueil BioMicro avec :
- Le logo 🔬
- Le titre "BioMicro"
- Les 3 étapes d'utilisation
- Un bouton "Analyser un échantillon"

### 3. Tester la Caméra

1. Appuyez sur "Analyser un échantillon"
2. Autorisez l'accès à la caméra
3. Prenez une photo (ou sélectionnez depuis la galerie)

**⚠️ Important :** Sans modèle CNN, l'analyse échouera. C'est normal !

---

## 🧠 Étape 3 : Ajouter Votre Modèle CNN

### Où Placer le Modèle ?

```
backend/app/models/cnn_model.h5
```

### Comment ?

```bash
# Option 1 : Copier depuis votre ordinateur
cp /chemin/vers/votre/modele.h5 backend/app/models/cnn_model.h5

# Option 2 : Télécharger depuis un serveur
curl -o backend/app/models/cnn_model.h5 https://votre-url/modele.h5

# Option 3 : Utiliser le Finder (macOS) ou l'Explorateur (Windows)
# Glisser-déposer le fichier dans backend/app/models/
```

### Vérifier

```bash
# Le fichier existe ?
ls -lh backend/app/models/cnn_model.h5

# Taille attendue : 10-100 MB
```

### Redémarrer le Backend

```bash
# Dans le terminal du backend, faire Ctrl+C
# Puis relancer :
python main.py
```

✅ Maintenant les prédictions fonctionneront !

---

## 🧪 Étape 4 : Tester l'API Manuellement

### Avec curl (Terminal)

```bash
# Test health check
curl http://localhost:8000/health

# Résultat attendu :
# {"status":"healthy","model_loaded":true}

# Test prédiction avec une image
curl -X POST http://localhost:8000/predict \
  -F "file=@/chemin/vers/une/image.jpg"

# Résultat attendu :
# {"prediction":"GO","confidence":0.87,"message":"..."}
```

### Avec le Navigateur

Ouvrez : http://localhost:8000/docs

Vous verrez l'interface **Swagger UI** automatique de FastAPI !

1. Cliquez sur `/predict`
2. Cliquez sur "Try it out"
3. Uploadez une image
4. Cliquez sur "Execute"
5. Voyez le résultat

---

## 🐛 Dépannage - Problèmes Courants

### 🔴 "python: command not found"

**Solution :**
```bash
# Essayez avec python3
python3 --version

# Si ça ne marche pas, réinstallez Python
```

### 🔴 "npm: command not found"

**Solution :**
Réinstallez Node.js depuis [nodejs.org](https://nodejs.org/)

### 🔴 "Port 8000 already in use"

**Solution :**
```bash
# Tuer le processus sur le port 8000
lsof -ti:8000 | xargs kill -9

# Ou changer le port dans main.py :
uvicorn.run(app, host="0.0.0.0", port=8001)
```

### 🔴 "Cannot connect to Metro"

**Solution :**
1. Vérifiez que téléphone et ordinateur sont sur le même Wi-Fi
2. Désactivez le VPN
3. Désactivez le pare-feu temporairement
4. Relancez Expo : `npx expo start --clear`

### 🔴 "Module not found: opencv"

**Solution :**
```bash
cd backend
source venv/bin/activate
pip install opencv-python-headless
```

### 🔴 "Model file not found"

**Solution :**
Placez votre fichier `cnn_model.h5` dans `backend/app/models/`

### 🔴 L'app se fige pendant l'analyse

**Causes possibles :**
1. Backend pas lancé → Vérifier http://localhost:8000/health
2. Mauvaise URL dans `api.js` → Vérifier ligne 4
3. Connexion réseau coupée → Vérifier Wi-Fi

---

## 📖 Comprendre le Code

### Structure Simplifiée

```
Backend (Python)
│
├── main.py                    # Point d'entrée, définit les routes
├── image_processor.py         # Nettoie et prépare l'image
└── model_service.py           # Fait la prédiction avec le CNN

Mobile (JavaScript)
│
├── App.js                     # Navigation entre les écrans
├── HomeScreen.js              # Écran d'accueil
├── CameraScreen.js            # Prise de photo
├── ResultScreen.js            # Affichage résultat
└── api.js                     # Appels vers le backend
```

### Flow Complet

```
1. Utilisateur ouvre l'app
   → HomeScreen.js s'affiche

2. Utilisateur appuie sur "Analyser"
   → Navigation vers CameraScreen.js

3. Utilisateur prend une photo
   → Photo enregistrée localement

4. api.js envoie la photo au backend
   → POST http://localhost:8000/predict

5. Backend reçoit l'image
   → main.py → image_processor.py → model_service.py

6. Modèle CNN fait la prédiction
   → Retourne {prediction: "GO", confidence: 0.87}

7. Mobile reçoit la réponse
   → Navigation vers ResultScreen.js

8. Résultat affiché
   → Badge vert (GO) ou rouge (NO-GO)
```

---

## 🎓 Ressources pour Apprendre

### Python / FastAPI
- [Tutorial FastAPI officiel](https://fastapi.tiangolo.com/tutorial/)
- [Python pour débutants](https://www.python.org/about/gettingstarted/)

### React Native
- [Tutorial React Native](https://reactnative.dev/docs/tutorial)
- [Expo Documentation](https://docs.expo.dev/)

### Machine Learning
- [TensorFlow Tutorials](https://www.tensorflow.org/tutorials)
- [OpenCV Python Tutorials](https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html)

### Git / GitHub
- [Git Tutorial](https://git-scm.com/docs/gittutorial)
- [GitHub Guides](https://guides.github.com/)
---

**Vous êtes maintenant développeur mobile full-stack ! 🚀**

---

**Bon développement ! 💻**
