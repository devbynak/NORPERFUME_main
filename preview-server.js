const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());

// Mock Routing Logic (Universal Product Template)
app.use((req, res, next) => {
    if (req.path.endsWith('.html')) {
        const filePath = path.join(__dirname, 'public', req.path);
        if (!fs.existsSync(filePath)) {
            // Serve the master product template instead of 404
            console.log(`🔍 [Preview Mode] Falling back to product.html for: ${req.path}`);
            return res.sendFile(path.join(__dirname, 'public', 'product.html'));
        }
    }
    next();
});

app.use(express.static('public'));

// Mock API Routes
app.post('/api/subscribe', (req, res) => {
    console.log('📬 [Preview Mode] Subscribed:', req.body.email);
    res.status(200).json({ status: "success (mocked)" });
});

app.post('/api/track-order', (req, res) => {
    console.log('🚚 [Preview Mode] Tracking:', req.body.order_number);
    res.status(200).json({ status: "success (mocked)", order: { order_number: "NOR123", status: "Mocked Delivery" } });
});

app.listen(PORT, () => {
    console.log('\n');
    console.log('🚀 ========================================== 🚀');
    console.log(`✅ [Preview Mode] Server running on http://localhost:${PORT}`);
    console.log('   All frontend features are available.');
    console.log('   Database operations are mocked.');
    console.log('🚀 ========================================== 🚀');
    console.log('\n');
});
