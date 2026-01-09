# 📝 Notes de Développement - BioMicro

## 🎯 Décisions Techniques

### Pourquoi React Native + Expo ?
- **Cross-platform** : Un seul code pour iOS et Android
- **Développement rapide** : Hot reload, pas besoin de Xcode/Android Studio
- **Écosystème mature** : Nombreuses librairies disponibles
- **OTA Updates** : Mises à jour sans rebuild complet

### Pourquoi FastAPI ?
- **Performance** : Async/await natif, rapide comme Node.js
- **Validation automatique** : Pydantic pour validation des données
- **Documentation auto** : Swagger UI inclus
- **Python** : Intégration facile avec TensorFlow/OpenCV

---

## 🏗️ Architecture Détaillée

### Backend - Flow de Prédiction

```
1. Réception image (POST /predict)
   ↓
2. Conversion bytes → PIL Image
   ↓
3. Preprocessing (image_processor.py)
   - Conversion niveaux de gris
   - Filtrage bruit (GaussianBlur)
   - Seuillage adaptatif
   - Morphologie (ouverture + fermeture)
   - Redimensionnement (224x224)
   - Normalisation (0-1)
   ↓
4. Prédiction CNN (model_service.py)
   - Ajout dimensions batch/channel
   - Inférence TensorFlow
   - Calcul confidence
   ↓
5. Retour JSON
   {prediction, confidence, message}
```

### Mobile - Navigation Flow

```
HomeScreen
    ↓ (Bouton "Analyser")
CameraScreen
    ↓ (Capture photo OU sélection galerie)
    ↓ (Appel API /predict)
ResultScreen
    ↓ (Bouton "Nouvelle analyse")
CameraScreen
    OU
    ↓ (Bouton "Retour accueil")
HomeScreen
```

---

## 🎨 Design System

### Palette de Couleurs

```javascript
Primary: #1B4D3E    // Vert foncé - Confiance, nature
Accent:  #4ECDC4    // Turquoise - Action, clarté
GO:      #22C55E    // Vert vif - Succès
NO-GO:   #EF4444    // Rouge - Alerte
```

**Rationale** :
- Vert : Association avec validation, écologie
- Rouge : Signal d'arrêt universel
- Contraste élevé : Lisibilité en plein soleil (usage terrain)

### Espacements (8pt Grid System)

```
xs:  4px   (padding minimal)
sm:  8px   (espacement serré)
md:  16px  (espacement standard)
lg:  24px  (séparation sections)
xl:  32px  (marges écran)
xxl: 48px  (header)
```

---

## 🔧 Configuration Recommandée

### Backend - Production

```python
# main.py - Recommandations
- workers: 4 (pour Railway/Render)
- timeout: 60s (analyses lourdes)
- max_upload_size: 10MB
- log_level: INFO
```

### Mobile - Optimisations

```javascript
// Configuration image
- quality: 0.8 (bon compromis qualité/taille)
- format: JPEG (plus léger que PNG)
- max_dimension: 2048px (éviter images trop lourdes)
```

---

## 📊 Performance Attendue

### Backend
- Temps traitement image : ~0.5s
- Temps inférence CNN : ~1-2s
- **Total** : ~2-3s par image

### Mobile
- Temps capture photo : instantané
- Temps upload : ~0.5s (dépend connexion)
- **Total utilisateur** : ~3-4s

---

## 🔐 Sécurité

### Implémentées

✅ CORS configuré (allow_origins à restreindre en prod)
✅ Validation type fichier (images uniquement)
✅ Limite taille upload
✅ Pas de stockage persistant des images

### À Améliorer (V2)

- [ ] Authentification JWT
- [ ] Rate limiting (éviter abus API)
- [ ] Chiffrement images en transit (HTTPS obligatoire)
- [ ] Audit logs des prédictions
- [ ] Validation côté backend des permissions caméra

---

## 🐛 Problèmes Connus

### Backend

1. **Modèle non trouvé au démarrage**
   - Cause : `cnn_model.h5` manquant
   - Solution : Placer le modèle dans `app/models/`

2. **Timeout sur images lourdes**
   - Cause : Traitement long sur CPU
   - Solution : Redimensionner côté mobile avant envoi

### Mobile

1. **Permissions refusées**
   - Cause : Utilisateur refuse l'accès caméra
   - Solution : Message clair avec instructions réactivation

2. **Expo Go crashe sur vieux Android**
   - Cause : Android < 10 non supporté par Expo 50
   - Solution : Downgrade Expo à v49 ou build standalone

---

## 📈 Métriques à Suivre

### Phase Bêta
- Nombre d'analyses/jour
- Taux de réussite (prédiction correcte)
- Temps moyen d'analyse
- Taux de crash
- Feedback utilisateurs

### Objectifs
- Précision : > 90%
- Temps réponse : < 5s
- Disponibilité API : > 99%
- Taux d'adoption : > 80% chauffeurs

---

## 🚀 Roadmap

### V1.0 (MVP) - ✅ Complété
- [x] Capture photo
- [x] Analyse GO/NO-GO
- [x] Interface simple
- [x] Backend FastAPI
- [x] Déploiement Railway

### V1.1 (Améliorations)
- [ ] Historique des analyses
- [ ] Export résultats PDF
- [ ] Mode sombre
- [ ] Notifications push

### V2.0 (Avancé)
- [ ] Mode offline (TFLite local)
- [ ] Multi-utilisateurs + authentification
- [ ] Dashboard admin web
- [ ] Analytics avancées
- [ ] Machine learning amélioré (plus de classes)

---

## 💡 Idées Futures

1. **Feedback loop**
   - Permettre aux chauffeurs de corriger une mauvaise prédiction
   - Utiliser ces données pour réentraîner le modèle

2. **Géolocalisation**
   - Tracker où les analyses sont faites
   - Heatmap des zones problématiques

3. **Intégration IoT**
   - Capteurs automatiques sur camions
   - Déclenchement auto de l'analyse

4. **Assistant vocal**
   - "Dis BioMicro, analyse l'échantillon"
   - Résultat audio (mains libres)

---

## 📚 Ressources Utiles

### Documentation
- [FastAPI](https://fastapi.tiangolo.com/)
- [React Navigation](https://reactnavigation.org/)
- [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- [TensorFlow Lite](https://www.tensorflow.org/lite)

### Outils
- [Postman](https://www.postman.com/) - Test API
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Railway](https://railway.app/) - Hébergement

---

**Dernière mise à jour :** 9 décembre 2024  
**Mainteneur :** Équipe BioMicro
