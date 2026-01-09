#!/bin/bash

# Script de vérification de la configuration BioMicro
# Usage: ./check.sh

set -e

COLOR_GREEN='\033[0;32m'
COLOR_RED='\033[0;31m'
COLOR_YELLOW='\033[1;33m'
COLOR_BLUE='\033[0;34m'
COLOR_RESET='\033[0m'

print_check() {
    if [ $1 -eq 0 ]; then
        echo -e "${COLOR_GREEN}✅ $2${COLOR_RESET}"
        return 0
    else
        echo -e "${COLOR_RED}❌ $2${COLOR_RESET}"
        return 1
    fi
}

print_warning() {
    echo -e "${COLOR_YELLOW}⚠️  $1${COLOR_RESET}"
}

print_info() {
    echo -e "${COLOR_BLUE}ℹ️  $1${COLOR_RESET}"
}

echo -e "${COLOR_BLUE}================================${COLOR_RESET}"
echo -e "${COLOR_BLUE}🔬 Vérification Configuration${COLOR_RESET}"
echo -e "${COLOR_BLUE}================================${COLOR_RESET}\n"

# Vérifications Système
echo -e "${COLOR_BLUE}[1/5] Vérifications Système${COLOR_RESET}"
echo "--------------------------------"

# Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    print_check 0 "Python installé (v$PYTHON_VERSION)"
    
    # Vérifier version >= 3.10
    PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d'.' -f1)
    PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d'.' -f2)
    if [ "$PYTHON_MAJOR" -ge 3 ] && [ "$PYTHON_MINOR" -ge 10 ]; then
        print_check 0 "Version Python >= 3.10"
    else
        print_check 1 "Version Python < 3.10 (requis: 3.10+)"
    fi
else
    print_check 1 "Python non installé"
fi

# Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | sed 's/v//')
    print_check 0 "Node.js installé (v$NODE_VERSION)"
    
    # Vérifier version >= 18
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -ge 18 ]; then
        print_check 0 "Version Node.js >= 18"
    else
        print_check 1 "Version Node.js < 18 (requis: 18+)"
    fi
else
    print_check 1 "Node.js non installé"
fi

# npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_check 0 "npm installé (v$NPM_VERSION)"
else
    print_check 1 "npm non installé"
fi

# Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | cut -d' ' -f3)
    print_check 0 "Git installé (v$GIT_VERSION)"
else
    print_warning "Git non installé (optionnel)"
fi

echo ""

# Vérifications Backend
echo -e "${COLOR_BLUE}[2/5] Vérifications Backend${COLOR_RESET}"
echo "--------------------------------"

# Structure backend
if [ -d "backend" ]; then
    print_check 0 "Dossier backend/ existe"
else
    print_check 1 "Dossier backend/ manquant"
fi

if [ -f "backend/main.py" ]; then
    print_check 0 "Fichier main.py existe"
else
    print_check 1 "Fichier main.py manquant"
fi

if [ -f "backend/requirements.txt" ]; then
    print_check 0 "Fichier requirements.txt existe"
else
    print_check 1 "Fichier requirements.txt manquant"
fi

# Environnement virtuel
if [ -d "backend/venv" ]; then
    print_check 0 "Environnement virtuel existe"
else
    print_warning "Environnement virtuel non créé (normal si première fois)"
    print_info "Exécuter: cd backend && python3 -m venv venv"
fi

# Modèle CNN
if [ -f "backend/app/models/cnn_model.h5" ]; then
    print_check 0 "Modèle CNN trouvé"
    MODEL_SIZE=$(du -h "backend/app/models/cnn_model.h5" | cut -f1)
    print_info "Taille: $MODEL_SIZE"
else
    print_warning "Modèle CNN non trouvé (à placer dans backend/app/models/)"
fi

echo ""

# Vérifications Mobile
echo -e "${COLOR_BLUE}[3/5] Vérifications Mobile${COLOR_RESET}"
echo "--------------------------------"

# Structure mobile
if [ -d "mobile" ]; then
    print_check 0 "Dossier mobile/ existe"
else
    print_check 1 "Dossier mobile/ manquant"
fi

if [ -f "mobile/App.js" ]; then
    print_check 0 "Fichier App.js existe"
else
    print_check 1 "Fichier App.js manquant"
fi

if [ -f "mobile/package.json" ]; then
    print_check 0 "Fichier package.json existe"
else
    print_check 1 "Fichier package.json manquant"
fi

if [ -f "mobile/app.json" ]; then
    print_check 0 "Fichier app.json existe"
else
    print_check 1 "Fichier app.json manquant"
fi

# node_modules
if [ -d "mobile/node_modules" ]; then
    print_check 0 "node_modules installé"
    PKG_COUNT=$(find mobile/node_modules -maxdepth 1 -type d | wc -l)
    print_info "Packages: $((PKG_COUNT-1))"
else
    print_warning "node_modules non installé (normal si première fois)"
    print_info "Exécuter: cd mobile && npm install"
fi

# Vérifier URL API dans api.js
if [ -f "mobile/src/services/api.js" ]; then
    API_URL=$(grep "const API_BASE_URL" mobile/src/services/api.js | cut -d"'" -f2)
    if [[ $API_URL == *"localhost"* ]]; then
        print_warning "URL API en mode développement: $API_URL"
        print_info "Changer en production après déploiement"
    else
        print_check 0 "URL API configurée: $API_URL"
    fi
fi

echo ""

# Vérifications Documentation
echo -e "${COLOR_BLUE}[4/5] Vérifications Documentation${COLOR_RESET}"
echo "--------------------------------"

DOCS=("README.md" "QUICKSTART.md" "DEPLOYMENT.md" "TESTING_CHECKLIST.md" "STRUCTURE.md" "PROJECT_SUMMARY.md")
for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        LINES=$(wc -l < "$doc")
        print_check 0 "$doc ($LINES lignes)"
    else
        print_check 1 "$doc manquant"
    fi
done

echo ""

# Vérifications Réseau
echo -e "${COLOR_BLUE}[5/5] Vérifications Réseau${COLOR_RESET}"
echo "--------------------------------"

# Tester connexion internet
if ping -c 1 google.com &> /dev/null; then
    print_check 0 "Connexion internet active"
else
    print_warning "Pas de connexion internet"
fi

# Vérifier si backend tourne
if curl -s http://localhost:8000/health &> /dev/null; then
    print_check 0 "Backend accessible sur http://localhost:8000"
    
    # Vérifier réponse health
    HEALTH_STATUS=$(curl -s http://localhost:8000/health | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
    if [ "$HEALTH_STATUS" == "healthy" ]; then
        print_check 0 "Health check: $HEALTH_STATUS"
    fi
else
    print_warning "Backend non démarré (normal si pas encore lancé)"
    print_info "Exécuter: cd backend && python main.py"
fi

echo ""
echo -e "${COLOR_BLUE}================================${COLOR_RESET}"
echo -e "${COLOR_BLUE}📊 Résumé${COLOR_RESET}"
echo -e "${COLOR_BLUE}================================${COLOR_RESET}\n"

# Calculer statistiques
TOTAL_FILES=$(find . -type f -not -path '*/node_modules/*' -not -path '*/venv/*' -not -path '*/__pycache__/*' -not -path '*/.git/*' | wc -l)
BACKEND_FILES=$(find backend -type f -name "*.py" | wc -l)
MOBILE_FILES=$(find mobile/src -type f -name "*.js" 2>/dev/null | wc -l)
DOC_FILES=$(find . -maxdepth 1 -name "*.md" | wc -l)

echo "📁 Fichiers totaux: $TOTAL_FILES"
echo "🐍 Fichiers Python: $BACKEND_FILES"
echo "📱 Fichiers JavaScript: $MOBILE_FILES"
echo "📄 Fichiers Markdown: $DOC_FILES"
echo ""

# Prochaines étapes
echo -e "${COLOR_BLUE}🎯 Prochaines Étapes${COLOR_RESET}"
echo "--------------------------------"

if [ ! -d "backend/venv" ]; then
    echo "1. Créer l'environnement virtuel:"
    echo "   cd backend && python3 -m venv venv"
fi

if [ ! -d "mobile/node_modules" ]; then
    echo "2. Installer les dépendances mobile:"
    echo "   cd mobile && npm install"
fi

if [ ! -f "backend/app/models/cnn_model.h5" ]; then
    echo "3. Placer le modèle CNN:"
    echo "   cp votre_modele.h5 backend/app/models/cnn_model.h5"
fi

echo "4. Lancer l'application:"
echo "   ./start.sh"
echo ""

echo -e "${COLOR_GREEN}✨ Vérification terminée !${COLOR_RESET}"
