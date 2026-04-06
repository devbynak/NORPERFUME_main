require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

// Create the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Security: Restrict CORS to expected domains
const allowedOrigins = [
  'https://norperfume.com', 
  'https://www.norperfume.com',
  'https://shop.norperfume.com'
];

if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.push('http://localhost:3000');
}

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('CORS blocked origin: ' + origin));
        }
    }
}));

// API Rate Limiting to prevent spam/abuse
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', apiLimiter);
app.use(express.json());
app.use(cookieParser());

// Serve static files from /public/ directory
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// API ROUTES
// ==========================================
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

module.exports = app;

/**
 * LOCAL DEVELOPMENT SERVER
 * Only listens if NOT on Vercel.
 */
if (process.env.NODE_ENV !== 'production' && require.main === module) {
    app.listen(PORT, () => {
        console.log(`✅ NOR Perfume Local Dev running on http://localhost:${PORT}`);
    });
}
