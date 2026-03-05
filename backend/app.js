const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { errorHandler, notFound } = require('./src/middleware/errorHandler');
const routes = require('./src/routes');

const app = express();

// ── Security Middleware ──
app.use(helmet());

// ── CORS Configuration ──
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// ── Request Parsing ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Logging ──
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ── Health Check ──
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// ── API Routes ──
app.use('/api', routes);

// ── Error Handling ──
app.use(notFound);
app.use(errorHandler);

module.exports = app;
