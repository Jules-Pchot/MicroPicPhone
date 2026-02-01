# 🔬 BioMicro - Classification des Phases Bactériennes

Application mobile pour l'analyse d'images microscopiques de *Sporosarcina pasteurii* permettant de déterminer si une solution de bio-ciment est prête pour le déversement.

## 📊 Vue d'Ensemble

| Aspect | Détail |
|--------|--------|
| **Plateformes** | iOS 14+ / Android 10+ |
| **Frontend** | React Native + Expo |
| **Backend** | FastAPI + PyTorch |
| **Modèle IA** | BacteriaCNN (3 classes) |
| **Précision** | ~86% sur validation |
| **Temps d'analyse** | 2-3 secondes |

## 🦠 Phases Bactériennes Détectées

| Phase | Résultat | Description |
|-------|----------|-------------|
| **Exponentielle** | ✅ GO | Croissance active - Prêt pour déversement |
| **Stationnaire** | ⚠️ NO-GO | Maximum atteint - Attendre |
| **Mort** | ❌ NO-GO | Déclin - Renouveler la culture |

## 🏗️ Architecture

```
┌─────────────────┐     HTTPS      ┌─────────────────┐
│   Application   │ ←────────────→ │   API Backend   │
│  React Native   │                │    FastAPI      │
│    (Expo)       │                │                 │
└─────────────────┘                └────────┬────────┘
                                            │
                                   ┌────────▼────────┐
                                   │  Modèle CNN     │
                                   │   PyTorch       │
                                   │  BacteriaCNN    │
                                   └─────────────────┘
```

## 📂 Structure du Projet

```
MicroPicPhone/
├── backend/                    # API Python
│   ├── main.py                 # Point d'entrée FastAPI
│   ├── requirements.txt        # Dépendances Python
│   └── app/
│       ├── models/
│       │   └── model.pt        # Modèle PyTorch entraîné
│       └── services/
│           ├── model_service.py    # Prédiction CNN
│           └── image_processor.py  # Prétraitement images
│
├── mobile/                     # Application React Native
│   ├── App.js                  # Point d'entrée
│   └── src/
│       ├── screens/
│       │   ├── HomeScreen.js       # Accueil
│       │   ├── CameraScreen.js     # Capture photo
│       │   └── ResultScreen.js     # Résultat GO/NO-GO
│       ├── services/
│       │   └── api.js              # Appels API
│       └── styles/
│           └── theme.js            # Design system
│
└── engineering_project.py      # Notebook d'entraînement
```

## 🚀 Installation

### Backend

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate      # Windows
# source venv/bin/activate   # Linux/Mac
pip install -r requirements.txt
python main.py
```

L'API sera accessible sur `http://localhost:8000`

### Mobile

```bash
cd mobile
npm install
npx expo start
```

Scanner le QR code avec Expo Go sur votre téléphone.

⚠️ **Modifier l'URL de l'API** dans `mobile/src/services/api.js` :
```javascript
const API_BASE_URL = 'http://VOTRE_IP:8000';
```

## 📡 Endpoints API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Page d'accueil |
| GET | `/health` | État du serveur |
| GET | `/info` | Infos sur le modèle |
| POST | `/predict` | Prédiction sur une image |

### Exemple de réponse `/predict`

```json
{
  "prediction": "GO",
  "phase": "expo",
  "confidence": 0.92,
  "message": "Solution prête pour déversement - Phase exponentielle détectée",
  "probabilities": {
    "expo": 0.92,
    "stationnaire": 0.05,
    "mort": 0.03
  },
  "processing_time": 0.234
}
```

## 🧠 Modèle CNN

### Architecture `BacteriaCNN`

```
Input: 256x256x1 (grayscale)
    ↓
Conv2d(1, 32) + BatchNorm + ReLU + MaxPool
    ↓
Conv2d(32, 64) + BatchNorm + ReLU + MaxPool
    ↓
Conv2d(64, 128) + BatchNorm + ReLU + MaxPool
    ↓
AdaptiveAvgPool + Flatten + Linear(128, 3)
    ↓
Output: 3 classes (expo, stationnaire, mort)
```

### Prétraitement

1. Conversion en niveaux de gris
2. Redimensionnement à 256x256
3. Normalisation avec mean/std du dataset
4. Conversion en tensor PyTorch

## 🧪 Tests

```bash
cd backend
pytest tests/ -v
```

## 👥 Équipe

- **Jules** : Acquisition d'images, Introduction, Méthodologie
- **Simon** : État de l'art, Prétraitement
- **Kylian** : Modèle CNN, Architecture ML
- **Rihem** : Résumé, Documentation
- **Issam** : Application mobile, Backend, Intégration

## 📄 Licence

Projet académique - EFREI Paris 2025-2026

---

**Version :** 2.0.0 (PyTorch)  
**Dernière mise à jour :** 1 février 2026
