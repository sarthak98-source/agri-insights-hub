import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import joblib

MODEL_PATH = "demand_model.pkl"

def train_model(df):
    df = pd.get_dummies(df, columns=["district", "season", "crop"])

    X = df.drop("demand", axis=1)
    y = df["demand"]

    model = RandomForestRegressor(
        n_estimators=200,
        random_state=42
    )

    model.fit(X, y)
    joblib.dump((model, X.columns), MODEL_PATH)

def predict_demand(input_df):
    model, columns = joblib.load(MODEL_PATH)

    input_df = pd.get_dummies(input_df)
    input_df = input_df.reindex(columns=columns, fill_value=0)

    prediction = model.predict(input_df)[0]
    return round(prediction)
