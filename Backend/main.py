from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import random

app = FastAPI(title="Agri Insights Hub – AI Backend")

# -------------------------------
# CORS (IMPORTANT for React)
# -------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Root Test API
# -------------------------------
@app.get("/")
def root():
    return {"status": "Backend is running successfully"}

# -------------------------------
# Upload Excel File
# -------------------------------
@app.post("/upload-excel")
async def upload_excel(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith((".xlsx", ".xls")):
            raise HTTPException(status_code=400, detail="Only Excel files allowed")

        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))

        return {
            "message": "File uploaded successfully",
            "columns": df.columns.tolist(),
            "rows": len(df),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -------------------------------
# AI Demand Prediction (DEMO)
# -------------------------------
@app.post("/predict-demand")
async def predict_demand(
    season: str,
    weather: str,
    product: str,
):
    """
    This is a DEMO AI logic.
    Later you will replace this with a trained ML model.
    """

    base_demand = random.randint(50, 100)

    # Season impact
    if season.lower() == "summer":
        base_demand += 20
    elif season.lower() == "monsoon":
        base_demand += 30
    elif season.lower() == "winter":
        base_demand -= 10

    # Weather impact
    if weather.lower() == "rainy":
        base_demand += 25
    elif weather.lower() == "hot":
        base_demand += 15
    elif weather.lower() == "cold":
        base_demand -= 5

    recommendation = "Normal Stock"

    if base_demand > 120:
        recommendation = "High Demand – Increase Stock"
    elif base_demand < 60:
        recommendation = "Low Demand – Reduce Stock"

    return {
        "product": product,
        "season": season,
        "weather": weather,
        "predicted_demand_score": base_demand,
        "recommendation": recommendation,
    }

# -------------------------------
# Future ML Placeholder
# -------------------------------
@app.get("/ml-status")
def ml_status():
    return {
        "ml_model": "Not trained yet",
        "next_step": "Train model using historical + weather data",
    }
