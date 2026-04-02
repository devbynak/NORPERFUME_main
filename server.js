require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const { sendEmailLog } = require('./utils/email');

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
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 100, // Limit each IP to 100 requests per `window`
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', apiLimiter);
app.use(express.json());
app.use(cookieParser());

app.use(express.static('public'));

// ==========================================
// API ROUTES
// ==========================================
// Shopify Headless Architecture:
// All product, cart, customer accounts, and checkout logic 
// is handled via the Shopify Storefront API on the front-end.
// Checkout redirects directly to Shopify's secure checkout page.

module.exports = app;

app.listen(PORT, () => {
    console.log(`✅ NOR Perfume Backend running on http://localhost:${PORT}`);
});
