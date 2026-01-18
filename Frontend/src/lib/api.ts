const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Debug: Log API URL
console.log('API Base URL:', API_BASE_URL);

export interface Product {
  _id?: string;
  userId: string;
  productName: string;
  quantity: number;
  category?: string;
  unit?: string;
  costPerUnit?: number;
  expiryDate?: string;
  minStockLevel?: number;
  maxStockLevel?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductStats {
  totalProducts: number;
  lowStock: number;
  overStock: number;
  optimal: number;
  outOfStock: number;
  totalQuantity: number;
  totalStockValue: number;
  expiringSoon: number;
  averageCostPerUnit: number;
}

export interface MonthlyTrendData {
  month: string;
  products: number;
  quantity: number;
  value: number;
}

export interface Alert {
  type: 'low_stock' | 'overstock' | 'optimal' | 'out_of_stock' | 'expiring';
  productName: string;
  currentStock: number;
  message: string;
  minStockLevel?: number;
  maxStockLevel?: number;
  expiryDate?: string;
}

// Get all products for a user
export const getProducts = async (userId: string): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Add a new product
export const addProduct = async (product: Product): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to add product');
    return await response.json();
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete product');
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Get product statistics
export const getProductStats = async (userId: string): Promise<ProductStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${userId}/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

// Get monthly trend data
export const getMonthlyTrend = async (userId: string): Promise<MonthlyTrendData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${userId}/trend`);
    if (!response.ok) throw new Error('Failed to fetch monthly trend');
    return await response.json();
  } catch (error) {
    console.error('Error fetching monthly trend:', error);
    throw error;
  }
};

// Generate alerts based on products
export const generateAlerts = (products: Product[]): Alert[] => {
  const alerts: Alert[] = [];
  const now = new Date();
  const fiveDaysFromNow = new Date(now.getTime() + (5 * 24 * 60 * 60 * 1000));

  products.forEach(product => {
    const minStock = product.minStockLevel || 10;
    const maxStock = product.maxStockLevel || 1000;

    // Check for out of stock
    if (product.quantity === 0) {
      alerts.push({
        type: 'out_of_stock',
        productName: product.productName,
        currentStock: product.quantity,
        message: `Product is out of stock! Immediate reorder required.`,
        minStockLevel: minStock
      });
      return; // Skip other checks for out of stock items
    }

    // Check for expiring soon
    if (product.expiryDate) {
      const expiryDate = new Date(product.expiryDate);
      if (expiryDate >= now && expiryDate <= fiveDaysFromNow) {
        alerts.push({
          type: 'expiring',
          productName: product.productName,
          currentStock: product.quantity,
          message: `Product expiring within 5 days! Use or sell quickly.`,
          expiryDate: product.expiryDate
        });
      }
    }

    // Check stock levels
    if (product.quantity <= minStock) {
      alerts.push({
        type: 'low_stock',
        productName: product.productName,
        currentStock: product.quantity,
        message: `Stock level critically low. Reorder ${minStock * 2 - product.quantity}+ units immediately.`,
        minStockLevel: minStock
      });
    } else if (product.quantity >= maxStock) {
      alerts.push({
        type: 'overstock',
        productName: product.productName,
        currentStock: product.quantity,
        message: `Excess inventory detected. Consider reducing next order.`,
        maxStockLevel: maxStock
      });
    } else {
      alerts.push({
        type: 'optimal',
        productName: product.productName,
        currentStock: product.quantity,
        message: 'Stock level is optimal.',
        minStockLevel: minStock,
        maxStockLevel: maxStock
      });
    }
  });

  return alerts;
};