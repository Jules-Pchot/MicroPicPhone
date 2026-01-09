from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.services.model_service import predict_image
from app.services.image_processor import preprocess_image
import uvicorn

app = FastAPI(title="BioMicro API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": True}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Reçoit une image microscopique et retourne GO ou NO-GO
    """
    # Lire l'image
    image_bytes = await file.read()
    
    # Prétraiter l'image (filtrage, normalisation)
    processed_image = preprocess_image(image_bytes)
    
    # Prédiction avec le modèle CNN
    result = predict_image(processed_image)
    
    return {
        "prediction": result["label"],  # "GO" ou "NO-GO"
        "confidence": result["confidence"],
        "message": "Solution prête pour déversement" if result["label"] == "GO" 
                   else "Attendre - Solution non optimale"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
