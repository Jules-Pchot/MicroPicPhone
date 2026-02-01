"""
Service de prétraitement d'images pour le modèle BacteriaCNN.
Reproduit exactement les transformations utilisées lors de l'entraînement.

Transformations:
1. Conversion en niveaux de gris
2. Redimensionnement à 256x256
3. Normalisation avec mean/std du dataset
"""

import cv2
import numpy as np
from PIL import Image
import io

# Paramètres de normalisation (à synchroniser avec model_service.py)
# Ces valeurs sont calculées sur le dataset d'entraînement
NORMALIZE_MEAN = 0.5  # À ajuster avec les vraies valeurs
NORMALIZE_STD = 0.5   # À ajuster avec les vraies valeurs

# Taille d'entrée du modèle
INPUT_SIZE = (256, 256)


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Applique le prétraitement d'image pour le modèle BacteriaCNN.
    
    Étapes:
    1. Chargement de l'image depuis les bytes
    2. Conversion en niveaux de gris (grayscale)
    3. Redimensionnement à 256x256 pixels
    4. Conversion en float32 (0-1)
    5. Normalisation avec mean/std
    
    Args:
        image_bytes: Image brute en bytes (JPEG, PNG, etc.)
        
    Returns:
        numpy.ndarray de shape (1, 256, 256) - channel, height, width
    """
    # Charger l'image depuis les bytes
    image = Image.open(io.BytesIO(image_bytes))
    
    # Convertir en RGB si nécessaire (pour gérer les images RGBA, etc.)
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Convertir en numpy array
    img_array = np.array(image)
    
    # Conversion en niveaux de gris
    if len(img_array.shape) == 3:
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
    else:
        gray = img_array
    
    # Redimensionner à 256x256
    resized = cv2.resize(gray, INPUT_SIZE, interpolation=cv2.INTER_AREA)
    
    # Convertir en float32 et normaliser à [0, 1]
    normalized = resized.astype(np.float32) / 255.0
    
    # Appliquer la normalisation (mean/std)
    normalized = (normalized - NORMALIZE_MEAN) / NORMALIZE_STD
    
    # Ajouter la dimension channel (1, 256, 256)
    # Le modèle attend: (batch, channel, height, width)
    output = np.expand_dims(normalized, axis=0)
    
    return output


def preprocess_image_enhanced(image_bytes: bytes, apply_denoising: bool = True) -> np.ndarray:
    """
    Version améliorée du prétraitement avec options de filtrage.
    
    Args:
        image_bytes: Image brute en bytes
        apply_denoising: Appliquer un filtre de réduction de bruit
        
    Returns:
        numpy.ndarray de shape (1, 256, 256)
    """
    # Charger l'image
    image = Image.open(io.BytesIO(image_bytes))
    
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    img_array = np.array(image)
    
    # Conversion en niveaux de gris
    if len(img_array.shape) == 3:
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
    else:
        gray = img_array
    
    # Optionnel: Réduction du bruit (utile pour images de microscope)
    if apply_denoising:
        gray = cv2.GaussianBlur(gray, (3, 3), 0)
    
    # Redimensionner
    resized = cv2.resize(gray, INPUT_SIZE, interpolation=cv2.INTER_AREA)
    
    # Normalisation
    normalized = resized.astype(np.float32) / 255.0
    normalized = (normalized - NORMALIZE_MEAN) / NORMALIZE_STD
    
    # Ajouter dimension channel
    output = np.expand_dims(normalized, axis=0)
    
    return output


def validate_image(image_bytes: bytes) -> tuple[bool, str]:
    """
    Valide qu'une image peut être traitée.
    
    Args:
        image_bytes: Image brute en bytes
        
    Returns:
        tuple (is_valid, message)
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        
        # Vérifier le format
        if image.format not in ['JPEG', 'PNG', 'BMP', 'TIFF', 'GIF']:
            return False, f"Format non supporté: {image.format}"
        
        # Vérifier la taille minimale
        min_size = 64
        if image.width < min_size or image.height < min_size:
            return False, f"Image trop petite (min {min_size}x{min_size})"
        
        # Vérifier la taille maximale (pour éviter les problèmes mémoire)
        max_size = 10000
        if image.width > max_size or image.height > max_size:
            return False, f"Image trop grande (max {max_size}x{max_size})"
        
        return True, "Image valide"
        
    except Exception as e:
        return False, f"Erreur de lecture de l'image: {str(e)}"
