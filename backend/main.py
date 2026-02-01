"""
API BioMicro - Classification des phases bactériennes
Sporosarcina pasteurii pour bio-ciment

Endpoints:
- GET /health : Vérification de l'état du serveur
- GET /info : Informations sur le modèle
- POST /predict : Prédiction GO/NO-GO sur une image

Phases détectées:
- expo (GO) : Phase exponentielle - prêt pour déversement
- stationnaire (NO-GO) : Phase stationnaire - attendre
- mort (NO-GO) : Phase de mort - renouveler la culture
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.services.model_service import predict_image, get_model_info
from app.services.image_processor import preprocess_image, validate_image
import uvicorn
import time

# Configuration de l'application
app = FastAPI(
    title="BioMicro API",
    description="API de classification des phases bactériennes pour bio-ciment",
    version="2.0.0"
)

# Configuration CORS (permettre les appels depuis l'app mobile)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, restreindre aux domaines autorisés
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Page d'accueil de l'API."""
    return {
        "name": "BioMicro API",
        "version": "2.0.0",
        "description": "Classification des phases bactériennes Sporosarcina pasteurii",
        "endpoints": {
            "/health": "GET - État du serveur",
            "/info": "GET - Informations sur le modèle",
            "/predict": "POST - Prédiction sur une image"
        }
    }


@app.get("/health")
async def health_check():
    """
    Vérification de l'état du serveur.
    Utilisé par l'app mobile pour vérifier la connectivité.
    """
    model_info = get_model_info()
    return {
        "status": "healthy",
        "model_loaded": model_info["model_loaded"],
        "device": model_info["device"],
        "timestamp": time.time()
    }


@app.get("/info")
async def model_info():
    """
    Retourne les informations détaillées sur le modèle.
    """
    return get_model_info()


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Analyse une image microscopique et retourne la prédiction.
    
    Args:
        file: Image au format JPEG, PNG, BMP, TIFF ou GIF
        
    Returns:
        - prediction: "GO" ou "NO-GO"
        - phase: Phase détectée (expo, stationnaire, mort)
        - confidence: Score de confiance (0-1)
        - message: Message explicatif pour l'utilisateur
        - probabilities: Probabilités pour chaque classe
        - processing_time: Temps de traitement en secondes
    """
    start_time = time.time()
    
    # Lire le contenu de l'image
    try:
        image_bytes = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erreur de lecture du fichier: {str(e)}")
    
    # Valider l'image
    is_valid, validation_message = validate_image(image_bytes)
    if not is_valid:
        raise HTTPException(status_code=400, detail=validation_message)
    
    # Prétraiter l'image
    try:
        processed_image = preprocess_image(image_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur de prétraitement: {str(e)}")
    
    # Prédiction avec le modèle CNN
    try:
        result = predict_image(processed_image)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur de prédiction: {str(e)}")
    
    # Calculer le temps de traitement
    processing_time = time.time() - start_time
    
    return {
        "prediction": result["label"],      # "GO" ou "NO-GO"
        "phase": result["phase"],           # expo, stationnaire, mort  
        "confidence": result["confidence"],
        "message": result["message"],
        "probabilities": result["probabilities"],
        "processing_time": round(processing_time, 3)
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Gestionnaire global d'erreurs."""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Erreur interne du serveur",
            "detail": str(exc)
        }
    )


if __name__ == "__main__":
    print("🔬 Démarrage de l'API BioMicro...")
    print("📍 Documentation: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
