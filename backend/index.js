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
const allowedOrigins = [
    'https://lamsadz-platform.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

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
const https = require('https');

app.listen(config.port, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   🪑 Furniture Marketplace Backend         ║
║   Running on port ${config.port}                    ║
║   Environment: ${config.nodeEnv}              ║
╚════════════════════════════════════════════╝
    `);

    // --- Startup Trick: Keep Server Awake ---
    // Only start pinging in production so we don't spam it in local dev
    if (config.nodeEnv !== 'development') {
        const PING_URL = 'https://lamsadz-api.onrender.com/health';
        const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes
        
        console.log(`[Ping] Keep-alive mechanism started for: ${PING_URL}`);
        
        setInterval(() => {
            https.get(PING_URL, (res) => {
                if (res.statusCode === 200) {
                    console.log(`[Ping] Server kept alive at ${new Date().toISOString()}`);
                } else {
                    console.error(`[Ping] Failed with status: ${res.statusCode}`);
                }
            }).on('error', (err) => {
                console.error('[Ping] Error:', err.message);
            });
        }, PING_INTERVAL);
    }
});
