## Checklist de Tests BioMicro

### ✅ Tests Fonctionnels

#### Backend
- [ ] Serveur démarre sans erreur
- [ ] Endpoint `/health` retourne status healthy
- [ ] Endpoint `/predict` accepte les images JPEG
- [ ] Endpoint `/predict` accepte les images PNG
- [ ] Traitement d'image ne plante pas avec images de mauvaise qualité
- [ ] Modèle CNN charge correctement au démarrage
- [ ] Prédictions GO retournent confidence > 0.5
- [ ] Prédictions NO-GO retournent confidence < 0.5

#### Mobile
- [ ] Application démarre sans crash
- [ ] Navigation Home → Camera fonctionne
- [ ] Demande de permission caméra apparaît
- [ ] Demande de permission galerie apparaît
- [ ] Prise de photo depuis l'app fonctionne
- [ ] Import depuis galerie fonctionne
- [ ] Guide de cadrage s'affiche correctement
- [ ] Indicateur de chargement pendant l'analyse
- [ ] Navigation vers écran résultat après analyse
- [ ] Résultat GO s'affiche en vert
- [ ] Résultat NO-GO s'affiche en rouge
- [ ] Barre de confiance affiche le bon pourcentage
- [ ] Bouton "Nouvelle analyse" fonctionne
- [ ] Bouton "Retour accueil" fonctionne

---

### ⚡ Tests de Performance

- [ ] Temps de réponse API < 3 secondes
- [ ] Application reste réactive pendant chargement
- [ ] Pas de fuite mémoire avec images lourdes (> 5 MB)
- [ ] Pas de crash avec 10 analyses consécutives
- [ ] Rechargement de l'app conserve l'état

---

### 🔌 Tests de Connexion

- [ ] Comportement gracieux si API indisponible
- [ ] Message d'erreur clair si timeout serveur
- [ ] Message d'erreur si pas de connexion Wi-Fi
- [ ] Retry automatique en cas d'échec temporaire

---

### 📱 Tests sur Appareils

#### iOS
- [ ] iPhone 12+ (iOS 15+)
- [ ] iPhone SE (petit écran)
- [ ] iPad (orientation portrait)

#### Android
- [ ] Samsung Galaxy S21+ (Android 12+)
- [ ] Google Pixel (Android natif)
- [ ] Appareil budget (Android 10+)

---

### 🖼️ Tests d'Image

- [ ] Image microscopique typique (x400)
- [ ] Image floue
- [ ] Image sous-exposée
- [ ] Image sur-exposée
- [ ] Image de très haute résolution (> 10 MP)
- [ ] Image de faible résolution (< 1 MP)
- [ ] Image corrompue
- [ ] Fichier non-image (PDF, TXT)

---

### 🛡️ Tests de Sécurité

- [ ] Upload limité à images uniquement
- [ ] Taille max de fichier respectée
- [ ] Pas d'injection de code via filename
- [ ] CORS configuré correctement
- [ ] Headers de sécurité présents

---

### 🌐 Tests de Déploiement

- [ ] Backend déployé sur Railway accessible
- [ ] URL HTTPS fonctionne
- [ ] Health check répond en production
- [ ] Mobile se connecte à l'API en production
- [ ] Certificat SSL valide
- [ ] Logs de production accessibles

---

### 📊 Tests de Validation Métier

- [ ] Images GO identifiées correctement (90%+)
- [ ] Images NO-GO identifiées correctement (90%+)
- [ ] Faux positifs < 5%
- [ ] Faux négatifs < 5%
- [ ] Validation avec expert microscopiste
- [ ] Test sur 50+ images réelles variées

---

### 📝 Documentation

- [ ] README.md à jour
- [ ] QUICKSTART.md clair et fonctionnel
- [ ] Commentaires de code en place
- [ ] Instructions de déploiement testées
- [ ] Guide utilisateur final rédigé

---

## 🐛 Bugs Connus

| Bug | Priorité | Status |
|-----|----------|--------|
| _À compléter après tests_ | | |

---

## ✅ Validation Finale

- [ ] Tests fonctionnels : 100%
- [ ] Tests performance : Validés
- [ ] Tests appareils : iOS + Android OK
- [ ] Tests métier : Précision > 90%
- [ ] Documentation : Complète
- [ ] Prêt pour production

---

**Date des tests :** _________  
**Testeur :** _________  
**Version :** 1.0.0
