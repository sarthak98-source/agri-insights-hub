<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useUser } from '@clerk/clerk-react';
import {
  TrendingUp,
  Package,
  AlertCircle,
  CheckCircle,
  Upload,
  Sparkles,
  RefreshCw,
  Brain,
  Zap,
  FileSpreadsheet,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const VALID_CATEGORIES = {
  Fertilizers: [
    'Urea',
    'DAP',
    'NPK',
    'Potash',
    'Organic Compost',
    'Vermicompost',
    'Phosphate',
    'Zinc Sulphate',
    'Boron',
    'Calcium Nitrate',
  ],
  Seeds: [
    'Rice Seeds',
    'Wheat Seeds',
    'Cotton Seeds',
    'Soybean Seeds',
    'Corn Seeds',
    'Sunflower Seeds',
    'Chickpea Seeds',
    'Mustard Seeds',
    'Tomato Seeds',
    'Onion Seeds',
  ],
  Pesticides: [
    'Insecticide',
    'Fungicide',
    'Herbicide',
    'Nematicide',
    'Rodenticide',
    'Bactericide',
    'Bio-Pesticide',
    'Growth Regulator',
    'Plant Tonic',
    'Weedicide',
  ],
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

  // AI states
  const [aiEnabled, setAiEnabled] = useState(true);
  const [modelInfo, setModelInfo] = useState(null);
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [trainingData, setTrainingData] = useState([]);
=======
import { useState, useRef } from "react";
import { Layout } from "@/components/Layout";
import {
  Brain,
  TrendingUp,
  Upload,
  Send,
  Loader2,
  Sparkles,
  BarChart3,
  CloudRain,
  Sun,
  Snowflake,
  Wind,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Bot,
  User,
  X,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface QuickScenario {
  label: string;
  icon: React.ReactNode;
  prompt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GROQ_SYSTEM_PROMPT = `You are an expert Agricultural Demand Prediction AI powered by Groq's fast inference engine.
You specialize in predicting crop demand, stock requirements, and agricultural inventory planning for Indian farmers and agri-businesses.

Your expertise includes:
- Seasonal demand patterns (Kharif, Rabi, Zaid crops)
- Weather impact on crop yields and demand
- Indian agricultural markets (APMC, mandi prices)
- Post-harvest supply chain logistics
- Regional demand variations across Indian states
- Commodity price trends (rice, wheat, pulses, vegetables, spices, etc.)
- Government procurement policies (MSP, FCI, NAFED)

When predicting demand, always provide:
1. **Predicted Demand Score** (0-100 scale, 100 = very high demand)
2. **Recommended Stock Level** (in relevant units)
3. **Confidence Level** (Low/Medium/High)
4. **Key Factors** driving demand
5. **Recommendation** (Buy More / Maintain / Reduce)
6. **Price Trend** (Rising/Stable/Falling)
7. **Best Action** (specific, actionable advice)

Format your response clearly with sections using bold headers. Be specific, data-driven, and practical.
Always consider the Indian agricultural context including seasons, festivals, and market dynamics.`;

const QUICK_SCENARIOS: QuickScenario[] = [
  {
    label: "Rice — Monsoon",
    icon: <CloudRain className="h-4 w-4" />,
    prompt: "Predict demand for Rice during Monsoon season with Rainy weather in Maharashtra. Current stock: 500 kg.",
  },
  {
    label: "Wheat — Winter",
    icon: <Snowflake className="h-4 w-4" />,
    prompt: "What is the expected demand for Wheat in Winter season in Punjab? I have 1000 kg in stock. Should I buy more before Rabi harvest?",
  },
  {
    label: "Tomatoes — Summer",
    icon: <Sun className="h-4 w-4" />,
    prompt: "Predict tomato demand for Summer season with Hot weather. Stock: 200 kg. Market: Nashik APMC.",
  },
  {
    label: "Onion — Festival",
    icon: <Sparkles className="h-4 w-4" />,
    prompt: "Predict onion demand during Diwali festival season. Weather: Normal. Region: Rajasthan. Stock: 800 kg.",
  },
  {
    label: "Pulses — Rabi",
    icon: <Wind className="h-4 w-4" />,
    prompt: "Forecast demand for Chana Dal (chickpea) in Rabi season across Madhya Pradesh. Should I increase stock levels?",
  },
];

// ─── Groq API Key ─────────────────────────────────────────────────────────────
// Set your Groq API key here OR in .env as VITE_GROQ_API_KEY
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "YOUR_GROQ_API_KEY_HERE";

// ─── Groq API (Direct — No CORS issues, Groq allows browser calls) ────────────

async function callGroqAgent(messages: { role: string; content: string }[]): Promise<string> {
  if (!GROQ_API_KEY || GROQ_API_KEY === "YOUR_GROQ_API_KEY_HERE") {
    throw new Error("Please set your Groq API key. Get one free at console.groq.com");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      temperature: 0.7,
      messages: [
        { role: "system", content: GROQ_SYSTEM_PROMPT },
        ...messages,
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = err?.error?.message || `Groq API error: ${response.status}`;
    throw new Error(msg);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response from Groq.";
}

// ─── Message Bubble ────────────────────────────────────────────────────────────

const MessageBubble = ({ msg }: { msg: Message }) => {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} mb-4`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm
          ${isUser ? "bg-green-500" : "bg-gradient-to-br from-purple-600 to-indigo-600"}`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
            ${isUser
              ? "bg-green-500 text-white rounded-tr-sm"
              : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm"
            }`}
          dangerouslySetInnerHTML={{
            __html: isUser
              ? msg.content
              : msg.content
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\n/g, "<br/>")
                  .replace(/#{1,3} (.*)/g, "<span class='font-bold text-base block mt-2 mb-1'>$1</span>")
          }}
        />
        <span className="text-xs text-gray-400 px-1">
          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

const DemandPrediction = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Hello! I'm your **AI Demand Prediction Agent** powered by Groq's ultra-fast inference.\n\nI can help you:\n• 📊 **Predict crop/product demand** based on season & weather\n• 📦 **Recommend stock levels** for your inventory\n• 💰 **Analyze price trends** in Indian agricultural markets\n• 🌾 **Plan procurement** before seasonal spikes\n\nTell me what product you want to analyze, or pick a quick scenario below!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manual inputs for structured prediction
  const [product, setProduct] = useState("");
  const [season, setSeason] = useState("Monsoon");
  const [weather, setWeather] = useState("Normal");
  const [stock, setStock] = useState("");
  const [region, setRegion] = useState("");
  const [showStructured, setShowStructured] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setError(null);

    const userMsg: Message = { role: "user", content: text, timestamp: new Date() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    setTimeout(scrollToBottom, 50);
>>>>>>> 2432ded6 (Updated backend API and fixed bug)

  // Check AI model status on component mount
  useEffect(() => {
    checkModelStatus();
  }, []);

  const validateProduct = (input) => {
    if (!input.trim()) return { valid: true, category: null };

    const normalizedInput = input.trim().toLowerCase();

    for (const [category, products] of Object.entries(VALID_CATEGORIES)) {
      const found = products.find((p) => p.toLowerCase() === normalizedInput);
      if (found) {
        return { valid: true, category, product: found };
      }
    }

    return { valid: false, category: null };
  };

  const checkModelStatus = async () => {
    try {
<<<<<<< HEAD
      const response = await fetch('http://127.0.0.1:8000/model-info');
      const data = await response.json();
      setModelInfo(data);
      setAiEnabled(data.is_trained);
    } catch (err) {
      console.log('AI model not available, using fallback');
      setAiEnabled(false);
    }
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
      if (
        !data.products ||
        !Array.isArray(data.products) ||
        data.products.length === 0
      ) {
        setError(
          'No valid product data found in Excel file. Please ensure your Excel has columns like "product_name" and "cost_per_unit".'
        );
        setLoading(false);
        return;
      }

      // Store excel data for predictions
      setExcelData(data);
      setUseExcelForPrediction(true);
      setMessage(
        `✅ Excel uploaded successfully! ${data.products.length} products detected. Click "Predict from Excel Data" to analyze.`
      );
    } catch (err) {
      console.error('Upload error:', err);
      setError(
        `Excel upload failed: ${err.message}. Please check your backend connection.`
      );
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
        details: `Strong demand expected for ${product || category || 'products'}`,
      });
    } else if (demandScore > 100) {
      recommendations.push({
        title: 'Moderate Demand',
        action: 'Maintain Current Stock Levels',
        priority: 'medium',
        details: 'Stable demand conditions',
      });
    } else if (demandScore < 60) {
      recommendations.push({
        title: 'Low Demand Warning',
        action: 'Reduce Stock by 20-30%',
        priority: 'low',
        details: 'Consider promotional offers',
      });
    } else {
      recommendations.push({
        title: 'Normal Demand',
        action: 'Standard Inventory Management',
        priority: 'medium',
        details: 'Maintain regular stock rotation',
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
    if (
      category === 'Fertilizers' &&
      (season === 'Monsoon' || season === 'Spring')
    ) {
      demandScore += 15;
    }
    if (category === 'Seeds' && (season === 'Summer' || season === 'Spring')) {
      demandScore += 20;
    }
    if (
      category === 'Pesticides' &&
      (weather === 'Humid' || weather === 'Rainy')
    ) {
      demandScore += 25;
    }

    return Math.round(Math.max(40, Math.min(150, demandScore)));
  };

  // Helper functions
  const getProductCategory = (productName) => {
    for (const [category, products] of Object.entries(VALID_CATEGORIES)) {
      if (
        products.some((p) =>
          productName.toLowerCase().includes(p.toLowerCase())
        )
      ) {
        return category;
      }
    }
    return 'Other';
  };

  const getInventoryAction = (demandScore) => {
    if (demandScore > 120) return 'Increase Stock';
    if (demandScore < 60) return 'Reduce Stock';
    return 'Maintain Stock';
  };

  // Fallback prediction function
  const handleFallbackPrediction = () => {
    if (productInput.trim()) {
      const validation = validateProduct(productInput);
      const finalScore = calculateDemandScore(
        validation.product,
        validation.category,
        season,
        weather
      );

      setResults({
        mode: 'single',
        product: validation.product,
        category: validation.category,
        season,
        weather,
        demandScore: finalScore,
        recommendations: generateRecommendations(
          finalScore,
          validation.category,
          validation.product
        ),
      });
    } else {
      // Multi-product fallback
      const allPredictions = [];

      for (const [category, products] of Object.entries(VALID_CATEGORIES)) {
        const topProducts = products.slice(0, 10);

        for (const product of topProducts) {
          const finalScore = calculateDemandScore(
            product,
            category,
            season,
            weather
          );

          const costPerUnit = Math.round(Math.random() * 500 + 100);
          const recommendedQuantity = Math.round(finalScore * 1.5);

          allPredictions.push({
            category,
            product,
            demandScore: finalScore,
            recommendedQuantity: recommendedQuantity,
            costPerUnit: costPerUnit,
            estimatedCost: costPerUnit * recommendedQuantity,
            inventoryAction:
              finalScore > 120
                ? 'Increase Stock'
                : finalScore < 60
                  ? 'Reduce Stock'
                  : 'Maintain Stock',
          });
        }
      }

      allPredictions.sort((a, b) => b.demandScore - a.demandScore);

      setResults({
        mode: 'multi',
        predictions: allPredictions,
        season,
        weather,
        totalEstimatedCost: allPredictions.reduce(
          (sum, p) => sum + p.estimatedCost,
          0
        ),
        totalProducts: allPredictions.length,
        highDemandProducts: allPredictions.filter((p) => p.demandScore > 120)
          .length,
        lowDemandProducts: allPredictions.filter((p) => p.demandScore < 60)
          .length,
      });
    }
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
        const productName =
          excelProduct.product_name ||
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
          const found = products.find(
            (p) =>
              productName.toLowerCase().includes(p.toLowerCase()) ||
              p.toLowerCase().includes(productName.toLowerCase())
          );
          if (found) {
            matchedCategory = category;
            break;
          }
        }

        // Calculate demand score
        const finalScore = calculateDemandScore(
          productName,
          matchedCategory,
          season,
          weather
        );
        const recommendedQuantity = Math.round(finalScore * 1.5);
        const estimatedCost = costPerUnit * recommendedQuantity;

        allPredictions.push({
          category: matchedCategory,
          product: productName,
          demandScore: finalScore,
          recommendedQuantity: recommendedQuantity,
          costPerUnit: costPerUnit,
          estimatedCost: estimatedCost,
          inventoryAction:
            finalScore > 120
              ? 'Increase Stock'
              : finalScore < 60
                ? 'Reduce Stock'
                : 'Maintain Stock',
        });
      }

      // Sort by demand score (highest first)
      allPredictions.sort((a, b) => b.demandScore - a.demandScore);

      setResults({
        mode: 'excel',
        predictions: allPredictions,
        season,
        weather,
        totalEstimatedCost: allPredictions.reduce(
          (sum, p) => sum + p.estimatedCost,
          0
        ),
        totalProducts: allPredictions.length,
        highDemandProducts: allPredictions.filter((p) => p.demandScore > 120)
          .length,
        lowDemandProducts: allPredictions.filter((p) => p.demandScore < 60)
          .length,
      });

      setMessage(
        `✅ Excel-based prediction completed for ${allPredictions.length} products!`
      );
    } catch (err) {
      console.error('Prediction error:', err);
      setError(`Prediction failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Add AI-powered Excel prediction
  const handlePredictionFromExcelWithAI = async () => {
    if (!excelData || !excelData.products || excelData.products.length === 0) {
      setError('No excel data available.');
      return;
    }

    setError('');
    setMessage('');
    setResults(null);

    try {
      setLoading(true);

      const predictionRequest = {
        products: excelData.products,
        season,
        weather,
      };

      const response = await fetch('http://127.0.0.1:8000/predict-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(predictionRequest),
      });

      if (!response.ok) throw new Error('Batch prediction failed');

      const data = await response.json();

      const allPredictions = data.predictions.map((pred, idx) => ({
        index: idx + 1,
        category: getProductCategory(pred.product),
        product: pred.product,
        demandScore: pred.predicted_demand_score,
        recommendedQuantity: pred.recommended_stock,
        costPerUnit:
          pred.cost_per_unit || Math.round(Math.random() * 500 + 100),
        estimatedCost: pred.estimated_cost,
        confidenceScore: pred.confidence_score,
        inventoryAction: getInventoryAction(pred.predicted_demand_score),
        aiConfidence: pred.confidence_score,
      }));

      setResults({
        mode: 'excel',
        predictions: allPredictions,
        season,
        weather,
        totalEstimatedCost: data.summary.total_estimated_cost,
        totalProducts: data.summary.total_products,
        highDemandProducts: data.summary.high_demand_count,
        lowDemandProducts: data.summary.low_demand_count,
        averageDemandScore: data.summary.average_demand_score,
        aiSummary: data.summary,
      });

      setMessage(
        `✅ AI analyzed ${allPredictions.length} products with ${data.summary.average_demand_score.toFixed(1)} average demand score!`
      );
    } catch (err) {
      console.error('AI prediction error:', err);
      setError(
        `AI prediction failed: ${err.message}. Using statistical calculations.`
      );
      // Fallback to statistical method
      handlePredictionFromExcel();
    } finally {
      setLoading(false);
    }
  };

  // Update handlePrediction function with AI integration
  const handlePrediction = async () => {
    setError('');
    setMessage('');
    setResults(null);

    // Validate product if entered
    let validation = null;
    if (productInput.trim()) {
      validation = validateProduct(productInput);

      if (!validation.valid) {
        setError(`"${productInput}" is not a recognized product.`);
        return;
      }

      setSelectedCategory(validation.category);
    }

    try {
      setLoading(true);

      // If AI is enabled, use AI prediction
      if (aiEnabled && productInput.trim()) {
        // Single product AI prediction
        const predictionData = {
          product: validation.product,
          season,
          weather,
          month: new Date().getMonth() + 1,
          region: 'North',
        };

        const response = await fetch('http://127.0.0.1:8000/predict-demand', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(predictionData),
        });

        if (!response.ok) throw new Error('AI prediction failed');

        const data = await response.json();

        setConfidenceScore(data.confidence_score);

        setResults({
          mode: 'single',
          product: data.product,
          category: validation.category,
          season: data.season,
          weather: data.weather,
          demandScore: data.predicted_demand_score,
          recommendedStock: data.recommended_stock,
          confidenceScore: data.confidence_score,
          recommendations: data.recommendations.map((rec) => ({
            title: rec.title,
            action: rec.action,
            priority: rec.priority,
            details: rec.details,
          })),
        });

        setMessage(
          `✅ AI Prediction completed with ${(data.confidence_score * 100).toFixed(1)}% confidence!`
        );
      } else if (useExcelForPrediction && excelData) {
        // Excel-based AI prediction
        await handlePredictionFromExcelWithAI();
      } else {
        // Fallback to existing logic if AI is not available
        handleFallbackPrediction();
        if (!aiEnabled) {
          setMessage('⚠️ Using statistical calculations (AI unavailable)');
        } else {
          setMessage('✅ Prediction completed successfully!');
        }
      }
    } catch (err) {
      console.error('Prediction error:', err);
      setError(
        `Prediction failed: ${err.message}. Using fallback calculations.`
      );
      // Fallback to existing calculation
      handleFallbackPrediction();
    } finally {
      setLoading(false);
    }
  };

  // Add train model function
  const handleTrainModel = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/train-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(
          `✅ AI Model retrained successfully! Accuracy: ${(data.model_score * 100).toFixed(1)}%`
        );
        checkModelStatus();
      }
    } catch (err) {
      setError('Model training failed');
    } finally {
      setLoading(false);
    }
  };

  // Update UI with AI status indicator
  const renderAIStatus = () => (
    <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-purple-600" />
          <div>
            <h3 className="font-bold text-foreground">AI Prediction Engine</h3>
            <p className="text-sm text-muted-foreground">
              {aiEnabled
                ? `Active - ${modelInfo?.model_type || 'XGBoost Model'} loaded`
                : 'Initializing...'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${aiEnabled ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}
          />
          <span className="text-sm font-medium">
            {aiEnabled ? 'AI Active' : 'Fallback Mode'}
          </span>
        </div>
      </div>
    </div>
  );

  // Add AI Training Section
  const renderAITraining = () => (
    <div className="mt-8 p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Zap className="h-5 w-5" />
        AI Model Training
      </h3>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-white/10 rounded-xl">
          <p className="text-sm opacity-80">Model Accuracy</p>
          <p className="text-2xl font-bold">~83.0%</p>
        </div>
        <div className="p-4 bg-white/10 rounded-xl">
          <p className="text-sm opacity-80">Training Data</p>
          <p className="text-2xl font-bold">50 records</p>
        </div>
        <div className="p-4 bg-white/10 rounded-xl">
          <p className="text-sm opacity-80">Last Updated</p>
          <p className="text-2xl font-bold">Today</p>
        </div>
      </div>
      <Button
        onClick={handleTrainModel}
        className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600"
        disabled={loading}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Retrain AI Model
      </Button>
    </div>
  );

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
                  Welcome {user?.firstName || 'User'}! Upload historical data
                  and get intelligent demand forecasts
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  disabled={loading}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                  />
                  Reset
                </Button>
=======
      // Build conversation history for the API
      const history = newMessages.map(m => ({ role: m.role, content: m.content }));
      const reply = await callGroqAgent(history);

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: reply, timestamp: new Date() },
      ]);
    } catch (err: any) {
      setError(err.message || "AI request failed. Please try again.");
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Sorry, I couldn't process your request right now. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleStructuredPredict = () => {
    if (!product) return;
    const prompt = `Predict demand for **${product}** with the following conditions:
- Season: ${season}
- Weather: ${weather}
- Current Stock: ${stock ? stock + " units" : "Not specified"}
- Region: ${region || "India (general)"}

Please provide a comprehensive demand analysis with stock recommendations.`;
    sendMessage(prompt);
    setShowStructured(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared! Ask me anything about agricultural demand prediction. 🌾",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-gray-50 via-green-50/30 to-indigo-50/20 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-600 to-green-600 text-white py-6 shadow-lg">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <div className="bg-white/20 rounded-xl p-2">
                  <Brain className="h-7 w-7" />
                </div>
                AI Demand Prediction
              </h1>
              <p className="text-indigo-200 text-sm mt-1 flex items-center gap-2">
                <Sparkles className="h-3 w-3" />
                Powered by Groq · Ultra-fast Agricultural Intelligence
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-xs">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Groq Agent Active
>>>>>>> 2432ded6 (Updated backend API and fixed bug)
              </div>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <div className="container mx-auto px-4 py-8">
          {/* AI Status Indicator */}
          {renderAIStatus()}

          {/* File Upload Section */}
          <div className="bg-card rounded-3xl shadow-xl border-2 border-primary/20 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
              <FileSpreadsheet className="text-primary" />
              Upload Historical Data
            </h2>
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full text-sm text-foreground
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-primary-foreground
                    hover:file:bg-primary/90"
                />
                <Button
                  onClick={handleUpload}
                  disabled={loading || !file}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Excel
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Upload Excel/CSV files with product data (columns: product_name,
                cost_per_unit, etc.)
              </p>
            </div>

            {excelData && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">
                        {excelData.filename || 'Excel file'} loaded
                      </p>
                      <p className="text-sm text-green-700">
                        {excelData.products_found} products detected
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handlePredictionFromExcelWithAI}
                    disabled={loading}
                    className="bg-gradient-to-r from-green-600 to-teal-600"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Predict with AI
                  </Button>
                </div>
              </div>
            )}
          </div>

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
                    <option key={s} value={s}>
                      {s}
                    </option>
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
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-primary/10 rounded-xl p-4 mb-6">
              <p className="text-sm text-foreground">
                <strong>Valid Categories:</strong> Fertilizers, Seeds,
                Pesticides
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handlePrediction}
                disabled={loading}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-primary to-green-600 text-lg font-bold"
              >
                {loading && !excelData
                  ? 'Analyzing...'
                  : productInput.trim()
                    ? aiEnabled
                      ? 'AI Predict Single Product'
                      : 'Predict Single Product'
                    : aiEnabled
                      ? 'AI Predict Top 30 Products'
                      : 'Predict Top 30 Products'}
              </Button>

              {excelData && (
                <Button
                  onClick={handlePredictionFromExcel}
                  disabled={loading}
                  variant="outline"
                  className="px-6 py-4 border-2 border-primary text-primary hover:bg-primary/10"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Statistical Analysis
                </Button>
              )}
            </div>
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
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <Package size={32} />
                  AI Prediction Results
                </h2>
                {results.confidenceScore && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                    <p className="text-sm opacity-80">AI Confidence</p>
                    <p className="text-xl font-bold">
                      {(results.confidenceScore * 100).toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>

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
                <p className="text-lg mb-2">AI Predicted Demand Score</p>
                <p className="text-6xl font-bold">{results.demandScore}</p>
                {results.recommendedStock && (
                  <p className="text-lg mt-2 opacity-90">
                    Recommended Stock: {results.recommendedStock} units
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold mb-4">AI Recommendations</h3>
                {results.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="bg-white/20 backdrop-blur-sm rounded-xl p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xl font-bold mb-2">{rec.title}</h4>
                        <p className="text-lg font-semibold mb-2">
                          {rec.action}
                        </p>
                        <p className="opacity-90">{rec.details}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          rec.priority === 'high'
                            ? 'bg-red-500/30 text-red-200'
                            : rec.priority === 'medium'
                              ? 'bg-yellow-500/30 text-yellow-200'
                              : 'bg-blue-500/30 text-blue-200'
                        }`}
                      >
                        {rec.priority} priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results - Multiple Products or Excel */}
          {results &&
            (results.mode === 'multi' || results.mode === 'excel') && (
              <div className="bg-card rounded-3xl shadow-xl border-2 border-primary/20 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                    <Package className="text-primary" />
                    {results.mode === 'excel'
                      ? 'Excel Data'
                      : 'Top 30 Products'}{' '}
                    Demand Forecast
                    {results.aiSummary && (
                      <span className="text-sm font-normal bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full">
                        AI Powered
                      </span>
                    )}
                  </h2>
                  {results.averageDemandScore && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl px-4 py-2">
                      <p className="text-sm text-purple-700 font-semibold">
                        Avg Demand Score
                      </p>
                      <p className="text-xl font-bold text-purple-900">
                        {results.averageDemandScore}
                      </p>
                    </div>
                  )}
                </div>

                {/* Summary Stats */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-700 font-semibold">
                      Total Products
                    </p>
                    <p className="text-3xl font-bold text-blue-900">
                      {results.totalProducts}
                    </p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-700 font-semibold">
                      High Demand
                    </p>
                    <p className="text-3xl font-bold text-red-900">
                      {results.highDemandProducts}
                    </p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-sm text-yellow-700 font-semibold">
                      Low Demand
                    </p>
                    <p className="text-3xl font-bold text-yellow-900">
                      {results.lowDemandProducts}
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-sm text-green-700 font-semibold">
                      Total Cost
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      ₹{results.totalEstimatedCost.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-primary/10 rounded-xl">
                  <p className="text-foreground">
                    <strong>Season:</strong> {results.season} |{' '}
                    <strong>Weather:</strong> {results.weather}
                    {results.aiSummary && (
                      <span className="ml-4 text-sm text-purple-600">
                        <strong>AI Confidence:</strong>{' '}
                        {results.aiSummary.average_demand_score}%
                      </span>
                    )}
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
                        <th className="px-4 py-3 text-center">
                          Recommended Qty
                        </th>
                        <th className="px-4 py-3 text-center">Cost/Unit</th>
                        <th className="px-4 py-3 text-center">
                          Est. Total Cost
                        </th>
                        {results.predictions[0]?.confidenceScore && (
                          <th className="px-4 py-3 text-center">
                            AI Confidence
                          </th>
                        )}
                        <th className="px-4 py-3 text-left rounded-tr-xl">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.predictions.map((pred, idx) => (
                        <tr
                          key={idx}
                          className={`${idx % 2 === 0 ? 'bg-secondary/50' : 'bg-card'} hover:bg-secondary transition`}
                        >
                          <td className="px-4 py-4 font-semibold text-foreground">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                              {pred.category}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-medium text-foreground">
                            {pred.product}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-bold ${
                                pred.demandScore > 120
                                  ? 'bg-red-100 text-red-700'
                                  : pred.demandScore > 100
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : pred.demandScore < 60
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-green-100 text-green-700'
                              }`}
                            >
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
                          {pred.confidenceScore && (
                            <td className="px-4 py-4 text-center">
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                {(pred.confidenceScore * 100).toFixed(0)}%
                              </span>
                            </td>
                          )}
                          <td className="px-4 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                pred.inventoryAction === 'Increase Stock'
                                  ? 'bg-red-100 text-red-700'
                                  : pred.inventoryAction === 'Reduce Stock'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-green-100 text-green-700'
                              }`}
                            >
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

          {/* AI Training Section */}
          {renderAITraining()}
=======
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Quick Scenarios */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wider">Quick Scenarios</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_SCENARIOS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => sendMessage(s.prompt)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-full text-xs text-gray-700 hover:text-indigo-700 transition-all shadow-sm disabled:opacity-50"
                >
                  {s.icon}
                  {s.label}
                </button>
              ))}
              <button
                onClick={() => setShowStructured(!showStructured)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs transition-all shadow-sm"
              >
                <BarChart3 className="h-3.5 w-3.5" />
                Structured Input
                <ChevronDown className={`h-3 w-3 transition-transform ${showStructured ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

          {/* Structured Input Panel */}
          {showStructured && (
            <div className="mb-4 bg-white border border-indigo-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-500" />
                Structured Demand Analysis
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Product / Crop *</label>
                  <input
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="e.g. Basmati Rice, Wheat"
                    value={product}
                    onChange={e => setProduct(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Season</label>
                  <select
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={season}
                    onChange={e => setSeason(e.target.value)}
                  >
                    {["Monsoon (Kharif)", "Winter (Rabi)", "Summer (Zaid)", "Festival", "Harvest"].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Weather</label>
                  <select
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={weather}
                    onChange={e => setWeather(e.target.value)}
                  >
                    {["Normal", "Hot", "Rainy", "Cold", "Dry Spell", "Flood Risk", "Cyclone"].map(w => (
                      <option key={w}>{w}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Current Stock (units)</label>
                  <input
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="e.g. 500"
                    type="number"
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Region / State</label>
                  <input
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="e.g. Maharashtra, Punjab"
                    value={region}
                    onChange={e => setRegion(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleStructuredPredict}
                    disabled={!product || isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Predict
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chat Window */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-indigo-50 to-green-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Groq Demand Agent</p>
                  <p className="text-xs text-green-600">● Online · Fast Inference Mode</p>
                </div>
              </div>
              <button
                onClick={clearChat}
                className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            </div>

            {/* Messages */}
            <div className="h-[420px] overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} />
              ))}
              {isLoading && (
                <div className="flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="text-xs text-gray-400 ml-1">Groq is analyzing...</span>
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-lg p-3 mb-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-3 bg-gray-50">
              <div className="flex items-end gap-2">
                <textarea
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none bg-white"
                  placeholder="Ask about demand prediction for any crop, product, or market... (Enter to send)"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={2}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl p-3 transition-colors flex-shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5 px-1">
                Shift+Enter for new line · Powered by Groq ultra-fast inference
              </p>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[
              { icon: <Brain className="h-5 w-5 text-purple-500" />, title: "AI-Powered", desc: "Groq LLM for instant agricultural insights" },
              { icon: <TrendingUp className="h-5 w-5 text-green-500" />, title: "Market Aware", desc: "Understands Indian APMC & mandi dynamics" },
              { icon: <CheckCircle2 className="h-5 w-5 text-indigo-500" />, title: "Actionable", desc: "Get specific stock & procurement recommendations" },
            ].map(card => (
              <div key={card.title} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
                <div className="flex justify-center mb-2">{card.icon}</div>
                <p className="font-semibold text-gray-700 text-sm">{card.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{card.desc}</p>
              </div>
            ))}
          </div>
>>>>>>> 2432ded6 (Updated backend API and fixed bug)
        </div>
      </div>
    </Layout>
  );
};

export default DemandPrediction;