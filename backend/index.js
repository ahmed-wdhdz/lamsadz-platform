/**
 * Furniture Marketplace - Backend Server
 * 
 * Main entry point for the Express server.
 * Clean, modular architecture.
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// Config
const { validateEnv, setDefaults, config } = require('./config');

// Setup environment
validateEnv();
setDefaults();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const setupRoutes = require('./routes');
setupRoutes(app);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'الصفحة غير موجودة' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
});

// Start server
app.listen(config.port, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   🪑 Furniture Marketplace Backend         ║
║   Running on port ${config.port}                    ║
║   Environment: ${config.nodeEnv}              ║
╚════════════════════════════════════════════╝
    `);
});
