import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';
import productRoutes from './routes/product.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS Configuration
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve React frontend build
// server.js is at Backend/src/, so go up 2 levels to reach project root, then into Frontend/dist
app.use(express.static(path.join(__dirname, '../../Frontend/dist')));

// API Routes
app.use('/api/products', productRoutes);

// ✅ Catch-all: send React app for any non-API route
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, '../../Frontend/dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Starting the server with DB connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`✅ Server running on port: ${ENV.PORT}`);
      console.log(`✅ Frontend served from: /Frontend/dist`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error.message);
    process.exit(1);
  }
};

startServer();