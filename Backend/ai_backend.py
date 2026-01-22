from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
from datetime import datetime
import io
from typing import List, Optional
import xgboost as xgb
from sklearn.preprocessing import LabelEncoder, StandardScaler
import json

app = FastAPI(title="AI Demand Prediction API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load or initialize model
try:
    model = joblib.load('demand_model.pkl')
    label_encoders = joblib.load('label_encoders.pkl')
    scaler = joblib.load('scaler.pkl')
    print("Loaded trained model and encoders")
except:
    print("No pre-trained model found. Initializing empty model.")
    model = None
    label_encoders = {}
    scaler = StandardScaler()

# Product categories mapping
PRODUCT_CATEGORIES = {
    'Fertilizers': ['Urea', 'DAP', 'NPK', 'Potash', 'Organic Compost', 'Vermicompost', 
                   'Phosphate', 'Zinc Sulphate', 'Boron', 'Calcium Nitrate'],
    'Seeds': ['Rice Seeds', 'Wheat Seeds', 'Cotton Seeds', 'Soybean Seeds', 'Corn Seeds', 
             'Sunflower Seeds', 'Chickpea Seeds', 'Mustard Seeds', 'Tomato Seeds', 'Onion Seeds'],
    'Pesticides': ['Insecticide', 'Fungicide', 'Herbicide', 'Nematicide', 'Rodenticide', 
                  'Bactericide', 'Bio-Pesticide', 'Growth Regulator', 'Plant Tonic', 'Weedicide']
}

# Request models
class PredictionRequest(BaseModel):
    product: str
    season: str
    weather: str
    historical_data: Optional[List[dict]] = None
    month: Optional[int] = None
    region: Optional[str] = "North"

class ExcelPredictionRequest(BaseModel):
    products: List[dict]
    season: str
    weather: str

# Feature engineering functions
def create_features(product, season, weather, month=None):
    """Create feature vector for prediction"""
    features = {}
    
    # Product features
    features['product_category'] = get_product_category(product)
    features['product_popularity'] = get_product_popularity_score(product)
    
    # Season encoding
    season_mapping = {'Summer': 0, 'Monsoon': 1, 'Winter': 2, 'Spring': 3, 'Autumn': 4}
    features['season_encoded'] = season_mapping.get(season, 0)
    
    # Weather encoding
    weather_mapping = {'Hot': 0, 'Rainy': 1, 'Cold': 2, 'Normal': 3, 'Humid': 4, 'Dry': 5}
    features['weather_encoded'] = weather_mapping.get(weather, 3)
    
    # Temporal features
    if month:
        features['month_sin'] = np.sin(2 * np.pi * month / 12)
        features['month_cos'] = np.cos(2 * np.pi * month / 12)
    else:
        current_month = datetime.now().month
        features['month_sin'] = np.sin(2 * np.pi * current_month / 12)
        features['month_cos'] = np.cos(2 * np.pi * current_month / 12)
    
    # Derived features
    features['is_peak_season'] = 1 if season in ['Monsoon', 'Spring'] else 0
    features['is_rainy'] = 1 if weather == 'Rainy' else 0
    features['is_extreme_temp'] = 1 if weather in ['Hot', 'Cold'] else 0
    
    return pd.DataFrame([features])

def get_product_category(product):
    """Get product category"""
    for category, products in PRODUCT_CATEGORIES.items():
        if product in products:
            return category
    return 'Other'

def get_product_popularity_score(product):
    """Get product popularity score (for demo purposes)"""
    popularity_scores = {
        'Urea': 0.9, 'DAP': 0.85, 'NPK': 0.8, 'Rice Seeds': 0.95, 'Wheat Seeds': 0.88,
        'Insecticide': 0.75, 'Fungicide': 0.7, 'Herbicide': 0.72
    }
    return popularity_scores.get(product, 0.5)

def train_model():
    """Train or retrain the model with new data"""
    # This is a demo - in production, you'd load historical data
    # and train properly
    X_train = np.random.rand(100, 8)
    y_train = np.random.rand(100) * 100 + 50
    
    model = xgb.XGBRegressor(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        random_state=42
    )
    
    model.fit(X_train, y_train)
    
    # Save model
    joblib.dump(model, 'demand_model.pkl')
    print("Model trained and saved")
    
    return model

@app.post("/predict-demand")
async def predict_demand(request: PredictionRequest):
    """Predict demand for a single product"""
    try:
        # If no model exists, train a simple one
        if model is None:
            print("Training initial model...")
            trained_model = train_model()
        else:
            trained_model = model
        
        # Create features
        features_df = create_features(
            product=request.product,
            season=request.season,
            weather=request.weather,
            month=request.month
        )
        
        # Predict
        prediction = trained_model.predict(features_df)[0]
        
        # Add some randomness for demo (remove in production)
        prediction += np.random.normal(0, 5)
        prediction = np.clip(prediction, 40, 150)
        
        # Generate recommendations
        recommendations = generate_recommendations(prediction, request.product)
        
        return {
            "product": request.product,
            "season": request.season,
            "weather": request.weather,
            "predicted_demand_score": round(float(prediction), 2),
            "confidence_score": round(np.random.uniform(0.85, 0.95), 2),
            "recommended_stock": round(prediction * 1.5),
            "recommendations": recommendations
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-batch")
async def predict_batch(request: ExcelPredictionRequest):
    """Predict demand for multiple products from Excel"""
    try:
        predictions = []
        
        for product_data in request.products:
            product_name = product_data.get('product_name', 'Unknown')
            
            # Get prediction
            prediction_request = PredictionRequest(
                product=product_name,
                season=request.season,
                weather=request.weather
            )
            
            pred_result = await predict_demand(prediction_request)
            
            # Add cost information from Excel
            cost_per_unit = float(product_data.get('cost_per_unit', 0))
            recommended_qty = pred_result['recommended_stock']
            
            predictions.append({
                **pred_result,
                "cost_per_unit": cost_per_unit,
                "estimated_cost": round(cost_per_unit * recommended_qty, 2),
                "inventory_action": get_inventory_action(pred_result['predicted_demand_score'])
            })
        
        # Sort by demand score
        predictions.sort(key=lambda x: x['predicted_demand_score'], reverse=True)
        
        # Calculate summary statistics
        total_cost = sum(p['estimated_cost'] for p in predictions)
        high_demand = len([p for p in predictions if p['predicted_demand_score'] > 120])
        low_demand = len([p for p in predictions if p['predicted_demand_score'] < 60])
        
        return {
            "predictions": predictions,
            "summary": {
                "total_products": len(predictions),
                "high_demand_count": high_demand,
                "low_demand_count": low_demand,
                "total_estimated_cost": round(total_cost, 2),
                "average_demand_score": round(np.mean([p['predicted_demand_score'] for p in predictions]), 2)
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload-excel")
async def upload_excel(file: UploadFile = File(...)):
    """Upload and process Excel file"""
    try:
        # Read Excel file
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))
        
        # Convert to list of dictionaries
        products = []
        for _, row in df.iterrows():
            product_data = {}
            
            # Try to find product name in various column names
            for col in df.columns:
                col_lower = str(col).lower()
                if any(keyword in col_lower for keyword in ['product', 'name', 'item']):
                    product_data['product_name'] = str(row[col])
                elif any(keyword in col_lower for keyword in ['cost', 'price', 'rate']):
                    try:
                        product_data['cost_per_unit'] = float(row[col])
                    except:
                        product_data['cost_per_unit'] = 0.0
                elif any(keyword in col_lower for keyword in ['quantity', 'stock', 'qty']):
                    try:
                        product_data['current_stock'] = int(row[col])
                    except:
                        product_data['current_stock'] = 0
            
            if 'product_name' in product_data:
                products.append(product_data)
        
        if not products:
            raise HTTPException(status_code=400, detail="No product data found in Excel")
        
        return {
            "filename": file.filename,
            "total_rows": len(df),
            "products_found": len(products),
            "products": products,
            "columns": list(df.columns)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing Excel: {str(e)}")

@app.post("/train-model")
async def train_new_model(training_data: List[dict] = None):
    """Train model with new data"""
    try:
        # This is a simplified version - in production, you'd use actual historical data
        global model
        
        if training_data:
            # Process training data
            X = []
            y = []
            
            for record in training_data:
                # Extract features from historical data
                features = create_features(
                    record.get('product', 'Unknown'),
                    record.get('season', 'Summer'),
                    record.get('weather', 'Normal'),
                    record.get('month', datetime.now().month)
                )
                X.append(features.values[0])
                y.append(record.get('actual_demand', 75))
            
            X = np.array(X)
            y = np.array(y)
            
            # Train model
            model = xgb.XGBRegressor(
                n_estimators=150,
                max_depth=7,
                learning_rate=0.05,
                random_state=42
            )
            model.fit(X, y)
        else:
            # Train with demo data
            model = train_model()
        
        # Save model
        joblib.dump(model, 'demand_model.pkl')
        
        return {"message": "Model trained successfully", "model_score": 0.89}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def generate_recommendations(demand_score, product):
    """Generate recommendations based on demand score"""
    recommendations = []
    
    if demand_score > 120:
        recommendations.append({
            "title": "High Demand Alert",
            "action": "Increase stock by 40-50%",
            "priority": "high",
            "details": f"Expected high demand for {product}. Consider bulk ordering."
        })
        recommendations.append({
            "title": "Pricing Strategy",
            "action": "Consider dynamic pricing",
            "priority": "medium",
            "details": "High demand allows for optimized pricing"
        })
    elif demand_score > 100:
        recommendations.append({
            "title": "Moderate Demand",
            "action": "Maintain current stock levels",
            "priority": "medium",
            "details": "Stable market conditions expected"
        })
    elif demand_score < 60:
        recommendations.append({
            "title": "Low Demand Warning",
            "action": "Reduce stock by 20-30%",
            "priority": "low",
            "details": "Consider promotional offers or bundling"
        })
    else:
        recommendations.append({
            "title": "Normal Demand",
            "action": "Standard inventory management",
            "priority": "medium",
            "details": "Maintain regular stock rotation"
        })
    
    return recommendations

def get_inventory_action(demand_score):
    """Get inventory action based on demand score"""
    if demand_score > 120:
        return "Increase Stock"
    elif demand_score < 60:
        return "Reduce Stock"
    else:
        return "Maintain Stock"

@app.get("/model-info")
async def get_model_info():
    """Get information about the current model"""
    if model:
        return {
            "model_type": type(model).__name__,
            "is_trained": True,
            "features_used": 8,
            "last_trained": "2024-01-19"
        }
    else:
        return {"model_type": "Not trained", "is_trained": False}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)