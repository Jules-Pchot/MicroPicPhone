import cv2
import numpy as np
from PIL import Image
import io

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Applique le traitement d'image du cahier des charges :
    - Conversion en niveaux de gris
    - Filtrage des parasites (levures, micro-bactéries)
    - Normalisation
    """
    # Convertir bytes en image
    image = Image.open(io.BytesIO(image_bytes))
    img_array = np.array(image)
    
    # Conversion en niveaux de gris
    if len(img_array.shape) == 3:
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
    else:
        gray = img_array
    
    # Réduction du bruit
    denoised = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Seuillage adaptatif pour isoler les bactéries
    binary = cv2.adaptiveThreshold(
        denoised, 255, 
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
        cv2.THRESH_BINARY_INV, 11, 2
    )
    
    # Opérations morphologiques pour nettoyer
    kernel = np.ones((3, 3), np.uint8)
    cleaned = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)
    cleaned = cv2.morphologyEx(cleaned, cv2.MORPH_CLOSE, kernel)
    
    # Redimensionner pour le modèle (adapter selon votre modèle)
    resized = cv2.resize(cleaned, (224, 224))
    
    # Normaliser
    normalized = resized.astype(np.float32) / 255.0
    
    return normalized
