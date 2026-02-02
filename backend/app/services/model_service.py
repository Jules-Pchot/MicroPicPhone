"""
Service de prédiction CNN pour la classification des phases bactériennes.
Utilise le modèle PyTorch BacteriaCNN de Kylian.

Classes:
- expo: Phase exponentielle (GO - prêt pour déversement)
- stationnaire: Phase stationnaire (NO-GO)
- mort: Phase de mort (NO-GO)
"""

import torch
import torch.nn as nn
from pathlib import Path
import numpy as np

# Chemin vers le fichier du modèle
MODEL_PATH = Path(__file__).parent.parent / "models" / "model.pt"

# Paramètres de normalisation (calculés sur le dataset d'entraînement)
# Valeurs extraites du notebook Colab de Kylian
NORMALIZE_MEAN = 0.656081
NORMALIZE_STD = 0.145692

# Mapping des classes
CLASS_NAMES = ["expo", "mort", "stationnaire"]  # Ordre alphabétique (ImageFolder)

# Compteur pour le mode démo (alterne GO/NO-GO)
_demo_counter = 0


class BacteriaCNN(nn.Module):
    """
    Architecture CNN pour la classification des phases bactériennes.
    Reproduit exactement l'architecture du notebook de Kylian.
    """
    def __init__(self):
        super().__init__()

        self.features = nn.Sequential(
            nn.Conv2d(1, 32, 3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(32, 64, 3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(64, 128, 3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.MaxPool2d(2),
        )

        self.classifier = nn.Sequential(
            nn.AdaptiveAvgPool2d((1, 1)),
            nn.Flatten(),
            nn.Linear(128, 3)  # 3 classes: expo, stationnaire, mort
        )

    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x


# Instance globale du modèle
_model = None
_device = None


def get_device():
    """Détermine le device à utiliser (GPU si disponible, sinon CPU)."""
    global _device
    if _device is None:
        _device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    return _device


def load_model():
    """
    Charge le modèle CNN pré-entraîné.
    Le modèle est chargé une seule fois et mis en cache.
    """
    global _model
    
    if _model is not None:
        return _model
    
    device = get_device()
    _model = BacteriaCNN()
    
    if MODEL_PATH.exists():
        try:
            state_dict = torch.load(str(MODEL_PATH), map_location=device)
            _model.load_state_dict(state_dict)
            print(f"✅ Modèle chargé depuis {MODEL_PATH}")
        except Exception as e:
            print(f"⚠️ Erreur lors du chargement du modèle: {e}")
            print("   Le modèle utilisera des poids aléatoires (mode démo)")
    else:
        print(f"⚠️ Fichier modèle non trouvé: {MODEL_PATH}")
        print("   Le modèle utilisera des poids aléatoires (mode démo)")
    
    _model.to(device)
    _model.eval()
    
    return _model


def predict_image(processed_image: np.ndarray) -> dict:
    """
    Effectue la prédiction sur une image prétraitée.
    
    Args:
        processed_image: Image numpy array de forme (256, 256), normalisée
        
    Returns:
        dict avec:
        - label: "GO" ou "NO-GO"
        - phase: nom de la phase détectée (expo, stationnaire, mort)
        - confidence: score de confiance (0-1)
        - probabilities: probabilités pour chaque classe
    """
    model = load_model()
    device = get_device()
    
    # Convertir en tensor PyTorch
    # Shape attendue: (1, 1, 256, 256) - batch, channel, height, width
    if len(processed_image.shape) == 2:
        # Ajouter dimension channel
        processed_image = np.expand_dims(processed_image, axis=0)
    
    # Ajouter dimension batch
    tensor = torch.from_numpy(processed_image).unsqueeze(0).float()
    tensor = tensor.to(device)
    
    # Prédiction
    with torch.no_grad():
        outputs = model(tensor)
        probabilities = torch.softmax(outputs, dim=1)
        confidence, predicted_idx = torch.max(probabilities, dim=1)
    
    # Récupérer les résultats
    predicted_class = CLASS_NAMES[predicted_idx.item()]
    confidence_score = confidence.item()
    probs = probabilities[0].cpu().numpy()
    
    # MODE DÉMO : Si le modèle n'est pas chargé, alterner GO/NO-GO
    global _demo_counter
    if not MODEL_PATH.exists():
        _demo_counter += 1
        # Alterner : pair = GO, impair = NO-GO
        if _demo_counter % 2 == 0:
            return {
                "label": "GO",
                "phase": "expo",
                "confidence": 0.87,
                "message": "Solution prête pour déversement - Phase exponentielle détectée",
                "probabilities": {"expo": 0.87, "mort": 0.08, "stationnaire": 0.05}
            }
        else:
            phases = ["stationnaire", "mort"]
            phase = phases[_demo_counter % 2]
            return {
                "label": "NO-GO",
                "phase": phase,
                "confidence": 0.72,
                "message": "Attendre - Phase stationnaire détectée" if phase == "stationnaire" else "Attendre - Phase de mort détectée",
                "probabilities": {"expo": 0.15, "mort": 0.35, "stationnaire": 0.50}
            }
    
    # Déterminer GO/NO-GO (mode normal avec vrai modèle)
    # GO = phase exponentielle (bactéries prêtes)
    # NO-GO = stationnaire ou mort (pas prêtes)
    if predicted_class == "expo":
        label = "GO"
        message = "Solution prête pour déversement - Phase exponentielle détectée"
    elif predicted_class == "stationnaire":
        label = "NO-GO"
        message = "Attendre - Phase stationnaire (bactéries au maximum, attendre)"
    else:  # mort
        label = "NO-GO"
        message = "Attendre - Phase de mort détectée (renouveler la culture)"
    
    return {
        "label": label,
        "phase": predicted_class,
        "confidence": confidence_score,
        "message": message,
        "probabilities": {
            CLASS_NAMES[i]: float(probs[i]) for i in range(len(CLASS_NAMES))
        }
    }


def get_model_info() -> dict:
    """Retourne les informations sur le modèle chargé."""
    model_loaded = MODEL_PATH.exists()
    device = get_device()
    
    return {
        "model_loaded": model_loaded,
        "model_path": str(MODEL_PATH),
        "device": str(device),
        "classes": CLASS_NAMES,
        "input_size": "256x256",
        "input_channels": 1,
        "architecture": "BacteriaCNN (3 conv layers)"
    }
