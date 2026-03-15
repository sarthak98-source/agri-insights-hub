#!/bin/bash
# This script builds the React frontend and starts the Express backend
# Used by Render during deployment

echo "📦 Installing Frontend dependencies..."
cd Frontend
npm install

echo "🏗️ Building React frontend..."
npm run build

echo "📦 Installing Backend dependencies..."
cd ../Backend
npm install

echo "✅ Build complete!"