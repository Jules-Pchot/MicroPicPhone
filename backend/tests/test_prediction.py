import pytest
from fastapi.testclient import TestClient
from main import app
import io
from PIL import Image

client = TestClient(app)

def test_health_check():
    """Test de l'endpoint health"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_predict_endpoint():
    """Test de l'endpoint predict avec une image factice"""
    # Créer une image de test
    img = Image.new('RGB', (224, 224), color='white')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    
    response = client.post(
        "/predict",
        files={"file": ("test.jpg", img_bytes, "image/jpeg")}
    )
    
    # Vérifier la structure de la réponse
    assert response.status_code == 200
    data = response.json()
    assert "prediction" in data
    assert "confidence" in data
    assert "message" in data
    assert data["prediction"] in ["GO", "NO-GO"]
