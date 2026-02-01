# 📋 Tâches d'Issam - Projet BioMicro (Microscopy for AI)

> **Date :** 1 février 2026  
> **Deadline :** Mardi/Mercredi 3-4 février 2026 (soutenance orale)  
> **⚠️ URGENT : L'oral est dans 2-3 jours !**

---

## ✅ Ce qui a été fait (Backend + Mobile)

### Backend PyTorch modifié ✅
- [x] `model_service.py` - Converti de TensorFlow à **PyTorch**
- [x] `image_processor.py` - Prétraitement adapté (256x256, grayscale, normalisation)
- [x] `main.py` - API mise à jour avec les 3 phases
- [x] `requirements.txt` - Dépendances PyTorch
- [x] `test_prediction.py` - Tests unitaires mis à jour

### Mobile React Native modifié ✅
- [x] `api.js` - Service API mis à jour pour les nouvelles réponses
- [x] `ResultScreen.js` - Affichage des 3 phases avec probabilités
- [x] `theme.js` - Couleurs pour les 3 phases (vert/orange/rouge)

---

## 🔴 Tâches URGENTES Restantes

### 1. Récupérer le fichier du modèle
- [ ] **Demander à Kylian le fichier `model.pt`**
- [ ] Le placer dans `backend/app/models/model.pt`
- [ ] Récupérer les vraies valeurs de normalisation (mean/std)

### 2. Mettre à jour les paramètres de normalisation
Dans `backend/app/services/model_service.py` et `image_processor.py`, remplacer :
```python
NORMALIZE_MEAN = 0.5  # Remplacer par vraie valeur
NORMALIZE_STD = 0.5   # Remplacer par vraie valeur
```
Par les valeurs calculées par Kylian (voir son notebook lignes 291-295)

### 3. Tester le backend localement
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
Puis tester avec : `curl http://localhost:8000/health`

### 4. Tester l'application mobile
```bash
cd mobile
npm install
npx expo start
```
- [ ] Modifier `API_BASE_URL` dans `api.js` avec ton IP locale
- [ ] Tester la capture photo
- [ ] Tester l'envoi à l'API
- [ ] Vérifier l'affichage des 3 phases

### 5. Push sur Git
```bash
git add .
git commit -m "Backend PyTorch + 3 phases (expo/stationnaire/mort)"
git push
```

---

## 📝 Partie du Rapport à Écrire

### Section 5.5 - Développement de l'application mobile

#### 5.5.1 Architecture logicielle
```
┌─────────────────┐     HTTPS/JSON     ┌─────────────────┐
│   Application   │ ←────────────────→ │   API Backend   │
│  React Native   │                    │    FastAPI      │
│    (Expo)       │                    │   + PyTorch     │
└─────────────────┘                    └─────────────────┘
        ↓                                      ↓
   3 écrans :                           Modèle CNN :
   - Accueil                            - BacteriaCNN
   - Caméra                             - 3 classes
   - Résultat                           - 86% accuracy
```

**Technologies utilisées :**
- Frontend : React Native + Expo
- Backend : FastAPI (Python)
- IA : PyTorch + BacteriaCNN
- Communication : REST API + multipart/form-data

#### 5.5.2 Interface utilisateur
- **HomeScreen** : Instructions d'utilisation en 3 étapes
- **CameraScreen** : Capture photo avec guide de cadrage
- **ResultScreen** : Affichage GO/NO-GO + phase détectée + probabilités

#### 5.5.3 Intégration du modèle IA
- Modèle chargé une fois au démarrage du serveur
- Image prétraitée : 256x256 grayscale, normalisée
- Prédiction en ~0.1-0.5 secondes (CPU)
- Retourne : label (GO/NO-GO), phase, confiance, probabilités

### Section 6.4 - Tests de l'application
- Tests unitaires : 10 tests dans `test_prediction.py`
- Tests manuels sur Expo Go (iOS/Android)
- Temps de réponse moyen : < 3 secondes

### Annexe C - Guide utilisateur
1. Ouvrir l'application BioMicro
2. Appuyer sur "Analyser un échantillon"
3. Photographier l'échantillon au microscope
4. Attendre le résultat (2-3 secondes)
5. Lire le verdict : GO (vert) ou NO-GO (orange/rouge)

---

## 📂 Structure des fichiers modifiés

```
MicroPicPhone/
├── backend/
│   ├── main.py                    ✅ Modifié
│   ├── requirements.txt           ✅ Modifié (PyTorch)
│   └── app/
│       ├── models/
│       │   └── model.pt           ⚠️ À RÉCUPÉRER DE KYLIAN
│       └── services/
│           ├── model_service.py   ✅ Modifié (PyTorch)
│           └── image_processor.py ✅ Modifié
│
├── mobile/
│   └── src/
│       ├── services/
│       │   └── api.js             ✅ Modifié
│       ├── screens/
│       │   └── ResultScreen.js    ✅ Modifié (3 phases)
│       └── styles/
│           └── theme.js           ✅ Modifié
│
└── engineering_project.py         📖 Notebook de Kylian
```

---

## 🏃 Plan d'Action pour ce soir

| Heure | Tâche |
|-------|-------|
| 22h55 | Contacter Kylian pour `model.pt` + valeurs mean/std |
| 23h00 | Installer les dépendances backend |
| 23h30 | Tester le backend |
| 00h00 | Tester l'app mobile |
| 00h30 | Écrire ta partie du rapport (sections 5.5, 6.4) |

---

## 📞 Message à envoyer à Kylian

> Salut Kylian ! J'ai adapté tout le backend pour ton modèle PyTorch (BacteriaCNN).
> 
> J'aurais besoin de :
> 1. Le fichier `model.pt` (le meilleur que t'as entraîné)
> 2. Les valeurs de mean et std que t'as calculées (lignes 291-295 du notebook)
> 
> Comme ça je peux finaliser l'intégration pour la soutenance !
> Merci 🙏

---

## ✅ Checklist Finale

- [x] Backend converti en PyTorch
- [x] 3 phases implémentées (expo/stationnaire/mort)
- [x] Mobile mis à jour pour afficher les phases
- [ ] Fichier `model.pt` récupéré
- [ ] Valeurs mean/std mises à jour
- [ ] Backend testé localement
- [ ] Mobile testé avec Expo
- [ ] Partie du rapport écrite
- [ ] Push sur Git

---

**Dernière mise à jour :** 1 février 2026 - 22h53
