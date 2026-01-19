import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useUser } from '@clerk/clerk-react';
import { TrendingUp, Package, AlertCircle, CheckCircle, Upload, Sparkles, RefreshCw, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VALID_CATEGORIES = {
  'Fertilizers': ['Urea', 'DAP', 'NPK', 'Potash', 'Organic Compost', 'Vermicompost', 'Phosphate', 'Zinc Sulphate', 'Boron', 'Calcium Nitrate'],
  'Seeds': ['Rice Seeds', 'Wheat Seeds', 'Cotton Seeds', 'Soybean Seeds', 'Corn Seeds', 'Sunflower Seeds', 'Chickpea Seeds', 'Mustard Seeds', 'Tomato Seeds', 'Onion Seeds'],
  'Pesticides': ['Insecticide', 'Fungicide', 'Herbicide', 'Nematicide', 'Rodenticide', 'Bactericide', 'Bio-Pesticide', 'Growth Regulator', 'Plant Tonic', 'Weedicide']
};

const seasons = ['Summer', 'Monsoon', 'Winter', 'Spring', 'Autumn'];
const weatherTypes = ['Hot', 'Rainy', 'Cold', 'Normal', 'Humid', 'Dry'];

const DemandPrediction = () => {
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [season, setSeason] = useState('Summer');
  const [weather, setWeather] = useState('Normal');
  const [productInput, setProductInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [excelData, setExcelData] = useState(null);
  const [useExcelForPrediction, setUseExcelForPrediction] = useState(false);

  const validateProduct = (input) => {
    if (!input.trim()) return { valid: true, category: null };

    const normalizedInput = input.trim().toLowerCase();
    
    for (const [category, products] of Object.entries(VALID_CATEGORIES)) {
      const found = products.find(p => p.toLowerCase() === normalizedInput);
      if (found) {
        return { valid: true, category, product: found };
      }
    }
    
    return { valid: false, category: null };
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://127.0.0.1:8000/upload-excel', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Upload failed');
      }
      
      const data = await response.json();
      
      console.log('Received data from backend:', data);
      
      // Check if data has products array
      if (!data.products || !Array.isArray(data.products) || data.products.length === 0) {
        setError('No valid product data found in Excel file. Please ensure your Excel has columns like "product_name" and "cost_per_unit".');
        setLoading(false);
        return;
      }
      
      // Store excel data for predictions
      setExcelData(data);
      setUseExcelForPrediction(true);
      setMessage(`✅ Excel uploaded successfully! ${data.products.length} products detected. Click "Predict from Excel Data" to analyze.`);
    } catch (err) {
      console.error('Upload error:', err);
      setError(`Excel upload failed: ${err.message}. Please check your backend connection.`);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = (demandScore, category, product) => {
    const recommendations = [];
    
    if (demandScore > 120) {
      recommendations.push({
        title: 'High Demand Alert',
        action: 'Increase Stock by 40-50%',
        priority: 'high',
        details: `Strong demand expected for ${product || category || 'products'}`
      });
    } else if (demandScore > 100) {
      recommendations.push({
        title: 'Moderate Demand',
        action: 'Maintain Current Stock Levels',
        priority: 'medium',
        details: 'Stable demand conditions'
      });
    } else if (demandScore < 60) {
      recommendations.push({
        title: 'Low Demand Warning',
        action: 'Reduce Stock by 20-30%',
        priority: 'low',
        details: 'Consider promotional offers'
      });
    } else {
      recommendations.push({
        title: 'Normal Demand',
        action: 'Standard Inventory Management',
        priority: 'medium',
        details: 'Maintain regular stock rotation'
      });
    }

    return recommendations;
  };

  const calculateDemandScore = (productName, category, season, weather) => {
    const baseDemand = Math.random() * 50 + 50;
    let demandScore = baseDemand;

    // Season impact
    if (season === 'Summer') demandScore += 20;
    if (season === 'Monsoon') demandScore += 30;
    if (season === 'Winter') demandScore -= 10;
    if (season === 'Spring') demandScore += 15;
    if (season === 'Autumn') demandScore += 5;

    // Weather impact
    if (weather === 'Rainy') demandScore += 25;
    if (weather === 'Hot') demandScore += 15;
    if (weather === 'Cold') demandScore -= 5;
    if (weather === 'Humid') demandScore += 10;
    if (weather === 'Dry') demandScore -= 8;
    if (weather === 'Normal') demandScore += 5;

    // Category-specific adjustments
    if (category === 'Fertilizers' && (season === 'Monsoon' || season === 'Spring')) {
      demandScore += 15;
    }
    if (category === 'Seeds' && (season === 'Summer' || season === 'Spring')) {
      demandScore += 20;
    }
    if (category === 'Pesticides' && (weather === 'Humid' || weather === 'Rainy')) {
      demandScore += 25;
    }

    return Math.round(Math.max(40, Math.min(150, demandScore)));
  };

  const handlePredictionFromExcel = async () => {
    if (!excelData || !excelData.products || excelData.products.length === 0) {
      setError('No excel data available. Please upload an excel file first.');
      return;
    }

    setError('');
    setMessage('');
    setResults(null);

    try {
      setLoading(true);

      const allPredictions = [];

      // Process each product from excel
      for (const excelProduct of excelData.products) {
        // Dynamic field extraction
        const productName = excelProduct.product_name || 
                          excelProduct.product || 
                          excelProduct.name || 
                          excelProduct.Product || 
                          excelProduct['Product Name'] ||
                          'Unknown Product';
        
        const costPerUnit = parseFloat(
          excelProduct.cost_per_unit || 
          excelProduct.price || 
          excelProduct.cost || 
          excelProduct.Price ||
          excelProduct['Cost Per Unit'] ||
          0
        );
        
        // Find matching category
        let matchedCategory = 'Other';
        
        for (const [category, products] of Object.entries(VALID_CATEGORIES)) {
          const found = products.find(p => 
            productName.toLowerCase().includes(p.toLowerCase()) ||
            p.toLowerCase().includes(productName.toLowerCase())
          );
          if (found) {
            matchedCategory = category;
            break;
          }
        }

        // Calculate demand score
        const finalScore = calculateDemandScore(productName, matchedCategory, season, weather);
        const recommendedQuantity = Math.round(finalScore * 1.5);
        const estimatedCost = costPerUnit * recommendedQuantity;
        
        allPredictions.push({
          category: matchedCategory,
          product: productName,
          demandScore: finalScore,
          recommendedQuantity: recommendedQuantity,
          costPerUnit: costPerUnit,
          estimatedCost: estimatedCost,
          inventoryAction: finalScore > 120 ? 'Increase Stock' : finalScore < 60 ? 'Reduce Stock' : 'Maintain Stock'
        });
      }

      // Sort by demand score (highest first)
      allPredictions.sort((a, b) => b.demandScore - a.demandScore);

      setResults({
        mode: 'excel',
        predictions: allPredictions,
        season,
        weather,
        totalEstimatedCost: allPredictions.reduce((sum, p) => sum + p.estimatedCost, 0),
        totalProducts: allPredictions.length,
        highDemandProducts: allPredictions.filter(p => p.demandScore > 120).length,
        lowDemandProducts: allPredictions.filter(p => p.demandScore < 60).length
      });

      setMessage(`✅ Excel-based prediction completed for ${allPredictions.length} products!`);
    } catch (err) {
      console.error('Prediction error:', err);
      setError(`Prediction failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePrediction = async () => {
    setError('');
    setMessage('');
    setResults(null);

    // Validate product if entered
    if (productInput.trim()) {
      const validation = validateProduct(productInput);
      
      if (!validation.valid) {
        setError(`"${productInput}" is not a recognized product. Please select from Fertilizers, Seeds, or Pesticides categories.`);
        return;
      }
      
      setSelectedCategory(validation.category);
    }

    try {
      setLoading(true);

      // If no specific product, generate recommendations for all categories
      if (!productInput.trim()) {
        const allPredictions = [];

        for (const [category, products] of Object.entries(VALID_CATEGORIES)) {
          const topProducts = products.slice(0, 10);
          
          for (const product of topProducts) {
            const finalScore = calculateDemandScore(product, category, season, weather);
            
            // Generate random cost per unit for demo
            const costPerUnit = Math.round(Math.random() * 500 + 100);
            const recommendedQuantity = Math.round(finalScore * 1.5);
            
            allPredictions.push({
              category,
              product,
              demandScore: finalScore,
              recommendedQuantity: recommendedQuantity,
              costPerUnit: costPerUnit,
              estimatedCost: costPerUnit * recommendedQuantity,
              inventoryAction: finalScore > 120 ? 'Increase Stock' : finalScore < 60 ? 'Reduce Stock' : 'Maintain Stock'
            });
          }
        }

        // Sort by demand score
        allPredictions.sort((a, b) => b.demandScore - a.demandScore);

        setResults({
          mode: 'multi',
          predictions: allPredictions,
          season,
          weather,
          totalEstimatedCost: allPredictions.reduce((sum, p) => sum + p.estimatedCost, 0),
          totalProducts: allPredictions.length,
          highDemandProducts: allPredictions.filter(p => p.demandScore > 120).length,
          lowDemandProducts: allPredictions.filter(p => p.demandScore < 60).length
        });

      } else {
        // Single product prediction
        const validation = validateProduct(productInput);
        
        const response = await fetch(
          `http://127.0.0.1:8000/predict-demand?season=${season}&weather=${weather}&product=${validation.product}`,
          { method: 'POST' }
        );

        if (!response.ok) throw new Error('Prediction failed');
        
        const data = await response.json();
        
        setResults({
          mode: 'single',
          product: validation.product,
          category: validation.category,
          season: data.season,
          weather: data.weather,
          demandScore: data.predicted_demand_score,
          recommendations: generateRecommendations(data.predicted_demand_score, validation.category, validation.product)
        });
      }

      setMessage('✅ Prediction completed successfully!');
    } catch (err) {
      console.error('Prediction error:', err);
      setError(`Prediction failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-secondary min-h-screen">
        {/* Header - Dashboard Style */}
        <div className="bg-gradient-hero text-primary-foreground py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-3">
                  <Sparkles className="h-8 w-8" />
                  AI Demand Prediction
                </h1>
                <p className="text-primary-foreground/80 mt-1">
                  Welcome {user?.firstName || 'User'}! Upload historical data and get intelligent demand forecasts
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">

        {/* Input Section */}
        <div className="bg-card rounded-3xl shadow-xl border-2 border-primary/20 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
            <TrendingUp className="text-primary" />
            Prediction Parameters
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Product Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Urea, Rice Seeds, Insecticide"
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                className="w-full px-4 py-3 border-2 border-border bg-background rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary transition"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Leave empty to get top 10 products from each category
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Season
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-4 py-3 border-2 border-border bg-background rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary transition cursor-pointer"
              >
                {seasons.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Weather Condition
              </label>
              <select
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                className="w-full px-4 py-3 border-2 border-border bg-background rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary transition cursor-pointer"
              >
                {weatherTypes.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-primary/10 rounded-xl p-4 mb-6">
            <p className="text-sm text-foreground">
              <strong>Valid Categories:</strong> Fertilizers, Seeds, Pesticides
            </p>
          </div>

          <Button
            onClick={handlePrediction}
            disabled={loading}
            className="w-full px-8 py-4 bg-gradient-to-r from-primary to-green-600 text-lg font-bold"
          >
            {loading && !excelData ? 'Analyzing...' : productInput.trim() ? 'Predict Single Product' : 'Predict Top 30 Products'}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {message && !error && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-8 flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
            <p className="text-green-700 font-medium">{message}</p>
          </div>
        )}

        {/* Results - Single Product */}
        {results && results.mode === 'single' && (
          <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-3xl p-8 text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Package size={32} />
              Prediction Results
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <p className="text-sm opacity-80 mb-1">Product</p>
                <p className="text-2xl font-bold">{results.product}</p>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <p className="text-sm opacity-80 mb-1">Category</p>
                <p className="text-2xl font-bold">{results.category}</p>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <p className="text-sm opacity-80 mb-1">Season</p>
                <p className="text-2xl font-bold">{results.season}</p>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <p className="text-sm opacity-80 mb-1">Weather</p>
                <p className="text-2xl font-bold">{results.weather}</p>
              </div>
            </div>

            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-8 mb-6">
              <p className="text-lg mb-2">Demand Score</p>
              <p className="text-6xl font-bold">{results.demandScore}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-4">Recommendations</h3>
              {results.recommendations.map((rec, idx) => (
                <div key={idx} className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-2">{rec.title}</h4>
                  <p className="text-lg font-semibold mb-2">{rec.action}</p>
                  <p className="opacity-90">{rec.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results - Multiple Products or Excel */}
        {results && (results.mode === 'multi' || results.mode === 'excel') && (
          <div className="bg-card rounded-3xl shadow-xl border-2 border-primary/20 p-8">
            <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
              <Package className="text-primary" />
              {results.mode === 'excel' ? 'Excel Data' : 'Top 30 Products'} Demand Forecast
            </h2>

            {/* Summary Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-700 font-semibold">Total Products</p>
                <p className="text-3xl font-bold text-blue-900">{results.totalProducts}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-700 font-semibold">High Demand</p>
                <p className="text-3xl font-bold text-red-900">{results.highDemandProducts}</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-700 font-semibold">Low Demand</p>
                <p className="text-3xl font-bold text-yellow-900">{results.lowDemandProducts}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm text-green-700 font-semibold">Total Cost</p>
                <p className="text-2xl font-bold text-green-900">₹{results.totalEstimatedCost.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-primary/10 rounded-xl">
              <p className="text-foreground">
                <strong>Season:</strong> {results.season} | <strong>Weather:</strong> {results.weather}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary to-green-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left rounded-tl-xl">#</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-center">Demand Score</th>
                    <th className="px-4 py-3 text-center">Recommended Qty</th>
                    <th className="px-4 py-3 text-center">Cost/Unit</th>
                    <th className="px-4 py-3 text-center">Est. Total Cost</th>
                    <th className="px-4 py-3 text-left rounded-tr-xl">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.predictions.map((pred, idx) => (
                    <tr 
                      key={idx} 
                      className={`${idx % 2 === 0 ? 'bg-secondary/50' : 'bg-card'} hover:bg-secondary transition`}
                    >
                      <td className="px-4 py-4 font-semibold text-foreground">{idx + 1}</td>
                      <td className="px-4 py-4">
                        <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                          {pred.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-medium text-foreground">{pred.product}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          pred.demandScore > 120 ? 'bg-red-100 text-red-700' :
                          pred.demandScore > 100 ? 'bg-yellow-100 text-yellow-700' :
                          pred.demandScore < 60 ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {pred.demandScore}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center font-semibold text-foreground">
                        {pred.recommendedQuantity} units
                      </td>
                      <td className="px-4 py-4 text-center font-mono text-foreground">
                        ₹{pred.costPerUnit.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-4 text-center font-mono font-bold text-foreground">
                        ₹{pred.estimatedCost.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          pred.inventoryAction === 'Increase Stock' ? 'bg-red-100 text-red-700' :
                          pred.inventoryAction === 'Reduce Stock' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {pred.inventoryAction}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        </div>
      </div>
    </Layout>
  );
};

export default DemandPrediction;