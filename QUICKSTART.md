# Guide de Démarrage Rapide - BioMicro

## 🚀 Mise en Route en 5 Minutes

### Étape 1 : Backend (Terminal 1)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

✅ Vérifiez : http://localhost:8000/health

---

### Étape 2 : Mobile (Terminal 2)

```bash
cd mobile
npm install
npx expo start
```

✅ Scannez le QR code avec **Expo Go** sur votre téléphone

---

## ⚠️ N'oubliez pas !

1. **Placer votre modèle CNN** : `backend/app/models/cnn_model.h5`

2. **Même réseau Wi-Fi** : téléphone + ordinateur

3. **Expo Go installé** : 
   - [iOS](https://apps.apple.com/app/expo-go/id982107779)
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

---

## 🎯 Tester l'API

```bash
# Health check
curl http://localhost:8000/health

# Avec une image
curl -X POST http://localhost:8000/predict \
  -F "file=@test_image.jpg"
```

---

## 📱 Utilisation

1. **Accueil** → Bouton "Analyser un échantillon"
2. **Caméra** → Prenez une photo ou sélectionnez depuis la galerie
3. **Résultat** → Verdict GO/NO-GO avec instructions

---

## 🐛 Problèmes ?

- **Backend ne démarre pas** → Vérifier Python 3.10+
- **App ne se connecte pas** → Même Wi-Fi ?
- **Expo plante** → `rm -rf node_modules && npm install`

Plus d'infos : Voir `README.md` complet
