import tensorflow as tf
import numpy as np
from pathlib import Path

# Charger le modèle au démarrage
MODEL_PATH = Path(__file__).parent.parent / "models" / "cnn_model.h5"
model = None

def load_model():
    global model
    if model is None:
        model = tf.keras.models.load_model(str(MODEL_PATH))
    return model

def predict_image(processed_image: np.ndarray) -> dict:
    """
    Effectue la prédiction GO/NO-GO
    """
    model = load_model()
    
    # Ajouter les dimensions batch et channel si nécessaire
    if len(processed_image.shape) == 2:
        processed_image = np.expand_dims(processed_image, axis=-1)
    processed_image = np.expand_dims(processed_image, axis=0)
    
    # Prédiction
    prediction = model.predict(processed_image, verbose=0)
    confidence = float(prediction[0][0])
    
    # Seuil de décision (à ajuster selon votre modèle)
    threshold = 0.5
    
    if confidence > threshold:
        return {"label": "GO", "confidence": confidence}
    else:
        return {"label": "NO-GO", "confidence": 1 - confidence}
