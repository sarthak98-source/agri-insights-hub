import Product from '../models/product.model.js';

// Get all products for a user
export const getProducts = async (req, res) => {
  try {
    const { userId } = req.params;
    const products = await Product.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Add a new product
export const addProduct = async (req, res) => {
  try {
    const { 
      userId, 
      productName, 
      quantity, 
      category, 
      unit, 
      costPerUnit,
      expiryDate,
      minStockLevel, 
      maxStockLevel 
    } = req.body;

    if (!userId || !productName || quantity === undefined) {
      return res.status(400).json({ message: 'UserId, productName, and quantity are required' });
    }

    const newProduct = new Product({
      userId,
      productName,
      quantity,
      category: category || 'General',
      unit: unit || 'units',
      costPerUnit: costPerUnit || 0,
      expiryDate: expiryDate || null,
      minStockLevel: minStockLevel || 10,
      maxStockLevel: maxStockLevel || 1000
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// Get product statistics
export const getProductStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const products = await Product.find({ userId });

    // Calculate all stats
    const totalProducts = products.length;
    const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= p.minStockLevel).length;
    const outOfStock = products.filter(p => p.quantity === 0).length;
    const overStock = products.filter(p => p.quantity >= p.maxStockLevel).length;
    const optimal = products.filter(p => p.quantity > p.minStockLevel && p.quantity < p.maxStockLevel).length;
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    
    // Calculate total stock value
    const totalStockValue = products.reduce((sum, p) => {
      return sum + (p.quantity * (p.costPerUnit || 0));
    }, 0);

    // Calculate average cost per unit
    const totalCost = products.reduce((sum, p) => sum + (p.costPerUnit || 0), 0);
    const averageCostPerUnit = totalProducts > 0 ? totalCost / totalProducts : 0;

    // Calculate expiring soon (within 5 days)
    const now = new Date();
    const fiveDaysFromNow = new Date(now.getTime() + (5 * 24 * 60 * 60 * 1000));
    const expiringSoon = products.filter(p => {
      if (!p.expiryDate) return false;
      const expiryDate = new Date(p.expiryDate);
      return expiryDate >= now && expiryDate <= fiveDaysFromNow;
    }).length;

    const stats = {
      totalProducts,
      lowStock,
      outOfStock,
      overStock,
      optimal,
      totalQuantity,
      totalStockValue: Math.round(totalStockValue * 100) / 100, // Round to 2 decimals
      expiringSoon,
      averageCostPerUnit: Math.round(averageCostPerUnit * 100) / 100
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

// Get monthly trend data
export const getMonthlyTrend = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all products for the user
    const products = await Product.find({ userId }).sort({ createdAt: 1 });

    // Group products by month
    const monthlyData = {};

    products.forEach(product => {
      if (!product.createdAt) return;

      const date = new Date(product.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthName,
          products: 0,
          quantity: 0,
          value: 0
        };
      }

      monthlyData[monthKey].products += 1;
      monthlyData[monthKey].quantity += product.quantity;
      monthlyData[monthKey].value += product.quantity * (product.costPerUnit || 0);
    });

    // Convert to array and sort by date, get last 6 months
    const trendData = Object.entries(monthlyData)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .map(([_, data]) => ({
        month: data.month,
        products: data.products,
        quantity: data.quantity,
        value: Math.round(data.value * 100) / 100
      }));

    res.status(200).json(trendData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching monthly trend', error: error.message });
  }
};