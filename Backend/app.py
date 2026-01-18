from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)
model = joblib.load("demand_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    df = pd.DataFrame([data])
    df = pd.get_dummies(df)

    prediction = model.predict(df)[0]

    return jsonify({
        "recommended_stock": round(prediction)
    })

if __name__ == "__main__":
    app.run(port=5000)
