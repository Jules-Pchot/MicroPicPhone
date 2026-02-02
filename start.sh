#!/bin/bash

# Script de démarrage rapide pour BioMicro
# Usage: ./start.sh [backend|mobile|all]

set -e

COLOR_GREEN='\033[0;32m'
COLOR_BLUE='\033[0;34m'
COLOR_RED='\033[0;31m'
COLOR_YELLOW='\033[1;33m'
COLOR_RESET='\033[0m'

print_header() {
    echo -e "${COLOR_BLUE}================================${COLOR_RESET}"
    echo -e "${COLOR_BLUE}🔬  BioMicro - Démarrage${COLOR_RESET}"
    echo -e "${COLOR_BLUE}================================${COLOR_RESET}\n"
}

check_backend_deps() {
    echo -e "${COLOR_YELLOW}📦 Vérification des dépendances backend...${COLOR_RESET}"
    
    if [ ! -d "backend/venv" ]; then
        echo -e "${COLOR_RED}❌ Environnement virtuel non trouvé${COLOR_RESET}"
        echo -e "${COLOR_YELLOW}Création de l'environnement...${COLOR_RESET}"
        cd backend
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
        cd ..
        echo -e "${COLOR_GREEN}✅ Environnement créé${COLOR_RESET}"
    else
        echo -e "${COLOR_GREEN}✅ Environnement virtuel OK${COLOR_RESET}"
    fi
    
    # Vérifier la présence du modèle PyTorch
    if [ ! -f "backend/app/models/model.pt" ]; then
        echo -e "${COLOR_RED}⚠️  ATTENTION : Modèle PyTorch non trouvé !${COLOR_RESET}"
        echo -e "${COLOR_YELLOW}Placez votre fichier model.pt dans backend/app/models/${COLOR_RESET}"
    else
        echo -e "${COLOR_GREEN}✅ Modèle PyTorch trouvé${COLOR_RESET}"
    fi
}

check_mobile_deps() {
    echo -e "${COLOR_YELLOW}📦 Vérification des dépendances mobile...${COLOR_RESET}"
    
    if [ ! -d "mobile/node_modules" ]; then
        echo -e "${COLOR_RED}❌ node_modules non trouvé${COLOR_RESET}"
        echo -e "${COLOR_YELLOW}Installation des dépendances...${COLOR_RESET}"
        cd mobile
        npm install
        cd ..
        echo -e "${COLOR_GREEN}✅ Dépendances installées${COLOR_RESET}"
    else
        echo -e "${COLOR_GREEN}✅ node_modules OK${COLOR_RESET}"
    fi
}

start_backend() {
    echo -e "\n${COLOR_GREEN}🚀 Démarrage du backend...${COLOR_RESET}"
    cd backend
    source venv/bin/activate
    python main.py
}

start_mobile() {
    echo -e "\n${COLOR_GREEN}📱 Démarrage de l'application mobile...${COLOR_RESET}"
    echo -e "${COLOR_YELLOW}Scannez le QR code avec Expo Go sur votre téléphone${COLOR_RESET}\n"
    cd mobile
    npx expo start
}

start_all() {
    check_backend_deps
    check_mobile_deps
    
    echo -e "\n${COLOR_BLUE}================================${COLOR_RESET}"
    echo -e "${COLOR_GREEN}Démarrage de tous les services...${COLOR_RESET}"
    echo -e "${COLOR_BLUE}================================${COLOR_RESET}\n"
    
    # Démarrer le backend en arrière-plan
    echo -e "${COLOR_YELLOW}1. Démarrage du backend...${COLOR_RESET}"
    cd backend
    source venv/bin/activate
    python main.py > ../backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    
    # Attendre que le backend démarre
    echo -e "${COLOR_YELLOW}⏳ Attente du démarrage du backend...${COLOR_RESET}"
    sleep 5
    
    # Vérifier que le backend est accessible
    if curl -s http://localhost:8000/health > /dev/null; then
        echo -e "${COLOR_GREEN}✅ Backend démarré sur http://localhost:8000${COLOR_RESET}"
    else
        echo -e "${COLOR_RED}❌ Impossible de contacter le backend${COLOR_RESET}"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    
    # Démarrer Expo
    echo -e "\n${COLOR_YELLOW}2. Démarrage de l'application mobile...${COLOR_RESET}"
    cd mobile
    npx expo start
    
    # Cleanup au CTRL+C
    trap "kill $BACKEND_PID 2>/dev/null || true; exit" INT TERM
}

# Main
print_header

case "${1:-all}" in
    backend)
        check_backend_deps
        start_backend
        ;;
    mobile)
        check_mobile_deps
        start_mobile
        ;;
    all)
        start_all
        ;;
    *)
        echo -e "${COLOR_RED}Usage: $0 [backend|mobile|all]${COLOR_RESET}"
        exit 1
        ;;
esac
