import express from 'express';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  getMonthlyTrend
} from '../controllers/product.controller.js';

const router = express.Router();

// Get all products for a user
router.get('/:userId', getProducts);

// Get product statistics
router.get('/:userId/stats', getProductStats);

// Get monthly trend data
router.get('/:userId/trend', getMonthlyTrend);

// Add a new product
router.post('/', addProduct);

// Update a product
router.put('/:id', updateProduct);

// Delete a product
router.delete('/:id', deleteProduct);

export default router;