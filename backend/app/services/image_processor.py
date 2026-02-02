"""
Service de prétraitement d'images pour le modèle BacteriaCNN.
Reproduit EXACTEMENT les transformations utilisées lors de l'entraînement.

Pipeline identique au notebook Colab:
    transforms.Grayscale(1),
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.656081], std=[0.145692])
"""

import numpy as np
from PIL import Image
import io
from torchvision import transforms

# Paramètres de normalisation (calculés sur le dataset d'entraînement)
# Valeurs extraites du notebook Colab de Kylian
NORMALIZE_MEAN = 0.656081
NORMALIZE_STD = 0.145692

# Taille d'entrée du modèle
INPUT_SIZE = (256, 256)

# Pipeline de transformation IDENTIQUE au notebook d'entraînement
_transform = transforms.Compose([
    transforms.Grayscale(1),
    transforms.Resize(INPUT_SIZE),
    transforms.ToTensor(),
    transforms.Normalize(mean=[NORMALIZE_MEAN], std=[NORMALIZE_STD])
])


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Applique le prétraitement d'image pour le modèle BacteriaCNN.
    Utilise EXACTEMENT le même pipeline que le notebook d'entraînement.
    
    Args:
        image_bytes: Image brute en bytes (JPEG, PNG, etc.)
        
    Returns:
        numpy.ndarray de shape (1, 256, 256) - channel, height, width
    """
    # Charger l'image depuis les bytes
    image = Image.open(io.BytesIO(image_bytes))
    
    # Convertir en RGB si nécessaire (pour gérer les images RGBA, P mode, etc.)
    if image.mode not in ['RGB', 'L']:
        image = image.convert('RGB')
    
    # Appliquer les transformations identiques au notebook
    tensor = _transform(image)
    
    # Convertir en numpy array pour le modèle
    # Shape: (1, 256, 256) - channel, height, width
    output = tensor.numpy()
    
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
