"""
Tests unitaires pour l'API BioMicro.
Teste les endpoints et le modèle de prédiction.
"""

import pytest
from fastapi.testclient import TestClient
from main import app
import io
from PIL import Image
import numpy as np

client = TestClient(app)


def create_test_image(size=(256, 256), mode='RGB'):
    """Crée une image de test."""
    # Créer une image avec du bruit (simule une image de microscope)
    img_array = np.random.randint(0, 255, (*size, 3), dtype=np.uint8)
    img = Image.fromarray(img_array, mode)
    
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    
    return img_bytes


def test_root():
    """Test de la page d'accueil."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert data["name"] == "BioMicro API"
    assert "endpoints" in data


def test_health_check():
    """Test de l'endpoint health."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "model_loaded" in data
    assert "device" in data


def test_model_info():
    """Test de l'endpoint info."""
    response = client.get("/info")
    assert response.status_code == 200
    data = response.json()
    assert "model_loaded" in data
    assert "classes" in data
    assert len(data["classes"]) == 3  # expo, stationnaire, mort
    assert "input_size" in data


def test_predict_endpoint():
    """Test de l'endpoint predict avec une image factice."""
    img_bytes = create_test_image()
    
    response = client.post(
        "/predict",
        files={"file": ("test.jpg", img_bytes, "image/jpeg")}
    )
    
    # Vérifier la structure de la réponse
    assert response.status_code == 200
    data = response.json()
    
    # Champs obligatoires
    assert "prediction" in data
    assert "phase" in data
    assert "confidence" in data
    assert "message" in data
    assert "probabilities" in data
    assert "processing_time" in data
    
    # Valeurs valides
    assert data["prediction"] in ["GO", "NO-GO"]
    assert data["phase"] in ["expo", "stationnaire", "mort"]
    assert 0 <= data["confidence"] <= 1
    assert data["processing_time"] > 0
    
    # Vérifier les probabilités
    probs = data["probabilities"]
    assert "expo" in probs
    assert "stationnaire" in probs
    assert "mort" in probs
    
    # Les probabilités doivent sommer à ~1
    total_prob = sum(probs.values())
    assert 0.99 <= total_prob <= 1.01


def test_predict_with_png():
    """Test avec une image PNG."""
    img = Image.new('RGB', (256, 256), color='gray')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    
    response = client.post(
        "/predict",
        files={"file": ("test.png", img_bytes, "image/png")}
    )
    
    assert response.status_code == 200


def test_predict_with_grayscale():
    """Test avec une image en niveaux de gris."""
    img = Image.new('L', (256, 256), color=128)
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    
    response = client.post(
        "/predict",
        files={"file": ("test_gray.jpg", img_bytes, "image/jpeg")}
    )
    
    assert response.status_code == 200


def test_predict_small_image():
    """Test avec une petite image (doit fonctionner avec resize)."""
    img = Image.new('RGB', (100, 100), color='white')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    
    response = client.post(
        "/predict",
        files={"file": ("small.jpg", img_bytes, "image/jpeg")}
    )
    
    assert response.status_code == 200


def test_predict_large_image():
    """Test avec une grande image (doit fonctionner avec resize)."""
    img = Image.new('RGB', (1920, 1080), color='black')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    
    response = client.post(
        "/predict",
        files={"file": ("large.jpg", img_bytes, "image/jpeg")}
    )
    
    assert response.status_code == 200


def test_predict_invalid_file():
    """Test avec un fichier invalide (pas une image)."""
    response = client.post(
        "/predict",
        files={"file": ("test.txt", b"this is not an image", "text/plain")}
    )
    
    assert response.status_code == 400


def test_go_nogo_logic():
    """
    Vérifie que la logique GO/NO-GO est correcte:
    - expo -> GO
    - stationnaire -> NO-GO
    - mort -> NO-GO
    """
    # Ce test vérifie la logique, pas la prédiction réelle
    # (le modèle peut retourner n'importe quelle phase)
    
    response = client.post(
        "/predict",
        files={"file": ("test.jpg", create_test_image(), "image/jpeg")}
    )
    
    data = response.json()
    
    # Vérifier la cohérence
    if data["phase"] == "expo":
        assert data["prediction"] == "GO"
    else:
        assert data["prediction"] == "NO-GO"
