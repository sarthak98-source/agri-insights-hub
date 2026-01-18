import express from 'express';
import cors from 'cors';
import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';
import productRoutes from './routes/product.routes.js';

const app = express();

// CORS Configuration - IMPORTANT: Allow your frontend port
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Agri Insights Hub API is running correctly ✅' });
});

app.use('/api/products', productRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Starting the server with DB connection
const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => {
            console.log(`✅ Server is running on port: ${ENV.PORT}`);
            console.log(`✅ API available at: http://localhost:${ENV.PORT}`);
            console.log(`✅ Accepting requests from: localhost:5173, localhost:8080`);
        });
    } catch (error) {
        console.error("❌ Error starting server:", error.message);
        process.exit(1);
    }
};

startServer();