// Central API configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Mock data for demo purposes (when API is not available)
const mockStock = [
  { id: 1, productName: 'NPK Fertilizer (50kg)', quantity: 150 },
  { id: 2, productName: 'Urea (45kg)', quantity: 80 },
  { id: 3, productName: 'DAP Fertilizer (50kg)', quantity: 45 },
  { id: 4, productName: 'Pesticide - Chlorpyrifos (1L)', quantity: 200 },
  { id: 5, productName: 'Herbicide - Glyphosate (5L)', quantity: 35 },
  { id: 6, productName: 'Hybrid Corn Seeds (10kg)', quantity: 120 },
  { id: 7, productName: 'Wheat Seeds (25kg)', quantity: 90 },
  { id: 8, productName: 'Drip Irrigation Kit', quantity: 25 },
];

const mockForecast = {
  predictions: [
    { productName: 'NPK Fertilizer (50kg)', predictedDemand: 180, currentStock: 150 },
    { productName: 'Urea (45kg)', predictedDemand: 60, currentStock: 80 },
    { productName: 'DAP Fertilizer (50kg)', predictedDemand: 70, currentStock: 45 },
    { productName: 'Pesticide - Chlorpyrifos (1L)', predictedDemand: 150, currentStock: 200 },
    { productName: 'Herbicide - Glyphosate (5L)', predictedDemand: 50, currentStock: 35 },
    { productName: 'Hybrid Corn Seeds (10kg)', predictedDemand: 100, currentStock: 120 },
    { productName: 'Wheat Seeds (25kg)', predictedDemand: 85, currentStock: 90 },
    { productName: 'Drip Irrigation Kit', predictedDemand: 40, currentStock: 25 },
  ],
  forecastPeriod: '7 days',
  generatedAt: new Date().toISOString(),
  modelUsed: 'XGBoost',
  accuracy: 94.5,
};

// Helper to check if API is available
let useRealApi = false;

export const checkApiAvailability = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { 
      method: 'GET',
      signal: AbortSignal.timeout(2000) 
    });
    useRealApi = response.ok;
    return useRealApi;
  } catch {
    useRealApi = false;
    return false;
  }
};

// Stock API
export interface StockItem {
  id?: number;
  productName: string;
  quantity: number;
}

export const getStock = async (): Promise<StockItem[]> => {
  if (!useRealApi) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return [...mockStock];
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/stock`);
    if (!response.ok) throw new Error('Failed to fetch stock');
    return response.json();
  } catch {
    return [...mockStock];
  }
};

export const addStock = async (item: StockItem): Promise<StockItem> => {
  if (!useRealApi) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newItem = { ...item, id: Date.now() };
    mockStock.push(newItem);
    return newItem;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/stock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to add stock');
    return response.json();
  } catch {
    const newItem = { ...item, id: Date.now() };
    mockStock.push(newItem);
    return newItem;
  }
};

// Forecast API
export interface ForecastPrediction {
  productName: string;
  predictedDemand: number;
  currentStock: number;
}

export interface ForecastData {
  predictions: ForecastPrediction[];
  forecastPeriod: string;
  generatedAt: string;
  modelUsed: string;
  accuracy: number;
}

export const getForecast = async (): Promise<ForecastData> => {
  if (!useRealApi) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { ...mockForecast, generatedAt: new Date().toISOString() };
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/forecast`);
    if (!response.ok) throw new Error('Failed to fetch forecast');
    return response.json();
  } catch {
    return { ...mockForecast, generatedAt: new Date().toISOString() };
  }
};

// Alert types
export type AlertType = 'low_stock' | 'overstock' | 'optimal';

export interface Alert {
  productName: string;
  type: AlertType;
  message: string;
  currentStock: number;
  predictedDemand: number;
  difference: number;
}

export const generateAlerts = (predictions: ForecastPrediction[]): Alert[] => {
  return predictions.map(p => {
    const difference = p.currentStock - p.predictedDemand;
    const ratio = p.currentStock / p.predictedDemand;
    
    if (ratio < 0.8) {
      return {
        productName: p.productName,
        type: 'low_stock' as AlertType,
        message: `Stock critically low! Need ${Math.abs(difference)} more units to meet predicted demand.`,
        currentStock: p.currentStock,
        predictedDemand: p.predictedDemand,
        difference,
      };
    } else if (ratio > 1.5) {
      return {
        productName: p.productName,
        type: 'overstock' as AlertType,
        message: `Excess inventory detected. ${difference} units above predicted demand.`,
        currentStock: p.currentStock,
        predictedDemand: p.predictedDemand,
        difference,
      };
    }
    return {
      productName: p.productName,
      type: 'optimal' as AlertType,
      message: 'Stock levels are optimal for predicted demand.',
      currentStock: p.currentStock,
      predictedDemand: p.predictedDemand,
      difference,
    };
  });
};
