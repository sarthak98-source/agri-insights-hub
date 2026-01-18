import { useState } from "react";
import { Layout } from "@/components/Layout";
import {
  uploadExcelFile,
  predictDemand,
} from "@/services/demandService";
import { DemandPredictionResult } from "../types/demand";

const seasons = ["Summer", "Monsoon", "Winter"];
const weatherTypes = ["Hot", "Rainy", "Cold", "Normal"];

const DemandPrediction = () => {
  const [file, setFile] = useState<File | null>(null);
  const [season, setSeason] = useState("Summer");
  const [weather, setWeather] = useState("Normal");
  const [product, setProduct] = useState("");
  const [result, setResult] = useState<DemandPredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      const res = await uploadExcelFile(file);
      setMessage(`Excel uploaded (${res.rows} rows detected)`);
    } catch (err) {
      setMessage("Excel upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePrediction = async () => {
    if (!product) {
      setMessage("Please enter product name");
      return;
    }

    try {
      setLoading(true);
      const data = await predictDemand(season, weather, product);
      setResult(data);
      setMessage("");
    } catch (err) {
      setMessage("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">
            AI-Based Demand Prediction
          </h1>
          <p className="text-muted-foreground">
            Upload historical data + weather to predict demand
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Upload Historical Excel Data
          </h2>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mb-4"
          />

          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Upload Excel
          </button>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Prediction Inputs
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="border rounded px-3 py-2"
            />

            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="border rounded px-3 py-2"
            >
              {seasons.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <select
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              className="border rounded px-3 py-2"
            >
              {weatherTypes.map((w) => (
                <option key={w}>{w}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePrediction}
            className="mt-6 px-6 py-2 bg-green-600 text-white rounded"
          >
            Predict Demand
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-gradient-to-br from-primary to-green-400 text-white rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">
              Prediction Result
            </h2>

            <ul className="space-y-2">
              <li>
                <strong>Product:</strong> {result.product}
              </li>
              <li>
                <strong>Season:</strong> {result.season}
              </li>
              <li>
                <strong>Weather:</strong> {result.weather}
              </li>
              <li>
                <strong>Demand Score:</strong>{" "}
                {result.predicted_demand_score}
              </li>
              <li>
                <strong>Recommendation:</strong>{" "}
                {result.recommendation}
              </li>
            </ul>
          </div>
        )}

        {/* Status */}
        {message && (
          <p className="text-center mt-6 text-muted-foreground">
            {message}
          </p>
        )}

        {loading && (
          <p className="text-center mt-6">Processing...</p>
        )}
      </div>
    </Layout>
  );
};

export default DemandPrediction;
